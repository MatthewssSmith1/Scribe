import Document from '@main/document'
import Bullet from '@main/bullet'
import WorkspaceManager from '../main/workspace_manager'

//these values are used in initCtxState to have them defaulted to null and have types
var initDoc: Document = null
var initRootBullet: Bullet = null
var initFocusedBullets: Array<Bullet> = null

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
      document: initDoc,
      rootBullet: initRootBullet,
      focusedBullets: initFocusedBullets,
      shouldSave: false,
   },
   keyboard: {
      isCtrlPressed: false,
   },
}
export type ContextState = typeof initCtxState

//* ACTIONS

//action panel
const TOGGLE_ACTION_PANEL = 'TOGGLE_ACTION_PANEL'
export function toggleActionPanel() {
   return { type: TOGGLE_ACTION_PANEL }
}

//content panel
const TOGGLE_CONTENT_PANEL = 'TOGGLE_CONTENT_PANEL'
export function toggleContentPanel() {
   return { type: TOGGLE_CONTENT_PANEL }
}
const RESIZE_CONTENT_PANEL = 'RESIZE_CONTENT_PANEL'
export function resizeContentPanel(width: number) {
   return {
      type: RESIZE_CONTENT_PANEL,
      width,
   }
}

//note body
const ENQUEUE_SAVE_DOCUMENT = 'ENQUEUE_SAVE_DOCUMENT'
export function enqueueSaveDocument() {
   return { type: ENQUEUE_SAVE_DOCUMENT }
}
const LOAD_DOCUMENT = 'LOAD_DOCUMENT'
export function loadDocument(document: Document, rootBullet: Bullet) {
   return {
      type: LOAD_DOCUMENT,
      document,
      rootBullet,
   }
}

//* REDUCER
export function contextReducer(state: ContextState, action: any): ContextState {
   switch (action.type) {
      case TOGGLE_ACTION_PANEL:
         return { ...state, actionPanel: { ...state.actionPanel, isCollapsed: !state.actionPanel.isCollapsed } }

      case TOGGLE_CONTENT_PANEL:
         return { ...state, contentPanel: { ...state.contentPanel, isCollapsed: !state.contentPanel.isCollapsed } }

      case RESIZE_CONTENT_PANEL:
         var minWidth = window.innerWidth * state.contentPanel.minWidthPercentage
         var maxWidth = window.innerWidth * state.contentPanel.maxWidthPercentage
         var newWidth = Math.min(maxWidth, Math.max(minWidth, action.width))
         return { ...state, contentPanel: { ...state.contentPanel, width: newWidth } }

      case ENQUEUE_SAVE_DOCUMENT:
         return { ...state, noteBody: { ...state.noteBody, shouldSave: true } }

      case LOAD_DOCUMENT:
         var nb = {
            document: action.document,
            rootBullet: action.rootBullet,
            focusedBullets: [...action.rootBullet.children],
            shouldSave: false,
         }
         return { ...state, noteBody: nb }

      default:
         return state
   }
}
