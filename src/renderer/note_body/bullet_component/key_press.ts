import * as React from 'react'
import Bullet from '@main/bullet'
import { ContextStateType, ContextDispatchType } from '@renderer/state/context'
import { addFocusBulletToIndex, removeFocusedBullet, LinkMenuState, showLinkMenu } from '@renderer/state/context_actions'
import WorkspaceManager from '@main/workspace_manager'

export default function handleKeyPress(state: ContextStateType, dispatch: ContextDispatchType, e: React.KeyboardEvent<HTMLDivElement>, blt: Bullet) {
   //TODO make enter with selection not collapsed start linking process

   var sel = window.getSelection()

   handleEnter(state, dispatch, e, blt, sel)
   handleBackspace(state, dispatch, e, blt, sel)
   handleTab(state, dispatch, e, blt, sel)
   handleBrackets(state, dispatch, e, blt, sel)
   handleCtrlArrows(state, dispatch, e, blt, sel)
   handleAltArrows(state, dispatch, e, blt, sel)
}

function handleEnter(
   state: ContextStateType,
   dispatch: ContextDispatchType,
   evt: React.KeyboardEvent<HTMLDivElement>,
   bullet: Bullet,
   selection: Selection
): boolean {
   if (evt.key != 'Enter') return false

   if (selection.isCollapsed) {
      var textBeforeCaret = bullet.text.substring(0, selection.anchorOffset)
      var textAfterCaret = bullet.text.substring(selection.anchorOffset)

      bullet.addSibling(-1, new Bullet(textBeforeCaret))
      bullet.text = textAfterCaret

      bullet.selectComponent(0)
      bullet.parent.updateComponent()

      bullet.updateComponent()
   } else {
      var selectedText = selection.toString()
      var selectionRect = selection.getRangeAt(0).getBoundingClientRect()

      var linkMenuState: LinkMenuState = {
         isHidden: false,
         viewportPos: [selectionRect.left, selectionRect.bottom],
         bulletWithSelection: bullet,
         selectionBounds: [selection.anchorOffset, selection.focusOffset],
         selectedText,
         suggestedLinks: WorkspaceManager.getSuggestedLinks(selectedText),
      }

      dispatch(showLinkMenu(linkMenuState))
   }

   evt.preventDefault()
}

function handleBackspace(
   state: ContextStateType,
   dispatch: ContextDispatchType,
   evt: React.KeyboardEvent<HTMLDivElement>,
   bullet: Bullet,
   selection: Selection
) {
   if (evt.key != 'Backspace' || !selection.isCollapsed || selection.anchorOffset != 0) return

   if (bullet.isFirstSibling) {
      if (bullet.parent.isRoot) return
      //move siblings following bullet to be children of bullet
      var siblingsAfterBullet = bullet.parent.removeChildren(1)
      bullet.addChildrenToEnd(siblingsAfterBullet)

      //move bullet to be the sibling after its old parent
      bullet.parent.addSibling(1, bullet)

      var sibFocusedBulletsIndex = state.noteBody.focusedBullets.indexOf(bullet.siblingBefore)
      if (sibFocusedBulletsIndex != -1) {
         dispatch(addFocusBulletToIndex(bullet, sibFocusedBulletsIndex + 1))
      }

      bullet.selectComponent(selection.anchorOffset)
      state.noteBody.rootBullet.updateComponent()
   } else if (bullet.siblingBefore.childCount == 0) {
      //store length of the text in the bullet before (set cursor pos here later)
      var sibling = bullet.siblingBefore
      bullet.selectComponent(sibling.text.length)

      //concat the two bullets
      bullet.text = sibling.remove().text + bullet.text

      state.noteBody.rootBullet.updateComponent()
   }

   evt.preventDefault()
}

function handleTab(state: ContextStateType, dispatch: ContextDispatchType, evt: React.KeyboardEvent<HTMLDivElement>, bullet: Bullet, selection: Selection) {
   if (evt.key == 'Tab' && selection.anchorOffset == 0 && bullet.isFirstSibling == false) {
      var newParent = bullet.siblingBefore

      newParent.addChildrenToEnd(bullet)

      bullet.selectComponent(0)
      state.noteBody.rootBullet.updateComponent()

      evt.preventDefault()
   }
}

function handleBrackets(
   state: ContextStateType,
   dispatch: ContextDispatchType,
   evt: React.KeyboardEvent<HTMLDivElement>,
   bullet: Bullet,
   selection: Selection
) {
   if (!evt.ctrlKey) return

   if (evt.key == '[' && bullet.hasGrandParent) {
      //move siblings following bullet to be children of bullet
      var newChildren = bullet.parent.removeChildren(bullet.indexInParent + 1)
      bullet.addChildrenToEnd(newChildren)

      //move bullet to be the sibling following its existing parent
      bullet.parent.addSibling(1, bullet)

      //add bullet to the list of focussed bullets if its new sibling is in the list
      var sibFocusedBulletsIndex = state.noteBody.focusedBullets.indexOf(bullet.siblingBefore)
      if (sibFocusedBulletsIndex != -1) {
         dispatch(addFocusBulletToIndex(bullet, sibFocusedBulletsIndex + 1))
      }

      bullet.selectComponent(selection.anchorOffset)
      state.noteBody.rootBullet.updateComponent()

      evt.preventDefault()
   } else if (evt.key == ']' && !bullet.isFirstSibling) {
      var focusedBulletsIndex = state.noteBody.focusedBullets.indexOf(bullet)
      if (focusedBulletsIndex != -1) dispatch(removeFocusedBullet(focusedBulletsIndex))

      var newParent = bullet.siblingBefore

      newParent.addChildrenToEnd(bullet)

      bullet.selectComponent(0)
      state.noteBody.rootBullet.updateComponent()

      evt.preventDefault()
   }
}

function handleCtrlArrows(
   state: ContextStateType,
   dispatch: ContextDispatchType,
   evt: React.KeyboardEvent<HTMLDivElement>,
   bullet: Bullet,
   selection: Selection
) {
   if (!evt.ctrlKey) return

   if (evt.key == 'ArrowUp') bullet.bulletBefore.selectComponent(selection.anchorOffset)
   else if (evt.key == 'ArrowDown') bullet.bulletAfter.selectComponent(selection.anchorOffset)
   else return

   state.noteBody.rootBullet.updateComponent()

   evt.preventDefault()
}

function handleAltArrows(
   state: ContextStateType,
   dispatch: ContextDispatchType,
   evt: React.KeyboardEvent<HTMLDivElement>,
   bullet: Bullet,
   selection: Selection
) {
   if (!evt.altKey) return

   if (evt.key == 'ArrowUp') {
      var bulletBefore = bullet.bulletBefore

      var tempText = bullet.text
      bullet.text = bulletBefore.text
      bulletBefore.text = tempText

      bulletBefore.selectComponent(selection.anchorOffset)
      state.noteBody.rootBullet.updateComponent()

      evt.preventDefault()
   }
   if (evt.key == 'ArrowDown') {
      var bulletAfter = bullet.bulletAfter

      var tempText = bullet.text
      bullet.text = bulletAfter.text
      bulletAfter.text = tempText

      bulletAfter.selectComponent(selection.anchorOffset)
      state.noteBody.rootBullet.updateComponent()

      evt.preventDefault()
   }
   if (evt.key == 'ArrowLeft' && bullet.hasGrandParent) {
      //move siblings following bullet to be children of bullet
      var newChildren = bullet.parent.removeChildren(bullet.indexInParent + 1)
      bullet.addChildrenToEnd(newChildren)

      //move bullet to be the sibling following its existing parent
      bullet.parent.addSibling(1, bullet)

      bullet.selectComponent(selection.anchorOffset)
      state.noteBody.rootBullet.updateComponent()

      evt.preventDefault()
   }
   if (evt.key == 'ArrowRight' && !bullet.isFirstSibling) {
      bullet.siblingBefore.addChildrenToEnd(bullet)
      bullet.selectComponent(selection.anchorOffset)

      state.noteBody.rootBullet.updateComponent()

      evt.preventDefault()
   }
}
