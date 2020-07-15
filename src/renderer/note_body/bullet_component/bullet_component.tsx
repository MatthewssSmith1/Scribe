import React, { useRef, useEffect, useReducer, memo, useState } from 'react'

import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import cx from 'classnames'

import Bullet from '@/main/bullet'
import Icon from '@/renderer/other_components/icon'
import handleKeyPress from '@renderer/note_body/bullet_component/key_press'
import { useContextDispatch, useContext } from '@/renderer/state/context'
import { enqueueSaveDocument, focusBullet } from '@/renderer/state/context_actions'

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

const bulletComponentReducer = ([counter, oldCaretIndex], caretIndex?: number): [number, number] => {
   return [counter + 1, caretIndex == null ? oldCaretIndex : caretIndex]
}

var BulletComponent = memo((props: { bullet: Bullet }) => {
   var { bullet } = props

   const [[, caretIndex], forceUpdate] = useReducer(bulletComponentReducer, [0, -1])
   bullet.setComponentCallback(forceUpdate)

   console.log('bullet component rendered')

   var shouldDisplayChildren = bullet.children.length >= 0 && !bullet.isCollapsed
   var bulletToChildrenComponents = (bullet: Bullet) => {
      return bullet.children.map((child: Bullet) => <BulletComponent bullet={child} key={child.key} />)
   }

   return (
      <div className="bullet">
         <BulletLine bullet={bullet} caretIndex={caretIndex} />
         {shouldDisplayChildren && <div className="bullet__children-container">{bulletToChildrenComponents(bullet)}</div>}
      </div>
   )
})

var BulletLine = (props: { bullet: Bullet; caretIndex: number }) => {
   const [state, dispatch] = useContext()
   const contentEditableRef = useRef(null)

   var { bullet, caretIndex } = props

   // after rendered, select the text if bullet.select(index) has been called
   useEffect(() => {
      if (caretIndex == -1) return

      var divElm = contentEditableRef.current
      // divElm.focus()

      var textNode = divElm.childNodes[0]
      if (!textNode) return

      if (caretIndex > bullet.text.length - 1) {
         console.warn(`caret index is outside of bounds for the text of ${bullet}`)
         return
      }

      var range = document.createRange()
      range.setStart(textNode, caretIndex)
      range.collapse(true)

      var selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
   })

   //when text is typed into a bullet, update the bullet data in the tree
   var handleTextChange = (evt: ContentEditableEvent) => {
      if (evt.type !== 'input') return

      // maintain selection when rebuilding
      bullet.selectComponent(window.getSelection().anchorOffset)

      var str = evt.target.value
      if (str.charAt(str.length - 1) == '\n') {
         str = str.slice(0, -1)
      }
      props.bullet.text = str

      dispatch(enqueueSaveDocument())
   }

   var handleDropDownClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      bullet.toggleCollapsed()

      if (evt.altKey) bullet.setCollapsedForAllDescendants(bullet.isCollapsed)

      bullet.updateComponent()
   }

   return (
      <div className={cx('bullet__line', { collapsed: bullet.isCollapsed })}>
         <Icon
            glyph="keyboard_arrow_down"
            className={cx({
               'bullet__line__drop-down': true,
               rotated: bullet.isCollapsed,
            })}
            onClick={handleDropDownClick}
            disabled={bullet.childCount == 0}
         />
         <div className="bullet__line__dot">
            <div
               className={cx('bullet__line__dot__circle', {
                  'click-disabled': state.noteBody.focusedBullets.includes(bullet),
                  highlighted: bullet.isCollapsed,
               })}
               onClick={() => dispatch(focusBullet(bullet))}
            />
         </div>
         <ContentEditable
            className={cx('bullet__line__editable', { childless: props.bullet.isChildless })}
            innerRef={contentEditableRef}
            html={props.bullet.text}
            onChange={handleTextChange}
            onKeyDown={(evt: any) => handleKeyPress(evt, props.bullet)}
         />
      </div>
   )
}

export default BulletComponent
