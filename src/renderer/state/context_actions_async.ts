import { Context, actionifyAsync } from '@renderer/state/context'

import { loadDocument, dequeueSaveDocument } from '@renderer/state/context_actions'

import WorkspaceManager from '@main/workspace_manager'
import { writeFileSync } from 'fs'
// import Link, { FromAddress, ToAddress } from '@/main/link'

export const loadInitDocument = actionifyAsync(async (context: Context) => {
   var { dispatchAsync } = context

   if (!WorkspaceManager.isInitialized) await WorkspaceManager.init()

   var docID = WorkspaceManager.documents[0].metaData.id

   dispatchAsync(loadDocumentByID(docID))
})

export const loadDocumentByID = actionifyAsync(async (context: Context, id: number) => {
   var { dispatch } = context

   dispatch(dequeueSaveDocument)

   if (!WorkspaceManager.isInitialized) await WorkspaceManager.init()

   var doc = WorkspaceManager.documents.find(doc => doc.metaData.id == id)

   if (doc === undefined) {
      console.warn(`attempted to load document with id ${id}, but it could not be found`)
      return
   }

   dispatch(loadDocument(doc, doc.toBullet()))
})

export const trySaveDocument = actionifyAsync(async (context: Context) => {
   //TODO implement saving
   // var { rootBullet, document, shouldSave } = context.state.noteBody
   // if (!shouldSave) return
   // var textFilePath = WorkspaceManager.workspacePath + document.name + '.txt'
   // writeFileSync(textFilePath, rootBullet.toString())
   // context.dispatch(documentSaveComplete())
})
