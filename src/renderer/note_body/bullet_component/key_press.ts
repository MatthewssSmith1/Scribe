import * as React from 'react'
import Bullet from '@main/bullet'
// import LinkMenu from '@renderer/link_menu/link_menu'
import { ContextStateType, ContextDispatchType } from '@renderer/state/context'
import { addFocusBulletToIndex } from '@renderer/state/context_actions'

export default function handleKeyPress(state: ContextStateType, dispatch: ContextDispatchType, e: React.KeyboardEvent<HTMLDivElement>, blt: Bullet) {
   //TODO make enter with selection not collapsed start linking process

   var sel = window.getSelection()

   if (
      handleEnter(state, dispatch, e, blt, sel) ||
      handleBackspace(state, dispatch, e, blt, sel) //||
      // handleTab(e, blt, sel) ||
      // handleBrackets(e, blt, sel) ||
      // handleCtrlArrows(e, blt, sel) ||
      // handleAltArrows(e, blt, sel)
   ) {
      e.preventDefault()
   }
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

      bullet.parent.updateComponent()

      bullet.selectComponent(0)
   }

   evt.preventDefault()
}

//TODO potentially rework because the last character being messed up may have been corrected elsewhere
function handleBackspace(
   state: ContextStateType,
   dispatch: ContextDispatchType,
   evt: React.KeyboardEvent<HTMLDivElement>,
   bullet: Bullet,
   selection: Selection
): boolean {
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
         console.log('should add to focused bullets')
         dispatch(addFocusBulletToIndex(bullet, sibFocusedBulletsIndex + 1))
      }

      bullet.parent.updateComponent()
      bullet.siblingBefore.updateComponent()
      bullet.selectComponent(selection.anchorOffset)
   } else {
      //store length of the text in the bullet before (set cursor pos here later)
      var sibling = bullet.siblingBefore
      var caretIndex = sibling.text.length

      //concat the two bullets
      sibling.text += bullet.text

      //remove currently selected bullet
      bullet.remove()

      console.log('slct called')
      sibling.parent.updateComponent()
      sibling.selectComponent(caretIndex)
   }

   evt.preventDefault()
}

function handleTab(state: ContextStateType, dispatch: ContextDispatchType, evt: React.KeyboardEvent<HTMLDivElement>, bullet: Bullet, selection: Selection) {
   if (evt.key == 'Tab' && selection.anchorOffset == 0 && bullet.isFirstSibling == false) {
      bullet.siblingBefore.addChildrenToEnd(bullet)

      bullet.selectComponent(0)

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

      bullet.selectComponent(selection.anchorOffset)

      evt.preventDefault()
   } else if (evt.key == ']' && !bullet.isFirstSibling) {
      bullet.siblingBefore.addChildrenToEnd(bullet)
      bullet.selectComponent(selection.anchorOffset)

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

      evt.preventDefault()
   }
   if (evt.key == 'ArrowDown') {
      var bulletAfter = bullet.bulletAfter

      var tempText = bullet.text
      bullet.text = bulletAfter.text
      bulletAfter.text = tempText

      bulletAfter.selectComponent(selection.anchorOffset)

      evt.preventDefault()
   }
   if (evt.key == 'ArrowLeft' && bullet.hasGrandParent) {
      //move siblings following bullet to be children of bullet
      var newChildren = bullet.parent.removeChildren(bullet.indexInParent + 1)
      bullet.addChildrenToEnd(newChildren)

      //move bullet to be the sibling following its existing parent
      bullet.parent.addSibling(1, bullet)

      bullet.selectComponent(selection.anchorOffset)

      evt.preventDefault()
   }
   if (evt.key == 'ArrowRight' && !bullet.isFirstSibling) {
      bullet.siblingBefore.addChildrenToEnd(bullet)
      bullet.selectComponent(selection.anchorOffset)

      evt.preventDefault()
   }
}
