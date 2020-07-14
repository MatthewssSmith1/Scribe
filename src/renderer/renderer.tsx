import * as React from 'react'
import { useState } from 'react'
import * as ReactDOM from 'react-dom'
import { Titlebar, Color } from 'custom-electron-titlebar'

import WorkspaceManager from '@/main/workspace_manager'

import ActionPanel from '@/renderer/action_panel/action_panel'
import NoteBody from '@renderer/note_body/note_body'
import ContentPanel from '@renderer/content_panel/content_panel'
import LinkMenu from '@/renderer/link_menu/link_menu'

import { ContextProvider } from './context'

//import all scss files
import '@renderer/style.scss'

//add titlebar to top of window
let titleBar = new Titlebar({
   backgroundColor: Color.fromHex('#4a6fa5'),
   overflow: 'hidden',
   unfocusEffect: false,
})
titleBar.updateTitle('Scribe')

ReactDOM.render(
   <ContextProvider>
      <div id="root">
         <ActionPanel key="0" />
         <NoteBody key="1" />
         <ContentPanel key="2" />
         <LinkMenu key="3" />
      </div>
   </ContextProvider>,
   document.querySelector('.container-after-titlebar')
)

//handles file loading
WorkspaceManager.init()
