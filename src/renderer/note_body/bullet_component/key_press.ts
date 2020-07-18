import * as React from 'react'
import Bullet from '@main/bullet'
import { ContextStateType, ContextDispatchType } from '@renderer/state/context'
import { LinkMenuState, showLinkMenu, selectBullet } from '@renderer/state/context_actions'
import WorkspaceManager from '@main/workspace_manager'

type KeyEvent = React.KeyboardEvent<HTMLDivElement>

export default function handleKeyPress(state: ContextStateType, dispatch: ContextDispatchType, evt: KeyEvent, bullet: Bullet) {
   //TODO make enter with selection not collapsed start linking process

   //TODO handle focused bullet list on enter/backspace and move left/right

   var selection = window.getSelection()

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

      // if any part of the selected text is in a span link, do nothing
      if (
         selection.anchorNode.parentElement.tagName == 'SPAN' ||
         selection.focusNode.parentElement.tagName == 'SPAN' ||
         selection.getRangeAt(0).cloneContents().querySelector('span') != null
      )
         return

      //TODO move this behavior to bullet
      var getAnchorIndex = (): number => {
         var anchorIndex: number = selection.anchorOffset

         var node: Node = selection.anchorNode

         //traverse up the DOM until at an element that is a child of the contenteditable div
         while (node.parentElement.tagName != 'DIV') {
            //add the length of the opening tag to the caretPos
            anchorIndex += node.parentElement.outerHTML.indexOf('>') + 1

            node = node.parentElement
         }

         //traverse across the DOM for each sibling before the node from the previous while loop
         while (node.previousSibling != null) {
            node = node.previousSibling

            //add the length of the node (either the textContent of text nodes or the html string of elements) to the caret pos
            if (node.nodeType == Node.TEXT_NODE) {
               anchorIndex += node.textContent.length
            } else {
               anchorIndex += (node as HTMLElement).outerHTML.length
            }
         }

         return anchorIndex
      }

      var getFocusIndex = (): number => {
         var focusIndex: number = selection.focusOffset

         var node: Node = selection.focusNode

         //traverse up the DOM until at an element that is a child of the contenteditable div
         while (node.parentElement.tagName != 'DIV') {
            //add the length of the opening tag to the caretPos
            focusIndex += node.parentElement.outerHTML.indexOf('>') + 1

            node = node.parentElement
         }

         //traverse across the DOM for each sibling before the node from the previous while loop
         while (node.previousSibling != null) {
            node = node.previousSibling

            //add the length of the node (either the textContent of text nodes or the html string of elements) to the caret pos
            if (node.nodeType == Node.TEXT_NODE) {
               focusIndex += node.textContent.length
            } else {
               focusIndex += (node as HTMLElement).outerHTML.length
            }
         }

         return focusIndex
      }

      var selectionStartIndex = getAnchorIndex()
      var selectionEndIndex = getFocusIndex()

      //ensure start index is before end index
      if (selectionStartIndex > selectionEndIndex) {
         var temp = selectionEndIndex
         selectionEndIndex = selectionStartIndex
         selectionStartIndex = temp
      }

      if (selection.isCollapsed) {
         var textBeforeCaret = bullet.text.substring(0, selectionStartIndex)
         var textAfterCaret = bullet.text.substring(selectionStartIndex).trim() //? the trim should be unnecessary

         bullet.addSibling(-1, new Bullet(textBeforeCaret))
         bullet.text = textAfterCaret

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
