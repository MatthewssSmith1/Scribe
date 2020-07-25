import { writeFileSync } from 'fs'

import { State, createActionAsync, Dispatch } from '@renderer/state/context'
import { loadDocument, dequeueSaveDocument, documentSaveComplete } from '@renderer/state/context_actions'
import WorkspaceManager from '@main/workspace_manager'
import Document from '@main/document'

export const loadDocumentByID = createActionAsync(async (state: State, dispatch: Dispatch, id: number) => {
   dispatch(dequeueSaveDocument())

   if (!WorkspaceManager.isInitialized) await WorkspaceManager.init()

   var doc = WorkspaceManager.documents.find(doc => doc.metaData.id == id)

   if (doc === undefined) {
      console.warn(`attempted to load document with id ${id}, but it could not be found`)
      return
   }

   dispatch(loadDocument(doc))
})

export const loadDocumentAsync = createActionAsync(async (state: State, dispatch: Dispatch, doc: Document) => {
   dispatch(dequeueSaveDocument())

   dispatch(loadDocument(doc))

   document.querySelector('.note-body').scrollTop = 0
})

export const trySaveDocument = createActionAsync(async (state: State, dispatch: Dispatch, forceSave: boolean = false) => {
   // var { document, shouldSave } = state.noteBody

   // if (!forceSave && !shouldSave) return
   // dispatch(dequeueSaveDocument())

   // var textFilePath = WorkspaceManager.workspacePath + document.name + '.txt'
   // writeFileSync(textFilePath, rootBullet.toString())

   // dispatch(documentSaveComplete())
})
