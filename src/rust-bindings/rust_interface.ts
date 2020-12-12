import { Event, EventListener, EventType } from '@/rust-bindings/binding_event'

/**
 * A static class to handle events passing to and from the business logic written in rust.
 */
export default abstract class RustInterface {
   private static binding = require('@rust/native/index.node')
   private static listeners: EventListener[][]

   /**
    * Initializes the RustInterface on the ts and rust side
    */
   static init() {
      if (this.listeners != undefined) return

      //init 2d array of listeners
      this.listeners = new Array(EventType.NumEventTypes as number)
      for (var i = 0; i < this.listeners.length; i++) {
         this.listeners[i] = new Array(0)
      }

      //initialize rust
      this.send(new Event(EventType.Init))
   }

   /**
    * Sends an event to rust to be processed. Side Effect: once rust returns an event, it is dispatched to all subscribed listeners of the new events type.
    * @param e the event to be sent to rust
    */
   static async send(e: Event) {
      //if e is an error or log, just log it to console it and return
      if (e.try_log()) return

      this.listeners[e.type].forEach(l => l.handleEvent(e))

      let returned = Event.fromString(this.binding.processEvent(e.toString()))

      returned.try_log("RUST ")
      this.listeners[returned.type].forEach(l => l.handleEvent(returned))
   }

   /**
    * Subscribes a BindingEventListener to be notified when an event of specific types are dispatched.
    *
    * @param listener the BindingEventListener to be dispatched to whenever a relevant event is returned from rust
    * @param types a list of BindingEventTypes which the listener should be notified of
    */
   static subscribe(listener: EventListener, ...types: Array<EventType>) {
      types.forEach(t => {
         switch (t) {
            case EventType.Empty:
            case EventType.Multiple:
            case EventType.Init:
            case EventType.NumEventTypes:
               console.error('cannot subscribe to events of type Empty, Multiple, Init, or NUM_EVENT_TYPES')
               return
         }
         this.listeners[t].push(listener)
      })
   }
}

/**
 * Instantiates and sends an event to rust.
 *
 * @param type type of the event to send
 * @param data data to be stored in the event
 */
export function generateEvent(type: EventType, ...data: Array<string>) {
   RustInterface.send(new Event(type, data))
}
