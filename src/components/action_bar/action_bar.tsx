import * as React from 'react'
import Icon from '@/components/icon/icon'
import cx from 'classnames'

import SidePanel from '@/components/side_panel/side_panel'

import SearchResultList from '@/components/action_bar/search_result_list/search_result_list'
import PinList from '@/components/action_bar/pin_list/pin_list'
import ContentBody from '@/components/content_body/content_body'

import RustInterface, { generateEvent } from '@/rust-bindings/rust_interface'
import {Event, EventType, EventListener } from '@/rust-bindings/binding_event'

type ActionBarState = {
   isCollapsed: boolean
   searchValue: string
   searchResults: Array<[string, Function]>
}

//the panel on the left of the document body that can be collapsed/expanded
export default class ActionBar extends React.Component implements EventListener {
   //#region State
   private static _SINGLETON: ActionBar

   state: ActionBarState

   constructor(props: any) {
      super(props)

      RustInterface.subscribe(this, EventType.GraphOpened)

      ActionBar._SINGLETON = this

      this.state = {
         isCollapsed: true,
         searchValue: null,
         searchResults: null,
      }
   }

   handleEvent(e: Event) {
      if (e.type == EventType.GraphOpened) ContentBody.openGraphPage()
   }

   //only rebuild the ActionBar component hierarchy when searchValue becomes null or not null (changing from "a" to "ab" doesn't rebuild)
   shouldComponentUpdate(_nextProps: any, nextState: ActionBarState) {
      return (this.state.searchValue == null) != (nextState.searchValue == null)
   }
   //#endregion

   //#region Getters & Setters
   static get isCollapsed(): boolean {
      return this._SINGLETON.state.isCollapsed
   }

   //does not rebuild html, see shouldComponentUpdate
   static set isCollapsed(_isCollapsed: boolean) {
      //stores it in state for the next rebuild
      this._SINGLETON.setState({ isCollapsed: _isCollapsed })

      //modifies the class list in the front facing HTML independent of React
      var classList = document.querySelector('#action-panel-wrapper').classList
      if (_isCollapsed) {
         classList.add('collapsed')
      } else {
         classList.remove('collapsed')
      }
   }

   static toggleIsCollapsed(): void {
      this.isCollapsed = !this.isCollapsed
   }

   static set search(search: { searchValue: string; searchResults: Array<[string, Function]> }) {
      this._SINGLETON.setState(search)
   }
   //#endregion

   render() {
      return (
         <div id="action-panel-wrapper" className={cx({ collapsed: this.state.isCollapsed })}>
            <div id="action-panel">
               <SearchBar />
               <ButtonRow />
               {this.state.searchValue == null ? <PinList /> : <SearchResultList />}
            </div>
         </div>
      )
   }
}

//the row of buttons at the top of the action panel (excluding the search icon, which is rendered above this row and by the SearchBar component)
var ButtonRow = () => {
   return (
      <div className="button-row">
         <div className="search-icon-place-holder" />
         <Icon glyph="device_hub" onClick={() => generateEvent(EventType.GraphOpened)} />
         <Icon glyph="calendar_today" onClick={ContentBody.openNotePage} />
         <Icon glyph="settings" onClick={SidePanel.toggleIsCollapsed} />
         <Icon glyph="arrow_back_ios" className="button-row__collapse-icon" onClick={() => ActionBar.toggleIsCollapsed()} />
      </div>
   )
}

//the search icon on the top left of the action panel which expands into the search bar
class SearchBar extends React.Component {
   render() {
      var input = (
         <input
            type="text"
            placeholder="search"
            className="search-bar__input"
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
         ></input>
      )

      return (
         <div className="search-bar-wrapper">
            <div className="search-bar">
               {input}
               <Icon glyph="search" className="search-bar__search-icon" />
               <Icon glyph="close" className="search-bar__close-icon" />
            </div>
         </div>
      )
   }

   handleFocus = () => {
      document.querySelector('#action-panel').classList.add('search-expanded')

      ActionBar.search = { searchValue: null, searchResults: null }
   }

   handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      document.querySelector('#action-panel').classList.remove('search-expanded')

      ActionBar.search = { searchValue: null, searchResults: null }

      var input = e.target as HTMLInputElement

      input.value = ''
   }

   handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      var searchValue = e.target.value

      if (searchValue == '') searchValue = null

      if (searchValue) SearchResultList.updateUI()

      ActionBar.search = { searchValue, searchResults: null }
   }
}
