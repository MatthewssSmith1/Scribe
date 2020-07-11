import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Titlebar, Color } from 'custom-electron-titlebar'

import WorkspaceManager from '@/main/workspace_manager'

import ActionPanel from '@/renderer/action_panel/action_panel'
import NoteBody from '@renderer/note_body/note_body'
import ContentPanel from '@renderer/content_panel/content_panel'
import LinkMenu from '@renderer/note_body/link_menu/link_menu'

ReactDOM.render([<ActionPanel key="0" />, <NoteBody key="1" />, <ContentPanel key="2" />, <LinkMenu key="3" />], document.getElementById('root'))

WorkspaceManager.init()

// document.getElementById('root').classList.add('content-panel-collapsed')

let titleBar = new Titlebar({
   backgroundColor: Color.fromHex('#4a6fa5'),
})
titleBar.updateTitle('Scribe')
import '@renderer/style.scss'
