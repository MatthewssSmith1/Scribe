import { State, createActionAsync, Dispatch } from '@renderer/state/context'

import { loadDocument, dequeueSaveDocument, documentSaveComplete } from '@renderer/state/context_actions'

import WorkspaceManager from '@main/workspace_manager'
import { writeFileSync } from 'fs'

export const loadDocumentByID = createActionAsync(async (state: State, dispatch: Dispatch, id: number) => {
   dispatch(dequeueSaveDocument())

   if (!WorkspaceManager.isInitialized) await WorkspaceManager.init()

   var doc = WorkspaceManager.documents.find(doc => doc.metaData.id == id)

   if (doc === undefined) {
      console.warn(`attempted to load document with id ${id}, but it could not be found`)
      return
   }

   dispatch(loadDocument(doc, doc.toBullet()))
})

export const trySaveDocument = createActionAsync(async (state: State, dispatch: Dispatch, forceSave: boolean = false) => {
   var { rootBullet, document, shouldSave } = state.noteBody

   if (!forceSave && !shouldSave) return
   dispatch(dequeueSaveDocument())

   var textFilePath = WorkspaceManager.workspacePath + document.name + '.txt'
   writeFileSync(textFilePath, rootBullet.toString())

   dispatch(documentSaveComplete())
})
