import { combineReducers } from 'redux'
import actionPanelReducer from '@/reducers/action_panel_reducer'
import contentPanelReducer from '@/reducers/content_panel_reducer'
import keyboardReducer from '@/reducers/keyboard_reducer'

const rootReducer = combineReducers({ actionPanel: actionPanelReducer, contentPanel: contentPanelReducer, keyboard: keyboardReducer })

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
