import React, { createContext, useReducer } from 'react'

import { contextReducer, initialState, State } from '@/renderer/context_actions'

const ContextState = createContext(initialState)
const ContextDispatch = createContext(null)

//the component which wraps the app root
function ContextProvider({ children }) {
   const [state, dispatch] = useReducer(contextReducer, initialState)

   return (
      <ContextState.Provider value={state}>
         <ContextDispatch.Provider value={dispatch}>{children}</ContextDispatch.Provider>
      </ContextState.Provider>
   )
}

function useContextState(): State {
   const contextState = React.useContext(ContextState)
   if (contextState === undefined) {
      throw new Error('useCountState must be used on a component that is a child of CountProvider')
   }
   return contextState
}

function useContextDispatch() {
   const contextDispatch = React.useContext(ContextDispatch)
   if (contextDispatch === undefined) {
      throw new Error('useCountDispatch must be used on a component that is a child of CountProvider')
   }
   return contextDispatch
}

//allows more concise "const [state, dispatch] = useContext()"
function useContext(): [State, any] {
   return [useContextState(), useContextDispatch()]
}

export { ContextProvider, useContext, useContextState, useContextDispatch }