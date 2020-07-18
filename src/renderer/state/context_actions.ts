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
export type ContextStateType = typeof initCtxState
export type LinkMenuState = typeof initCtxState.linkMenu
export type NoteBodyState = typeof initCtxState.noteBody
export type SelectionState = typeof initCtxState.selection

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

//selection
export function selectBullet(bullet: Bullet, startIndex: number = 0, endIndex?: number) {
   if (!endIndex) endIndex = startIndex
   else if (endIndex < startIndex) {
      //ensure that startIndex is before endIndex
      var temp = endIndex
      endIndex = startIndex
      startIndex = temp
   }

   return {
      type: selectBullet.name,
      bullet,
      startIndex,
      endIndex,
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
               bulletsKeyModifier: state.noteBody.bulletsKeyModifier * -1,
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

      case documentSaveComplete.name:
         //? potentially implement subscribing to events and send it out from here
         return state

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

      case selectBullet.name:
         return {
            ...state,
            selection: {
               bullet: action.bullet,
               startIndex: action.startIndex,
               endIndex: action.endIndex,
            },
         }

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
