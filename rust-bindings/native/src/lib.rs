mod binding_event;
mod data_types;

use std::collections::HashMap;

use neon::prelude::*;

use binding_event::*;
use data_types::*;

use std::sync::Mutex;

#[macro_use]
extern crate lazy_static;

lazy_static! {
    static ref STATE: Mutex<AppState> = Mutex::new(AppState {
        workspace_path: "C:/dev/Scribe/workspace/".to_string(),
        documents: HashMap::new(),
        links: HashMap::new(),
    });
}

fn process_event(mut ctx: FunctionContext) -> JsResult<JsString> {
    let in_event: BindingEvent = BindingEvent::from_ctx(&mut ctx);
    let mut out_event: Option<BindingEvent> = None;

    match in_event.event_type {
        BindingEventType::Init => {
            out_event = Some(STATE.lock().unwrap().load_workspace());
        }
        _ => {}
    }

    Ok(ctx.string(out_event.unwrap_or(BindingEvent::empty()).to_string()))
}

register_module!(mut ctx, {
    ctx.export_function("processEvent", process_event)
});
