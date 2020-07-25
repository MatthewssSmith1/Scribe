import { createAction, State, LinkMenuState, initialState, Page } from '@renderer/state/context'

import Document from '@main/document'
import Bullet from '@main/bullet'

//#region Content Body
export const openGraphPage = createAction((state: State) => {
   state.contentBody.activePage = Page.Graph
   state.actionPanel.isCollapsed = true
   state.contentPanel.isCollapsed = true
})
export const openNotePage = createAction((state: State) => {
   state.contentBody.activePage = Page.Note
})
//#endregion

//#region Panels
export const toggleActionPanel = createAction((state: State, _isCollapsed?: boolean) => {
   state.actionPanel.isCollapsed = _isCollapsed || !state.actionPanel.isCollapsed
})

export const toggleContentPanel = createAction((state: State) => {
   state.contentPanel.isCollapsed = !state.contentPanel.isCollapsed
})

export const resizeContentPanel = createAction((state: State, width: number) => {
   var windowWidth = window.innerWidth
   var { minWidthPercentage, maxWidthPercentage } = state.contentPanel

   var minWidth = windowWidth * minWidthPercentage
   var maxWidth = windowWidth * maxWidthPercentage

   state.contentPanel.width = Math.min(maxWidth, Math.max(minWidth, width))
})
//#endregion

//#region Note Body
export const loadDocument = createAction((state: State, document: Document) => {
   state.noteBody = {
      document: document,
      headNode: document.getNodeHead(),
      shouldSave: false,
      updateCallback: state.noteBody.updateCallback,
      isLinkListCollapsed: false,
   }
})

export const toggleLinkList = createAction((state: State, _isCollapsed?: boolean) => {
   if (!_isCollapsed) _isCollapsed = !state.noteBody.isLinkListCollapsed

   state.noteBody.isLinkListCollapsed = _isCollapsed
})

export const enqueueSaveDocument = createAction((state: State) => {
   state.noteBody.shouldSave = true
})
export const dequeueSaveDocument = createAction((state: State) => {
   state.noteBody.shouldSave = false
})
export const documentSaveComplete = createAction((state: State) => {
   //? potentially implement subscribing to events and send it out from here
   state = state
})
export const setUpdateNoteCallback = createAction((state: State, callback: () => void) => {
   state.noteBody.updateCallback = callback
})
//#endregion

//#region Selection
export const selectBullet = createAction((state: State, bullet: Bullet, startIndex: number = 0, endIndex?: number) => {
   if (!endIndex) endIndex = startIndex

   state.selection = {
      bullet: bullet,
      startIndex: Math.min(startIndex, endIndex),
      endIndex: Math.max(startIndex, endIndex),
   }
})
//#endregion

//#region Link Menu
export const showLinkMenu = createAction((state: State, linkMenuState: LinkMenuState) => {
   state.linkMenu = linkMenuState
})
export const hideLinkMenu = createAction((state: State) => {
   state.linkMenu = initialState.linkMenu
})
//#endregion
