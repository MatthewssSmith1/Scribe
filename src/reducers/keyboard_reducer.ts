import { SET_IS_CTRL_PRESSED } from '@/actions/keyboard_actions'

const defaultState = {
   isCtrlPressed: false,
}

export default function keyboardReducer(state = defaultState, action: any) {
   switch (action.type) {
      case SET_IS_CTRL_PRESSED:
         return { ...state, isCtrlPressed: action.isCtrlPressed }

      default:
         return state
   }
}

export function selectIsCtrlPressed(state: any): boolean {
   return state.keyboard.isCtrlPressed
}
