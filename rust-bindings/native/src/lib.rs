mod binding_event;
mod data_types;

use lazy_static::lazy_static;
use neon::prelude::{register_module, Context, FunctionContext, JsResult, JsString};
use std::sync::Mutex;

use binding_event::BindingEvent;
use data_types::app_state::AppState;

fn process_event(mut ctx: FunctionContext) -> JsResult<JsString> {
    lazy_static! {
        static ref STATE: Mutex<AppState> = Mutex::new(AppState::new());
    }

    let event_string = STATE
        .lock()
        .unwrap()
        .handle_event(BindingEvent::from_ctx(&mut ctx))
        .to_string();

    Ok(ctx.string(event_string))
}

register_module!(mut ctx, {
    ctx.export_function("processEvent", process_event)
});
