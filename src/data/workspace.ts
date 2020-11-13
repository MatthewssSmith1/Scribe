import { readdirSync, Dirent } from 'fs'

import Document from '@/data/document'
import Node from '@/data/node'
import Link from '@/data/link'
import { empty } from '@typed/hashmap'

export { Document, Node, Link }

export default class Workspace {
   private static _documents = [] as Array<Document>
   private static _documentsMap = empty<string, Document>()

   // get path at runtime: `${process.cwd()}\\workspace\\`
   private static _path = `C:\\dev\\Scribe\\workspace\\`

   private static _hasLoaded = false
   static onceLoadedCallbacks: Array<Function> = []

   static async load() {
      if (this._hasLoaded) return
      this._hasLoaded = true

      //reads every file/directory in workspace path, maps them to strings, filters out only .txt files, loads a Document object for each
      this._documents = readdirSync(this._path, { withFileTypes: true })
         .map((dirent: Dirent) => `${dirent}`)
         .filter(fileName => fileName.substring(fileName.indexOf('.')) == '.txt')
         .map(fileName => new Document(fileName.split('.')[0]))

      // register every link with the document it points to
      this._documents.forEach(doc => {
         doc.linksFromThis.forEach(lnk => {
            this._documents.forEach(d => {
               if (d.name == lnk.toDocName) {
                  d.linksToThis.push(lnk)
               }
            })
         })
      })

      this.onceLoadedCallbacks.forEach(callback => callback())
   }

   static onceLoaded(callback: Function) {
      if (this._hasLoaded) callback()
      else this.onceLoadedCallbacks.push(callback)
   }

   //#region Getters/Setters
   static documentByName(docName: string): Document {
      for (var i = 0; i < this._documents.length; i++) {
         var doc: Document = this._documents[i]

         if (doc.name.toLowerCase().trim() === docName.toLowerCase().trim()) {
            return doc
         }
      }

      return null
   }

   static get numDocuments(): number {
      return this._documents.length
   }

   static get defaultDocument(): Document {
      if (this.numDocuments == 0) return null

      return this._documents[0]
   }

   static get path(): string {
      return this._path
   }
   //#endregion
}
