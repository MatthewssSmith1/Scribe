import * as React from 'react'
import Icon from '@/renderer/other_components/icon'
import cx from 'classnames'

import { useSelector, useDispatch } from 'react-redux'

import * as ActionPanelActions from '@/actions/action_panel_actions'
import * as ContentPanelActions from '@/actions/content_panel_actions'

//the panel on the left of the document body that can be collapsed/expanded
export default function ActionPanel(props: any) {
   var width = useSelector((state: any) => state.actionPanel.width)
   var isCollapsed = useSelector((state: any) => state.actionPanel.isCollapsed)

   var style: React.CSSProperties = {
      left: isCollapsed ? `${-props.width}px` : '0px',
      width,
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
function ButtonRow() {
   const dispatch = useDispatch()

   return (
      <div className="button-row">
         <div className="search-icon-place-holder" />
         <Icon glyph="device_hub" onClick={() => {}} />
         <Icon glyph="note_add" onClick={() => {}} />
         <Icon glyph="settings" onClick={() => dispatch(ContentPanelActions.toggleCollapsed())} />
         <Icon glyph="arrow_back_ios" className="button-row__collapse-icon" onClick={() => dispatch(ActionPanelActions.toggleCollapsed())} />
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
