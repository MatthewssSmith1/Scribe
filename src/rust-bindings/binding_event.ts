export enum BindingEventType {
   Error = 0,
   Empty = 1,
   Multiple = 2,
   Init = 3,
   GraphOpened = 4,
   NoteOpened = 5,
   NodeTextChanged = 6,
   NUM_EVENT_TYPES = 7,
}

export default class BindingEvent {
   constructor(public type: BindingEventType, public data: Array<string> = new Array<string>()) {
      if (type == BindingEventType.NUM_EVENT_TYPES) {
         console.error('new BindingEvent() called with BindingEventType.NUM_EVENT_TYPES')
      }
   }

   static fromArray(events: Array<BindingEvent>): BindingEvent {
      return new BindingEvent(
         BindingEventType.Multiple,
         events.map<string>(e => e.toString())
      )
   }

   toArray(): Array<BindingEvent> {
      if (this.type == BindingEventType.Multiple) {
         return this.data.map<BindingEvent>(s => BindingEvent.fromString(s))
      }

      return [this]
   }

   static fromString(str: string): BindingEvent {
      let str_list: Array<string> = str.slice(2, -2).split('|')

      return new BindingEvent(parseInt(str_list.shift()) as BindingEventType, str_list)
   }

   toString(): string {
      return `<<${<number>this.type}|${this.data.join('|')}>>`
   }
}

/**
 * An class for ui components throughout the application to extend and then subscribe themselves to events using RustInterface.subscribe()
 */
export interface BindingEventListener {
   /**
    * For the extending class to implement any sort of functionality. Only events of the BindingEventType(s) subscribed to will be dispatched to this method.
    *
    * @param e the event to be handled
    */
   handleEvent(e: BindingEvent): void
}
