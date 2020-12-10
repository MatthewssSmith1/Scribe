use std::io::{Error, ErrorKind};
use std::{fmt, vec::Vec, sync::Mutex};

use lazy_static::lazy_static;

#[derive(Clone, Copy)]
pub struct Link {
	pub id: i32,
	pub from_id: i32,
	pub from_line: i32,
	pub to_id: i32,
	pub to_line: i32,
}

impl Link {
	pub fn new(from_id: i32, from_line: i32, to_id: i32, to_line: i32) -> Link {
		lazy_static!{
			static ref ID_GEN: Mutex<i32> = Mutex::new(0);
		}
		let mut id_gen = ID_GEN.lock().unwrap();
		*id_gen = *id_gen + 1;

		Link {
			id: *id_gen,
			from_id,
			from_line,
			to_id,
			to_line,
		}
	}

	pub fn from_str(s: &str) -> Result<Link, Error> {
		let split: Vec<i32> = s
			.split("|")
			.map(|s| s.parse::<i32>())
			.filter_map(Result::ok)
			.collect();

		if split.len() != 4 {
			return Err(Error::new(
				ErrorKind::InvalidData,
				format!("link '{}' was not formatted properly", s),
			));
		}

		Ok(Link::new(split[0], split[1], split[2], split[3]))
	}
}

impl fmt::Display for Link {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		write!(
			f,
			"{}|{}|{}|{}",
			self.from_id, self.from_line, self.to_id, self.to_line
		)
	}
}
