import React, { useState } from 'react'
// import { writeFileSync } from 'fs'

import Bullet from '@main/bullet'
import BulletComponent from '@renderer/note_body/bullet_component/bullet_component'
import Breadcrumbs from '@renderer/note_body/breadcrumbs/breadcrumbs'
// import WorkspaceManager from '@main/workspace_manager'
// import Document from '@main/document'
// import Link from '@main/link'

import { useContextState, useContextDispatchAsync } from '@/renderer/state/context'
import { ContextState } from '@renderer/state/context_actions'
import { loadInitDocument } from '@renderer/state/context_actions_async'

// private static _singleton: NoteBody

// private _shouldSave: boolean = false
// private _saveInterval: NodeJS.Timeout

// state: {
//    document: Document
//    rootBullet: Bullet
//    isRootSelected: boolean
//    bullets: Array<Bullet>
// }

// constructor(props: any) {
//    super(props)

//    NoteBody._singleton = this

//    this.state = { document: null, rootBullet: null, isRootSelected: true, bullets: [] }

//    WorkspaceManager.onceInitialized(() => {
//       var currentDocument = WorkspaceManager.documents[0]
//       var rootBullet = currentDocument.toBullet()

//       NoteBody._singleton.setState({ document: currentDocument, rootBullet: rootBullet, bullets: rootBullet.children })
//    })
// }

// static selectBullet(bullet: Bullet) {
//    var singleton = this._singleton

//    var bulletIsRoot = singleton.state.rootBullet == bullet

//    singleton.setState({ isRootSelected: bulletIsRoot, bullets: bulletIsRoot ? bullet.children : [bullet] })

//    this.rebuild()
// }

// static rebuild() {
//    this._singleton.forceUpdate()
//    NoteBody.queueSaveDocument()
// }

// static get currentDocument(): Document {
//    return this._singleton.state.document
// }

// static loadLink(link: Link): void {
//    //find the document that the link goes to
//    //TODO abstract into WorkspaceManager method
//    var document: Document = WorkspaceManager.documents.find(doc => doc.metaData.id == link.to.documentId)
//    var docRootBullet: Bullet = document.toBullet()

//    this._singleton.setState({ document: document, rootBullet: docRootBullet, bullets: docRootBullet.children })
// }

// static queueSaveDocument(immediate: boolean = false): void {
//    NoteBody._singleton._shouldSave = true
//    if (immediate) NoteBody._singleton.save()
// }

//every four seconds (while the component is mounted) save the document
// componentDidMount() {
//    this._saveInterval = setInterval(() => {
//       if (this._shouldSave) this.save()
//    }, 4000)
// }
// componentWillUnmount() {
//    clearInterval(this._saveInterval)
// }
// private save() {
//    this._shouldSave = false

//    return

//    var textFilePath = WorkspaceManager.workspacePath + NoteBody._singleton.state.document.name + '.txt'
//    writeFileSync(textFilePath, NoteBody._singleton.state.rootBullet.toString())
//    console.log('doc saved')
// }

//called when any bullet is clicked, loads what a link points to if ctrl is pressed
// handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//    var clickedSpan = e.target as HTMLSpanElement

//    if (!clickedSpan || !e.ctrlKey || !clickedSpan.classList.contains('link')) return

//    var linkID = parseInt(clickedSpan.dataset.linkId)
//    var link: Link = WorkspaceManager.links.find(l => l.id == linkID)
//    if (link == undefined) {
//       console.warn(`could not find link of id ${linkID}`)
//       return
//    }

//    NoteBody.loadLink(link)
// }

export default function NoteBody() {
   var [isInit, setIsInit] = useState(() => false)
   const state = useContextState()
   const dispatchAsync = useContextDispatchAsync()

   if (!isInit) {
      setIsInit(true)

      dispatchAsync(loadInitDocument)
   }

   var { document, rootBullet, focusedBullets, shouldSave, isRootSelected } = state.noteBody

   var bullets = focusedBullets || []
   var docName = document ? document.name : '[Document Name]'

   let bulletElements = bullets.map((child: Bullet) => {
      return <BulletComponent bullet={child} key={child.key} />
   })

   var topElement = isRootSelected ? <h1 className="document-title">{docName}</h1> : <Breadcrumbs />

   return (
      <div className="note-body" style={getStyle(state)}>
         <div className="note-body__top-element-wrapper">{topElement}</div>
         <div className="note-body__bullet-list">{bulletElements}</div>
      </div>
   )
}

function getStyle(state: ContextState): React.CSSProperties {
   var rightProp = state.contentPanel.isCollapsed ? 0 : state.contentPanel.width
   var leftProp = state.actionPanel.isCollapsed ? 0 : state.actionPanel.width

   return {
      right: `${rightProp}px`,
      left: `${leftProp}px`,
   }
}
