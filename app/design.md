#This Project: itsRoutine
A timer app built for the formation and maintenance of daily habits

#Tools
Expo
React Native (Typescript)

#Terms
##Timer: a single task with any of the following properties
- label (required)
- start time - can be scheduled or started manually. overridden within a Routine
- end time - overridden within a Routine
- duration - all Timers have a button to end early. if no duration is set, it will not end unless the user ends it or it is interrupted by another Routine or Timer

Timers can be started and ended individually, or they can be included in Routines.

##Routine: a collection of Timers with any of the following properties
- label (required)
- start time 
- time alerts - for lists of tasks with flexible times, flags the current time to keep the user on schedule
- end time - can be configured as a time alert or hard cutoff
- duration
Routines are containers for everything else

##Task: a task without a fixed time
- label
- category
- notes
- completion status: incomplete/on hold/complete
A Timer can be a container for Tasks. For example: 1 hour for tasks in the "pay bills" category. While that timer is active, tasks from "pay bills" will be shown one after another and can be marked complete OR have notes added and then put at the bottom of the list to be addressed later

#Core design concepts
Goal: help to create and maintain daily habits with gentle alarms, reminders, and easily-configurable time-blocking. We want structure to make sure we make the most of your day, but the flexibility to handle the changing demands of everyday life.
- operates on a maximum timescale of two weeks - this is a short-term habit app, not a calendar app
- Routines can be at a fixed time daily (such as a morning routine) or a collection that can be started at any time (such as a midday stretch)
- Routines can nest - such as a workout routine within a morning routine. 
- The app should handle regular intervals such as every other day, once every 2 weeks, Monday/Wednesday/Friday, or "weekends only"

#Technical Architecture

##State Management
- `RegistryContext` provides global access to timers and routines via `useRegistry()` hook
- All data persists to AsyncStorage automatically on changes
- CRUD operations are atomic - deletes cascade to remove references from parent routines

##Key Files
- `types.ts` - Core data structures (Timer, Routine, Registry)
- `RegistryContext.tsx` - Global state provider, CRUD operations, persistence
- `storage.ts` - AsyncStorage read/write helpers
- `hooks/use-routine-runner.ts` - State machine for executing routines with nesting support
- `seed.ts` - Dev data for testing (call `seedRegistry()` to reset)

##Routine Execution Model
The runner hook uses a stack-based traversal to handle nested routines:
- Stack of `{routineId, itemIndex}` positions tracks current location
- `advance()` function steps through items, diving into sub-routines automatically
- Always resolves to a leaf `Timer` or marks completion as `isDone`
- First timer waits for user to press Start; subsequent timers auto-advance
- Timers without `durationSeconds` stay active until manually skipped

##Data Flow
1. App loads → `RegistryProvider` reads from AsyncStorage
2. Components use `useRegistry()` to access/modify data
3. Any registry change → auto-saves to AsyncStorage
4. `TimerView` gets routine + registry → `useRoutineRunner` executes it

##Current Limitations
- Delete confirmations are stubbed (auto-confirm, just log warnings)
- No debouncing on AsyncStorage writes (saves on every mutation)
- No validation on routine item references (will crash if timer/routine missing from registry)