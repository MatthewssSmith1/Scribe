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
      this.loadLinks()

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
         else if (ext != 'meta' && fullName != 'links.list') console.warn(`unexpected extension on file: '${fullName}'`)
      })

      this.documents = documentNames.map(docName => new Document(docName))
   }

   static loadLinks() {
      var linksFilePath = this._workspacePath + 'links.list'

      if (!existsSync(linksFilePath)) writeFileSync(linksFilePath, '')

      this.links = readFileSync(linksFilePath, 'utf8')
         .split('\n')
         .map(line => line.trim())
         .filter(line => line.length > 0)
         .map(line => Link.fromString(line))
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

   static saveLink(link: Link): void {
      appendFileSync(this.workspacePath + 'links.list', '\n' + link.toString())
   }

   static get newLinkID(): number {
      return Date.now()

      //? save link to file here too?
   }

   static createLink(from: FromAddress, to: ToAddress): Link {
      var link = new Link(this.newLinkID, { ...from }, { ...to })

      this.links.push(link)

      this.saveLink(link)

      return link
   }
}
