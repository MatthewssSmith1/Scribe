import * as React from 'react'
import NoteBody from '@renderer/note_body/note_body'
import Bullet from '@main/bullet'
import LinkMenu from '@renderer/link_menu/link_menu'

export default function handleKeyPress(e: React.KeyboardEvent<HTMLDivElement>, blt: Bullet) {
   //TODO make enter with selection not collapsed start linking process

   var sel = window.getSelection()

   // if (
   //    handleEnter(e, blt, sel) ||
   //    handleBackspace(e, blt, sel) ||
   //    handleTab(e, blt, sel) ||
   //    handleBrackets(e, blt, sel) ||
   //    handleCtrlArrows(e, blt, sel) ||
   //    handleAltArrows(e, blt, sel)
   // ) {
   //    e.preventDefault()
   //    NoteBody.rebuild()
   // }
}

function handleEnter(evt: React.KeyboardEvent<HTMLDivElement>, bullet: Bullet, selection: Selection): boolean {
   if (evt.key == 'Enter' && selection.isCollapsed) {
      if (bullet.isRoot) {
         bullet.select(selection.anchorOffset)
         return true
      }

      var textBeforeCaret = bullet.text.substring(0, selection.anchorOffset)
      var textAfterCaret = bullet.text.substring(selection.anchorOffset)

      var newBullet = new Bullet(textBeforeCaret)

      bullet.addSibling(-1, newBullet)
      bullet.text = textAfterCaret
      bullet.select(0)

      return true
   } else if (evt.key == 'Enter') {
      LinkMenu.handleEnterPressedOnSelection(bullet, selection)

      evt.preventDefault()
      return false
   }

   return false
}

//TODO potentially rework because the last character being messed up may have been corrected elsewhere
function handleBackspace(evt: React.KeyboardEvent<HTMLDivElement>, bullet: Bullet, selection: Selection): boolean {
   if (evt.key == 'Backspace' && selection.isCollapsed && selection.anchorOffset == 0 && bullet.hasParent) {
      if (bullet.isFirstSibling) {
         //move siblings following bullet to be children of bullet
         var siblingsAfterBullet = bullet.parent.removeChildren(1)
         bullet.addChildrenToEnd(siblingsAfterBullet)

         //move bullet to be the sibling after its old parent
         bullet.parent.addSibling(1, bullet)

         bullet.select(selection.anchorOffset)
      } else {
         var sibling = bullet.siblingBefore
         var sibText = sibling.text

         sibling.select(Math.max(sibText.length, 0))

         sibling.text += bullet.text

         bullet.remove()
      }

      return true
   }
   return false
}

function handleTab(evt: React.KeyboardEvent<HTMLDivElement>, bullet: Bullet, selection: Selection): boolean {
   if (evt.key == 'Tab' && selection.anchorOffset == 0 && bullet.isFirstSibling == false) {
      bullet.siblingBefore.addChildrenToEnd(bullet)

      bullet.select(0)

      return true
   }

   return false
}

function handleBrackets(evt: React.KeyboardEvent<HTMLDivElement>, bullet: Bullet, selection: Selection): boolean {
   if (!evt.ctrlKey) return false

   if (evt.key == '[' && bullet.hasGrandParent) {
      //move siblings following bullet to be children of bullet
      var newChildren = bullet.parent.removeChildren(bullet.indexInParent + 1)
      bullet.addChildrenToEnd(newChildren)

      //move bullet to be the sibling following its existing parent
      bullet.parent.addSibling(1, bullet)

      bullet.select(selection.anchorOffset)

      return true
   } else if (evt.key == ']' && !bullet.isFirstSibling) {
      bullet.siblingBefore.addChildrenToEnd(bullet)
      bullet.select(selection.anchorOffset)

      return true
   }

   return false
}

function handleCtrlArrows(evt: React.KeyboardEvent<HTMLDivElement>, bullet: Bullet, selection: Selection): boolean {
   if (!evt.ctrlKey) return false

   if (evt.key == 'ArrowUp') bullet.bulletBefore.select(selection.anchorOffset)
   else if (evt.key == 'ArrowDown') bullet.bulletAfter.select(selection.anchorOffset)
   else return false

   return true
}

function handleAltArrows(evt: React.KeyboardEvent<HTMLDivElement>, bullet: Bullet, selection: Selection): boolean {
   if (!evt.altKey) return false

   if (evt.key == 'ArrowUp') {
      var bulletBefore = bullet.bulletBefore

      var tempText = bullet.text
      bullet.text = bulletBefore.text
      bulletBefore.text = tempText

      bulletBefore.select(selection.anchorOffset)

      return true
   }
   if (evt.key == 'ArrowDown') {
      var bulletAfter = bullet.bulletAfter

      var tempText = bullet.text
      bullet.text = bulletAfter.text
      bulletAfter.text = tempText

      bulletAfter.select(selection.anchorOffset)
      return true
   }
   if (evt.key == 'ArrowLeft' && bullet.hasGrandParent) {
      //move siblings following bullet to be children of bullet
      var newChildren = bullet.parent.removeChildren(bullet.indexInParent + 1)
      bullet.addChildrenToEnd(newChildren)

      //move bullet to be the sibling following its existing parent
      bullet.parent.addSibling(1, bullet)

      bullet.select(selection.anchorOffset)

      return true
   }
   if (evt.key == 'ArrowRight' && !bullet.isFirstSibling) {
      bullet.siblingBefore.addChildrenToEnd(bullet)
      bullet.select(selection.anchorOffset)

      return true
   }

   return false
}
