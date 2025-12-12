// import { useMemo, useState } from "react";

// type Position = {
//   routineId: string;
//   itemIndex: number;
// };

// function useRoutineRunner(rootRoutine: Routine) {
//   const [stack, setStack] = useState<Position[]>([
//     { routineId: rootRoutine.id, itemIndex: 0 }
//   ]);
//   const [timeRemaining, setTimeRemaining] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);

//   // Get current item by walking the stack
//   const currentItem = useMemo(() => {
//     let routine = rootRoutine;
//     for (let pos of stack) {
//       const item = routine.items[pos.itemIndex];
//       if (!item) return null;
      
//       if (item.type === 'routine') {
//         routine = allRoutines[item.routineId];
//       } else {
//         return allTimers[item.timerId];
//       }
//     }
//     return null;
//   }, [stack]);

//   const advance = () => {
//     const current = stack[stack.length - 1];
//     const routine = getRoutineAtStack(stack);
//     const nextIndex = current.itemIndex + 1;

//     if (nextIndex < routine.items.length) {
//       const nextItem = routine.items[nextIndex];
      
//       if (nextItem.type === 'routine') {
//         // Dive into subroutine
//         setStack([...stack, { 
//           routineId: nextItem.routineId, 
//           itemIndex: 0 
//         }]);
//       } else {
//         // Next timer in current routine
//         setStack([...stack.slice(0, -1), 
//           { ...current, itemIndex: nextIndex }
//         ]);
//       }
//     } else {
//       // Pop up a level
//       setStack(s => {
//         const popped = s.slice(0, -1);
//         if (popped.length === 0) return s; // done
//         // Advance parent routine
//         const parent = popped[popped.length - 1];
//         return [...popped.slice(0, -1), 
//           { ...parent, itemIndex: parent.itemIndex + 1 }
//         ];
//       });
//     }
//   };

//   // ... interval logic calls advance() when timer hits 0
// }