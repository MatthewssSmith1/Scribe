import React, { useState } from 'react'

import Bullet from '@main/bullet'
import BulletComponent from '@renderer/note_body/bullet_component/bullet_component'
import Breadcrumbs from '@renderer/note_body/breadcrumbs/breadcrumbs'

import { useContextState, useContextDispatchAsync, ContextStateType } from '@/renderer/state/context'
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

   // check to save the document every 3 seconds
   useInterval(() => dispatchAsync(trySaveDocument), 3000)

   return (
      <div className="note-body" style={getStyle(state)}>
         <TitleOrBreadCrumbs />
         <BulletList />
      </div>
   )
}

function getStyle(state: ContextStateType): React.CSSProperties {
   var rightProp = state.contentPanel.isCollapsed ? 0 : state.contentPanel.width
   var leftProp = state.actionPanel.isCollapsed ? 0 : state.actionPanel.width

   return {
      right: `${rightProp}px`,
      left: `${leftProp}px`,
   }
}

function TitleOrBreadCrumbs() {
   const state = useContextState()
   var { document, isRootSelected } = state.noteBody

   var docName = document ? document.name : '[Document Name]'
   var topElement = isRootSelected ? <h1 className="document-title">{docName}</h1> : <Breadcrumbs />

   return <div className="note-body__top-element-wrapper">{topElement}</div>
}

function BulletList() {
   const state = useContextState()

   var bullets = state.noteBody.focusedBullets || []

   var children = bullets.map((child: Bullet) => {
      return <BulletComponent bullet={child} key={child.key} />
   })

   return <div className="note-body__bullet-list">{children}</div>
}
