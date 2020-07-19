import { actionify, State, LinkMenuState, initialState } from '@renderer/state/context';

import Document from '@main/document'
import Bullet from '@main/bullet'

// #region Panels
export const toggleActionPanel = actionify((state: State) => {
   state.actionPanel.isCollapsed = !state.actionPanel.isCollapsed
})

export const toggleContentPanel = actionify((state: State) => {
   state.contentPanel.isCollapsed = !state.contentPanel.isCollapsed
})

export const resizeContentPanel = actionify((state: State, width: number) => {
   var windowWidth = window.innerWidth
   var { minWidthPercentage, maxWidthPercentage } = state.contentPanel

   var minWidth = windowWidth * minWidthPercentage
   var maxWidth = windowWidth * maxWidthPercentage

   state.contentPanel.width = Math.min(maxWidth, Math.max(minWidth, width))
})
// #endregion

// #region Note Body
export const loadDocument = actionify((state: State, document: Document, rootBullet: Bullet) => {
   state.noteBody = {
      document: document,
      rootBullet: rootBullet,
      focusedBullets: [...rootBullet.children],
      shouldSave: false,
      isRootSelected: true,
      bulletsKeyModifier: state.noteBody.bulletsKeyModifier * -1,
   }
})
export const enqueueSaveDocument = actionify((state: State) => {
   state.noteBody.shouldSave = true
})
export const dequeueSaveDocument = actionify((state: State) => {
   state.noteBody.shouldSave = false
})
export const documentSaveComplete = actionify((state: State) => {
   //? potentially implement subscribing to events and send it out from here
   state = state
})
export const focusBullet = actionify((state: State, bullet: Bullet) => {
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
export const selectBullet = actionify((state: State, bullet: Bullet, startIndex: number = 0, endIndex?: number) => {
   if (!endIndex) endIndex = startIndex

   state.selection = {
      bullet: bullet,
      startIndex: Math.min(startIndex, endIndex),
      endIndex: Math.max(startIndex, endIndex),
   }
})
// #endregion

// #region Link Menu
export const showLinkMenu = actionify((state: State, linkMenuState: LinkMenuState) => {
   state.linkMenu = linkMenuState
})
export const hideLinkMenu = actionify((state: State) => {
   state.linkMenu = initialState.linkMenu
})
// #endregion
