import React from 'react'
import * as ReactDOM from 'react-dom'
import { Titlebar, Color } from 'custom-electron-titlebar'

import ActionPanel from '@/renderer/action_panel/action_panel'
import NoteBody from '@/renderer/note_page/note_page'
import ContentPanel from '@renderer/content_panel/content_panel'
import LinkMenu from '@/renderer/link_menu/link_menu'
import GraphPage from '@renderer/graph_page/graph_page'

import { ContextProvider, GlobalContext, Context, Page, State } from '@renderer/state/context'

//import all scss files
import '@renderer/style.scss'

//add titlebar to top of window
let titleBar = new Titlebar({
   backgroundColor: Color.fromHex('#4a6fa5'),
   overflow: 'hidden',
   unfocusEffect: false,
})
titleBar.updateTitle('Scribe')

class ContentBody extends React.Component {
   static contextType = GlobalContext

   render() {
      var { state } = this.context as Context

      var activePage = state.contentBody.activePage

      return activePage == Page.Note ? <NoteBody /> : <GraphPage />
   }
}

ReactDOM.render(
   <ContextProvider>
      <div id="root">
         <ActionPanel key="0" />
         {/* <NoteBody key="1" /> */}
         <ContentBody key="1" />
         <ContentPanel key="2" />
         <LinkMenu key="3" />
      </div>
   </ContextProvider>,
   document.querySelector('.container-after-titlebar')
)
