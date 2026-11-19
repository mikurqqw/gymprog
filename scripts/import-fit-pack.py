"""Build static series data from the archive's checked workbook exports."""

import argparse
import csv
import gzip
import hashlib
import io
import json
from collections import defaultdict
from pathlib import Path
from zipfile import ZipFile

ROOT = "Fitness_Website_Pack/"
DATA = "02_Данные_для_сайта/"
ROMAN = {1: "I", 2: "II", 3: "III"}
DOSE = """exercise_original record_type role priority sets short_sets reps_min reps_max
work_seconds_min work_seconds_max sides rest_seconds_min rest_seconds_max effort_scale
effort_min effort_max load_fraction_1rm load_coefficient load_method reference_lift
load_unit load_kg no_calculated_weight equipment duration_seconds_min duration_seconds_max
short_seconds_min short_seconds_max short_quantity_min short_quantity_max quantity_unit
quantity_scope weight_basis load_unit_source short_cardio_policy station_seconds_full
station_seconds_short variation_note transition_seconds source_ref""".split()


def rows(archive, path):
    with archive.open(ROOT + DATA + path + ".csv") as stream:
        yield from csv.DictReader(io.TextIOWrapper(stream, encoding="utf-8-sig"))


def compact(row, fields):
    return {key: row[key] for key in fields if row.get(key, "").strip()}


def write(path, data, compressed=False):
    raw = json.dumps(data, ensure_ascii=False, separators=(",", ":")).encode()
    path.write_bytes(gzip.compress(raw, mtime=0) if compressed else raw)


def import_pack(archive_path: Path, target: Path):
    with ZipFile(archive_path) as archive:
        target.mkdir(parents=True, exist_ok=True)
        sources = {}
        for row in rows(archive, "cycles_sources"):
            with archive.open(ROOT + row["workbook"]) as workbook:
                if hashlib.file_digest(workbook, "sha256").hexdigest() != row["workbook_sha256"]:
                    raise ValueError("Workbook hash mismatch: " + row["workbook"])
            sources[(row["program_id"], int(row["cycle"]))] = row
        profiles = {row["profile_id"]: row for row in rows(archive, "profiles_original")}
        indexes = defaultdict(list)
        for pid, row in profiles.items():
            if not row["age_group"].startswith("Подросток"):
                indexes[row["program_id"]].append({
                    "id": pid, "title": row["title"], "age": row["age_group"],
                    "sex": row["sex"], "modes": json.loads(row["equipment_modes"]),
                })
        transitions = {}
        for cycle, path in [(1, "Карта_I_II"), (2, "Карта_II_III")]:
            for row in rows(archive, "Переходы/" + path):
                transitions[(cycle, row["source_profile_id"])] = row
        intro = list(rows(archive, "Переходы/Вводный_курс"))
        count = 0
        for cycle, roman in ROMAN.items():
            count += import_cycle(archive, target, cycle, roman, profiles, sources, transitions, intro)
        for program, options in indexes.items():
            write(target / (program + ".json"), sorted(options, key=lambda row: (row["title"], row["id"])))
        print(f"Verified {len(sources)} workbooks, imported {count} adult profile/mode cycles")


def import_cycle(archive, target, cycle, roman, profiles, sources, transitions, intro):
    cycle_profiles = (profiles if cycle == 1 else {
        row["profile_id"]: row for row in rows(archive, f"{roman}/profiles")
    })
    sessions = {row["session_id"]: row for row in rows(archive, f"{roman}/sessions")}
    assignments = defaultdict(list)
    for row in rows(archive, f"{roman}/assignments"):
        if row["session_id"] not in sessions:
            raise ValueError("Orphan assignment")
        assignments[row["session_id"]].append(row)
    calendars = defaultdict(list)
    for row in rows(archive, f"{roman}/calendar"):
        calendars[(row["profile_id"], row["mode"])].append(row)
    modes = list(rows(archive, f"{roman}/modes"))
    for mode in modes:
        pid, equipment = mode["profile_id"], mode["mode"]
        original, profile = profiles[pid], cycle_profiles[pid]
        calendar = calendars.pop((pid, equipment))
        blocks, days = int(mode["blocks"]), int(mode["days_in_block"])
        calendar.sort(key=lambda row: (int(float(row["block"])), int(float(row["day"]))))
        expected = [(block, day) for block in range(1, blocks + 1) for day in range(1, days + 1)]
        if [(int(float(row["block"])), int(float(row["day"]))) for row in calendar] != expected:
            raise ValueError("Incomplete or duplicate calendar")
        plan = mode["plan_id"]
        program = original["program_id"]
        output = []
        for row in calendar:
            sid = row["session_id"]
            day = {"phase": row["phase"], "kind": row["day_type"]}
            if sid:
                session = sessions.pop(sid)
                actual = (session["profile_id"], session.get("plan_id", pid), session["equipment_mode"])
                if actual != (pid, plan, equipment) or session["program_id"] != program:
                    raise ValueError("Session attached to wrong profile, plan, mode, or program")
                if float(session["block"]) != float(row["block"]) or float(session["day_in_block"]) != float(row["day"]):
                    raise ValueError("Session date mismatch")
                doses = sorted(assignments.pop(sid), key=lambda dose: int(float(dose["order"])))
                day.update({"name": session["session_name"], "work": [compact(dose, DOSE) for dose in doses],
                            "session": compact(session, ["warmup_min", "warmup_max", "cardio_minutes",
                                                         "practice_minutes", "full_duration_seconds",
                                                         "short_duration_seconds", "short_supported", "source_ref"])})
            output.append(day)
        if original["age_group"].startswith("Подросток"):
            continue
        route = transitions.get((cycle, pid))
        intro_route = next((r for r in intro if r["from_profile_id"] == pid and
                            r["from_cycle"] == str(cycle) and r["mode"] == equipment), None)
        following = None
        if intro_route:
            following = {"cycle": int(intro_route["to_cycle"]), "profile": intro_route["to_profile_id"],
                         "plan": intro_route["to_plan_id"], "condition": intro_route["condition"]}
        elif route:
            following = {"cycle": cycle + 1, "profile": pid, "plan": route.get("target_id", route.get("next_profile_id")),
                         "condition": route.get("readiness", route.get("readiness_inputs"))}
            if route.get("plan_II", plan) != plan:
                raise ValueError("Transition starts from the wrong plan")
        write(target / f"{pid}-{equipment}-{cycle}.json.gz", {
            "profile": pid, "program": program, "plan": plan, "cycle": cycle,
            "mode": equipment, "blocks": blocks, "days": days, "title": profile["title"],
            "source": sources[(program, cycle)]["workbook"], "calendar": output,
            "following": following,
            "control": compact(mode, [key for key in mode if key.startswith(("min_completed", "control_"))]),
        }, compressed=True)
    if sessions or assignments or calendars:
        raise ValueError("Unlinked export rows")
    return sum(not profiles[row["profile_id"]]["age_group"].startswith("Подросток") for row in modes)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("archive", type=Path)
    parser.add_argument("--output", type=Path, default=Path("public/fit-series"))
    args = parser.parse_args()
    import_pack(args.archive, args.output)
