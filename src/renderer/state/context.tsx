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
export type AsyncCallback = (c: Context) => Promise<void>
export type Context = {
   state: State
   dispatch: React.Dispatch<Action>
   dispatchAsync: (callback: AsyncCallback) => void
}
// #endregion

// #region Action Creators
export function actionify<T extends any[]>(callback: (state: State, ...restParams: T) => void): (...t: T) => Action {
   return (...params: T) => state => callback(state, ...params)
}

export function actionifyAsync<T extends any[]>(callback: (context: Context, ...restParams: T) => Promise<void>): (...t: T) => AsyncCallback {
   return (...params: T) => ctx => callback(ctx, ...params)
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

   //done this way so ctx can be passed into its own asyncCallback
   var ctx: Context = null
   ctx = {
      state,
      dispatch,
      dispatchAsync: (asyncCallback: AsyncCallback) => asyncCallback(ctx),
   }

   return <GlobalContext.Provider value={ctx}>{children}</GlobalContext.Provider>
}

//called within components that are children of ContextProvider and returns the context
export const getContext = (): Context => {
   const ctx = React.useContext(GlobalContext)

   if (ctx === undefined) throw 'getContext() must be used on a component that is a child of CountProvider'

   return ctx
}
// #endregion
