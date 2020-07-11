import * as React from 'react'
import Icon from '@/renderer/other_components/icon'

//the panel on the left of the document body that can be collapsed/expanded
export default class ActionPanel extends React.Component {
   constructor(props: {}) {
      super(props)

      document.getElementById('root').classList.add('action-panel-collapsed')
   }

   render(): JSX.Element {
      return (
         <div id="action-panel">
            <this.SearchBar />
            <this.ButtonRow />
         </div>
      )
   }

   //the row of buttons at the top of the action panel (excluding the search icon, which is rendered above this row and by the SearchBar component)
   ButtonRow() {
      return (
         <div className="button-row">
            <div className="search-icon-place-holder" />
            <Icon glyph="device_hub" onClick={() => {}} />
            <Icon glyph="note_add" onClick={() => {}} />
            <Icon glyph="settings" onClick={() => {}} />
            <Icon
               glyph="arrow_back_ios"
               className="button-row__collapse-icon"
               onClick={() => document.getElementById('root').classList.toggle('action-panel-collapsed')}
            />
         </div>
      )
   }

   //the search icon on the top left of the action panel which expands into the search bar
   SearchBar(): JSX.Element {
      return (
         <div className="search-bar-wrapper">
            <div className="search-bar">
               <input type="text" placeholder="search" className="search-bar__input"></input>
               <Icon glyph="search" className="search-bar__search-icon" />
               <Icon glyph="close" className="search-bar__close-icon" />
            </div>
         </div>
      )
   }
}
