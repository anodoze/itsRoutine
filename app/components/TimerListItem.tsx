import { Timer } from '../types';
import { useRegistry } from '../RegistryContext';
import TimerCollapsedView from './TimerCollapsedView';
import TimerEditView from './TimerEditView'

interface Props {
  timer: Timer;
  isExpanded: boolean;
  onExpand: () => void;
}

export default function TimerListItem({ timer, isExpanded, onExpand }: Props) {
  const { updateTimer, deleteTimer } = useRegistry();

  return isExpanded ? (
    <TimerEditView
      timer={timer}
      onUpdate={updates => updateTimer(timer.id, updates)}
      onCollapse={onExpand}
      onDelete={() => deleteTimer(timer.id)}
    />
  ) : (
    <TimerCollapsedView timer={timer} onExpand={onExpand} />
  );
}