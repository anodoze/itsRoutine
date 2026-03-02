import { Registry, Routine } from "./types";

export function formatDuration(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const parts = [];
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  if (sec || parts.length === 0) parts.push(`${sec}s`);
  return parts.join(' ');
}

// TODO: elements with no duration are treated as 0 - needs better handling
export function calcRoutineDuration(routine: Routine, registry: Registry): number {
  return routine.items.reduce((total, item) => {
    if (item.type === 'timer') return total + (item.timer.durationSeconds ?? 0);
    const sub = registry.routines[item.routineId];
    if (!sub) return total;
    return total + calcRoutineDuration(sub, registry);
  }, 0);
}

export function minutesToTime(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

export function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}