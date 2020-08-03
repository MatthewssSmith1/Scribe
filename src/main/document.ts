import { readFileSync, writeFileSync, existsSync } from 'fs'
import yaml from 'js-yaml'

import { State } from '@renderer/state/context'

import Link from '@/main/link'
import Node from '@main/node'

interface MetaData {
   id: number
   linksFromThisStrings: Array<string>
}

export default class Document {
   name: string
   metaData: MetaData
   linksToThis: Array<Link> = []
   linksFromThis: Array<Link> = []

   constructor(_name: string, workspacePath: string) {
      this.name = _name

      var metaFilePath = workspacePath + `${_name}.meta`
      if (existsSync(metaFilePath)) this.metaData = yaml.safeLoad(readFileSync(metaFilePath, 'utf8')) as MetaData
      else {
         this.generateMetaData()
         this.saveMetaData(workspacePath)
      }
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
   }

   getNodeHead(state: State): Node {
      if (state.workspace.path === null) throw 'Document.toNodeList() (reading from a file) called before state.workspace was initialized'

      var fileLines = readFileSync(state.workspace.path + `${this.name}.txt`, { encoding: 'utf8', flag: 'r' }).split('\n')

      return Node.headFromStringArray(fileLines)
   }

   // toBullet(): Bullet {
   //    if (!WorkspaceManager.isInitialized) throw 'Document.toBullet() (reading from a file) called before WorkspaceManager.init() finished'

   //    var fileLines = readFileSync(WorkspaceManager.workspacePath + `${this.name}.txt`, { encoding: 'utf8', flag: 'r' })
   //       .split('\n')
   //       .filter(line => line.trim() !== '')

   //    return Bullet.fromStringArray(this.name, fileLines)
   // }

   saveMetaData(workspacePath: string) {
      this.metaData.linksFromThisStrings = this.linksFromThis.map(l => l.toString())

      writeFileSync(workspacePath + `${this.name}.meta`, yaml.safeDump(this.metaData))
   }
}
