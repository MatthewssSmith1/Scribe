import { readFileSync, writeFileSync, existsSync } from 'fs'
import Bullet from '@/main/bullet'
import Link from '@/main/link'
import WorkspaceManager from '@main/workspace_manager'

const yaml = require('js-yaml')

interface MetaData {
   id: number
}

export default class Document {
   name: string
   metaData: MetaData
   linksToThis: Array<Link> = []
   linksFromThis: Array<Link> = []

   constructor(_name: string) {
      this.name = _name

      var metaFilePath = WorkspaceManager.workspacePath + `${_name}.meta`
      if (existsSync(metaFilePath)) this.metaData = yaml.safeLoad(readFileSync(metaFilePath, 'utf8'))
      else this.generateMetaData()

      var id = this.metaData.id
      this.linksFromThis = WorkspaceManager.links.filter(link => link.from.documentId == id)
      this.linksToThis = WorkspaceManager.links.filter(link => link.to.documentId == id)
   }

   private generateMetaData() {
      var hashCode = (str: string) => {
         var hash = 0
         if (str.length == 0) return hash

         for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i)
            hash = (hash << 5) - hash + char
            hash = hash & hash // Convert to 32bit integer
         }
         return hash
      }

      this.metaData = { id: hashCode(this.name) }

      this.saveMetaData()
   }

   toBullet() {
      if (!WorkspaceManager.isInitialized) throw 'Document.toBullet() (reading from a file) called before WorkspaceManager.init() finished'

      var fileLines = readFileSync(WorkspaceManager.workspacePath + `${this.name}.txt`, { encoding: 'utf8', flag: 'r' })
         .split('\n')
         .filter(line => line.trim() !== '')

      return Bullet.fromStringArray(this.name, fileLines)
   }

   saveMetaData() {
      writeFileSync(WorkspaceManager.workspacePath + `${this.name}.meta`, yaml.safeDump(this.metaData))
   }
}
