//* STATE
export const initialState = {
   actionPanel: {
      isCollapsed: true,
      width: 224,
   },
   contentPanel: {
      isCollapsed: false,
      width: 350,
      minWidth: 300,
   },
   keyboard: {
      isCtrlPressed: false,
   },
}
export type State = typeof initialState

//* ACTIONS
const TOGGLE_ACTION_PANEL = 'TOGGLE_ACTION_PANEL'
export function toggleActionPanel() {
   return { type: TOGGLE_ACTION_PANEL }
}

const TOGGLE_CONTENT_PANEL = 'TOGGLE_CONTENT_PANEL'
export function toggleContentPanel() {
   return { type: TOGGLE_CONTENT_PANEL }
}

//* REDUCER
export function contextReducer(state: typeof initialState, action): typeof initialState {
   switch (action.type) {
      case TOGGLE_ACTION_PANEL:
         return { ...state, actionPanel: { ...state.actionPanel, isCollapsed: !state.actionPanel.isCollapsed } }

      case TOGGLE_CONTENT_PANEL:
         return { ...state, contentPanel: { ...state.contentPanel, isCollapsed: !state.contentPanel.isCollapsed } }

      default:
         return state
   }
}
