use std::collections::HashMap;
use std::vec::Vec;

pub struct AppState {
	pub workspace_path: String,
	pub documents: HashMap<i32, Document>,
	pub links: HashMap<i32, Link>,
}

pub struct Document {
	pub name: String,
	pub id: i32,

	pub tags: Vec<String>,

	pub props: HashMap<String, String>,

	pub link_ids_to_this: Vec<i32>,
	pub link_ids_from_this: Vec<i32>,
}

pub struct Link {
	pub id: i32,
	pub from_doc_id: i32,
	pub from_doc_line: i32,
	pub to_doc_id: i32,
	pub to_doc_line: i32,
}
