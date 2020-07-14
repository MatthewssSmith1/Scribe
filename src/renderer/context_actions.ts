//* STATE
export const initCtxState = {
   actionPanel: {
      isCollapsed: true,
      width: 224,
   },
   contentPanel: {
      isCollapsed: false,
      width: 350,
   },
   keyboard: {
      isCtrlPressed: false,
   },
}
export type ContextState = typeof initCtxState

//* ACTIONS
const TOGGLE_ACTION_PANEL = 'TOGGLE_ACTION_PANEL'
export function toggleActionPanel() {
   return { type: TOGGLE_ACTION_PANEL }
}

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

//* REDUCER
export function contextReducer(state: ContextState, action: any): ContextState {
   switch (action.type) {
      case TOGGLE_ACTION_PANEL:
         return { ...state, actionPanel: { ...state.actionPanel, isCollapsed: !state.actionPanel.isCollapsed } }

      case TOGGLE_CONTENT_PANEL:
         return { ...state, contentPanel: { ...state.contentPanel, isCollapsed: !state.contentPanel.isCollapsed } }

      case RESIZE_CONTENT_PANEL:
         return { ...state, contentPanel: { ...state.contentPanel, width: action.width } }

      default:
         return state
   }
}
