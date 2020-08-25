import Document from '@/data/document'
import Node from '@/data/node'
import Link from '@/data/link'

export { Document, Node, Link }

export default class Workspace {
   //#region Members
   private static _documents = [] as Array<Document>
   static get documents(): Array<Document> {
      return this._documents
   }

   private static _path = `C:\\dev\\Scribe\\workspace\\`
   static get path(): string {
      return this._path
   }
   //#endregion

   //#region Loading
   private static _hasLoaded = false
   static async load() {
      if (this._hasLoaded) return
      this._hasLoaded = true
   }
   //#endregion
}

/*
const loadWorkspace = createActionAsync(async (state: State, dispatch: Dispatch) => {
   return
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

      if (ext == 'txt') documents.push(new Document(fileName, state))
      else if (ext != 'meta' && fullName != 'config.yaml') console.warn(`unexpected file: '${fullName}'`)
   })

   //deserialize every link from the metadata in every document and register it with the corresponding documents
   // documents.forEach(doc => {
   //    doc.linksFromThisStrings.forEach(str => {
   //       var link = Link.fromString(str, state)

   //       link.from.document.linksFromThis.push(link)
   //       link.to.document.linksToThis.push(link)
   //    })
   // })

   dispatch(setWorkspaceDocuments(documents))

   if (documents.length > 0) dispatch(loadDocument(documents[0]))
})
*/
