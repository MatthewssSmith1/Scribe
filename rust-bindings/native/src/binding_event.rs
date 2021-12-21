use std::{fmt, str::FromStr, vec::Vec};

use int_enum::IntEnum;
use neon::prelude::*;

#[repr(i32)]
#[derive(Clone, Copy, Debug, Eq, PartialEq, IntEnum)]
pub enum BindingEventType {
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

pub struct BindingEvent {
	pub event_type: BindingEventType,
	pub data: Vec<String>,
}

impl BindingEvent {
	pub fn new<N: AsRef<str>>(event_type: BindingEventType, data: Vec<N>) -> BindingEvent {
		BindingEvent {
			event_type,
			data: data.iter().map(|n| n.as_ref().to_string()).collect(),
		}
	}

	pub fn err<N: AsRef<str>>(msg: N) -> BindingEvent {
		BindingEvent::new(BindingEventType::Error, vec![msg])
	}

	pub fn empty() -> BindingEvent {
		BindingEvent {
			event_type: BindingEventType::Empty,
			data: vec![],
		}
	}

	pub fn _msg<N: AsRef<str>>(msg: N) -> BindingEvent {
		BindingEvent::new(BindingEventType::Log, vec![msg])
	}

	pub fn _msgs<N: AsRef<str>>(msgs: Vec<N>) -> BindingEvent {
		BindingEvent::new(BindingEventType::Log, msgs)
	}

	pub fn from_ctx(ctx: &mut FunctionContext) -> BindingEvent {
		return match ctx.argument::<JsString>(0) {
			Ok(s) => s
				.value()
				.parse::<BindingEvent>()
				.unwrap_or(BindingEvent::err(
					"Could not parse the string passed to processEvent() from JS",
				)),
			Err(_) => BindingEvent::err("processEvent() called on JS end without string as first arg"),
		};
	}
}

impl fmt::Display for BindingEvent {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		write!(f, "<<{}|{}>>", self.event_type as i32, self.data.join("|"))
	}
}

impl FromStr for BindingEvent {
	type Err = std::num::ParseIntError;

	fn from_str(s: &str) -> Result<Self, Self::Err> {
		let mut s_split: Vec<String> = s[2..s.len() - 2]
			.split("|")
			.map(|val| val.to_string())
			.collect();

		let event_type = match BindingEventType::from_int(i32::from_str(&s_split.remove(0))?) {
			Ok(t) => t,
			Err(e) => return Ok(BindingEvent::err(format!(
				"event passed to rust with event type (as an integer) that couldn't be converted: {}",
				e
			))),
		};

		Ok(BindingEvent::new(event_type, s_split))
	}
}
