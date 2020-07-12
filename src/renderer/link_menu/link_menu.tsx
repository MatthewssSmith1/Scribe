import * as React from 'react'
import Bullet from '@main/bullet'
import Link, { FromAddress, ToAddress } from '@main/link'
import WorkspaceManager from '@main/workspace_manager'
import NoteBody from '../note_body/note_body'

export default class LinkMenu extends React.Component {
   private static _singleton: LinkMenu

   //domRef.current doesn't work unless this is any
   domRef: any

   state: {
      isHidden: boolean
      viewportPos: [number, number]
      bulletWithSelection: Bullet
      selectionBounds: [number, number]
      selectedText: string
      suggestedLinks: Array<[string, ToAddress]>
   }

   constructor(props: {}) {
      super(props)

      if (LinkMenu._singleton) throw 'LinkMenu constructor called twice, conflict with singleton'
      LinkMenu._singleton = this

      this.state = {
         isHidden: true,
         viewportPos: null,
         bulletWithSelection: null,
         selectionBounds: null,
         selectedText: null,
         suggestedLinks: null,
      }

      this.domRef = React.createRef()
   }

   render(): JSX.Element {
      if (this.state.isHidden) return <div id="link-menu" ref={this.domRef} />

      var children: Array<JSX.Element> = this.state.suggestedLinks.map((suggestion: [string, ToAddress], i) => (
         <this.SuggestionItem name={suggestion[0]} toAddress={suggestion[1]} key={i} />
      ))

      //if the selected text isn't an exact match to a file, add an item to the top of the suggestions for a new file
      if (
         this.state.suggestedLinks.find((suggestion: [string, ToAddress]) => suggestion[0].toLowerCase() == this.state.selectedText.toLowerCase()) == undefined
      )
         children.unshift(<this.NewPageItem key={-1} />)

      return (
         <div id="link-menu" className="enabled" style={this.positionStyle} ref={this.domRef}>
            {children}
         </div>
      )
   }

   NewPageItem = (): JSX.Element => {
      return (
         <div className="link-menu__item">
            <p>{this.state.selectedText}</p>
         </div>
      )
   }

   SuggestionItem = (props: { name: string; toAddress: ToAddress }): JSX.Element => {
      var handleClick = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
         var fromAddress: FromAddress = {
            documentId: NoteBody.currentDocument.metaData.id,
            bulletCoords: this.state.bulletWithSelection.coords,
            selectionBounds: this.state.selectionBounds,
         }

         var link = WorkspaceManager.createLink(fromAddress, props.toAddress)

         this.hide()

         var selection = window.getSelection()
         var editable = selection.anchorNode.parentElement

         var span = document.createElement('SPAN')
         span.textContent = selection.toString()
         span.dataset.linkId = link.id.toString()
         span.classList.add('link')

         var range = selection.getRangeAt(0)
         range.deleteContents()
         range.insertNode(span)

         this.state.bulletWithSelection.text = editable.innerHTML

         NoteBody.queueSaveDocument(true)
      }

      return (
         <div className="link-menu__item">
            <p onClick={handleClick}>{props.name}</p>
         </div>
      )
   }

   get positionStyle() {
      return {
         left: `${this.state.viewportPos[0]}px`,
         top: `${this.state.viewportPos[1]}px`,
      }
   }

   static handleEnterPressedOnSelection = (bullet: Bullet, selection: Selection) => {
      var selectedText = selection.toString()

      var selectionRect = selection.getRangeAt(0).getBoundingClientRect()

      var suggestedLinks = WorkspaceManager.getSuggestedLinks(selectedText)

      LinkMenu._singleton.setState({
         isHidden: false,
         viewportPos: [selectionRect.left, selectionRect.bottom],
         bulletWithSelection: bullet,
         selectionBounds: [selection.anchorOffset, selection.focusOffset],
         selectedText: selectedText,
         suggestedLinks: suggestedLinks,
      })
   }

   hide() {
      this.setState({ isHidden: true })
   }

   componentDidMount() {
      document.addEventListener('mousedown', this.handleClick)
   }

   componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClick)
   }

   handleClick = (e: MouseEvent) => {
      var clickedElm = e.target

      var menuDiv = LinkMenu._singleton.domRef.current

      if (clickedElm != menuDiv && !menuDiv.contains(clickedElm)) {
         LinkMenu._singleton.hide()
      } else e.preventDefault()
   }
}
