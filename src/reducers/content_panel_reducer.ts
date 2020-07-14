import { useSelector, TypedUseSelectorHook } from 'react-redux'

// ACTIONS
const SET_IS_DRAGGING = 'SET_IS_DRAGGING'
interface SetIsDraggingAction {
   type: typeof SET_IS_DRAGGING
   isDragging: boolean
}
export function setIsDragging(isDragging: boolean): SetIsDraggingAction {
   return {
      type: SET_IS_DRAGGING,
      isDragging,
   }
}

const TOGGLE_COLLAPSED = 'TOGGLE_COLLAPSED'
interface ToggleCollapsedAction {
   type: typeof TOGGLE_COLLAPSED
}
export function toggleCollapsed(): ToggleCollapsedAction {
   return {
      type: TOGGLE_COLLAPSED,
   }
}

const RESIZE = 'RESIZE'
interface ResizeAction {
   type: typeof RESIZE
   newWidth: number
}
export function resize(newWidth: number): ResizeAction {
   return {
      type: RESIZE,
      newWidth,
   }
}

// REDUCER
export interface State {
   isDragging: boolean
   isCollapsed: boolean
   width: number
   minWidth: number
}

const defaultState = {
   isDragging: false,
   isCollapsed: true,
   width: 350,
   minWidth: 300,
}

export default function contentPanelReducer(state: State = defaultState, action: ToggleCollapsedAction | ResizeAction | SetIsDraggingAction): State {
   switch (action.type) {
      case SET_IS_DRAGGING:
         return { ...state, isDragging: action.isDragging }

      case TOGGLE_COLLAPSED:
         return { ...state, isCollapsed: !state.isCollapsed }

      case RESIZE:
         return { ...state, width: action.newWidth }

      default:
         return state
   }
}

//SELECTOR
export const contentPanelSelector: TypedUseSelectorHook<State> = useSelector
