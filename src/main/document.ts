import { readFileSync, writeFileSync, existsSync } from 'fs'
import yaml from 'js-yaml'

import { State } from '@renderer/state/context'

import Link from '@/main/link'
import Node from '@main/node'

export interface IDocumentMetaData {
   id: number
   tags: Array<string>
   propKeys: Array<string>
   propValues: Array<string>
   linksFromThis: Array<string>
}

export default class Document {
   name: string
   id: number

   tags: Array<string>
   props: Map<string, string>

   linksToThis: Array<Link> = []
   linksFromThis: Array<Link> = []

   constructor(_name: string, state: State) {
      var filePath = state.workspace.path + `${_name}.txt`
      if (!existsSync(filePath)) throw `document '${filePath}' does not exist in workspace folder`

      var str = readFileSync(filePath, 'utf8')
      var mData = yaml.safeLoad(str.substr(0, str.indexOf('\n---\n'))) as IDocumentMetaData

      this.name = _name
      this.id = mData.id
      this.tags = mData.tags
      this.linksFromThis = mData.linksFromThis.map(s => Link.fromString(s, state))

      this.props = new Map<string, string>()
      if (mData.propKeys.length != mData.propValues.length) throw `document '${filePath}' property key and values count mismatch`

      mData.propKeys.forEach((key, i) => {
         this.props.set(key, mData.propValues[i])
      })
   }

   // static hashCode(str: string) {
   //    var hash = 0
   //    if (str.length == 0) return hash

   //    for (var i = 0; i < str.length; i++) {
   //       var char = str.charCodeAt(i)
   //       hash = (hash << 5) - hash + char
   //       hash = hash & hash // Convert to 32bit integer
   //    }
   //    return hash
   // }

   getNodeHead(state: State): Node {
      var fileStr = readFileSync(state.workspace.path + `${this.name}.txt`, { encoding: 'utf8', flag: 'r' })
      var fileLines = fileStr.substr(fileStr.indexOf('\n---\n') + 5).split('\n')

      return Node.headFromStringArray(fileLines)
   }

   // saveMetaData(workspacePath: string) {
   //    this.metaData.linksFromThisStrings = this.linksFromThis.map(l => l.toString())

   //    writeFileSync(workspacePath + `${this.name}.meta`, yaml.safeDump(this.metaData))
   // }
}
