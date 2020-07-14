import { loadDocument } from '@renderer/context_actions'

import WorkspaceManager from '@main/workspace_manager'

export async function loadInitDocument(dispatch: React.Dispatch<any>) {
   await WorkspaceManager.init()

   var doc = WorkspaceManager.documents[0]

   dispatch(loadDocument(doc, doc.toBullet()))
}
