import * as React from 'react'
import Icon from '@/renderer/other_components/icon'

import cx from 'classnames'
import Bullet from '@/main/bullet'

export default class ActionPanel extends React.Component {
   state: {
      collapsed: boolean
   }

   workspaceRoot: Bullet

   constructor(props: {}) {
      super(props)

      var isCollapsed = true
      document.getElementById('root').classList.toggle('action-panel-collapsed', isCollapsed)

      this.state = { collapsed: isCollapsed }
   }

   toggleCollapsed = () => {
      var root: HTMLElement = document.getElementById('root')

      root.classList.toggle('action-panel-collapsed')
      this.setState({ collapsed: root.classList.contains('action-panel-collapsed') })
   }

   render(): JSX.Element {
      return (
         <div id="action-panel">
            <this.SearchBar />
            <this.ButtonRow />
         </div>
      )
   }

   ButtonRow = () => {
      return (
         <div className="button-row">
            <div className="search-icon-place-holder" />
            <Icon glyph="device_hub" onClick={() => {}} />
            <Icon glyph="note_add" onClick={() => {}} />
            <Icon glyph="settings" onClick={() => {}} />
            <Icon
               glyph="arrow_back_ios"
               className={cx('button-row__collapse-icon', { 'parent-collapsed': this.state.collapsed })}
               onClick={this.toggleCollapsed}
            />
         </div>
      )
   }

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
