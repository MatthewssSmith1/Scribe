import React, { useRef, useEffect, useReducer, memo } from 'react'

import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import cx from 'classnames'

import Bullet from '@/main/bullet'
import handleKeyPress from '@renderer/note_body/bullet_component/key_press'
import BulletDot from '@renderer/note_body/bullet_component/bullet_dot/bullet_dot'
import BulletDropDown from '@renderer/note_body/bullet_component/bullet_drop_down/bullet_drop_down'
import { useContextDispatch } from '@/renderer/state/context'
import { enqueueSaveDocument } from '@/renderer/state/context_actions'

/*
   bullet
      bullet__line
         bullet__line__drop-down
         bullet__line__dot-container
            bullet__line__dot-container__dot
         bullet__line__editable
      bullet__children-container
*/

//TODO implement link clicking for bullets
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

var BulletComponent = (props: { bullet: Bullet }) => {
   const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
   var bullet = props.bullet

   var bulletToChildrenComponents = (bullet: Bullet) => {
      return bullet.children.map((child: Bullet) => {
         return <BulletComponent bullet={child} key={child.key} />
      })
   }

   var shouldDisplayChildren = bullet.children.length >= 0 && !bullet.isCollapsed

   return (
      <div className="bullet">
         <BulletLine bullet={bullet} forceUpdate={forceUpdate} />
         {shouldDisplayChildren && <div className="bullet__children-container">{bulletToChildrenComponents(bullet)}</div>}
      </div>
   )
}
// BulletComponent = memo(BulletComponent)

var BulletLine = (props: { bullet: Bullet; forceUpdate: React.Dispatch<unknown> }) => {
   const dispatch = useContextDispatch()
   const innerRef = useRef(null)

   var { bullet, forceUpdate } = props

   //after the bullet is rendered, select the text if the bullet data contains a caretIndex that != -1
   useEffect(() => {
      if (bullet.caretIndex == -1) return

      innerRef.current.focus()

      var textNode = innerRef.current.childNodes[0]
      if (!textNode) return

      if (bullet.caretIndex > bullet.text.length - 1) throw `caret index is outside of bounds for the text of ${bullet}`

      var range = document.createRange()
      range.setStart(textNode, bullet.caretIndex)
      range.collapse(true)

      var selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)

      bullet.unselect()
   })

   console.log('rendered')

   //when text is typed into a bullet, update the bullet data in the tree
   var handleChange = (evt: ContentEditableEvent) => {
      if (evt.type !== 'input') return

      //? whenever edited, this removes an unknown character at the end of the text node (appears to be both delete and new line)
      var newText = evt.target.value
      props.bullet.text = newText.slice(0, newText.length - 1)

      dispatch(enqueueSaveDocument())
   }

   var bulletIsCollapsed = props.bullet.isCollapsed
   return (
      <div className={cx('bullet__line', { collapsed: bulletIsCollapsed })}>
         <BulletDropDown bullet={props.bullet} forceUpdate={forceUpdate} />
         <BulletDot bullet={props.bullet} />
         <ContentEditable
            className={cx('bullet__line__editable', { childless: props.bullet.isChildless })}
            innerRef={innerRef}
            html={props.bullet.text}
            onChange={handleChange}
            onKeyDown={(evt: any) => handleKeyPress(evt, props.bullet)}
         />
      </div>
   )
}

export default BulletComponent
