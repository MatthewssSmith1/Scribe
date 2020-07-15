import React, { useRef, useEffect, useReducer, memo } from 'react'

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

//memoize for more efficient rendering
var BulletComponent = memo((props: { bullet: Bullet }) => {
   const [, forceUpdate] = useReducer(x => x + 1, 0)
   var { bullet } = props

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
})

var BulletLine = (props: { bullet: Bullet; forceUpdate: React.Dispatch<unknown> }) => {
   const [state, dispatch] = useContext()
   const contentEditableRef = useRef(null)

   var { bullet, forceUpdate } = props

   //after rendered, select the text if bullet.select(index) has been called
   useEffect(() => {
      if (bullet.caretIndex == -1) return

      contentEditableRef.current.focus()

      var textNode = contentEditableRef.current.childNodes[0]
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

   //when text is typed into a bullet, update the bullet data in the tree
   var handleTextChange = (evt: ContentEditableEvent) => {
      if (evt.type !== 'input') return

      //? whenever edited, this removes an unknown character at the end of the text node (appears to be both delete and new line)
      var newText = evt.target.value
      props.bullet.text = newText.slice(0, newText.length - 1)

      dispatch(enqueueSaveDocument())
   }

   var handleDropDownClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      bullet.toggleCollapsed()

      if (evt.altKey) bullet.setCollapsedForAllDescendants(bullet.isCollapsed)

      forceUpdate(0)
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
