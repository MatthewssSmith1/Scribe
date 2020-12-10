export enum EventType {
   Error = 0,
   Empty = 1,
   Multiple = 2,
   Init = 3,
   Message = 4,

   A = 5,
   B = 6,
   
   OpenGraphPage = 7,
   OpenTodayPage = 8,
   ToggleActionBar = 9,
   ToggleSidePanel = 10,
   NumEventTypes = 11,
}

export class Event {
   constructor(public type: EventType, public data: Array<string> = new Array<string>()) {
      if (type == EventType.NumEventTypes) {
         console.error('new Event() called with EventType.NUM_EVENT_TYPES')
      }
   }

   static fromArray(events: Array<Event>): Event {
      return new Event(
         EventType.Multiple,
         events.map<string>(e => e.toString())
      )
   }

   toArray(): Array<Event> {
      if (this.type == EventType.Multiple) {
         return this.data.map<Event>(s => Event.fromString(s))
      }

      return [this]
   }

   static fromString(str: string): Event {
      let str_list: Array<string> = str.slice(2, -2).split('|')

      return new Event(parseInt(str_list.shift()) as EventType, str_list)
   }

   toString(): string {
      return `<<${<number>this.type}|${this.data.join('|')}>>`
   }
}

/**
 * An class for ui components throughout the application to extend and then subscribe themselves to events using RustInterface.subscribe()
 */
export interface EventListener {
   /**
    * For the extending class to implement any sort of functionality. Only events of the EventType(s) subscribed to will be dispatched to this method.
    *
    * @param e the event to be handled
    */
   handleEvent(e: Event): void
}
