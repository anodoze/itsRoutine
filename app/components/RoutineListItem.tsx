import { useState } from "react";
import { Routine } from "../types";
import RoutineCollapsedView from "./RoutineCollapsedView";
import RoutineExpandedView from "./RoutineExpandedView";
import RoutineEditModal from "./RoutineEditModal";

type ViewState = 'collapsed' | 'expanded' | 'editing';

interface Props {
  routine: Routine;
}

export default function RoutineListItem({ routine }: Props) {
  const [state, setState] = useState<ViewState>('collapsed');

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
        />
      )}
      <RoutineEditModal
        visible={state === 'editing'}
        routine={routine}
        onClose={() => setState('expanded')}
      />
    </>
  );
}
