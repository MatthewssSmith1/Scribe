import React, { useRef, useEffect, useReducer, memo, useState } from 'react'

import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import cx from 'classnames'

import Link from '@main/link'
import Bullet from '@/main/bullet'
import Icon from '@/renderer/other_components/icon'
import handleKeyPress from '@renderer/note_body/bullet_component/key_press'
import { useContext, useContextDispatchAsync } from '@/renderer/state/context'
import { enqueueSaveDocument, focusBullet } from '@/renderer/state/context_actions'
import { loadDocumentByID } from '../../state/context_actions_async'

/*
   bullet
      bullet__line
         bullet__line__drop-down
         bullet__line__dot-container
            bullet__line__dot-container__dot
         bullet__line__editable
      bullet__children-container
*/

class BulletComponent extends React.Component {
   props: { bullet: Bullet }

   shouldComponentUpdate(nextProps: { bullet: Bullet }, nextState): boolean {
      var { bullet } = nextProps

      if (bullet.shouldComponentRebuild) {
         bullet.shouldComponentRebuild = false
         return true
      }

      return false
   }

   render() {
      var { bullet } = this.props

      bullet.setComponentCallback(() => this.forceUpdate())

      // console.log('bullet component rendered')

      var shouldDisplayChildren = bullet.children.length >= 0 && !bullet.isCollapsed
      var bulletToChildrenComponents = (bullet: Bullet) => {
         return bullet.children.map((child: Bullet) => <BulletComponent bullet={child} key={child.key} />)
      }

      return (
         <div className="bullet">
            <BulletLine bullet={bullet} />
            {shouldDisplayChildren && <div className="bullet__children-container">{bulletToChildrenComponents(bullet)}</div>}
         </div>
      )
   }
}

var BulletLine = (props: { bullet: Bullet }) => {
   const [state, dispatch] = useContext()
   const dispatchAsync = useContextDispatchAsync()
   const contentEditableRef = useRef(null)

   var { bullet } = props

   // after rendered, select the text if bullet.select(index) has been called
   useEffect(() => {
      //fetches the caret index and sets it to -1
      var caretIndex = bullet.getCaretIndex()
      bullet.unselect()

      if (caretIndex == -1) return

      var divElm = contentEditableRef.current

      divElm.focus()

      var textNode = divElm.childNodes[0]
      if (!textNode) return

      if (caretIndex > bullet.text.length) {
         console.warn(`caret index is outside of bounds for the text of ${bullet}`)
         caretIndex == bullet.text.length
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

   //expand/collapse the children of this bullet by toggling the chevron button to the left of the bullet
   var handleDropDownClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      bullet.toggleCollapsed()

      if (evt.altKey) bullet.setCollapsedForAllDescendants(bullet.isCollapsed)

      bullet.updateComponent()
   }

   //called when any bullet is clicked, loads what a link points to if ctrl is pressed
   var handleEditableClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      var clickedSpan = e.target as HTMLSpanElement

      if (!clickedSpan || clickedSpan.tagName != 'SPAN' || !e.ctrlKey) return

      var linkID = parseInt(clickedSpan.dataset.linkId)
      var link: Link = state.noteBody.document.linksFromThis.find(l => l.id == linkID)
      if (link == undefined) {
         console.warn(`could not find link of id ${linkID}`)
         return
      } else {
         dispatchAsync(loadDocumentByID(link.to.documentId))
      }
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
            onKeyDown={(evt: any) => handleKeyPress(state, dispatch, evt, props.bullet)}
            onClick={handleEditableClick}
         />
      </div>
   )
}

export default BulletComponent
