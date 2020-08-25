import React from 'react'
import * as ReactDOM from 'react-dom'
import { Titlebar, Color } from 'custom-electron-titlebar'
import showdown from 'showdown'

import ActionBar from '@/renderer/action_bar/action_bar'
import SidePanel from '@/renderer/side_panel/side_panel'
import LinkMenu from '@/renderer/link_menu/link_menu'
import ContentBody from '@/renderer/content_body/content_body'

//import all scss files and font
require('typeface-montserrat')
import '@/renderer/style.scss'

//#region Mark Down
showdown.setOption('emoji', true)
showdown.setOption('backslashEscapesHTMLTags', true)
showdown.setOption('strikethrough', true)
showdown.setOption('headerLevelStart', 3)
showdown.setOption('requireSpaceBeforeHeadingText', true)
export const markDownConverter = new showdown.Converter() //{ extensions: ['youtube'] }
//#endregion

//#region Titlebar
let titleBar = new Titlebar({
   backgroundColor: Color.fromHex('#4a6fa5'),
   overflow: 'hidden',
   unfocusEffect: false,
})
titleBar.updateTitle('Scribe')
//#endregion

ReactDOM.render(
   <div id="root">
      <ActionBar />
      <ContentBody />
      <SidePanel />
      <LinkMenu />
   </div>,
   document.querySelector('.container-after-titlebar')
)

//#region Input Initialization
//allow for different css behavior when ctrl is clicked
document.addEventListener('keydown', (e: KeyboardEvent) => {
   if (e.key == 'Control') document.body.classList.add('ctrl-is-pressed')
})

document.addEventListener('keyup', (e: KeyboardEvent) => {
   if (e.key == 'Control') document.body.classList.remove('ctrl-is-pressed')
})

//disable dragging of things into bullets
document.body.ondragstart = () => false
document.body.ondrop = () => false
//#endregion
