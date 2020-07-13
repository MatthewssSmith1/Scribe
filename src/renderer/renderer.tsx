import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Titlebar, Color } from 'custom-electron-titlebar'

import cx from 'classnames'

import WorkspaceManager from '@/main/workspace_manager'

import ActionPanel from '@/renderer/action_panel/action_panel'
import NoteBody from '@renderer/note_body/note_body'
import ContentPanel from '@renderer/content_panel/content_panel'
import LinkMenu from '@/renderer/link_menu/link_menu'

//import all scss files
import '@renderer/style.scss'

interface RootState {
   isActionPanelCollapsed: boolean
   isContentPanelCollapsed: boolean
   actionPanelWidth: number
   contentPanelWidth: number
   minContentPanelWidth: number
   shouldAnimateLeft: boolean
   isCtrlPressed: boolean
}

export default class RootComponent extends React.Component {
   private static _singleton: RootComponent

   state: RootState

   constructor(props: any) {
      super(props)

      RootComponent._singleton = this

      this.state = {
         isActionPanelCollapsed: false,
         isContentPanelCollapsed: true,

         actionPanelWidth: 224,
         contentPanelWidth: 350,
         minContentPanelWidth: 300,

         shouldAnimateLeft: true,

         isCtrlPressed: false,
      }

      document.addEventListener('keydown', event => {
         if (event.key == 'Control') this.setState({ isCtrlPressed: true })
      })
      document.addEventListener('keyup', event => {
         if (event.key == 'Control') this.setState({ isCtrlPressed: false })
      })
   }

   static toggleActionPanelCollapsed(newState?: boolean) {
      this._singleton.setState((state: RootState) => {
         return { shouldAnimateLeft: true, isActionPanelCollapsed: newState || !state.isActionPanelCollapsed }
      })
   }

   static toggleContentPanelCollapsed(newState?: boolean) {
      this._singleton.setState((state: RootState) => {
         return { shouldAnimateLeft: false, isContentPanelCollapsed: newState || !state.isContentPanelCollapsed }
      })
   }

   static setActionPanelWidth(newWidth: number) {
      this._singleton.setState({ shouldAnimateLeft: true, actionPanelWidth: newWidth })
   }

   static setContentPanelWidth(newWidth: number) {
      this._singleton.setState((state: RootState) => {
         return { shouldAnimateLeft: false, contentPanelWidth: Math.max(newWidth, state.minContentPanelWidth) }
      })
   }

   render() {
      var state = this.state

      return (
         <div id="root" className={cx({ 'ctrl-pressed': state.isCtrlPressed })}>
            <ActionPanel key="0" width={state.actionPanelWidth} isCollapsed={state.isActionPanelCollapsed} />
            <NoteBody
               key="1"
               shouldAnimateLeft={state.shouldAnimateLeft}
               actionPanelWidth={state.actionPanelWidth}
               contentPanelWidth={state.contentPanelWidth}
               isActionPanelCollapsed={state.isActionPanelCollapsed}
               isContentPanelCollapsed={state.isContentPanelCollapsed}
            />
            <ContentPanel key="2" width={state.contentPanelWidth} isCollapsed={state.isContentPanelCollapsed} />,
            <LinkMenu key="3" />
         </div>
      )
   }
}

//add titlebar to top of window
let titleBar = new Titlebar({
   backgroundColor: Color.fromHex('#4a6fa5'),
   overflow: 'hidden',
   unfocusEffect: false,
})
titleBar.updateTitle('Scribe')

ReactDOM.render(<RootComponent />, document.querySelector('.container-after-titlebar'))

//handles file loading
WorkspaceManager.init()
