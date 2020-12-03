import BindingEvent, { BindingEventListener, BindingEventType } from '@/rust-bindings/binding_event'

export default abstract class RustInterface {
   private static binding = require('@rust/native/index.node')
   private static listeners: BindingEventListener[][]
   private static hasInit: boolean = false

   static init() {
      if (this.hasInit) return
      this.hasInit = true

      //init 2d array of listeners
      this.listeners = new Array(BindingEventType.NUM_EVENT_TYPES as number)
      for (var i = 0; i < this.listeners.length; i++) {
         this.listeners[i] = new Array(0)
      }

      //initialize rust
      this.send(new BindingEvent(BindingEventType.Init))
   }

   /**
    * Sends an event to rust to be processed. Side Effect: once rust returns an event, it is dispatched to all subscribed listeners of the new events type.
    * @param e the event to be sent to rust
    */
   static async send(e: BindingEvent) {
      let returned = BindingEvent.fromString(this.binding.processEvent(e.toString()))

      this.listeners[returned.type].forEach(l => l.handleEvent(returned))
   }

   /**
    * Subscribes a BindingEventListener to be notified when an event of specific types are dispatched.
    *
    * @param listener the BindingEventListener to be dispatched to whenever a relevant event is returned from rust
    * @param types a list of BindingEventTypes which the listener should be notified of
    */
   static subscribe(listener: BindingEventListener, ...types: Array<BindingEventType>) {
      types.forEach(t => {
         this.listeners[t].push(listener)
      })
   }
}

export function generateEvent(type: BindingEventType, ...data: Array<string>) {
   RustInterface.send(new BindingEvent(type, data))
}
