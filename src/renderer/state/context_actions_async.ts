// import { writeFileSync } from 'fs'

import { State, createActionAsync, Dispatch } from '@renderer/state/context'
import { loadDocument, dequeueSaveDocument, setWorkspacePath } from '@renderer/state/context_actions'
import WorkspaceManager from '@main/workspace_manager'
import Document from '@main/document'
import Link, { FromAddress } from '@main/link'
import { readdirSync, Dirent } from 'fs'
import { setWorkspaceDocuments } from './context_actions'

//todo remove state from async actions parameter

export const trySaveDocument = createActionAsync(async (_state: State, dispatch: Dispatch, forceSave: boolean = false) => {
   // var { document, shouldSave } = state.noteBody
   // if (!forceSave && !shouldSave) return
   // dispatch(dequeueSaveDocument())
   // var textFilePath = WorkspaceManager.workspacePath + document.name + '.txt'
   // writeFileSync(textFilePath, rootBullet.toString())
   // dispatch(documentSaveComplete())
})

export const loadWorkspace = createActionAsync(async (state: State, dispatch: Dispatch) => {
   var path = `${process.cwd()}\\workspace\\`
   dispatch(setWorkspacePath(path))

   var documents: Array<Document> = []

   //read the title of every folder/file in the workspace folder
   //converts .txt files to Documents
   readdirSync(path, { withFileTypes: true }).forEach((dirent: Dirent) => {
      var fullName = `${dirent}`
      var splitName = fullName.split('.')

      //skip if there is no extension
      if (splitName.length < 2) return

      var fileName = splitName.shift() //everything before first '.'
      var ext = splitName.join('.') //everything after first '.'

      if (ext == 'txt') documents.push(new Document(fileName, path))
      else if (ext != 'meta' && fullName != 'config.yaml') console.warn(`unexpected file: '${fullName}'`)
   })

   //deserialize every link from the metadata in every document and register it with the corresponding documents
   documents.forEach(doc => {
      doc.metaData.linksFromThisStrings.forEach(str => {
         var link = Link.fromString(str, state)

         link.from.document.linksFromThis.push(link)
         link.to.document.linksToThis.push(link)
      })
   })

   dispatch(setWorkspaceDocuments(documents))

   if (documents.length > 0) dispatch(loadDocument(documents[0]))
})
