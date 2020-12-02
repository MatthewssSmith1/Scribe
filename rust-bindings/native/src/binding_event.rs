use std::{fmt, str::FromStr, vec::Vec};

use int_enum::IntEnum;

#[repr(i32)]
#[derive(Clone, Copy, Debug, Eq, PartialEq, IntEnum)]
pub enum BindingEventType {
	Error = 0,
	Init = 1,
	GraphOpened = 2,
	NodeTextChanged = 3, //what and where
	NoteOpened = 4,      //to doc id, to line num, inSidePanel
}

pub struct BindingEvent {
	pub event_type: BindingEventType,
	pub data: Vec<String>,
}

impl BindingEvent {
	pub fn new(event_type: BindingEventType, data: Vec<String>) -> BindingEvent {
		BindingEvent { event_type, data }
	}

	pub fn err(msg: &str) -> BindingEvent {
		BindingEvent::new(BindingEventType::Error, vec![msg.to_string()])
	}
}

impl fmt::Display for BindingEvent {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		write!(f, "{}|{}", self.event_type as i32, self.data.join("|"))
	}
}

impl FromStr for BindingEvent {
	type Err = std::num::ParseIntError;

	fn from_str(s: &str) -> Result<Self, Self::Err> {
		let mut s_split: Vec<String> = s.split("|").map(|val| val.to_string()).collect();

		let event_type = BindingEventType::from_int(i32::from_str(&s_split.remove(0))?).unwrap();

		Ok(BindingEvent::new(event_type, s_split))
	}
}