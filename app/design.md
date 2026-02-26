# This Project: itsRoutine
A timer app built for the formation and maintenance of daily habits

# Tools
Expo
React Native (Typescript)
Targeting Android first, will adapt to iOS later

# Terms
## Timer: a single timer with any of the following properties
- label (required)
- description
- duration - all Timers have a button to end early. if no duration is set, it will not end unless the user ends it or it is interrupted by another routine item
- task categories - list of types of Tasks that my be displayed in a timer

## Routine: a collection of Timers with any of the following properties
- label (required)
- description
- start time
- time alerts - for lists of tasks with flexible times, flags the current time to keep the user on schedule
- end time - can be configured as a time alert or hard cutoff
- duration
- routine items - timers or subroutines that run within the routine
Routines are containers for everything else

## Task: a task without a fixed time - not implemented
- label
- category
- notes
- completion status: incomplete/on hold/complete
A Timer can be a container for Tasks. For example: 1 hour for tasks in the "clean house" category. While that timer is active, tasks from "clean house" will be shown one after another and can be marked complete OR have notes added and then put at the bottom of the list to be addressed later
- blocking task: link to another task that must be done before this can begin. A task with a blocking task is automatically on hold
- task type
    - one-off - when marked complete, will stay present until the containing routine finishes (to give a chance to un-complete in case of misclicks/second thoughts), and then is deleted.
    - recurring: happens on a regular interval, such as daily, weekly, monthly or yearly. when marked "complete", goes dormant until it is relevant again.

# Core design concepts
Goal: help to create and maintain daily habits with gentle alarms, reminders, and easily-configurable time-blocking. We want structure to make sure we make the most of your day, but the flexibility to handle the changing demands of everyday life.

- operates on a maximum timescale of two weeks - this is a habit app, not a calendar app
    - do we want to make an exception for monthly recurring Tasks, such as paying bills?
- Routines can be at a fixed time daily (such as a morning routine) or a collection that can be started at any time (such as a midday stretch)
- Routines can nest - such as a workout routine within a morning routine.
- The app should handle regular intervals such as every other day, once every 2 weeks, Monday/Wednesday/Friday, or "weekends only"

# UI Routes
## Home - index.tsx
Main page, shows the active routine and active timer within the routine

## Manage - manage.tsx
Space for adding and editing Routines
- List view, items editable via modal
- Routines have drag-and-drop interface for arranging sub-elements

# Technical Architecture
- `RegistryContext` provides global access to routines via `useRegistry()` hook
- All data persists to AsyncStorage automatically on changes
- CRUD operations are atomic - deletes cascade to remove references from parent routines
- `RegistryContext.tsx` - Global state provider, CRUD operations, persistence
- `storage.ts` - AsyncStorage read/write helpers
- `hooks/use-routine-runner.ts` - State machine for executing routines with nesting support
- `types.ts` - Core data structures (Routine, Registry)
- `seed.ts` - Dev data for testing (call `seedRegistry()` to reset)

## Routine Execution Model
The runner hook uses a stack-based traversal to handle nested routines:
- Stack of `{routineId, itemIndex}` positions tracks current location
- `advance()` function steps through items, diving into sub-routines automatically
- Always resolves to a leaf `Timer` or marks completion as `isDone`
- First timer waits for user to press Start; subsequent timers auto-advance
- Timers without `durationSeconds` stay active until manually skipped

## Data Flow
1. App loads → `RegistryProvider` reads from AsyncStorage
2. Components use `useRegistry()` to access/modify data
3. Any registry change → auto-saves to AsyncStorage
4. `TimerView` gets routine + registry → `useRoutineRunner` executes it

## Current Limitations
- Delete confirmations are stubbed (auto-confirm, just log warnings)
- No debouncing on AsyncStorage writes (saves on every mutation)
- No validation on routine item references (will crash if routine is missing from registry)