import { useState } from "react";
import { Routine } from "../types";
import { useRegistry } from "../_RegistryContext";
import RoutineCollapsedView from "./RoutineCollapsedView";
import RoutineEditModal from "./RoutineEditModal";
import RoutineExpandedView from "./RoutineExpandedView";

type ViewState = 'collapsed' | 'expanded' | 'editing';

interface Props {
  routine: Routine;
}

export default function RoutineListItem({ routine }: Props) {
    const { registry } = useRegistry();
  const [state, setState] = useState<ViewState>('collapsed');
  const renderRoutine = (id: string) => {
    const subroutine = registry.routines[id];
    if (!subroutine) return null;
    return <RoutineListItem routine={subroutine} />;
  };

  return (
    <>
      {state === 'collapsed' && (
        <RoutineCollapsedView routine={routine} onExpand={() => setState('expanded')} />
      )}
      {state === 'expanded' && (
        <RoutineExpandedView
          routine={routine}
          onCollapse={() => setState('collapsed')}
          onEdit={() => setState('editing')}
          renderRoutine={renderRoutine}
        />
      )}
      <RoutineEditModal
        visible={state === 'editing'}
        routine={routine}
        onClose={() => setState('expanded')}
        renderRoutine={renderRoutine}
      />
    </>
  );
}
