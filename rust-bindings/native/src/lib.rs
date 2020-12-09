use std::sync::Mutex;
use lazy_static::lazy_static;
use neon::prelude::*;

mod binding_event;
use binding_event::*;

mod data_types;
use data_types::app_state::AppState;

mod id_manager;


lazy_static! {
    static ref STATE: Mutex<AppState> = Mutex::new(AppState::new());
}

fn process_event(mut ctx: FunctionContext) -> JsResult<JsString> {
    let in_event: BindingEvent = BindingEvent::from_ctx(&mut ctx);
    let mut out_event: Option<BindingEvent> = None;

    match in_event.event_type {
        BindingEventType::Init => {
            out_event = Some(STATE.lock().unwrap().load_workspace());

            // let mut props = HashMap::new();
            // props.insert("date-created".to_string(), "12-6-2020".to_string());

            // let doc = Document {
            //     name: "Doc Name".to_string(),
            //     id: 142135342,

            //     tags: vec!["completed".to_string()],

            //     props: props,

            //     links_to_this: vec![],
            //     links_from_this: vec![],
            // };
            // out_event = Some(BindingEvent::msg(doc.to_string()))
        }
        _ => {}
    }

    Ok(ctx.string(out_event.unwrap_or(BindingEvent::empty()).to_string()))
}

register_module!(mut ctx, {
    ctx.export_function("processEvent", process_event)
});
