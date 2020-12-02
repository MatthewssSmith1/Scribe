import React from 'react'
import * as ReactDOM from 'react-dom'
import { Titlebar, Color } from 'custom-electron-titlebar'
import showdown from 'showdown'

import ActionBar from '@/components/action_bar/action_bar'
import SidePanel from '@/components/side_panel/side_panel'
import LinkMenu from '@/components/link_menu/link_menu'
import ContentBody from '@/components/content_body/content_body'
import RustInterface, { BindingEvent, BindingEventType } from '@/rust_interface'

//import all scss files and font
require('typeface-montserrat')
import '@/style.scss'

//#region Mark Down
showdown.setOption('emoji', true)
showdown.setOption('backslashEscapesHTMLTags', true)
showdown.setOption('strikethrough', true)
showdown.setOption('headerLevelStart', 3)
showdown.setOption('requireSpaceBeforeHeadingText', true)

var getExtensions = (): Array<showdown.ShowdownExtension> => {
   return [
      {
         type: 'lang',
         regex: /\[\[(.*?)\]\]/g,
         replace: '<a data-link="$1">[[$1]]</a>',
      },
   ]
}

export const markDownConverter = new showdown.Converter({ extensions: getExtensions() }) //{ extensions: ['youtube'] }
//#endregion

//#region Titlebar
let titleBar = new Titlebar({
   backgroundColor: Color.fromHex('#4a6fa5'),
   overflow: 'hidden',
   unfocusEffect: false,
})
titleBar.updateTitle('Scribe')
//#endregion

RustInterface.init();
RustInterface.processEvent(new BindingEvent(BindingEventType.GraphOpened, ["231", "hello"]));

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
