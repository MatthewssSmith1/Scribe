import { readdirSync, Dirent, existsSync, readFileSync, writeFileSync, appendFileSync } from 'fs'
import Document from '@main/document'
import Link, { ToAddress } from '@main/link'
import { FromAddress } from './link'

// import yaml from 'js-yaml'

export default class WorkspaceManager {
   private static _workspacePath: string
   static get workspacePath() {
      return this._workspacePath
   }

   private static _isInitialized = false
   static get isInitialized() {
      return this._isInitialized
   }

   static documents: Array<Document> = []
   static links: Array<Link> = []
   static _onceInitCallbacks: Array<Function> = []

   static async init() {
      if (this.isInitialized) throw 'WorkspaceManager initialized twice'

      this._workspacePath = `${process.cwd()}\\workspace\\`

      this.loadDocuments()

      this._isInitialized = true

      this._onceInitCallbacks.forEach(cb => cb())
   }

   static onceInitialized(callback: Function) {
      if (this.isInitialized) callback()
      else this._onceInitCallbacks.push(callback)
   }

   static loadDocuments() {
      //list of every .txt file name in workspace
      var documentNames: Array<string> = []

      //populates documentName array with .txt file names, load .config files
      readdirSync(this.workspacePath, { withFileTypes: true }).forEach((dirent: Dirent) => {
         var fullName = `${dirent}`
         var splitName = fullName.split('.')

         //skip if there is no extension
         if (splitName.length < 2) return

         var fileName = splitName.shift() //everything before first '.'
         var ext = splitName.join('.') //everything after first '.'

         if (ext == 'txt') documentNames.push(fileName)
         else if (fullName == 'config.yaml') this.loadConfig()
         else if (ext != 'meta') console.warn(`unexpected extension on file: '${fullName}'`)
      })

      this.documents = documentNames.map(docName => new Document(docName))

      this.documents.forEach(fromDoc =>
         fromDoc.linksFromThis.forEach(lnk => {
            var toDocID = lnk.to.documentId
            var toDoc = this.documents.find(d => d.metaData.id == toDocID)

            if (toDoc == undefined) {
               console.warn(`the to docId on a link loaded from a meta file does not point to a document`)
            } else {
               toDoc.linksToThis.push(lnk)
            }
         })
      )

      console.log(this.documents)
   }

   static loadConfig() {
      // var config = yaml.safeLoad(readFileSync(this._workspacePath + 'config.yaml', 'utf8'))
      // console.log(`config loaded: ${config}`)
   }

   static getSuggestedLinks(str: string): Array<[string, ToAddress]> {
      if (!this.isInitialized) throw 'WorkspaceManager.getRecommendedLinks() called before init() completed'

      str = str.toLowerCase().trim()

      return this.documents
         .filter(doc => doc.name.toLowerCase().includes(str))
         .map(doc => [
            doc.name,
            {
               documentId: doc.metaData.id,
            },
         ])
   }

   static get newLinkID(): number {
      return Date.now()

      //? save link to file here too?
   }

   static createLink(from: FromAddress, to: ToAddress): Link {
      var link = new Link(this.newLinkID, { ...from }, { ...to })

      //find document that the link is from
      var fromDocID = from.documentId
      var fromDoc = this.documents.find(d => d.metaData.id == fromDocID)

      if (fromDoc == undefined) {
         console.warn(`the from docId on a link created by WorkspaceManager.createLink() does not point to a document`)
      } else {
         fromDoc.linksFromThis.push(link)
      }

      fromDoc.saveMetaData()

      //find document that the link is to
      var toDocID = from.documentId
      var toDoc = this.documents.find(d => d.metaData.id == toDocID)

      if (toDoc == undefined) {
         console.warn(`the to docId on a link created by WorkspaceManager.createLink() does not point to a document`)
      } else {
         toDoc.linksToThis.push(link)
      }

      toDoc.saveMetaData()

      return link
   }
}
