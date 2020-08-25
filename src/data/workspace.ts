import { readdirSync, Dirent } from 'fs'

import Document from '@/data/document'
import Node from '@/data/node'
import Link from '@/data/link'
import NotePage from '../renderer/content_body/note_page/note_page'

export { Document, Node, Link }

export default class Workspace {
   //#region Members
   private static _documents = [] as Array<Document>
   static get documents(): Array<Document> {
      return this._documents
   }

   // get path at runtime: `${process.cwd()}\\workspace\\`
   private static _path = `C:\\dev\\Scribe\\workspace\\`
   static get path(): string {
      return this._path
   }
   //#endregion

   //#region Loading
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

      // deserialize every link from the metadata in every document and register it with the corresponding documents
      // documents.forEach(doc => {
      //    doc.linksFromThisStrings.forEach(str => {
      //       var link = Link.fromString(str, state)

      //       link.from.document.linksFromThis.push(link)
      //       link.to.document.linksToThis.push(link)
      //    })
      // })

      this.onceLoadedCallbacks.forEach(callback => callback());
   }

   static onceLoaded(callback: Function) {
      if (this._hasLoaded) callback()
      else this.onceLoadedCallbacks.push(callback)
   }
   //#endregion
}
