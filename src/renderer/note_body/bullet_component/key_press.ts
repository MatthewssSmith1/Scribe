import * as React from 'react'

import { Context, LinkMenuState } from '@renderer/state/context'
import { showLinkMenu, selectBullet } from '@renderer/state/context_actions'

import Bullet from '@main/bullet'
import WorkspaceManager from '@main/workspace_manager'
import { focusBullet } from '../../state/context_actions'

type KeyEvent = React.KeyboardEvent<HTMLDivElement>

//TODO make enter with selection not collapsed start linking process

//TODO handle focused bullet list on enter/backspace and move left/right
export default function handleKeyPress(context: Context, evt: KeyEvent, bullet: Bullet) {
   var { state, dispatch } = context

   var selection = window.getSelection()

   var doesSelectionContainSpan = (): boolean => {
      return (
         selection.anchorNode.parentElement.tagName == 'SPAN' ||
         selection.focusNode.parentElement.tagName == 'SPAN' ||
         selection.getRangeAt(0).cloneContents().querySelector('span') != null
      )
   }

   var getRawTextIndex = (fromAnchor: boolean): number => {
         var index: number = fromAnchor ? selection.anchorOffset : selection.focusOffset

         var node: Node = fromAnchor ? selection.anchorNode : selection.focusNode

         //traverse up the DOM until at an element that is a child of the contenteditable div
         while (node.parentElement.tagName != 'DIV') {
            //add the length of the opening tag to the caretPos
            index += node.parentElement.outerHTML.indexOf('>') + 1

            node = node.parentElement
         }

         //traverse across the DOM for each sibling before the node from the previous while loop
         while (node.previousSibling != null) {
            node = node.previousSibling

            //add the length of the node (either the textContent of text nodes or the html string of elements) to the caret pos
            if (node.nodeType == Node.TEXT_NODE) {
               index += node.textContent.length
            } else {
               index += (node as HTMLElement).outerHTML.length
            }
         }

         return index

   }

   const rebuildAndPreventDefault = () => {
      //rebuild tree
      state.noteBody.rootBullet.updateComponent()

      //stop normal key behavior
      evt.preventDefault()
   }

   const handleEnter = () => {
      if (evt.key != 'Enter') return

      //prevent default enter behavior no matter what
      evt.preventDefault()

      // if any part of the selected text is in a span link, return
      if (doesSelectionContainSpan()) return


      var selectionStartIndex = getRawTextIndex(true)
      var selectionEndIndex = getRawTextIndex(false)

      //ensure start index is before end index
      if (selectionStartIndex > selectionEndIndex) {
         var temp = selectionEndIndex
         selectionEndIndex = selectionStartIndex
         selectionStartIndex = temp
      }

      if (selection.isCollapsed) {
         var textBeforeCaret = bullet.text.substring(0, selectionStartIndex)
         var textAfterCaret = bullet.text.substring(selectionStartIndex).trim()

         bullet.addSibling(-1, new Bullet(textBeforeCaret))
         bullet.text = textAfterCaret

         if (state.noteBody.isRootSelected && state.noteBody.rootBullet == bullet.parent) {
            dispatch(focusBullet(state.noteBody.rootBullet))
         }

         dispatch(selectBullet(bullet, 0))
         bullet.parent.updateComponent()

         bullet.updateComponent()
      } else {
         var selectedText = selection.toString()
         var selectionRect = selection.getRangeAt(0).getBoundingClientRect()
         var linkMenuState: LinkMenuState = {
            isHidden: false,
            viewportPos: [selectionRect.left, selectionRect.bottom],
            bulletWithSelection: bullet,
            selectionBounds: [selectionStartIndex, selectionEndIndex],
            selectedText,
            suggestedLinks: WorkspaceManager.getSuggestedLinks(selectedText),
         }
         dispatch(showLinkMenu(linkMenuState))
      }
   }

   const handleBackspace = () => {
      if (evt.key != 'Backspace' || !selection.isCollapsed || selection.anchorOffset != 0) return

      if (bullet.isFirstSibling) {
         if (!bullet.hasGrandParent) return

         bullet.moveLeft()

         dispatch(selectBullet(bullet, selection.anchorOffset))
      } else {
         if (bullet.siblingBefore.childCount > 0) return

         //store length of the text in the bullet before (set cursor pos here later)
         var sibling = bullet.siblingBefore
         dispatch(selectBullet(bullet, sibling.text.length))

         //concat the two bullets
         bullet.text = sibling.remove().text + bullet.text

         if (state.noteBody.isRootSelected && state.noteBody.rootBullet == bullet.parent) {
            dispatch(focusBullet(state.noteBody.rootBullet))
         }
      }

      rebuildAndPreventDefault()
   }

   const handleBracketsAndTab = () => {
      const lBracketCtrl = evt.key == '[' && evt.ctrlKey
      const rBracketCtrl = evt.key == ']' && evt.ctrlKey

      if (bullet.hasGrandParent && lBracketCtrl) bullet.moveLeft()
      else if (!bullet.isFirstSibling && (rBracketCtrl || evt.key == 'Tab')) bullet.moveRight()
      else return

      dispatch(selectBullet(bullet, selection.anchorOffset))

      rebuildAndPreventDefault()
   }

   const handleArrows = () => {
      if (!evt.altKey && !evt.ctrlKey) return

      var otherBullet: Bullet

      if (evt.key == 'ArrowUp') otherBullet = bullet.bulletBefore
      else if (evt.key == 'ArrowDown') otherBullet = bullet.bulletAfter
      else return

      if (evt.altKey) bullet.swapTextWith(otherBullet)

      dispatch(selectBullet(bullet, selection.anchorOffset))

      rebuildAndPreventDefault()
   }

   handleEnter()
   handleBackspace()
   handleBracketsAndTab()
   handleArrows()
}
