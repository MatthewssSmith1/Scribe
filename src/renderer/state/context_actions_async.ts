import { ContextStateType, ContextDispatchType } from '@renderer/state/context'

import { loadDocument, documentSaveComplete, dequeueSaveDocument } from '@renderer/state/context_actions'

import { AsyncCallback } from '@renderer/state/context'

import WorkspaceManager from '@main/workspace_manager'
import { writeFileSync } from 'fs'

export function loadInitDocument(): AsyncCallback {
   return async (state: ContextStateType, dispatch: ContextDispatchType) => {
      if (!WorkspaceManager.isInitialized) await WorkspaceManager.init()

      var loadDocCallback = loadDocumentById(WorkspaceManager.documents[0].metaData.id)

      loadDocCallback(state, dispatch)
   }
}

export function loadDocumentById(id: number): AsyncCallback {
   return async (state: ContextStateType, dispatch: ContextDispatchType) => {
      dispatch(dequeueSaveDocument)

      if (!WorkspaceManager.isInitialized) await WorkspaceManager.init()

      var doc = WorkspaceManager.documents.find(doc => doc.metaData.id == id)

      if (doc == undefined) {
         console.warn(`attempted to load document with id ${id}, but it could not be found`)
         return
      }

      dispatch(loadDocument(doc, doc.toBullet()))
   }
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
