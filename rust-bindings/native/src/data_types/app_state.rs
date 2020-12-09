use std::{collections::HashMap, fs};

use super::{document::*, link::*};
use crate::binding_event::*;

use std::cell::Cell;

pub struct IDManager {
	next_id: Cell<i32>,
}

impl IDManager {
	pub fn new() -> IDManager {
		IDManager {
			next_id: Cell::new(1),
		}
	}

	pub fn get_id(&self) -> i32 {
		let ans = self.next_id.get();
		self.next_id.set(ans + 1);
		ans
	}
}

pub struct AppState {
	pub workspace_path: String,
	pub documents: HashMap<i32, Document>,
	pub links: HashMap<i32, Link>,
	pub id_manager: IDManager,
}

impl AppState {
	pub fn new() -> AppState {
		AppState {
			workspace_path: "C:/dev/Scribe/workspace/".to_string(),
			documents: HashMap::new(),
			links: HashMap::new(),
			id_manager: IDManager::new(),
		}
	}

	pub fn load_workspace(&mut self) -> BindingEvent {
		if self.documents.len() != 0 {
			return BindingEvent::err("AppState.load_workspace() called more than once");
		}

		//converts every valid .txt file in workspace into deserialized doc data
		let docs_data: Vec<DocSerData> = match fs::read_dir(&self.workspace_path) {
			Ok(dir) => dir,
			Err(_) => return BindingEvent::err("could not read workspace dir"),
		}
		.filter_map(Result::ok)
		.map(|p| p.path().display().to_string())
		.filter(|s| s.split(".").last().unwrap_or("").eq("txt"))
		.map(DocSerData::from_path)
		.filter_map(Result::ok)
		.collect();

		//convert all of the links stored in the deserialized data into links and store them in state
		let links: Vec<Link> = docs_data
			.iter()
			.flat_map(|data| {
				data
					.links_from_this
					.iter()
					.map(|s| Link::from_str(self, s))
					.filter_map(Result::ok)
			})
			.collect();

		links.iter().for_each(|l| {
			self.links.insert(l.id, *l);
		});

		//convert all doc data into documents and store them in state
		let docs: Vec<Document> = docs_data
			.iter()
			.map(|data| {
				let (links_from, links_to) = self.links_with_doc(data.id);
				Document {
					name: data.name.clone(),
					id: data.id,

					tags: data.tags.clone(),
					props: data.props.clone(),

					links_from,
					links_to,
				}
			})
			.collect();

		docs.iter().for_each(|d| {
			self.documents.insert(d.id, d.clone());
		});

		return BindingEvent::empty();
	}

	
	pub fn links_with_doc(&self, doc_id: i32) -> (Vec<i32>, Vec<i32>) {
		let mut links_from: Vec<i32> = vec![];
		let mut links_to: Vec<i32> = vec![];

		self.links.values().for_each(|lnk| {
			if lnk.to_id == doc_id {
				links_to.push(lnk.id);
			} else if lnk.from_id == doc_id {
				links_from.push(lnk.id);
			}
		});

		(links_from, links_to)
	}
}
