import { createAction, State, LinkMenuState, initialState } from '@renderer/state/context'

import Document from '@main/document'
import Bullet from '@main/bullet'

// #region Panels
export const toggleActionPanel = createAction((state: State) => {
   state.actionPanel.isCollapsed = !state.actionPanel.isCollapsed
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
// #endregion

// #region Note Body
export const loadDocument = createAction((state: State, document: Document, rootBullet: Bullet) => {
   state.noteBody = {
      document: document,
      rootBullet: rootBullet,
      focusedBullets: [...rootBullet.children],
      shouldSave: false,
      isRootSelected: true,
      bulletsKeyModifier: state.noteBody.bulletsKeyModifier * -1,
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

export const focusBullet = createAction((state: State, bullet: Bullet) => {
   var isRootSelected = bullet == state.noteBody.rootBullet
   var focusedBullets = isRootSelected ? [...bullet.children] : [bullet]

   state.noteBody = {
      ...state.noteBody,
      isRootSelected,
      focusedBullets,
   }
})
// #endregion

// #region Selection
export const selectBullet = createAction((state: State, bullet: Bullet, startIndex: number = 0, endIndex?: number) => {
   if (!endIndex) endIndex = startIndex

   state.selection = {
      bullet: bullet,
      startIndex: Math.min(startIndex, endIndex),
      endIndex: Math.max(startIndex, endIndex),
   }
})
// #endregion

// #region Link Menu
export const showLinkMenu = createAction((state: State, linkMenuState: LinkMenuState) => {
   state.linkMenu = linkMenuState
})
export const hideLinkMenu = createAction((state: State) => {
   state.linkMenu = initialState.linkMenu
})
// #endregion
