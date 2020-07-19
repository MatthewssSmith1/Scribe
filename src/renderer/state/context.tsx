import React, { createContext, useReducer } from 'react'

import { contextReducer, initCtxState, State } from '@/renderer/state/context_actions'

const ContextState = createContext<State>(initCtxState)
type ContextDispatchType = React.Dispatch<any>
const ContextDispatch = createContext<ContextDispatchType>(null)

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
function useContextState(): State {
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
function useContext(): [State, React.Dispatch<any>] {
   return [useContextState(), useContextDispatch()]
}

type AsyncCallback = (state: State, dispatch: React.Dispatch<any>) => Promise<void>

function useContextDispatchAsync() {
   const [state, dispatch] = useContext()

   return (asyncCallback: AsyncCallback) => {
      asyncCallback(state, dispatch)
   }
}

export { ContextProvider, useContext, useContextState, useContextDispatch, useContextDispatchAsync, State as ContextStateType, ContextDispatchType, AsyncCallback }
