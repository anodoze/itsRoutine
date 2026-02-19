// app/components/manage/RoutineItemRow.tsx
import { View } from 'react-native';
import { RoutineItem } from '../types';
import { useRegistry } from '../RegistryContext';
import TimerListItem from './TimerListItem';
import RoutineEditView from './RoutineEditView';

interface Props {
  item: RoutineItem;
  isExpanded: boolean;
  onExpand: () => void;
  depth: number;
}

export default function RoutineItemRow({ item, isExpanded, onExpand, depth }: Props) {
  const { registry } = useRegistry();

  if (item.type === 'timer') {
    const timer = registry.timers[item.timerId];
    if (!timer) return null;
    return (
      <TimerListItem timer={timer} isExpanded={isExpanded} onExpand={onExpand} />
    );
  }

  const routine = registry.routines[item.routineId];
  if (!routine) return null;
  return (
    <View style={{ paddingLeft: depth * 12 }}>
      <RoutineEditView routine={routine} depth={depth + 1} />
    </View>
  );
}