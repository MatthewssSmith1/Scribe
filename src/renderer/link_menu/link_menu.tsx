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

   var isHidden = linkMenuState.isHidden

   useEffect(() => {
      if (isHidden) return

      var handleClick = (e: MouseEvent) => {
         var clickedElm = e.target

         var menuDiv = domRef.current

         if (clickedElm != menuDiv && !menuDiv.contains(clickedElm)) {
            dispatch(hideLinkMenu())
         } else e.preventDefault()
      }

      window.addEventListener('mousedown', handleClick, false)

      return () => {
         window.removeEventListener('mousedown', handleClick, false)
      }
   })

   return (
      <div id="link-menu" className={cx({ enabled: isHidden })} style={isHidden ? {} : positionStyle(linkMenuState)} ref={domRef}>
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
   // var state = useContextState()

   var handleClick = () => {
      // var fromAddress: FromAddress = {
      //    documentId: state.noteBody.document.metaData.id,
      //    bulletCoords: this.state.bulletWithSelection.coords,
      //    selectionBounds: this.state.selectionBounds,
      // }
      // var link = WorkspaceManager.createLink(fromAddress, props.toAddress)
      // this.hide()
      // var selection = window.getSelection()
      // var editable = selection.anchorNode.parentElement
      // var span = document.createElement('SPAN')
      // span.textContent = selection.toString()
      // span.dataset.linkId = link.id.toString()
      // span.classList.add('link')
      // var range = selection.getRangeAt(0)
      // range.deleteContents()
      // range.insertNode(span)
      // this.state.bulletWithSelection.text = editable.innerHTML
      // NoteBody.queueSaveDocument(true)
   }

   return (
      <div className="link-menu__item">
         <p onClick={handleClick}>{props.name}</p>
      </div>
   )
}

// class LinkMenuOld extends React.Component {
//    render(): JSX.Element {
//       return <div />
//    }

// NewPageItem = (): JSX.Element => {
//    return (
//       <div className="link-menu__item">
//          <p>{this.state.selectedText}</p>
//       </div>
//    )
// }

// SuggestionItem = (props: { name: string; toAddress: ToAddress }): JSX.Element => {
//    var handleClick = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
//       var fromAddress: FromAddress = {
//          documentId: NoteBody.currentDocument.metaData.id,
//          bulletCoords: this.state.bulletWithSelection.coords,
//          selectionBounds: this.state.selectionBounds,
//       }

//       var link = WorkspaceManager.createLink(fromAddress, props.toAddress)

//       this.hide()

//       var selection = window.getSelection()
//       var editable = selection.anchorNode.parentElement

//       var span = document.createElement('SPAN')
//       span.textContent = selection.toString()
//       span.dataset.linkId = link.id.toString()
//       span.classList.add('link')

//       var range = selection.getRangeAt(0)
//       range.deleteContents()
//       range.insertNode(span)

//       this.state.bulletWithSelection.text = editable.innerHTML

//       // NoteBody.queueSaveDocument(true)
//    }

//    return (
//       <div className="link-menu__item">
//          <p onClick={handleClick}>{props.name}</p>
//       </div>
//    )
// }

// get positionStyle() {
//    return {
//       left: `${this.state.viewportPos[0]}px`,
//       top: `${this.state.viewportPos[1]}px`,
//    }
// }

// static handleEnterPressedOnSelection = (bullet: Bullet, selection: Selection) => {
//    var selectedText = selection.toString()

//    var selectionRect = selection.getRangeAt(0).getBoundingClientRect()

//    var suggestedLinks = WorkspaceManager.getSuggestedLinks(selectedText)

//    LinkMenu._singleton.setState({
//       isHidden: false,
//       viewportPos: [selectionRect.left, selectionRect.bottom],
//       bulletWithSelection: bullet,
//       selectionBounds: [selection.anchorOffset, selection.focusOffset],
//       selectedText: selectedText,
//       suggestedLinks: suggestedLinks,
//    })
// }

// hide() {
//    this.setState({ isHidden: true })
// }

// componentDidMount() {
//    document.addEventListener('mousedown', this.handleClick)
// }

// componentWillUnmount() {
//    document.removeEventListener('mousedown', this.handleClick)
// }

// handleClick = (e: MouseEvent) => {
//    var clickedElm = e.target

//    var menuDiv = LinkMenu._singleton.domRef.current

//    if (clickedElm != menuDiv && !menuDiv.contains(clickedElm)) {
//       LinkMenu._singleton.hide()
//    } else e.preventDefault()
// }
// }
