import React, { useState, useEffect, memo } from 'react'

import BulletComponent from '@renderer/note_body/bullet_component/bullet_component'
import Breadcrumbs from '@renderer/note_body/breadcrumbs/breadcrumbs'

import { useContextState, useContextDispatchAsync, ContextStateType } from '@/renderer/state/context'
import { NoteBodyState } from '@renderer/state/context_actions'
import { loadInitDocument, trySaveDocument } from '@renderer/state/context_actions_async'
import { useInterval } from '@renderer/state/hooks'

var NoteBody = memo(() => {
   var [isInit, setIsInit] = useState(() => false)
   const state = useContextState()
   const dispatchAsync = useContextDispatchAsync()

   if (!isInit) {
      setIsInit(true)

      dispatchAsync(loadInitDocument())

      document.addEventListener('keydown', (e: KeyboardEvent) => {
         if (e.key == 'Control') document.body.classList.add('ctrl-is-pressed')
      })

      document.addEventListener('keyup', (e: KeyboardEvent) => {
         if (e.key == 'Control') document.body.classList.remove('ctrl-is-pressed')
      })
   }

   // check to save the document every 3 seconds
   useInterval(() => dispatchAsync(trySaveDocument), 3000)

   return (
      <div className="note-body" style={getStyle(state)}>
         <TitleOrBreadCrumbs />
         <BulletList noteBodyState={state.noteBody} />
      </div>
   )
})

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
   var topElement = isRootSelected != false ? <h1 className="document-title">{docName}</h1> : <Breadcrumbs />

   return <div className="note-body__top-element-wrapper">{topElement}</div>
}

class BulletList extends React.Component {
   props: {
      noteBodyState: NoteBodyState
   }

   render() {
      var { focusedBullets, rootBullet, bulletsKeyModifier } = this.props.noteBodyState

      if (rootBullet) rootBullet.setComponentCallback(() => this.forceUpdate())

      var children = (focusedBullets || []).map(c => {
         //the modifier here alternates between -1 and 1 on new documents being loaded
         //it is added as to avoid keys of 0 (which would overlap between rebuilds)
         var key = c.key * bulletsKeyModifier + bulletsKeyModifier
         return <BulletComponent bullet={c} key={key} />
      })

      return <div className="note-body__bullet-list">{children}</div>
   }
}

export default NoteBody
