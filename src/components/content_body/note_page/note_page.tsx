import React from 'react'
import cx from 'classnames'

import Workspace, { Node, Link, Document } from '@/data/workspace'

import SidePanel from '@/components/side_panel/side_panel'
import Bullet from '@/components/content_body/note_page/bullet/bullet'
import Icon from '@/components/icon/icon'

export default class NotePage extends React.Component {
   //#region Static Members & State
   private static _SINGLETON: NotePage

   static get document(): Document {
      return NotePage._SINGLETON.state.document
   }

   static set document(_document: Document) {
      NotePage._SINGLETON.setState({ document: _document, headNode: _document.getNodeHead(), shouldSave: false })

      document.querySelector('.note-body').scrollTop = 0
   }
   //#endregion

   //#region State & Loading
   state = {
      document: null as Document,
      headNode: null as Node,
      shouldSave: null as boolean,
   }

   constructor(props: any) {
      super(props)

      NotePage._SINGLETON = this

      Workspace.load()
   }

   handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!e.ctrlKey) return

      var t = e.target as HTMLLinkElement
      if (t.tagName != 'A') return

      var link: string = t.dataset.link
      if (link == undefined) return

      var doc: Document = Workspace.documentByName(link)
      if (doc == null) return

      NotePage.document = doc
   }

   componentDidMount() {
      Workspace.onceLoaded(() => {
         if (Workspace.numDocuments > 0) NotePage.document = Workspace.defaultDocument
      })
   }
   //#endregion

   render() {
      if (this.state.document == null) return <div className="note-body" />

      var right = SidePanel.isCollapsed ? 0 : SidePanel.width
      const style = {
         right: `${right}px`,
      }

      //top element: <h1 className="document-title">{document.name}</h1> : <Breadcrumbs />
      return (
         <div className="note-body" style={style} onClick={this.handleClick}>
            <div className="note-body__top-element-wrapper" />
            <BulletList headNode={this.state.headNode} />
            <LinkList />
         </div>
      )
   }
}

class BulletList extends React.Component {
   props: {
      headNode: Node
   }

   state: {
      keyMultiplier: number
   }

   constructor(props: any) {
      super(props)

      this.state = {
         keyMultiplier: 1,
      }
   }

   shouldComponentUpdate(nextProps: any, _nextState: any) {
      return true
   }

   render() {
      var node = this.props.headNode
      var children = []

      var keyMult: number = this.state.keyMultiplier
      this.state.keyMultiplier *= -1

      while (node) {
         children.push(<Bullet node={node} key={node.key * keyMult} />)

         node = node.nextNodeToRender
      }

      return <div className="note-body__bullet-list">{children}</div>
   }
}

class LinkList extends React.Component {
   //#region Static
   private static _SINGLETON: LinkList

   constructor(props: any) {
      super(props)

      LinkList._SINGLETON = this
   }

   static toggleCollapsed() {
      LinkList._SINGLETON.setState({ isCollapsed: !LinkList._SINGLETON.state.isCollapsed })
   }
   //#endregion

   state = {
      isCollapsed: false,
   }

   render() {
      if (NotePage.document.linksToThis == undefined || NotePage.document.linksToThis.length == 0) return <div className="link-list" />

      return (
         <div className={cx('link-list', { collapsed: this.state.isCollapsed })}>
            <div className="drop-down-line" onClick={LinkList.toggleCollapsed}>
               <Icon glyph="keyboard_arrow_down" />
               <h1>Links To This Page</h1>
            </div>
            {NotePage.document.linksToThis.map(this.createLinkItem)}
         </div>
      )
   }

   createLinkItem = (link: Link, index: number): JSX.Element => {
      //TODO rework the bullet text fetching because this current form is very inefficient

      var handleTitleClick = () => {
         NotePage.document = Workspace.documentByName(link.fromDocName)
      }

      var innerHtml = { __html: 'placeholder text' } //{ __html: props.link.from.document.toBullet().childAt(props.link.from.bulletCoords).text }

      return (
         <div className="link-item" key={index}>
            <h1 onClick={handleTitleClick}>{`${link.fromDocName}`}</h1>
            <div className="link-item__content" dangerouslySetInnerHTML={innerHtml}></div>
         </div>
      )
   }
}
