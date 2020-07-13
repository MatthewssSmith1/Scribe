import * as React from 'react'
import { writeFileSync } from 'fs'

import Bullet from '@main/bullet'
import BulletComponent from '@renderer/note_body/bullet_component/bullet_component'
import Breadcrumbs from '@renderer/note_body/breadcrumbs/breadcrumbs'
import WorkspaceManager from '@main/workspace_manager'
import Document from '@main/document'
import Link from '@main/link'

export default class NoteBody extends React.Component {
   private static _singleton: NoteBody

   private _shouldSave: boolean = false
   private _saveInterval: NodeJS.Timeout

   props: {
      shouldAnimateLeft: boolean
      isActionPanelCollapsed: boolean
      isContentPanelCollapsed: boolean
      actionPanelWidth: number
      contentPanelWidth: number
   }

   state: {
      document: Document
      rootBullet: Bullet
      isRootSelected: boolean
      bullets: Array<Bullet>
   }

   constructor(props: any) {
      super(props)

      NoteBody._singleton = this

      this.state = { document: null, rootBullet: null, isRootSelected: true, bullets: [] }

      WorkspaceManager.onceInitialized(() => {
         var currentDocument = WorkspaceManager.documents[0]
         var rootBullet = currentDocument.toBullet()

         NoteBody._singleton.setState({ document: currentDocument, rootBullet: rootBullet, bullets: rootBullet.children })
      })
   }

   static selectBullet(bullet: Bullet) {
      var singleton = this._singleton

      var bulletIsRoot = singleton.state.rootBullet == bullet

      singleton.setState({ isRootSelected: bulletIsRoot, bullets: bulletIsRoot ? bullet.children : [bullet] })

      this.rebuild()
   }

   static rebuild() {
      this._singleton.forceUpdate()
      NoteBody.queueSaveDocument()
   }

   static get currentDocument(): Document {
      return this._singleton.state.document
   }

   static loadLink(link: Link): void {
      //find the document that the link goes to
      //TODO abstract into WorkspaceManager method
      var document: Document = WorkspaceManager.documents.find(doc => doc.metaData.id == link.to.documentId)
      var docRootBullet: Bullet = document.toBullet()

      this._singleton.setState({ document: document, rootBullet: docRootBullet, bullets: docRootBullet.children })
   }

   static queueSaveDocument(immediate: boolean = false): void {
      NoteBody._singleton._shouldSave = true
      if (immediate) NoteBody._singleton.save()
   }

   //every four seconds (while the component is mounted) save the document
   componentDidMount() {
      this._saveInterval = setInterval(() => {
         if (this._shouldSave) this.save()
      }, 4000)
   }
   componentWillUnmount() {
      clearInterval(this._saveInterval)
   }
   private save() {
      this._shouldSave = false

      var textFilePath = WorkspaceManager.workspacePath + NoteBody._singleton.state.document.name + '.txt'
      writeFileSync(textFilePath, NoteBody._singleton.state.rootBullet.toString())
      console.log('doc saved')
   }

   //called when any bullet is clicked, loads what a link points to if ctrl is pressed
   handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      var clickedSpan = e.target as HTMLSpanElement

      if (!clickedSpan || !e.ctrlKey || !clickedSpan.classList.contains('link')) return

      var linkID = parseInt(clickedSpan.dataset.linkId)
      var link: Link = WorkspaceManager.links.find(l => l.id == linkID)
      if (link == undefined) {
         console.warn(`could not find link of id ${linkID}`)
         return
      }

      NoteBody.loadLink(link)
   }

   render(): JSX.Element {
      var bullets = this.state.bullets

      let bulletElements = bullets.map((child: Bullet) => {
         return <BulletComponent bullet={child} key={child.key} />
      })

      var documentTopElement = this.state.isRootSelected ? (
         <h1 className="document-title">{this.state.rootBullet && this.state.rootBullet.text}</h1>
      ) : (
         <Breadcrumbs selectedBullets={bullets} isRootSelected={this.state.isRootSelected} />
      )

      return (
         <div className="note-body" style={this.getStyle()}>
            <div className="note-body__top-element-wrapper">{bullets.length > 0 && documentTopElement}</div>
            <div className="note-body__bullet-list" onClick={this.handleClick}>
               {bulletElements}
            </div>
         </div>
      )
   }

   getStyle(): React.CSSProperties {
      var props = this.props

      var rightProp = props.isContentPanelCollapsed ? 0 : props.contentPanelWidth
      var leftProp = props.isActionPanelCollapsed ? 0 : props.actionPanelWidth

      return {
         right: `${rightProp}px`,
         left: `${leftProp}px`,
         transitionDuration: '300ms',
         transitionProperty: `${props.shouldAnimateLeft ? 'left' : 'right'}`,
      }
   }
}
