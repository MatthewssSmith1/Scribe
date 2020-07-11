import * as React from 'react'

import Bullet from '@/main/bullet'
import BulletComponent from '@renderer/note_body/bullet_component/bullet_component'
import Icon from '@/renderer/other_components/icon'
import WorkspaceManager from '@/main/workspace_manager'
import Document from '@main/document'

export default class NoteBody extends React.Component {
   private static _singleton: NoteBody

   state: {
      document: Document
      rootBullet: Bullet
      isRootSelected: boolean
      bullets: Array<Bullet>
   }

   constructor(props: {}) {
      super(props)

      NoteBody._singleton = this

      this.state = { document: null, rootBullet: null, isRootSelected: true, bullets: [] }

      NoteBody.loadRootBullet()
   }

   static async loadRootBullet() {
      WorkspaceManager.onceInitialized(() => {
         var currentDocument = WorkspaceManager.documents[0]
         var rootBullet = currentDocument.toBullet()

         this._singleton.setState({ document: currentDocument, rootBullet: rootBullet, bullets: rootBullet.children })
      })
   }

   static selectBullet(bullet: Bullet) {
      var singleton = this._singleton

      var bulletIsRoot = singleton.state.rootBullet == bullet

      singleton.setState({ isRootSelected: bulletIsRoot, bullets: bulletIsRoot ? bullet.children : [bullet] })

      this.rebuild()
   }

   static selectBullets(bullets: Array<Bullet>) {
      this._singleton.setState({ isRootSelected: false, bullets: bullets })

      this.rebuild()
   }

   static rebuild() {
      this._singleton.forceUpdate()
   }

   handleBulletListClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      // console.log(e)
      //TODO use follow document links
   }

   render(): JSX.Element {
      var bullets = this.state.bullets

      let bulletElements = bullets.map((child: Bullet) => {
         return <BulletComponent bullet={child} isVirtualRoot={true} key={child.key} />
      })

      var documentTopElement = this.state.isRootSelected ? (
         <h1 className="note-body__top-element-wrapper__document-title">{this.state.rootBullet && this.state.rootBullet.text}</h1>
      ) : (
         <Breadcrumbs selectedBullets={bullets} isRootSelected={this.state.isRootSelected} />
      )

      return (
         <div className="note-body">
            <div className="note-body__top-element-wrapper">{bullets.length > 0 && documentTopElement}</div>
            <div className="note-body__bullet-list" onClick={this.handleBulletListClick}>
               {bulletElements}
            </div>
         </div>
      )
   }
}

class Breadcrumbs extends React.Component {
   props: {
      selectedBullets: Array<Bullet>
      isRootSelected: boolean
   }

   render() {
      var elements: Array<JSX.Element> = []

      var selectedBullets = this.props.selectedBullets
      selectedBullets[0].breadCrumbs.forEach((crumbBullet, i) => {
         elements.push(<this.Crumb text={crumbBullet.text} onClick={() => NoteBody.selectBullet(crumbBullet)} key={i * 2} />)
         elements.push(<this.Spacer key={i * 2 + 1} />)
      })

      elements.push(<this.Crumb text={selectedBullets.map(b => b.text).join(', ')} key={-1} />)

      return <div className="breadcrumbs">{elements}</div>
   }

   Crumb(props: { text: string; onClick?: (event: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => void }): JSX.Element {
      var hasOnClick: boolean = props.onClick != null

      return (
         <h1 className="breadcrumbs__crumb" onClick={hasOnClick ? props.onClick : null}>
            {props.text}
         </h1>
      )
   }

   Spacer(): JSX.Element {
      return <Icon glyph="arrow_forward_ios" className="breadcrumbs__spacer" />
   }
}
