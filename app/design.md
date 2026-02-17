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