// import { readdirSync, Dirent} from 'fs'
// import Document from '@main/document'
// import Link, { ToAddress } from '@main/link'
// import { FromAddress } from './link'

export default class WorkspaceManager {
   // private static _workspacePath: string
   // static get workspacePath() {
   //    return this._workspacePath
   // }

   // private static _isInitialized = false
   // static get isInitialized() {
   //    return this._isInitialized
   // }

   // static documents: Array<Document> = []

   // static async init() {
   //    this._workspacePath = `${process.cwd()}\\workspace\\`

   //    this.loadDocuments()
   // }

   // static loadDocuments() {
   //    //list of every .txt file name in workspace
   //    var documentNames: Array<string> = []

   //    //read the title of every folder/file in the workspace folder
   //    //populates documentName array with .txt file names
   //    readdirSync(this.workspacePath, { withFileTypes: true }).forEach((dirent: Dirent) => {
   //       var fullName = `${dirent}`
   //       var splitName = fullName.split('.')

   //       //skip if there is no extension
   //       if (splitName.length < 2) return

   //       var fileName = splitName.shift() //everything before first '.'
   //       var ext = splitName.join('.') //everything after first '.'

   //       if (ext == 'txt') documentNames.push(fileName)
   //       else if (ext != 'meta' && fullName != 'config.yaml') console.warn(`unexpected file: '${fullName}'`)
   //    })

   //    //creates a Document object for each .txt file
   //    this.documents = documentNames.map(docName => new Document(docName))

   //    //deserialize every link string into a Link object and adds it to the from/to link lists for the corresponding documents
   //    this.documents.forEach(d => {
   //       d.metaData.linksFromThisStrings.forEach(str => {
   //          var link = Link.fromString(str)

   //          link.from.document.linksFromThis.push(link)
   //          link.to.document.linksToThis.push(link)
   //       })
   //    })
   // }

   // static getSuggestedLinks(str: string): Array<[string, ToAddress]> {
   //    if (!this.isInitialized) throw 'WorkspaceManager.getRecommendedLinks() called before init() completed'

   //    str = str.toLowerCase().trim()

   //    return this.documents
   //       .filter(doc => doc.name.toLowerCase().includes(str))
   //       .map(doc => [
   //          doc.name,
   //          {
   //             document: doc,
   //          },
   //       ])
   // }

   // static createLink(from: FromAddress, to: ToAddress): Link {
   //    var link = new Link(Date.now(), { ...from }, { ...to })

   //    from.document.linksFromThis.push(link)
   //    from.document.saveMetaData()

   //    to.document.linksToThis.push(link)
   //    to.document.saveMetaData()

   //    return link
   // }
}
