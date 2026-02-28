import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Routine, Registry } from './types';
import { loadRegistry, saveRegistry } from './Storage';

type RegistryContextValue = {
  registry: Registry;
  loading: boolean;
  addRoutine: (routine: Omit<Routine, 'id'>) => string;
  updateRoutine: (id: string, updates: Partial<Routine>) => void;
  deleteRoutine: (id: string) => Promise<boolean>;
  getRoutineReferences: (routineId: string) => Routine[];
  // Dev
  seedRegistry: (data: Registry) => void;
};

const RegistryContext = createContext<RegistryContextValue | null>(null);

export function useRegistry() {
  const ctx = useContext(RegistryContext);
  if (!ctx) throw new Error('useRegistry must be used within RegistryProvider');
  return ctx;
}

function generateId(prefix: string): string { // todo: use UUID
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function RegistryProvider({ children }: { children: React.ReactNode }) {
  const [registry, setRegistry] = useState<Registry>({ routines: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegistry().then(loaded => {
      setRegistry(loaded);
      setLoading(false);
    });
  }, []);

  // Save whenever registry changes (debounce this later if needed)
  useEffect(() => {
    if (!loading) saveRegistry(registry);
  }, [registry, loading]);

  const getRoutineReferences = useCallback((routineId: string): Routine[] => {
    return Object.values(registry.routines).filter(routine =>
      routine.items.some(item => item.type === 'routine' && item.routineId === routineId)
    );
  }, [registry]);

  const addRoutine = useCallback((routine: Omit<Routine, 'id'>): string => {
    const id = generateId('r');
    setRegistry(prev => ({
      ...prev,
      routines: { ...prev.routines, [id]: { ...routine, id } as Routine }
    }));
    return id;
  }, []);

  const updateRoutine = useCallback((id: string, updates: Partial<Routine>) => {
    setRegistry(prev => {
      const existing = prev.routines[id];
      if (!existing) return prev;
      return {
        ...prev,
        routines: { ...prev.routines, [id]: { ...existing, ...updates } }
      };
    });
  }, []);

  const deleteRoutine = useCallback(async (id: string): Promise<boolean> => {
    const references = getRoutineReferences(id);
    
    if (references.length > 0) {
      // TODO: Show confirmation modal
      console.log(`Routine ${id} referenced in:`, references.map(r => r.name));
    }

    // Remove from all parent routines
    setRegistry(prev => {
      const newRoutines = { ...prev.routines };
      for (const routine of references) {
        newRoutines[routine.id] = {
          ...routine,
          items: routine.items.filter(item => 
            !(item.type === 'routine' && item.routineId === id)
          )
        };
      }

      const { [id]: removed, ...remainingRoutines } = newRoutines;
      return {
        ...prev,
        routines: remainingRoutines
      };
    });

    return true;
  }, [getRoutineReferences]);

  const seedRegistry = useCallback((data: Registry) => {
    setRegistry(data);
  }, []);

  const value: RegistryContextValue = {
    registry, loading,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    getRoutineReferences,
    seedRegistry,
  };

  return (
    <RegistryContext.Provider value={value}>
      {children}
    </RegistryContext.Provider>
  );
}