import React, { useRef, useEffect, useReducer, memo, useState } from 'react'

import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import cx from 'classnames'

import Link from '@main/link'
import Bullet from '@/main/bullet'
import Icon from '@/renderer/other_components/icon'
import handleKeyPress, { getRawTextIndex } from '@renderer/note_body/bullet_component/key_press'

import { getContext } from '@/renderer/state/context'
import { enqueueSaveDocument, focusBullet, selectBullet } from '@/renderer/state/context_actions'
import { loadDocumentByID } from '@renderer/state/context_actions_async'

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
   const context = getContext()
   const { state, dispatch, dispatchAsync } = context
   const contentEditableRef = useRef<HTMLDivElement>(null)

   var { bullet } = props

   // after rendered, select the text if bullet.select(index) has been called
   useEffect(() => {
      //only run this effect if this bullet is selected and it hasn't already been selected
      if (state.selection.bullet != bullet) return

      //sets state.selection.shouldRender to false so that this effect runs only once per dispatch of a bulletSelect action
      dispatch(selectBullet(null))

      var { startIndex, endIndex } = state.selection

      // TODO implement selecting ranges (and use it with the link menu potentially)
      var isCollapsed = startIndex == endIndex
      if (!isCollapsed) return

      //fetches the caret index and sets it to -1
      var caretIndex = startIndex

      if (caretIndex == -1) return

      var divElm = contentEditableRef.current as HTMLDivElement

      divElm.focus()

      var strLengthInBullet = (node: Node) => {
         if (node.nodeType == Node.TEXT_NODE) {
            return node.textContent.length
         } else {
            return (node as HTMLElement).outerHTML.length
         }
      }

      var nodes = [...divElm.childNodes]
      // iterate through children nodes (either text nodes or tag elements) until the caretIndex points inside of one
      while (caretIndex > strLengthInBullet(nodes[0])) {
         caretIndex -= strLengthInBullet(nodes[0])
         nodes.shift()
      }
      if (nodes.length == 0) {
         console.warn(`caretIndex out of range on: ${bullet}`)
         return
      }
      var selectedNode = nodes[0]

      //? make while loop for nested tags
      // removes the str length of the opening html tag from caretIndex
      if (selectedNode.nodeType != Node.TEXT_NODE) {
         caretIndex -= (selectedNode as HTMLElement).outerHTML.indexOf('>') + 1
         selectedNode = selectedNode.childNodes[0]
      }

      if (!selectedNode) return

      if (caretIndex > bullet.text.length) {
         console.warn(`caret index is outside of bounds (> length) for the text of ${bullet}`)
         caretIndex = bullet.text.length
      } else if (caretIndex < 0) {
         console.warn(`caret index is outside of bounds (< 0) for the text of ${bullet}`)
         caretIndex = 0
      }

      var range = document.createRange()
      range.setStart(selectedNode, caretIndex)
      range.collapse(true)

      var selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
   })

   // when text is typed into a bullet, update the bullet data in the tree
   var handleTextChange = (evt: ContentEditableEvent) => {
      if (evt.type !== 'input') return

      // //prevent standard undo/redo behavior
      // var value = evt.target.value
      // document.execCommand('undo')
      // //at this point evt.target.value is in the state it was before this change
      // evt.target.value = value

      // maintain selection when rebuilding
      //TODO move the anchor/focus caret pos functions from key_press to a more general location and use it here
      // ! bullet.selectComponent(window.getSelection().anchorOffset)
      // dispatch(selectBullet(bullet, window.getS))

      // var str = evt.target.value

      // if (str.charAt(str.length - 1) == '\n') {
      //    str = str.slice(0, -1)

      //    var div = contentEditableRef.current as HTMLDivElement
      //    div.innerHTML = str
      // }
      bullet.text = evt.target.value

      dispatch(enqueueSaveDocument())
      dispatch(selectBullet(bullet, getRawTextIndex(true)))
   }

   // expand/collapse the children of this bullet by toggling the chevron button to the left of the bullet
   var handleDropDownClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      bullet.toggleCollapsed()

      if (evt.altKey) bullet.setCollapsedForAllDescendants(bullet.isCollapsed)

      bullet.updateComponent()
   }

   // called when any bullet is clicked, loads what a link points to if ctrl is pressed
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
            className={cx('bullet__line__editable', { childless: bullet.isChildless })}
            innerRef={contentEditableRef}
            html={bullet.text}
            onChange={handleTextChange}
            onKeyDown={(evt: any) => handleKeyPress(context, evt, bullet)}
            onClick={handleEditableClick}
         />
      </div>
   )
}

export default BulletComponent
