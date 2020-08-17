import React, { useState, memo } from 'react'

import Bullet from '@/renderer/note_page/bullet/bullet'
import Node from '@main/node'
import Link from '@main/link'
// import Breadcrumbs from '@/renderer/note_page/breadcrumbs/breadcrumbs'

import { getContext, GlobalContext, Context } from '@/renderer/state/context'
import { trySaveDocument, loadWorkspace } from '@renderer/state/context_actions_async'
import { setUpdateNoteCallback, loadDocument } from '@renderer/state/context_actions'

import Icon from '@renderer/other_components/icon'
import cx from 'classnames'

class NoteBody extends React.Component {
   static contextType = GlobalContext

   alreadyDidMountCheck = false

   componentDidMount() {
      //only run these functions once, done here rather than constructor to get access to the context
      if (this.alreadyDidMountCheck) return
      this.alreadyDidMountCheck = true

      const { dispatch, dispatchAsync } = this.context
      dispatchAsync(loadWorkspace())
      dispatch(setUpdateNoteCallback(() => this.forceUpdate()))
   }

   render() {
      const { state, dispatchAsync } = this.context as Context

      if (state.noteBody.document == null) return <div className="note-body" />

      const style = {
         right: `${state.contentPanel.isCollapsed ? 0 : state.contentPanel.width}px`,
         left: `${state.actionPanel.isCollapsed ? 0 : state.actionPanel.width}px`,
      }

      setInterval(() => dispatchAsync(trySaveDocument()), 3000)

      return (
         <div className="note-body" style={style}>
            <TitleOrBreadCrumbs />
            <BulletList headNode={state.noteBody.headNode} />
            <LinkList />
         </div>
      )
   }
}

function TitleOrBreadCrumbs() {
   // const { state } = getContext()

   // var { document, isRootSelected } = state.noteBody

   var topElement = <> </> //isRootSelected != false ? <h1 className="document-title">{document.name}</h1> : <Breadcrumbs />

   return <div className="note-body__top-element-wrapper">{topElement}</div>
}

class BulletList extends React.Component {
   props: {
      headNode: Node
   }

   shouldComponentUpdate(nextProps: any, _nextState: any) {
      return true
   }

   render() {
      var node = this.props.headNode
      var children = []

      while (node) {
         children.push(<Bullet node={node} key={node.key} />)

         node = node.nextNodeToRender
      }

      return <div className="note-body__bullet-list">{children}</div>
   }
}

//#region Link List
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

const LinkItem = (props: { link: Link }) => {
   var { dispatchAsync } = getContext()

   //TODO rework the bullet text fetching because this current form is very inefficient

   var handleTitleClick = () => {
      dispatchAsync(loadDocument(props.link.from.document))
   }

   var docTitle = props.link.from.document.name

   var innerHtml = { __html: 'placeholder text' } //{ __html: props.link.from.document.toBullet().childAt(props.link.from.bulletCoords).text }

   return (
      <div className="link-item">
         <h1 onClick={handleTitleClick}>{docTitle}</h1>
         <div className="link-item__content" dangerouslySetInnerHTML={innerHtml}></div>
      </div>
   )
}
//#endregion

export default NoteBody
