import React from 'react'

import { ToAddress } from '@/data/link'

export default class LinkMenu extends React.Component {
   //#region Static
   private static _SINGLETON: LinkMenu

   static hide(): void {
      LinkMenu._SINGLETON.setState({ isHidden: true })
   }
   //#endregion

   //#region Members & Constructor
   state = {
      isHidden: true,
      viewportPos: null as [number, number],
      nodeWithSelection: null as Node,
      selectionBounds: null as [number, number],
      selectedText: null as string,
      suggestions: null as Array<[string, ToAddress]>,
   }

   domRef: React.RefObject<HTMLDivElement>

   constructor(props: any) {
      super(props)

      LinkMenu._SINGLETON = this

      this.domRef = React.createRef<HTMLDivElement>()
   }
   //#endregion

   //#region Input
   handleMouseDown = (e: MouseEvent) => {
      if (this.state.isHidden) return

      var clickedElm = e.target as Node
      var menuDiv = this.domRef.current

      var clickedInLinkMenu = clickedElm != menuDiv && !menuDiv.contains(clickedElm)

      if (clickedInLinkMenu) LinkMenu.hide()
      else e.preventDefault()
   }

   handleKeyDown = (e: KeyboardEvent) => {
      if (this.state.isHidden) return

      e.preventDefault()
   }

   componentDidMount() {
      window.addEventListener('mousedown', this.handleMouseDown)
      window.addEventListener('keydown', this.handleKeyDown)
   }

   componentWillUnmount() {
      window.removeEventListener('mousedown', this.handleMouseDown)
      window.removeEventListener('keydown', this.handleKeyDown)
   }
   //#endregion

   //#region Getters
   get style(): React.CSSProperties {
      return {
         left: `${this.state.viewportPos[0]}px`,
         top: `${this.state.viewportPos[1]}px`,
      }
   }

   get menuItems(): Array<JSX.Element> {
      // if (!linkMenuState.suggestions) return []

      var children = this.state.suggestions.map((suggestion: [string, ToAddress], i) => (
         <SuggestionItem name={suggestion[0]} toAddress={suggestion[1]} key={i} />
      ))

      //if the selected text isn't an exact match to a file, add an item to the top of the suggestions for a new file
      if (this.state.suggestions.find((suggestion: [string, ToAddress]) => suggestion[0].toLowerCase() == this.state.selectedText.toLowerCase()) == undefined)
         children.unshift(<NewPageItem selectedText={this.state.selectedText} key="-1" />)

      return children
   }
   //#endregion

   render() {
      if (this.state.isHidden) return <div id="link-menu" ref={this.domRef} />

      return (
         <div id="link-menu" className={'enabled'} style={this.style} ref={this.domRef}>
            {this.menuItems}
         </div>
      )
   }
}

function NewPageItem(props: { selectedText: string }): JSX.Element {
   return (
      <div className="link-menu__item">
         <p>{props.selectedText}</p>
      </div>
   )
}

function SuggestionItem(props: { name: string; toAddress: ToAddress }): JSX.Element {
   // var { state, dispatch, dispatchAsync } = getContext()

   // var handleClick = () => {
   //    var { nodeWithSelection, selectionBounds, selectedText }: LinkMenuState = state.linkMenu

   //    var fromAddress: FromAddress = {
   //       document: state.noteBody.document,
   //       bulletCoords: bulletWithSelection.coords,
   //       selectionBounds: selectionBounds,
   //    }

   //    //creates the link and adds it to the documents linksFromThis list
   //    var link = WorkspaceManager.createLink(fromAddress, props.toAddress)

   //    var textBeforeSelection = bulletWithSelection.text.substr(0, selectionBounds[0])
   //    var textAfterSelection = bulletWithSelection.text.substr(selectionBounds[1])

   //    //surrounds the selected text with a span tag
   //    bulletWithSelection.text = textBeforeSelection + `<span data-link-id="${link.id}">` + selectedText + '</span>' + textAfterSelection

   //    //set cursor to the end of the selection and rebuild it
   //    //! bulletWithSelection.selectComponent(selectionBounds[1])
   //    // state.noteBody.rootBullet.updateComponent()

   //    //hide this menu
   //    dispatch(hideLinkMenu())

   //    dispatchAsync(trySaveDocument(true))

   //    //TODO save at end
   //    // NoteBody.queueSaveDocument(true)
   // }

   return <div className="link-menu__item">{/* <p onClick={handleClick}>{props.name}</p> */}</div>
}
