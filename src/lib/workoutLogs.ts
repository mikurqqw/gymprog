import { logSchema, type Log, type Planned } from './schema';
export const setLogId = (id: string, index: number) => `${id}::set:${index}`;
export function logRowId(id: string) {
  return id.replace(/::set:(?:[0-9]|[12][0-9])$/, '');
}
export function rowLogs(row: Planned, logs: Log[]) {
  const matches = logs.filter(
    (log) => logRowId(log.id) === row.id && log.exercise === row.exercise && log.date === row.date,
  );
  const individual = matches.filter((log) => log.id !== row.id);
  return individual.length ? individual : matches.slice(0, 1);
}
export function baseLog(row: Planned): Log {
  return {
    id: row.id,
    session: `${row.week}-${row.day}`,
    exercise: row.exercise,
    lift: row.lift,
    date: row.date,
    weight: row.weight ?? 0,
    reps: row.reps,
    sets: Array.from({ length: row.sets }, () => false),
    rpe: row.rpe,
    targetRpe: row.rpe,
    planned: row.weight,
    status: 'planned',
    note: '',
    video: '',
    technique: true,
    mode: row.mode,
  };
}
export function setLogs(row: Planned, logs: Log[]): Log[] {
  const legacy = rowLogs(row, logs).find((log) => log.id === row.id),
    base = legacy ?? baseLog(row);
  return Array.from(
    { length: row.sets },
    (_, index) =>
      logs.find(
        (log) =>
          log.id === setLogId(row.id, index) &&
          log.exercise === row.exercise &&
          log.date === row.date,
      ) ?? {
        ...base,
        id: setLogId(row.id, index),
        sets: [base.sets[index] ?? false],
      },
  );
}
export function readRowLog(row: Planned, logs: Log[]): Log {
  const records = setLogs(row, logs),
    first = records[0] ?? baseLog(row);
  return {
    ...first,
    id: row.id,
    sets: records.map((log) => log.status !== 'skipped' && log.sets[0]),
    status: records.every((log) => log.status === 'skipped')
      ? 'skipped'
      : records.every((log) => log.sets[0])
        ? 'done'
        : 'planned',
  };
}
// Both presentations write the same existing Log objects. Legacy rows expand only on editing.
export function writeRowLogs(logs: Log[], row: Planned, patch: Partial<Log>, setIndex?: number) {
  if (
    setIndex !== undefined &&
    (!Number.isInteger(setIndex) || setIndex < 0 || setIndex >= row.sets)
  )
    throw Error('Invalid set');
  const records = setLogs(row, logs).map((log, index) => {
    if (setIndex !== undefined && setIndex !== index) return logSchema.parse(log);
    const sets = patch.sets ? [patch.sets[setIndex === undefined ? index : 0] ?? false] : log.sets;
    const candidate = { ...log, ...patch, id: setLogId(row.id, index), sets };
    candidate.status =
      patch.status === 'skipped'
        ? 'skipped'
        : sets[0]
          ? candidate.weight === row.weight && candidate.reps === row.reps
            ? 'done'
            : 'modified'
          : 'planned';
    return logSchema.parse(candidate);
  });
  return [
    ...logs.filter(
      (log) =>
        logRowId(log.id) !== row.id || log.exercise !== row.exercise || log.date !== row.date,
    ),
    ...records,
  ];
}

export function completedExerciseCount(logs: Log[]) {
  return new Set(
    logs
      .filter((log) => log.status !== 'skipped' && log.sets.some(Boolean))
      .map((log) => `${log.date}:${logRowId(log.id)}`),
  ).size;
}
