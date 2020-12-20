import React from 'react'
import cx from 'classnames'

import { Node } from '@/data/workspace'

import Bullet from '@/components/content_body/note_page/bullet/bullet'
// import Icon from '@/components/icon/icon'

import RustInterface, { generateEvent } from '@/rust-bindings/rust_interface'
import { Event, EventType, EventListener } from '@/rust-bindings/binding_event'

export default class NotePage extends React.Component implements EventListener {
   nodes: Array<Node>
   nextNodeKey: number
   noteBodyRef: React.RefObject<HTMLDivElement>

   constructor(props: any) {
      super(props)

      this.noteBodyRef = React.createRef()

      RustInterface.subscribe(this, EventType.SidePanelWidthChanged, EventType.LoadDoc, EventType.ActionBarWidthChanged)
   }

   handleEvent(e: Event): void {
      if (e.is(EventType.LoadDoc)) {
         if (e.data.length != 1) {
            console.error("LoadDoc event received that doesn't have exactly 1 arg")
            return
         }

         this.nodes = e.data[0]
            .slice(2)
            .split('\n')
            .map((s, i) => new Node(s, i))

         this.nextNodeKey = this.nodes.length
         this.forceUpdate()
      } else if (e.is(EventType.SidePanelWidthChanged)) {
         this.noteBodyRef.current.style.paddingRight = `${e.dataAsNum(0) + 32}px`
      } else if (e.is(EventType.ActionBarWidthChanged)) {
         this.noteBodyRef.current.style.paddingLeft = `${e.dataAsNum(0) + 32}px`
      }
   }

   componentDidMount() {
      generateEvent(EventType.NotePageLoaded)
   }

   //only re-render on forceUpdate()
   shouldComponentUpdate() {
      return false
   }

   handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      // if (!e.ctrlKey) return
      // var t = e.target as HTMLLinkElement
      // if (t.tagName != 'A') return
      // var link: string = t.dataset.link
      // if (link == undefined) return
      // var doc: Document = Workspace.documentByName(link)
      // if (doc == null) return
      // NotePage.document = doc
   }

   render() {
      if (this.nodes == null) return <div className="note-body" />

      var bullets = this.nodes.map(n => <Bullet key={n.id} node={n} />)

      //top element: <h1 className="document-title">{document.name}</h1> : <Breadcrumbs />
      return (
         <div className="note-body" onClick={this.handleClick} ref={this.noteBodyRef}>
            <div className="note-body__top-element-wrapper" />
            <div className="note-body__bullet-list">{bullets}</div>
         </div>
      )
   }
}

// class BulletList extends React.Component {
//    props: {
//       headNode: Node
//    }

//    state: {
//       keyMultiplier: number
//    }

//    constructor(props: any) {
//       super(props)

//       this.state = {
//          keyMultiplier: 1,
//       }
//    }

//    shouldComponentUpdate(nextProps: any, _nextState: any) {
//       return true
//    }

//    render() {
//       var node = this.props.headNode
//       var children = []

//       var keyMult: number = this.state.keyMultiplier
//       this.state.keyMultiplier *= -1

//       while (node) {
//          children.push(<Bullet node={node} key={node.key * keyMult} />)

//          node = node.nextNodeToRender
//       }

//       return <div className="note-body__bullet-list">{children}</div>
//    }
// }

// class LinkList extends React.Component {
//    //#region Static
//    private static _SINGLETON: LinkList

//    constructor(props: any) {
//       super(props)

//       LinkList._SINGLETON = this
//    }

//    static toggleCollapsed() {
//       LinkList._SINGLETON.setState({ isCollapsed: !LinkList._SINGLETON.state.isCollapsed })
//    }
//    //#endregion

//    state = {
//       isCollapsed: false,
//    }

//    render() {
//       if (NotePage.document.linksToThis == undefined || NotePage.document.linksToThis.length == 0) return <div className="link-list" />

//       return (
//          <div className={cx('link-list', { collapsed: this.state.isCollapsed })}>
//             <div className="drop-down-line" onClick={LinkList.toggleCollapsed}>
//                <Icon glyph="keyboard_arrow_down" />
//                <h1>Links To This Page</h1>
//             </div>
//             {NotePage.document.linksToThis.map(this.createLinkItem)}
//          </div>
//       )
//    }

//    createLinkItem = (link: Link, index: number): JSX.Element => {
//       //TODO rework the bullet text fetching because this current form is very inefficient

//       var handleTitleClick = () => {
//          NotePage.document = Workspace.documentByName(link.fromDocName)
//       }

//       var innerHtml = { __html: 'placeholder text' } //{ __html: props.link.from.document.toBullet().childAt(props.link.from.bulletCoords).text }

//       return (
//          <div className="link-item" key={index}>
//             <h1 onClick={handleTitleClick}>{`${link.fromDocName}`}</h1>
//             <div className="link-item__content" dangerouslySetInnerHTML={innerHtml}></div>
//          </div>
//       )
//    }
// }
