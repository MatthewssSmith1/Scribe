// ACTIONS
const TOGGLE_COLLAPSED = 'TOGGLE_COLLAPSED'

interface ToggleCollapsedAction {
   type: typeof TOGGLE_COLLAPSED
}

export function toggleCollapsed() {
   return {
      type: TOGGLE_COLLAPSED,
   }
}

// REDUCER
interface State {
   isCollapsed: boolean
   width: number
}

const defaultState: State = {
   isCollapsed: true,
   width: 224,
}

export default function actionPanelReducer(state: State = defaultState, action: ToggleCollapsedAction) {
   switch (action.type) {
      case TOGGLE_COLLAPSED:
         return { ...state, isCollapsed: !state.isCollapsed }

      default:
         return state
   }
}
