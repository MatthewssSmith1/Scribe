import { generateEvent } from '@/rust-bindings/rust_interface'

export enum EventType {
   Error = 0,
   Empty = 1,
   Multiple = 2,
   Init = 3,
   Log = 4,

   ShowLinkMenu = 5,
   HideLinkMenu = 6,

   OpenGraphPage = 7,
   OpenTodayPage = 8,

   ToggleActionBar = 9,
   ToggleSidePanel = 10,

   ActionBarWidthChanged = 11,
   SidePanelWidthChanged = 12,

   NotePageLoaded = 13,
   LoadDoc = 14,

   SearchQueryChanged = 15,
   NewSearchResults = 16,

   NumEventTypes = 17,
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
      if (this.is(EventType.Multiple)) {
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

   is(...types: Array<EventType>): boolean {
      for (var i = 0; i < types.length; i++) {
         if (types[i] == this.type) return true
      }

      return false
   }

   try_log(prefix: string = ''): boolean {
      if (this.is(EventType.Log)) {
         this.data.forEach(msg => {
            console.log(`${prefix}${msg}`)
         })

         return true
      } else if (this.is(EventType.Error)) {
         this.data.forEach(msg => {
            console.log(`${prefix}ERROR: ${msg}`)
         })

         return true
      }

      return false
   }

   dataAsNum(index: number): number {
      return +this.data[index]
   }

   dataAsBool(index: number): boolean {
      let str = this.data[index]
      if (str == 'true') return true

      if (str != 'false') generateEvent(EventType.Error, `event data '${str}' was parsed as a boolean`)

      return false
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
