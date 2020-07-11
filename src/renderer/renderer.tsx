import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Titlebar, Color } from 'custom-electron-titlebar'

import WorkspaceManager from '@/main/workspace_manager'

import ActionPanel from '@/renderer/action_panel/action_panel'
import NoteBody from '@renderer/note_body/note_body'
import ContentPanel from '@renderer/content_panel/content_panel'
import LinkMenu from '@renderer/note_body/link_menu/link_menu'

//import all scss files
import '@renderer/style.scss'

var root = document.getElementById('root')

ReactDOM.render([<ActionPanel key="0" />, <NoteBody key="1" />, <ContentPanel key="2" />, <LinkMenu key="3" />], root)

WorkspaceManager.init()

//keeps root ctrl-pressed class updated to reflect actual state of the key to allow for children of root to be styled differently if ctrl is pressed
document.addEventListener('keydown', event => {
   if (event.key == 'Control') root.classList.add('ctrl-pressed')
})
document.addEventListener('keyup', event => {
   if (event.key == 'Control') root.classList.remove('ctrl-pressed')
})

//add titlebar to top of window
let titleBar = new Titlebar({
   backgroundColor: Color.fromHex('#4a6fa5'),
})
titleBar.updateTitle('Scribe')
var rootContainer = document.querySelector('.container-after-titlebar') as HTMLElement
rootContainer.style.overflow = 'hidden'
