import type { AppState } from './storage';
import { generate } from './program';
import { dateOffset } from './formulas';
import { nutrition } from './nutrition';
export function demoData(s: AppState): Partial<AppState> {
  if (!s.profile) throw Error('Profile setup required');
  const profile = s.profile;
  const rows = generate(profile).filter((r) => r.week <= 3);
  const target = nutrition(profile);
  const logs = rows.map((r, i) => ({
    id: r.id,
    session: `${r.week}-${r.day}`,
    exercise: r.exercise,
    lift: r.lift,
    date: r.date,
    weight: r.weight ?? (r.mode === 'core' ? 0 : 20),
    reps: r.reps,
    sets: Array.from({ length: r.sets }, () => true),
    rpe: Math.max(6, r.rpe - (i % 3) * 0.5),
    targetRpe: r.rpe,
    planned: r.weight,
    status: 'done' as const,
    note: '',
    video: '',
    technique: true,
    mode: r.mode,
  }));
  const checkins = Array.from({ length: 21 }, (_, i) => ({
    date: dateOffset(profile.start, i),
    sleep: 6.5 + (i % 4) * 0.4,
    quality: 4,
    recovery: 4,
    soreness: 2,
    stress: 2,
    mood: 4,
    calories: target.kcal + ((i % 3) - 1) * 100,
    protein: target.protein + ((i % 3) - 1) * 10,
    water: 2.7,
    weight: profile.weight + Math.sin(i) * 0.3,
    meal: true,
    pain: 'none' as const,
    location: '',
    speed: 'normal' as const,
    dizziness: false,
    weakness: false,
    worsening: false,
  }));
  return { logs, checkins, onboarded: true };
}
