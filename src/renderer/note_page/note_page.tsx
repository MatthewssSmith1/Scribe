import React, { useState, memo } from 'react'

import BulletComponent from '@/renderer/note_page/bullet_component/bullet_component'
import Breadcrumbs from '@/renderer/note_page/breadcrumbs/breadcrumbs'

import { getContext, NoteBodyState, State } from '@/renderer/state/context'
import { trySaveDocument, loadDocumentByID } from '@renderer/state/context_actions_async'
import { useInterval } from '@renderer/state/hooks'

import Icon from '@renderer/other_components/icon'
import cx from 'classnames'

import Link from '@main/link'
import { loadDocumentAsync } from '../state/context_actions_async'

var NoteBody = memo(() => {
   var [isInit, setIsInit] = useState(() => false)
   const { state, dispatchAsync } = getContext()

   if (!isInit) {
      setIsInit(true)

      dispatchAsync(loadDocumentByID(-115310742))

      document.addEventListener('keydown', (e: KeyboardEvent) => {
         if (e.key == 'Control') document.body.classList.add('ctrl-is-pressed')
      })

      document.addEventListener('keyup', (e: KeyboardEvent) => {
         if (e.key == 'Control') document.body.classList.remove('ctrl-is-pressed')
      })

      document.body.ondragstart = () => false
      document.body.ondrop = () => false
   }

   var getStyle = () => {
      var rightProp = state.contentPanel.isCollapsed ? 0 : state.contentPanel.width
      var leftProp = state.actionPanel.isCollapsed ? 0 : state.actionPanel.width

      return {
         right: `${rightProp}px`,
         left: `${leftProp}px`,
      }
   }

   // check to save the document every 3 seconds
   // TODO actually implement saving
   useInterval(() => dispatchAsync(trySaveDocument()), 3000)

   if (state.noteBody.document == null) return <div className="note-body" />

   return (
      <div className="note-body" style={getStyle()}>
         <TitleOrBreadCrumbs />
         <BulletList noteBodyState={state.noteBody} />
         <LinkList />
      </div>
   )
})

function TitleOrBreadCrumbs() {
   const { state } = getContext()

   var { document, isRootSelected } = state.noteBody

   var topElement = isRootSelected != false ? <h1 className="document-title">{document.name}</h1> : <Breadcrumbs />

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

const LinkList = () => {
   var [isCollapsed, setIsCollapsed] = useState(() => false)
   var { state } = getContext()

   var linkItems = state.noteBody.document.linksToThis.map((l, i) => <LinkItem link={l} key={i} />)

   if (linkItems.length == 0) return <div className="link-list" />

   return (
      <div className={cx('link-list', { collapsed: isCollapsed })}>
         <div className="drop-down-line" onClick={() => setIsCollapsed(!isCollapsed)}>
            <Icon glyph="keyboard_arrow_down" />
            <h1>Links To This Page</h1>
         </div>
         {linkItems}
      </div>
   )
}

var LinkItem = (props: { link: Link }) => {
   var { dispatchAsync } = getContext()

   //TODO rework the bullet text fetching because this current form is very inefficient

   var handleTitleClick = () => {
      dispatchAsync(loadDocumentAsync(props.link.from.document))
   }

   var docTitle = props.link.from.document.name

   var innerHtml = { __html: props.link.from.document.toBullet().childAt(props.link.from.bulletCoords).text }

   return (
      <div className="link-item">
         <h1 onClick={handleTitleClick}>{docTitle}</h1>
         <div className="link-item__content" dangerouslySetInnerHTML={innerHtml}></div>
      </div>
   )
}

export default NoteBody
