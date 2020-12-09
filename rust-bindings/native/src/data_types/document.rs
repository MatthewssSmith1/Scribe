use std::collections::HashMap;
use std::io::{Error, ErrorKind};
use std::{fs, vec::Vec};

use serde::{Deserialize, Serialize};
use serde_yaml;

use crate::data_types::{app_state::*, link::*};

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct DocSerData {
	pub name: String,
	pub id: i32,

	pub tags: Vec<String>,

	pub props: HashMap<String, String>,

	pub links_from_this: Vec<String>,
}

impl DocSerData {
	pub fn from_path(path: &str) -> Result<DocSerData, Error> {
		//get the file at path
		let file = match fs::read_to_string(path) {
			Ok(s) => s,
			Err(e) => {
				return Err(Error::new(
					ErrorKind::Interrupted,
					format!("file at path '{}' could not be read", path),
				))
			}
		};

		//get the index where to stop deserializing from (before document content)
		let sep_index = match file.find("---") {
			Some(i) => i,
			None => {
				return Err(Error::new(
					ErrorKind::InvalidData,
					format!("file at path '{}' was not formatted properly", path),
				))
			}
		};

		//deserialize the meta info stored in the loaded file
		return serde_yaml::from_str::<DocSerData>(&file[..sep_index]).map_err(|_| {
			Error::new(
				ErrorKind::InvalidData,
				format!("file at path '{}' was not formatted properly", path),
			)
		});
	}

	pub fn from_doc(doc: &Document, state: &AppState) -> DocSerData {
		DocSerData {
			name: doc.name.clone(),
			id: doc.id,
			tags: doc.tags.clone(),
			props: doc.props.clone(),
			links_from_this: doc
				.links_from
				.iter()
				.map(|id| state.links[id].to_string())
				.collect(),
		}
	}
}

pub struct Document {
	pub name: String,
	pub id: i32,

	pub tags: Vec<String>,
	pub props: HashMap<String, String>,

	pub links_from: Vec<i32>,
	pub links_to: Vec<i32>,
}

impl Document {
	pub fn from_path(state: &AppState, path: &str) -> Result<(Document, Vec<Link>), Error> {
		let data = match DocSerData::from_path(path) {
			Ok(d) => d,
			Err(e) => return Err(e),
		};

		let links: Vec<Link> = data
			.links_from_this
			.iter()
			.map(|s| Link::from_str(state, s))
			.filter_map(Result::ok).collect();

		Ok((
			Document {
				name: data.name,
				id: data.id,

				tags: data.tags,
				props: data.props,

				links_from: links.iter().map(|lnk| lnk.id).collect(),
				links_to: vec![],
			},
			links,
		))
	}

	// pub fn to_string(&self, state: &AppState) -> String {
	// 	return serde_yaml::to_string(&DocSerData::from_doc(self, state))
	// 		.expect("could not serialize doc");
	// }
}
