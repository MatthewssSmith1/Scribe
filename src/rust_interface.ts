enum BindingEventType {
   Error = 0,
   Init = 1,
   GraphOpened = 2,
   NodeTextChanged = 3, //what and where
   NoteOpened = 4, //to doc id, to line num, inSidePanel
}

class BindingEvent {
   constructor(public type: BindingEventType, public data: Array<string> = new Array<string>()) {}
}

export default abstract class RustInterface {
   static binding = require('@rust/native/index.node')

   static async init() {
      this.processEvent(new BindingEvent(BindingEventType.Init))
   }

   static async processEvent(e: BindingEvent) {
      console.log(e)
      let returnedEvent = this.binding.processEvent(JSON.stringify(e))
      console.log(returnedEvent)
   }
}

export { BindingEvent, BindingEventType }
