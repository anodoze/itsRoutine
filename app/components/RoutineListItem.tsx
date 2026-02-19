// app/components/manage/RoutineListItem.tsx
import { Routine } from '../types';
import RoutineCollapsedView from './RoutineCollapsedView';
import RoutineEditView from './RoutineEditView';

interface Props {
  routine: Routine;
  isExpanded: boolean;
  onExpand: () => void;
}

export default function RoutineListItem({ routine, isExpanded, onExpand }: Props) {
  return isExpanded ? (
    <RoutineEditView routine={routine} onCollapse={onExpand} />
  ) : (
    <RoutineCollapsedView routine={routine} onExpand={onExpand} />
  );
}