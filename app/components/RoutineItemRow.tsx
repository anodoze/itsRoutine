// app/components/manage/RoutineItemRow.tsx
import { useState } from "react";
import { View } from "react-native";
import { useRegistry } from "../RegistryContext";
import { Routine, RoutineItem } from "../types";
import RoutineListItem from "./RoutineListItem";
import TimerEditModal from "./TimerEditModal";
import TimerListItem from "./TimerListItem";

interface Props {
  item: RoutineItem;
  itemIndex: number;
  routine: Routine;
  depth: number;
  expandedRoutineId: string | null;
  onToggleRoutine: (id: string) => void;
}

export default function RoutineItemRow({
  item,
  itemIndex,
  routine,
  depth,
  expandedRoutineId,
  onToggleRoutine
}: Props) {
  const { registry, updateRoutine } = useRegistry();
  const [editingTimer, setEditingTimer] = useState(false);

  if (item.type === "timer") {
    return (
      <>
        <TimerListItem
          timer={item.timer}
          onEdit={() => setEditingTimer(true)}
          onDelete={() =>
            updateRoutine(routine.id, {
              items: routine.items.filter((_, i) => i !== itemIndex),
            })
          }
        />
        <TimerEditModal
          visible={editingTimer}
          timer={item.timer}
          onSave={(updated) => {
            const items = [...routine.items];
            items[itemIndex] = { type: "timer", timer: updated };
            updateRoutine(routine.id, { items });
            setEditingTimer(false);
          }}
          onCancel={() => setEditingTimer(false)}
        />
      </>
    );
  }

  const subroutine = registry.routines[item.routineId];
  if (!subroutine) return null;
  return (
    <View style={{ paddingLeft: depth * 12 }}>
      <RoutineListItem
        routine={subroutine}
        isExpanded={expandedRoutineId === subroutine.id}
        onExpand={() => onToggleRoutine(subroutine.id)}
      />
    </View>
  );
}
