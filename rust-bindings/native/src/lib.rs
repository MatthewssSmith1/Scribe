mod binding_event;
mod data_types;

use neon::prelude::*;
use std::collections::HashMap;

use binding_event::*;
use data_types::*;

#[macro_use]
extern crate lazy_static;

lazy_static! {
    static ref STATE: AppState = AppState {
        workspace_path: "C:/dev/Scribe/workspace/".to_string(),
        documents: HashMap::new(),
        links: HashMap::new(),
    };
}

fn process_event(mut cx: FunctionContext) -> JsResult<JsString> {
    let event: BindingEvent = match cx.argument::<JsString>(0) {
        Ok(s) => s
            .value()
            .parse::<BindingEvent>()
            .unwrap_or(BindingEvent::err(
                "Could not parse string in rust process_event",
            )),
        Err(_) => BindingEvent::err("Could not get string in rust process_event"),
    };

    Ok(cx.string(event.to_string()))
}

register_module!(mut cx, {
    cx.export_function("processEvent", process_event)
});
