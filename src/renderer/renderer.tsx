import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Titlebar, Color } from 'custom-electron-titlebar'

import WorkspaceManager from '@/main/workspace_manager'

import ActionPanel from '@/renderer/action_panel/action_panel'
import NoteBody from '@renderer/note_body/note_body'
import ContentPanel from '@renderer/content_panel/content_panel'
import LinkMenu from '@/renderer/link_menu/link_menu'

//import all scss files
import '@renderer/style.scss'

export default class RootChildren {
   static isActionPanelCollapsed: boolean = false
   static isContentPanelCollapsed: boolean = true

   static actionPanelWidth: number = 224
   static contentPanelWidth: number = 350

   static rootElement: HTMLElement

   static toggleActionPanelCollapsed(newState?: boolean) {
      console.log('toggled action panel')

      this.isActionPanelCollapsed = newState || !this.isActionPanelCollapsed

      this.build()
   }

   static toggleContentPanelCollapsed(newState?: boolean) {
      this.isContentPanelCollapsed = newState || !this.isContentPanelCollapsed

      this.build()
   }

   static setActionPanelWidth(newWidth: number) {
      this.actionPanelWidth = newWidth

      this.build()
   }

   static setContentPanelWidth(newWidth: number) {
      this.contentPanelWidth = newWidth

      this.build()
   }

   static build() {
      if (!this.rootElement) this.rootElement = document.getElementById('root')

      ReactDOM.render(
         [
            <ActionPanel key="0" width={this.actionPanelWidth} isCollapsed={this.isActionPanelCollapsed} />,
            <NoteBody
               key="1"
               actionPanelWidth={this.actionPanelWidth}
               contentPanelWidth={this.contentPanelWidth}
               isActionPanelCollapsed={this.isActionPanelCollapsed}
               isContentPanelCollapsed={this.isContentPanelCollapsed}
            />,
            <ContentPanel key="2" width={this.contentPanelWidth} isCollapsed={this.isContentPanelCollapsed} />,
            <LinkMenu key="3" />,
         ],
         this.rootElement
      )
   }
}

// var root = document.getElementById('root')

// ReactDOM.render([<ActionPanel key="0" />, <NoteBody key="1" />, <ContentPanel key="2" />, <LinkMenu key="3" />], root)

RootChildren.build()

WorkspaceManager.init()

//keeps root ctrl-pressed class updated to reflect actual state of the key to allow for children of root to be styled differently if ctrl is pressed
document.addEventListener('keydown', event => {
   if (event.key == 'Control') RootChildren.rootElement.classList.add('ctrl-pressed')
})
document.addEventListener('keyup', event => {
   if (event.key == 'Control') RootChildren.rootElement.classList.remove('ctrl-pressed')
})

//add titlebar to top of window
let titleBar = new Titlebar({
   backgroundColor: Color.fromHex('#4a6fa5'),
})
titleBar.updateTitle('Scribe')
var rootContainer = document.querySelector('.container-after-titlebar') as HTMLElement
rootContainer.style.overflow = 'hidden'
