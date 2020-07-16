import Document from '@main/document'
import Bullet from '@main/bullet'
import { ToAddress } from '@main/link'

//these values are used in initCtxState to have them defaulted to null and have types
var initDoc: Document = null
var initRootBullet: Bullet = null
var initFocusedBullets: Array<Bullet> = null
var initShouldSave: boolean = null
var initIsRootSelected: boolean = null

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
      shouldSave: initShouldSave,
      isRootSelected: initIsRootSelected,
   },
   keyboard: {
      isCtrlPressed: false,
   },
   linkMenu: {
      isHidden: true,
      viewportPos: null as [number, number],
      bulletWithSelection: null as Bullet,
      selectionBounds: null as [number, number],
      selectedText: [null as string],
      suggestedLinks: [null as Array<[string, ToAddress]>],
   },
}
export type ContextStateType = typeof initCtxState
export type LinkMenuState = typeof initCtxState.linkMenu

//* ACTIONS

//action panel
export function toggleActionPanel() {
   return {
      type: toggleActionPanel.name,
   }
}

//content panel
export function toggleContentPanel() {
   return {
      type: toggleContentPanel.name,
   }
}
export function resizeContentPanel(width: number) {
   return {
      type: resizeContentPanel.name,
      width,
   }
}

//note body
export function loadDocument(document: Document, rootBullet: Bullet) {
   return {
      type: loadDocument.name,
      document,
      rootBullet,
   }
}
export function enqueueSaveDocument() {
   return {
      type: enqueueSaveDocument.name,
   }
}
export function dequeueSaveDocument() {
   return {
      type: dequeueSaveDocument.name,
   }
}
export function documentSaveComplete() {
   return {
      type: documentSaveComplete.name,
   }
}
export function focusBullet(bullet: Bullet) {
   return {
      type: focusBullet.name,
      bullet,
   }
}
export function addFocusBulletToIndex(bullet: Bullet, index: number) {
   return {
      type: addFocusBulletToIndex.name,
      bullet,
      index,
   }
}
export function removeFocusedBullet(index: number) {
   return {
      type: removeFocusedBullet.name,
      index,
   }
}

//link menu
export function showLinkMenu(state: LinkMenuState) {
   return {
      type: showLinkMenu.name,
      state,
   }
}
export function hideLinkMenu() {
   return {
      type: hideLinkMenu.name,
   }
}

//* REDUCER
export function contextReducer(state: ContextStateType, action: any): ContextStateType {
   switch (action.type) {
      //* panels
      case toggleActionPanel.name:
         return {
            ...state,
            actionPanel: {
               ...state.actionPanel,
               isCollapsed: !state.actionPanel.isCollapsed,
            },
         }

      case toggleContentPanel.name:
         return {
            ...state,
            contentPanel: {
               ...state.contentPanel,
               isCollapsed: !state.contentPanel.isCollapsed,
            },
         }

      case resizeContentPanel.name:
         var minWidth = window.innerWidth * state.contentPanel.minWidthPercentage
         var maxWidth = window.innerWidth * state.contentPanel.maxWidthPercentage
         var newWidth = Math.min(maxWidth, Math.max(minWidth, action.width))
         return {
            ...state,
            contentPanel: {
               ...state.contentPanel,
               width: newWidth,
            },
         }

      //* note body
      case loadDocument.name:
         return {
            ...state,
            noteBody: {
               document: action.document,
               rootBullet: action.rootBullet,
               focusedBullets: [...action.rootBullet.children],
               shouldSave: false,
               isRootSelected: true,
            },
         }

      case enqueueSaveDocument.name:
         return {
            ...state,
            noteBody: {
               ...state.noteBody,
               shouldSave: true,
            },
         }

      case dequeueSaveDocument.name:
         return {
            ...state,
            noteBody: {
               ...state.noteBody,
               shouldSave: false,
            },
         }

      case focusBullet.name:
         var isRootSelected = action.bullet == state.noteBody.rootBullet
         var focusedBullets = isRootSelected ? [...action.bullet.children] : [action.bullet]
         return {
            ...state,
            noteBody: {
               ...state.noteBody,
               focusedBullets,
               isRootSelected,
            },
         }

      case addFocusBulletToIndex.name:
         var newFocusedBullets = state.noteBody.focusedBullets
         newFocusedBullets.splice(action.index, 0, action.bullet)
         return {
            ...state,
            noteBody: {
               ...state.noteBody,
               focusedBullets: newFocusedBullets,
            },
         }

      case removeFocusedBullet.name:
         var newFocusedBullets = state.noteBody.focusedBullets
         newFocusedBullets.splice(action.index, 1)
         return {
            ...state,
            noteBody: {
               ...state.noteBody,
               focusedBullets: newFocusedBullets,
            },
         }

      case documentSaveComplete.name:
         //? potentially implement subscribing to events and send it out from here
         return state

      //* Link Menu
      case showLinkMenu.name:
         return {
            ...state,
            linkMenu: action.state as LinkMenuState,
         }

      case hideLinkMenu.name:
         return {
            ...state,
            linkMenu: initCtxState.linkMenu,
         }

      //* default
      default:
         return state
   }
}
