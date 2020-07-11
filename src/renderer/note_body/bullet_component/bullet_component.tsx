import * as React from 'react'

import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import cx from 'classnames'

import Bullet from '@/main/bullet'
import handleKeyPress from '@renderer/note_body/bullet_component/key_press'
import BulletDot from '@renderer/note_body/bullet_component/bullet_dot/bullet_dot'
import BulletDropDown from '@renderer/note_body/bullet_component/bullet_drop_down/bullet_drop_down'

/*
   bullet
      bullet__line
         bullet__line__drop-down
         bullet__line__dot-container
            bullet__line__dot-container__dot
         bullet__line__editable
      bullet__children-container
*/

export default class BulletComponent extends React.Component {
   props: {
      bullet: Bullet
      isVirtualRoot: boolean
   }

   render(): JSX.Element {
      let bullet = this.props.bullet

      let children = bullet.isCollapsed
         ? []
         : bullet.children.map((child: Bullet) => {
              return <BulletComponent bullet={child} isVirtualRoot={false} key={child.key} />
           })

      if (bullet.childCount == 0)
         return (
            <div className="bullet childless">
               <BulletLine bullet={bullet} isVirtualRoot={this.props.isVirtualRoot} />
            </div>
         )

      return (
         <div className="bullet">
            <BulletLine bullet={bullet} isVirtualRoot={this.props.isVirtualRoot} />
            <div className="bullet__children-container">{children}</div>
         </div>
      )
   }
}

class BulletLine extends React.Component {
   props: {
      bullet: Bullet
      isVirtualRoot: boolean
   }

   innerRef: React.RefObject<HTMLElement>

   constructor(props: { bullet: Bullet }) {
      super(props)
      this.innerRef = React.createRef()
   }

   render(): JSX.Element {
      var bullet = this.props.bullet
      var bulletIsCollapsed = this.props.bullet.isCollapsed

      return (
         <div className={cx('bullet__line', { collapsed: bulletIsCollapsed })}>
            <BulletDropDown bullet={bullet} isVirtualRoot={this.props.isVirtualRoot} />
            <BulletDot bullet={bullet} />
            <ContentEditable
               className={cx('bullet__line__editable', { childless: bullet.isChildless })}
               innerRef={this.innerRef}
               html={bullet.text}
               onChange={this.handleChange}
               onKeyDown={(evt: any) => handleKeyPress(evt, bullet)}
            />
         </div>
      )
   }

   handleChange = (evt: ContentEditableEvent) => {
      // evt.preventDefault()
      if (evt.type !== 'input') return
      this.props.bullet.text = evt.target.value
   }

   // #region Selection
   //* if the bullet data is selected, then select the corresponding bullet in the DOM
   checkSelection() {
      var bullet = this.props.bullet
      if (bullet.caretIndex == -1) return

      this.innerRef.current.focus()

      var textNode = this.innerRef.current.childNodes[0]
      if (!textNode) return

      var range = document.createRange()
      range.setStart(textNode, Math.min(bullet.caretIndex, bullet.text.length))
      range.collapse(true)

      var selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)

      bullet.unselect()
   }

   componentDidUpdate() {
      this.checkSelection()
   }

   componentDidMount() {
      this.checkSelection()
   }
   // #endregion
}
