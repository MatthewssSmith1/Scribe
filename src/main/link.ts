import Document from '@main/document'
import WorkspaceManager from './workspace_manager'

//doc										 => tag from a document
//doc & bulletCoords					 => tag from a bullet
//doc & bulletCoords & selection	 => link from span of text
export interface FromAddress {
   document: Document
   bulletCoords?: Array<number>
   selectionBounds?: [number, number]
}

//doc						=> link/tag to page
//doc & bulletCoords	=> link to bullet
export interface ToAddress {
   document: Document
   bulletCoords?: Array<number>
}

export default class Link {
   id: number
   from: FromAddress
   to: ToAddress

   constructor(id: number, from: FromAddress, to: ToAddress) {
      this.id = id
      this.from = from
      this.to = to
   }

   //#region Serialization
   toString(): string {
      // format: 31245 213453|2,5,3|2,5 42145|1,2

      var _fromDocId = this.from.document.metaData.id
      var _fromBulletCoords = this.from.bulletCoords || [-1]
      var _fromSelectionBounds = this.from.selectionBounds || [-1, -1]
      var fromText = `${_fromDocId}|${_fromBulletCoords.join(',')}|${_fromSelectionBounds.join(',')}`

      var _toDocId = this.to.document.metaData.id
      var _toBulletCoords = this.to.bulletCoords || [-1]
      var toText = `${_toDocId}|${_toBulletCoords.join(',')}`

      return `${this.id} ${fromText} ${toText}`
   }

   static fromString(str: string) {
      // format: 31245 213453|2,5,3|2,5 42145|1,2

      var splitBySpaces = str.split(' ')
      if (splitBySpaces.length != 3) throw `Link.fromString() called on string without 2 separating spaces: ${str}`

      var id = parseInt(splitBySpaces[0])

      //from values
      var fromValues = splitBySpaces[1].split('|')
      if (fromValues.length != 3) throw `Link.fromString() called on string without 2 separating '|' in from values: ${str}`

      var fromDocID = parseInt(fromValues[0])
      var from = {
         document: WorkspaceManager.documents.find(doc => doc.metaData.id == fromDocID),
         bulletCoords: fromValues[1].split(',').map(str => parseInt(str)),
         selectionBounds: fromValues[2].split(',').map(str => parseInt(str)) as [number, number],
      }
      if (from.bulletCoords && from.bulletCoords.includes(-1)) from.bulletCoords = null
      if (from.selectionBounds && from.selectionBounds.includes(-1)) from.selectionBounds = null

      //to values
      var toValues = splitBySpaces[2].split('|')
      if (toValues.length != 2) throw `Link.fromString() called on string without 1 separating '|' in to values: ${str}`
      var toDocID = parseInt(toValues[0])
      var to = {
         document: WorkspaceManager.documents.find(doc => doc.metaData.id == toDocID),
         bulletCoords: toValues[1].split(',').map(str => parseInt(str)),
      }
      if (to.bulletCoords && to.bulletCoords.includes(-1)) to.bulletCoords = null

      return new Link(id, from, to)
   }
   //#endregion

   //#region Getters
   get pointsToDocument() {
      return this.to.bulletCoords == null || this.to.bulletCoords.includes(-1)
   }

   get pointsToBullet() {
      return !this.pointsToDocument
   }
   //#endregion
}
