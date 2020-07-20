import React from 'react'

import Document from '@main/document'
import Bullet from '@main/bullet'
import { ToAddress } from '@main/link'

// #region State
export const initialState = {
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
export type State = typeof initialState
export type LinkMenuState = typeof initialState.linkMenu
export type NoteBodyState = typeof initialState.noteBody
export type SelectionState = typeof initialState.selection
// #endregion

// #region Type Definitions
export type Action = (s: State) => void
export type AsyncAction = (d: Dispatch) => void

export type Dispatch = (a: Action) => void
export type DispatchAsync = (a: AsyncAction) => void

export type Context = {
   state: State
   dispatch: Dispatch
   dispatchAsync: DispatchAsync
}
// #endregion

// #region Action Creators
export function createAction<T extends any[]>(callback: (state: State, ...restParams: T) => void): (...t: T) => Action {
   return (...params: T) => (state: State) => callback(state, ...params)
}

export function createActionAsync<T extends any[]>(callback: (d: Dispatch, ...restParams: T) => Promise<void>): (...t: T) => AsyncAction {
   return (...params: T) => (d: Dispatch) => callback(d, ...params)
}
//#endregion

// #region Context
export const GlobalContext = React.createContext<Context>(null)

//the component at the root of the component tree that provides the context for descendants
export const ContextProvider = ({ children }) => {
   //the function called whenever an action is passed  to dispatch
   const contextReducer = (state: State, action: Action): State => {
      var newState = { ...state }
      action(newState)
      return newState
   }

   const [state, dispatch] = React.useReducer(contextReducer, initialState)

   var dispatchAsync = (asyncAction: AsyncAction) => asyncAction(dispatch)

   return (
      <GlobalContext.Provider
         value={{
            state,
            dispatch,
            dispatchAsync,
         }}
      >
         {children}
      </GlobalContext.Provider>
   )
}

//called within components that are children of ContextProvider and returns the context
export const getContext = (): Context => {
   const ctx = React.useContext(GlobalContext)

   if (ctx === undefined) throw 'getContext() must be used on a component that is a child of CountProvider'

   return ctx
}
// #endregion
