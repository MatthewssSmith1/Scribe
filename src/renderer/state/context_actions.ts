import Document from '@main/document'
import Bullet from '@main/bullet'

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
      isRootSelected: false,
   },
   keyboard: {
      isCtrlPressed: false,
   },
}
export type ContextStateType = typeof initCtxState

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
         var focusedBullets = action.bullet == state.noteBody.rootBullet ? [...action.bullet.children] : [action.bullet]
         return {
            ...state,
            noteBody: {
               ...state.noteBody,
               focusedBullets,
            },
         }

      case documentSaveComplete.name:
         //? potentially implement subscribing to events and send it out from here
         return state

      //* default
      default:
         return state
   }
}
