use std::collections::HashMap;
use std::vec::Vec;

use std::fs;

use crate::binding_event::*;

pub struct AppState {
	pub workspace_path: String,
	pub documents: HashMap<i32, Document>,
	pub links: HashMap<i32, Link>,
}

impl AppState {
	pub fn load_workspace(&mut self) -> BindingEvent {
		if self.documents.len() != 0 {
			return BindingEvent::err("AppState.load_workspace() called more than once");
		}

		let mut msgs = vec![];

		fs::read_dir(&self.workspace_path)
			.unwrap()
			.map(|p| p.unwrap().path().display().to_string())
			.filter(|s| s.split(".").last().unwrap_or("").eq("txt"))
			.for_each(|s| {
				msgs.push(s.clone());
				let doc = Document::new(&s);
				self.documents.insert(doc.id, doc);
			});

		return BindingEvent::msgs(msgs);
	}
}

pub struct Document {
	pub name: String,
	pub id: i32,

	pub tags: Vec<String>,

	pub props: HashMap<String, String>,

	pub link_ids_to_this: Vec<i32>,
	pub link_ids_from_this: Vec<i32>,
}

impl Document {
	fn new(_path: &str) -> Document {
		Document {
			name: "name".to_string(),
			id: 4,
			tags: vec![],
			props: HashMap::new(),
			link_ids_to_this: vec![],
			link_ids_from_this: vec![],
		}
	}
}

pub struct Link {
	pub id: i32,
	pub from_doc_id: i32,
	pub from_doc_line: i32,
	pub to_doc_id: i32,
	pub to_doc_line: i32,
}
