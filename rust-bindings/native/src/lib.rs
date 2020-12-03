mod binding_event;
mod data_types;

use std::collections::HashMap;

use neon::prelude::*;

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

fn process_event(mut ctx: FunctionContext) -> JsResult<JsString> {
    let event: BindingEvent = BindingEvent::from_function_ctx(&mut ctx);

    Ok(ctx.string(event.to_string()))
}

register_module!(mut ctx, {
    ctx.export_function("processEvent", process_event)
});
