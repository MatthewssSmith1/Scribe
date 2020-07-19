import * as React from 'react'
import Icon from '@/renderer/other_components/icon'
import cx from 'classnames'

import { getContext } from '@/renderer/state/context'
import { toggleActionPanel, toggleContentPanel } from '@/renderer/state/context_actions'

//the panel on the left of the document body that can be collapsed/expanded
export default function ActionPanel() {
   const {state} = getContext()
   var { isCollapsed, width } = state.actionPanel

   var style = {
      left: isCollapsed ? `${-width}px` : '0px',
      width: width,
   }

   return (
      <div id="action-panel-wrapper" className={cx({ collapsed: isCollapsed })} style={style}>
         <div id="action-panel">
            <SearchBar />
            <ButtonRow />
         </div>
      </div>
   )
}

//the row of buttons at the top of the action panel (excluding the search icon, which is rendered above this row and by the SearchBar component)
var ButtonRow = () => {
   const {dispatch} = getContext()

   return (
      <div className="button-row">
         <div className="search-icon-place-holder" />
         <Icon glyph="device_hub" onClick={() => {}} />
         <Icon glyph="note_add" onClick={() => {}} />
         <Icon glyph="settings" onClick={() => dispatch(toggleContentPanel())} />
         <Icon glyph="arrow_back_ios" className="button-row__collapse-icon" onClick={() => dispatch(toggleActionPanel())} />
      </div>
   )
}

//the search icon on the top left of the action panel which expands into the search bar
function SearchBar(): JSX.Element {
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
