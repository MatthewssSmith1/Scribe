import * as React from 'react'
import Bullet from '@main/bullet'
import Link from '@main/link'
import WorkspaceManager from '@main/workspace_manager'

export default class LinkMenu extends React.Component {
   private static _singleton: LinkMenu

   state: {
      viewportPos: [number, number]
      bulletWithSelection: Bullet
      selectionBounds: [number, number]
      selectedText: string
      suggestedLinks: Array<[string, Link]>
   }

   constructor(props: {}) {
      super(props)

      LinkMenu._singleton = this
   }

   render(): JSX.Element {
      if (!this.state) return <div id="link-menu" />

      var children: Array<JSX.Element> = this.state.suggestedLinks.map((suggestion: [string, Link], i) => (
         <this.SuggestionItem name={suggestion[0]} link={suggestion[1]} key={i} />
      ))

      //if the selected text isn't an exact match to a file, add an item to the top of the suggestions for a new file
      if (this.state.suggestedLinks.find((suggestion: [string, Link]) => suggestion[0].toLowerCase() == this.state.selectedText.toLowerCase()) == undefined)
         children.unshift(<this.NewPageItem key={-1} />)

      return (
         <div id="link-menu" className="enabled" style={this.positionStyle}>
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

   SuggestionItem = (props: { name: string; link: Link }): JSX.Element => {
      return (
         <div className="link-menu__item">
            <p>{props.name}</p>
         </div>
      )
   }

   get positionStyle() {
      return {
         left: `${this.state.viewportPos[0]}px`,
         top: `${this.state.viewportPos[1]}px`,
      }
   }

   static handleEnterPressedOnSelection(bullet: Bullet, selection: Selection) {
      var selectedText = selection.toString()

      var selectionRect = selection.getRangeAt(0).getBoundingClientRect()

      this._singleton.setState({
         viewportPos: [selectionRect.left, selectionRect.bottom],
         bulletWithSelection: bullet,
         selectionBounds: [selection.anchorOffset, selection.focusOffset],
         selectedText: selectedText,
         suggestedLinks: WorkspaceManager.getSuggestedLinks(selectedText),
      })
   }
}
