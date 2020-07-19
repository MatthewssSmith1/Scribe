import Document from '@main/document'
import Bullet from '@main/bullet'
import { ToAddress } from '@main/link'

//* STATE
export const initCtxState = {
   actionPanel: {
      isCollapsed: true,
      width: 224,
   },
   contentPanel: {
      isCollapsed: true,
      width: 350,
      minWidthPercentage: 0.2,
      maxWidthPercentage: 0.6,
   },
   noteBody: {
      document: null as Document,
      rootBullet: null as Bullet,
      focusedBullets: null as Array<Bullet>,
      shouldSave: null as boolean,
      isRootSelected: null as boolean,
      bulletsKeyModifier: 1,
   },
   linkMenu: {
      isHidden: true,
      viewportPos: null as [number, number],
      bulletWithSelection: null as Bullet,
      selectionBounds: null as [number, number],
      selectedText: null as string,
      suggestedLinks: null as Array<[string, ToAddress]>,
   },
   selection: {
      bullet: null as Bullet,
      startIndex: null as number,
      endIndex: null as number,
   },
}
export type State = typeof initCtxState
export type LinkMenuState = typeof initCtxState.linkMenu
export type NoteBodyState = typeof initCtxState.noteBody
export type SelectionState = typeof initCtxState.selection

export type Action = (s: State) => void

function actionify<T extends any[]>(callback: (state: State, ...restParams: T) => void): (...t: T) => Action {
   return (...params: T) => state => callback(state, ...params)
}

export const contextReducer = (state: State, action: Action): State => {
   var newState = { ...state }
   action(newState)
   return newState
}

//* ACTIONS///
//* //////////
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
   state.linkMenu = initCtxState.linkMenu
})
// #endregion
