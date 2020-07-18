import React, { useRef, useEffect } from 'react'

import cx from 'classnames'

import { useContext } from '@renderer/state/context'
import { LinkMenuState, hideLinkMenu } from '@renderer/state/context_actions'

import { FromAddress, ToAddress } from '@main/link'
import WorkspaceManager from '@main/workspace_manager'

export default function LinkMenu() {
   var [state, dispatch] = useContext()
   var domRef = useRef(null)

   var linkMenuState: LinkMenuState = state.linkMenu

   //TODO give isHidden its own return statement
   var isHidden = linkMenuState.isHidden

   //while the link menu is active: if clicked away from it => hide it, ignore keydown events
   useEffect(() => {
      if (isHidden) return

      var handleMouseDown = (e: MouseEvent) => {
         var clickedElm = e.target

         var menuDiv = domRef.current

         if (clickedElm != menuDiv && !menuDiv.contains(clickedElm)) {
            dispatch(hideLinkMenu())
         } else e.preventDefault()
      }

      var handleKeyDown = (e: KeyboardEvent) => {
         e.preventDefault()
      }

      window.addEventListener('mousedown', handleMouseDown, false)
      window.addEventListener('keydown', handleKeyDown, false)

      return () => {
         window.removeEventListener('mousedown', handleMouseDown, false)
         window.removeEventListener('keydown', handleKeyDown, false)
      }
   })

   return (
      <div id="link-menu" className={cx({ enabled: !isHidden })} style={isHidden ? {} : positionStyle(linkMenuState)} ref={domRef}>
         {isHidden ? [] : getMenuItems(linkMenuState)}
      </div>
   )
}

function positionStyle(linkMenuState: LinkMenuState) {
   return {
      left: `${linkMenuState.viewportPos[0]}px`,
      top: `${linkMenuState.viewportPos[1]}px`,
   }
}

function getMenuItems(linkMenuState: LinkMenuState): Array<JSX.Element> {
   // if (!linkMenuState.suggestedLinks) return []

   var children: Array<JSX.Element> = linkMenuState.suggestedLinks.map((suggestion: [string, ToAddress], i) => (
      <SuggestionItem name={suggestion[0]} toAddress={suggestion[1]} key={i} />
   ))

   //if the selected text isn't an exact match to a file, add an item to the top of the suggestions for a new file
   if (
      linkMenuState.suggestedLinks.find((suggestion: [string, ToAddress]) => suggestion[0].toLowerCase() == linkMenuState.selectedText.toLowerCase()) ==
      undefined
   )
      children.unshift(<NewPageItem selectedText={linkMenuState.selectedText} key="-1" />)

   return children
}

function NewPageItem(props: { selectedText: string }): JSX.Element {
   return (
      <div className="link-menu__item">
         <p>{props.selectedText}</p>
      </div>
   )
}

function SuggestionItem(props: { name: string; toAddress: ToAddress }): JSX.Element {
   var [state, dispatch] = useContext()

   var handleClick = () => {
      var { isHidden, viewportPos, bulletWithSelection, selectionBounds, selectedText, suggestedLinks }: LinkMenuState = state.linkMenu

      var fromAddress: FromAddress = {
         documentId: state.noteBody.document.metaData.id,
         bulletCoords: bulletWithSelection.coords,
         selectionBounds: selectionBounds,
      }

      //creates the link and adds it to the documents linksFromThis list
      var link = WorkspaceManager.createLink(fromAddress, props.toAddress)

      var textBeforeSelection = bulletWithSelection.text.substr(0, selectionBounds[0])
      var textAfterSelection = bulletWithSelection.text.substr(selectionBounds[1])

      console.log(textBeforeSelection)

      //surrounds the selected text with a span tag
      bulletWithSelection.text = textBeforeSelection + `<span data-link-id="${link.id}">` + selectedText + '</span>' + textAfterSelection

      //set cursor to the end of the selection and rebuild it
      console.log(selectionBounds[1])
      //! bulletWithSelection.selectComponent(selectionBounds[1])
      state.noteBody.rootBullet.updateComponent()

      //hide this menu
      dispatch(hideLinkMenu())

      //TODO save at end
      // NoteBody.queueSaveDocument(true)
   }

   return (
      <div className="link-menu__item">
         <p onClick={handleClick}>{props.name}</p>
      </div>
   )
}
