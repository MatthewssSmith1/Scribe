import { ContextStateType } from '@renderer/state/context_actions'

import { loadDocument, documentSaveComplete, dequeueSaveDocument } from '@renderer/state/context_actions'

import WorkspaceManager from '@main/workspace_manager'
import { writeFileSync } from 'fs'

export async function loadInitDocument(state: ContextStateType, dispatch: React.Dispatch<any>) {
   dispatch(dequeueSaveDocument)

   await WorkspaceManager.init()

   var doc = WorkspaceManager.documents[0]

   dispatch(loadDocument(doc, doc.toBullet()))
}

export async function trySaveDocument(state: ContextStateType, dispatch: React.Dispatch<any>) {
   //TODO fix bugs before allowing to save again
   return

   var { rootBullet, document, shouldSave } = state.noteBody

   if (!shouldSave) return

   var textFilePath = WorkspaceManager.workspacePath + document.name + '.txt'

   writeFileSync(textFilePath, rootBullet.toString())

   dispatch(documentSaveComplete())
}
