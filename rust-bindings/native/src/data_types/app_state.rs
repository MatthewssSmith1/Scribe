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

		match fs::read_dir(&self.workspace_path) {
			Ok(dir) => dir,
			Err(_) => return BindingEvent::err("could not read workspace dir"),
		}
		.filter_map(Result::ok)
		.map(|p| p.path().display().to_string())
		.filter(|s| s.split(".").last().unwrap_or("").eq("txt"))
		.for_each(|s| {
			let (doc, links) = Document::from_path(self, &s).expect("doc couldn't be loaded");
			self.documents.insert(doc.id, doc);
			links.iter().for_each(|l| {
				self.links.insert(l.id, l.clone());
			});
		});

		self
			.links
			.values()
			.for_each(|lnk| match self.documents.get(&lnk.id) {
				Some(doc) => doc.links_to.push(lnk.id),
				None => {}
			});

		return BindingEvent::empty();
	}
}

/*
pub fn load_workspace(&mut self) -> BindingEvent {
		if self.documents.len() != 0 {
			return BindingEvent::err("AppState.load_workspace() called more than once");
		}

		match fs::read_dir(&self.workspace_path) {
			Ok(dir) => dir,
			Err(_) => return BindingEvent::err("could not read workspace dir"),
		}
		.filter_map(Result::ok)
		.map(|p| p.path().display().to_string())
		.filter(|s| s.split(".").last().unwrap_or("").eq("txt"))
		.for_each(|s| {
			let (doc, links) = Document::from_path(self, &s).expect("doc couldn't be loaded");
			self.documents.insert(doc.id, doc);
			links.iter().for_each(|l| {
				self.links.insert(l.id, l.clone());
			});
		});

		self
			.links
			.values()
			.for_each(|lnk| match self.documents.get(&lnk.id) {
				Some(doc) => doc.links_to.push(lnk.id),
				None => {}
			});

		return BindingEvent::empty();
	}
	*/
