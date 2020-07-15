import * as React from 'react'
import Bullet from '@main/bullet'
// import LinkMenu from '@renderer/link_menu/link_menu'

export default function handleKeyPress(e: React.KeyboardEvent<HTMLDivElement>, blt: Bullet) {
   //TODO make enter with selection not collapsed start linking process

   var sel = window.getSelection()

   if (
      handleEnter(e, blt, sel) ||
      handleBackspace(e, blt, sel) //||
      // handleTab(e, blt, sel) ||
      // handleBrackets(e, blt, sel) ||
      // handleCtrlArrows(e, blt, sel) ||
      // handleAltArrows(e, blt, sel)
   ) {
      e.preventDefault()
      // NoteBody.rebuild()
   }
}

function handleEnter(evt: React.KeyboardEvent<HTMLDivElement>, bullet: Bullet, selection: Selection): boolean {
   if (evt.key != 'Enter') return false

   if (selection.isCollapsed) {
      var textBeforeCaret = bullet.text.substring(0, selection.anchorOffset)
      var textAfterCaret = bullet.text.substring(selection.anchorOffset)

      bullet.addSibling(-1, new Bullet(textBeforeCaret))
      bullet.text = textAfterCaret

      bullet.parent.updateComponent()

      bullet.selectComponent(0)

      return true
   }

   // LinkMenu.handleEnterPressedOnSelection(bullet, selection)

   return true
}

//TODO potentially rework because the last character being messed up may have been corrected elsewhere
function handleBackspace(evt: React.KeyboardEvent<HTMLDivElement>, bullet: Bullet, selection: Selection): boolean {
   if (evt.key == 'Backspace' && selection.isCollapsed && selection.anchorOffset == 0 && bullet.hasParent) {
      if (bullet.isFirstSibling) {
         //move siblings following bullet to be children of bullet
         // var siblingsAfterBullet = bullet.parent.removeChildren(1)
         // bullet.addChildrenToEnd(siblingsAfterBullet)

         // bullet.parent.updateComponent()
         // bullet.updateComponent()

         //move bullet to be the sibling after its old parent
         // bullet.parent.addSibling(1, bullet)

         // bullet.parent.updateComponent()
         // bullet.selectComponent(selection.anchorOffset)
      } else {
         var sibling = bullet.siblingBefore
         var caretIndex = sibling.text.length

         sibling.text += bullet.text

         bullet.remove()

         sibling.selectComponent(caretIndex)
         sibling.parent.updateComponent()
      }

      return true
   }
   return false
}

function handleTab(evt: React.KeyboardEvent<HTMLDivElement>, bullet: Bullet, selection: Selection): boolean {
   if (evt.key == 'Tab' && selection.anchorOffset == 0 && bullet.isFirstSibling == false) {
      bullet.siblingBefore.addChildrenToEnd(bullet)

      bullet.selectComponent(0)

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

      bullet.selectComponent(selection.anchorOffset)

      return true
   } else if (evt.key == ']' && !bullet.isFirstSibling) {
      bullet.siblingBefore.addChildrenToEnd(bullet)
      bullet.selectComponent(selection.anchorOffset)

      return true
   }

   return false
}

function handleCtrlArrows(evt: React.KeyboardEvent<HTMLDivElement>, bullet: Bullet, selection: Selection): boolean {
   if (!evt.ctrlKey) return false

   if (evt.key == 'ArrowUp') bullet.bulletBefore.selectComponent(selection.anchorOffset)
   else if (evt.key == 'ArrowDown') bullet.bulletAfter.selectComponent(selection.anchorOffset)
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

      bulletBefore.selectComponent(selection.anchorOffset)

      return true
   }
   if (evt.key == 'ArrowDown') {
      var bulletAfter = bullet.bulletAfter

      var tempText = bullet.text
      bullet.text = bulletAfter.text
      bulletAfter.text = tempText

      bulletAfter.selectComponent(selection.anchorOffset)
      return true
   }
   if (evt.key == 'ArrowLeft' && bullet.hasGrandParent) {
      //move siblings following bullet to be children of bullet
      var newChildren = bullet.parent.removeChildren(bullet.indexInParent + 1)
      bullet.addChildrenToEnd(newChildren)

      //move bullet to be the sibling following its existing parent
      bullet.parent.addSibling(1, bullet)

      bullet.selectComponent(selection.anchorOffset)

      return true
   }
   if (evt.key == 'ArrowRight' && !bullet.isFirstSibling) {
      bullet.siblingBefore.addChildrenToEnd(bullet)
      bullet.selectComponent(selection.anchorOffset)

      return true
   }

   return false
}
