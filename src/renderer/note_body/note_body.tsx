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
import { loadInitDocument, trySaveDocument } from '@renderer/state/context_actions_async'
import { useInterval } from '@renderer/state/hooks'

export default function NoteBody() {
   var [isInit, setIsInit] = useState(() => false)
   const state = useContextState()
   const dispatchAsync = useContextDispatchAsync()

   if (!isInit) {
      setIsInit(true)

      dispatchAsync(loadInitDocument)
   }

   var { document, rootBullet, focusedBullets, shouldSave, isRootSelected } = state.noteBody

   // check to save the document every 3 seconds
   setInterval(() => dispatchAsync(trySaveDocument), 3000)

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
