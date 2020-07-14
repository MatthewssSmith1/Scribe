import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Titlebar, Color } from 'custom-electron-titlebar'

import cx from 'classnames'

import WorkspaceManager from '@/main/workspace_manager'

import ActionPanel from '@/renderer/action_panel/action_panel'
import NoteBody from '@renderer/note_body/note_body'
import ContentPanel, { initContentPanelCallbacks } from '@renderer/content_panel/content_panel'
import LinkMenu from '@/renderer/link_menu/link_menu'

import { createStore } from 'redux'
import { Provider, useSelector } from 'react-redux'
import allReducer from '@/reducers/root'
import { setIsCtrlPressed } from '@/actions/keyboard_actions'
import { selectIsCtrlPressed } from '@/reducers/keyboard_reducer'

//import all scss files
import '@renderer/style.scss'

const store = createStore(allReducer)

initContentPanelCallbacks(store)

document.addEventListener('keydown', event => {
   if (event.key == 'Control') store.dispatch(setIsCtrlPressed(true))
})
document.addEventListener('keyup', event => {
   if (event.key == 'Control') store.dispatch(setIsCtrlPressed(false))
})

function App() {
   var isCtrlPressed = useSelector(selectIsCtrlPressed)

   return (
      <div id="root" className={cx({ 'ctrl-pressed': isCtrlPressed })}>
         <ActionPanel key="0" />
         <NoteBody key="1" />
         <ContentPanel key="2" />,
         <LinkMenu key="3" />
      </div>
   )
}

//add titlebar to top of window
let titleBar = new Titlebar({
   backgroundColor: Color.fromHex('#4a6fa5'),
   overflow: 'hidden',
   unfocusEffect: false,
})
titleBar.updateTitle('Scribe')

ReactDOM.render(
   <Provider store={store}>
      <App />
   </Provider>,
   document.querySelector('.container-after-titlebar')
)

//handles file loading
WorkspaceManager.init()
