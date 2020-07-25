import { readFileSync, writeFileSync, existsSync } from 'fs'
const yaml = require('js-yaml')

import Bullet from '@/main/bullet'
import Link from '@/main/link'
import Node from '@main/node'
import WorkspaceManager from '@main/workspace_manager'

interface MetaData {
   id: number
   linksFromThisStrings: Array<string>
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
   }

   //creates .meta file for documents that are missing one
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

      this.metaData = { id: hashCode(this.name), linksFromThisStrings: [] }

      this.saveMetaData()
   }

   getNodeHead(): Node {
      if (!WorkspaceManager.isInitialized) throw 'Document.toNodeList() (reading from a file) called before WorkspaceManager.init() finished'

      var fileLines = readFileSync(WorkspaceManager.workspacePath + `${this.name}.txt`, { encoding: 'utf8', flag: 'r' })
         .split('\n')

      return Node.headFromStringArray(fileLines)
   }

   // toBullet(): Bullet {
   //    if (!WorkspaceManager.isInitialized) throw 'Document.toBullet() (reading from a file) called before WorkspaceManager.init() finished'

   //    var fileLines = readFileSync(WorkspaceManager.workspacePath + `${this.name}.txt`, { encoding: 'utf8', flag: 'r' })
   //       .split('\n')
   //       .filter(line => line.trim() !== '')

   //    return Bullet.fromStringArray(this.name, fileLines)
   // }

   saveMetaData() {
      this.metaData.linksFromThisStrings = this.linksFromThis.map(l => l.toString())

      writeFileSync(WorkspaceManager.workspacePath + `${this.name}.meta`, yaml.safeDump(this.metaData))
   }
}
