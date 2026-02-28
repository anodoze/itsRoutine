import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Registry, Routine, TimerData } from "../types";

// A Position is a cursor into a specific routine at a specific item index.
// The runner maintains a *stack* of these, which lets us handle nesting:
// the bottom of the stack is always the root routine, and each time we
// enter a subroutine, we push a new Position on top.
type Position = {
  routineId: string;
  itemIndex: number;
};

// Given the current stack, walk down to the top entry and return the
// TimerData it points at -- or null if the stack is empty or the top
// item isn't a timer (which shouldn't happen in normal operation, but
// we want to be safe).
function resolveCurrentTimer(
  stack: Position[],
  registry: Registry
): TimerData | null {
  if (stack.length === 0) return null;
  const top = stack[stack.length - 1];
  const routine = registry.routines[top.routineId];
  if (!routine) return null;
  const item = routine.items[top.itemIndex];
  if (!item || item.type !== "timer") return null;
  return item.timer;
}

export function useRoutineRunner(root: Routine, registry: Registry) {
  // The stack starts with the root routine at item 0.
  // Invariant we maintain: the top of the stack always points at a timer.
  // We never leave the stack pointing at a routine item -- we immediately
  // dive in and keep going until we hit a timer (or exhaust everything).
  const [stack, setStack] = useState<Position[]>([
    { routineId: root.id, itemIndex: 0 },
  ]);

  // null means "no duration / runs until skipped"
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  // Starts paused so the user has to press Start deliberately on the first timer.
  // After that, timers auto-advance (we set isPaused=false at the end of advance()).
  const [isPaused, setIsPaused] = useState(true);

  const [isDone, setIsDone] = useState(false);

  // We use a ref for skip() inside the countdown interval to avoid the
  // stale-closure problem: if skip were a plain value captured at effect
  // creation time, it would reference an old version of itself forever.
  // A ref always gives us the latest version without needing to re-run
  // the effect.
  const skipRef = useRef<() => void>(() => {});

  // Derive the current timer directly from the stack.
  // useMemo means this only recomputes when stack or registry changes,
  // not on every render.
  const currentTimer = useMemo(
    () => resolveCurrentTimer(stack, registry),
    [stack, registry]
  );

  // advance() takes a stack, steps forward by one item, dives into
  // subroutines as needed, and returns the new stack pointing at the
  // next timer -- or the string "done" if we've exhausted everything.
  //
  // It does NOT call setStack itself: callers do that. This makes it a
  // pure function that's easy to reason about and test.
  const advance = useCallback(
    (currentStack: Position[]): Position[] | "done" => {
      // Work on a mutable copy so we can push/pop freely
      let s = [...currentStack];

      // Keep looping until we either land on a timer or run out of stack
      while (s.length > 0) {
        const top = s[s.length - 1];
        const routine = registry.routines[top.routineId];
        if (!routine) return "done"; // shouldn't happen, but be safe

        const nextIndex = top.itemIndex + 1;

        if (nextIndex < routine.items.length) {
          // There's a next item in the current routine -- advance to it
          s[s.length - 1] = { ...top, itemIndex: nextIndex };
        } else {
          // We've exhausted this routine -- pop back to the parent
          s.pop();
          continue; // loop again to advance the parent
        }

        const nextItem = routine.items[nextIndex];

        if (nextItem.type === "timer") {
          // We found a timer. Stack is in a valid state -- return it.
          return s;
        }

        if (nextItem.type === "routine") {
          // Dive into the subroutine by pushing its start position.
          // itemIndex 0 directly (not -1) means the stack is always valid.
          s.push({ routineId: nextItem.routineId, itemIndex: 0 });

          // Now loop again: the item at [routineId, 0] might itself be
          // a subroutine, so we keep diving until we hit a timer.
          // But first check that item 0 exists and is a timer:
          const sub = registry.routines[nextItem.routineId];
          if (!sub || sub.items.length === 0) {
            // Empty or missing subroutine -- pop it and keep going
            s.pop();
            continue;
          }

          const firstItem = sub.items[0];
          if (firstItem.type === "timer") return s; // landed on a timer, done
          // Otherwise loop again to keep diving
        }
      }

      return "done";
    },
    [registry]
  );

  // skip() advances to the next timer.
  // If there's nothing left, it marks the routine as done.
  // We define it with useCallback so the ref and the interval
  // always get a stable, up-to-date version.
  const skip = useCallback(() => {
    setStack((currentStack) => {
      const next = advance(currentStack);
      if (next === "done") {
        setIsDone(true);
        return currentStack; // state doesn't matter once isDone is set
      }
      // Auto-advance: subsequent timers start running immediately
      setIsPaused(false);
      return next;
    });
  }, [advance]);

  // Keep the ref pointing at the latest skip so the interval can call it
  // without going stale.
  useEffect(() => {
    skipRef.current = skip;
  }, [skip]);

  // When the current timer changes (i.e. the stack moved), reset secondsLeft
  // to match the new timer's duration.
  // We deliberately depend on `stack` rather than `currentTimer` because
  // currentTimer is derived from stack -- depending on the derived value
  // would risk missing updates in edge cases.
  useEffect(() => {
    if (!currentTimer) return;
    setSecondsLeft(currentTimer.durationSeconds ?? null);
    // Note: we do NOT touch isPaused here. pause/resume state is managed
    // by skip() (auto-advance) and the user (pause/resume buttons).
  }, [stack]);

  // The countdown. Runs whenever the timer is active (not paused, not done,
  // has a duration). Uses skipRef.current so it never captures a stale skip.
  useEffect(() => {
    if (isPaused || isDone || secondsLeft === null) return;

    const tick = setInterval(() => {
      setSecondsLeft((s) => {
        if (s === null || s <= 1) {
          skipRef.current(); // move to the next timer
          return null;
        }
        return s - 1;
      });
    }, 1000);

    // Clean up the interval whenever any dependency changes
    return () => clearInterval(tick);
  }, [isPaused, isDone, secondsLeft === null]);
  // We use `secondsLeft === null` (not `secondsLeft`) because we only want
  // to restart the interval when the timer crosses the null boundary
  // (i.e. a new timed timer started), not on every tick. The interval
  // manages its own countdown internally via setSecondsLeft.

  return {
    currentTimer,
    secondsLeft,
    isPaused,
    isDone,
    pause: () => setIsPaused(true),
    resume: () => setIsPaused(false), // no more hasStarted -- skip() handles auto-advance
    skip,
  };
}