import { useCallback, useEffect, useMemo, useState } from "react";
import { Timer, Routine, Registry } from "../types";

type Position = {
  routineId: string;
  itemIndex: number;
};

function resolveCurrentTimer(
  stack: Position[],
  registry: Registry
): Timer | null {
  if (stack.length === 0) return null;
  const top = stack[stack.length - 1];
  const routine = registry.routines[top.routineId];
  if (!routine) return null;
  const item = routine.items[top.itemIndex];
  if (!item || item.type !== "timer") return null;
  return registry.timers[item.timerId] ?? null;
}

export function useRoutineRunner(root: Routine, registry: Registry) {
  const [stack, setStack] = useState<Position[]>([
    { routineId: root.id, itemIndex: 0 },
  ]);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const currentTimer = useMemo(
    () => resolveCurrentTimer(stack, registry),
    [stack, registry]
  );

  // Initialise secondsLeft when the current timer changes
  useEffect(() => {
    if (currentTimer) {
      setSecondsLeft(currentTimer.durationSeconds ?? null);
        if (!hasStarted) setIsPaused(true);
    }
  }, [currentTimer?.id]);

  const advance = useCallback(
    (currentStack: Position[]): Position[] | "done" => {
      let s = [...currentStack];

      while (s.length > 0) {
        const top = s[s.length - 1];
        const routine = registry.routines[top.routineId];
        const nextIndex = top.itemIndex + 1;

        if (nextIndex < routine.items.length) {
          s = [...s.slice(0, -1), { ...top, itemIndex: nextIndex }];
        } else {
          s = s.slice(0, -1);
          continue;
        }

        const nextItem = routine.items[nextIndex];
        if (nextItem.type === "timer") return s;
        if (nextItem.type === "routine") {
          s = [...s, { routineId: nextItem.routineId, itemIndex: -1 }];
          // loop will advance to index 0
        }
      }

      return "done";
    },
    [registry]
  );

  const skip = useCallback(() => {
    setStack((current) => {
      const next = advance(current);
      if (next === "done") {
        setIsDone(true);
        return current;
      }
      return next;
    });
  }, [advance]);

  // Countdown interval
  useEffect(() => {
    if (isPaused || isDone || secondsLeft === null) return;

    const tick = setInterval(() => {
      setSecondsLeft((s) => {
        if (s === null || s <= 1) {
          skip();
          return null;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(tick);
  }, [isPaused, isDone, secondsLeft === null, skip]);

  return {
    currentTimer,
    secondsLeft,
    isPaused,
    isDone,
    pause: () => setIsPaused(true),
    resume: () => {    
        setIsPaused(false);
        setHasStarted(true);
    },
    skip,
  };
}