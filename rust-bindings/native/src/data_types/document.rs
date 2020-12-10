use std::io::{Error, ErrorKind};
use std::collections::HashMap;
use std::{fs, vec::Vec};

use serde::{Deserialize, Serialize};
use serde_yaml;

use crate::data_types::app_state::*;

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct DocSerData {
	pub name: String,
	pub id: i32,

	pub tags: Vec<String>,

	pub props: HashMap<String, String>,

	pub links_from_this: Vec<String>,
}

impl DocSerData {
	pub fn from_path<N: AsRef<str>>(path: N) -> Result<DocSerData, Error> {
		//get the file at path
		let file = match fs::read_to_string(path.as_ref()) {
			Ok(s) => s,
			Err(_) => {
				return Err(Error::new(
					ErrorKind::Interrupted,
					format!("file at path '{}' could not be read", path.as_ref()),
				))
			}
		};

		//get the index where to stop deserializing from (before document content)
		let sep_index = match file.find("---") {
			Some(i) => i,
			None => {
				return Err(Error::new(
					ErrorKind::InvalidData,
					format!(
						"file at path '{}' was not formatted properly",
						path.as_ref()
					),
				))
			}
		};

		//deserialize the meta info stored in the loaded file
		return serde_yaml::from_str::<DocSerData>(&file[..sep_index]).map_err(|_| {
			Error::new(
				ErrorKind::InvalidData,
				format!(
					"file at path '{}' was not formatted properly",
					path.as_ref()
				),
			)
		});
	}

	pub fn to_doc(&self, state: &AppState) -> Document {
		let (links_from, links_to) = state.links_with_doc(self.id);

		Document {
			name: self.name.clone(),
			id: self.id.clone(),
			tags: self.tags.clone(),
			props: self.props.clone(),
			links_from,
			links_to,
		}
	}
}

#[derive(Clone)]
pub struct Document {
	pub name: String,
	pub id: i32,

	pub tags: Vec<String>,
	pub props: HashMap<String, String>,

	pub links_from: Vec<i32>,
	pub links_to: Vec<i32>,
}
