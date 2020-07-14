import React, { createContext, useReducer } from 'react'

import { contextReducer, initCtxState, ContextState } from '@/renderer/state/context_actions'

const ContextState = createContext(initCtxState)
const ContextDispatch = createContext<React.Dispatch<any>>(null)

//the component which wraps the app root and provides both the state and dispatch from reducer
function ContextProvider({ children }) {
   const [state, dispatch] = useReducer(contextReducer, initCtxState)

   return (
      <ContextState.Provider value={state}>
         <ContextDispatch.Provider value={dispatch}>{children}</ContextDispatch.Provider>
      </ContextState.Provider>
   )
}

//provides the state in function components
function useContextState(): ContextState {
   const contextState = React.useContext(ContextState)
   if (contextState === undefined) {
      throw new Error('useCountState must be used on a component that is a child of CountProvider')
   }
   return contextState
}

function useContextDispatch(): React.Dispatch<any> {
   const contextDispatch = React.useContext(ContextDispatch)
   if (contextDispatch === undefined) {
      throw new Error('useCountDispatch must be used on a component that is a child of CountProvider')
   }
   return contextDispatch
}

//allows more concise "const [state, dispatch] = useContext()"
function useContext(): [ContextState, React.Dispatch<any>] {
   return [useContextState(), useContextDispatch()]
}

type AsyncCallback = (dispatch: React.Dispatch<any>) => Promise<void>

function useContextDispatchAsync() {
   const contextDispatch = useContextDispatch()
   var dispatchAsync = (asyncCallback: AsyncCallback) => {
      asyncCallback(contextDispatch)
   }

   return dispatchAsync
}

export { ContextProvider, useContext, useContextState, useContextDispatch, useContextDispatchAsync }
