import * as React from 'react'
import Icon from '@/renderer/other_components/icon'
import RootChildren from '../renderer'
import cx from 'classnames'

//the panel on the left of the document body that can be collapsed/expanded
export default class ActionPanel extends React.Component {
   props: {
      width: number
      isCollapsed: boolean
   }

   render(): JSX.Element {
      return (
         <div id="action-panel-wrapper" className={cx({ collapsed: this.props.isCollapsed })} style={this.getStyle()}>
            <div id="action-panel">
               <this.SearchBar />
               <this.ButtonRow />
            </div>
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
            <Icon glyph="settings" onClick={() => RootChildren.toggleContentPanelCollapsed()} />
            <Icon glyph="arrow_back_ios" className="button-row__collapse-icon" onClick={() => RootChildren.toggleActionPanelCollapsed()} />
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

   getStyle() {
      var props = this.props

      return {
         left: props.isCollapsed ? `${-props.width}px` : '0px',
         width: props.width,
      }
   }
}
