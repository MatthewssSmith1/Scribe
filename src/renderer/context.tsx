import React, { createContext, useReducer, useEffect } from 'react'

import { contextReducer, initCtxState, ContextState } from '@/renderer/context_actions'

const ContextState = createContext(initCtxState)
const ContextDispatch = createContext(null)

function useWindowEvent(event: string, handler: any, passive = false) {
   useEffect(() => {
      // initiate the event handler
      window.addEventListener(event, handler, passive)

      // this will clean up the event every time the component is re-rendered
      return function cleanup() {
         window.removeEventListener(event, handler)
      }
   })
}

//the component which wraps the app root
function ContextProvider({ children }) {
   const [state, dispatch] = useReducer(contextReducer, initCtxState)

   return (
      <ContextState.Provider value={state}>
         <ContextDispatch.Provider value={dispatch}>{children}</ContextDispatch.Provider>
      </ContextState.Provider>
   )
}

function useContextState(): ContextState {
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
function useContext(): [ContextState, any] {
   return [useContextState(), useContextDispatch()]
}

export { ContextProvider, useContext, useContextState, useContextDispatch, useWindowEvent }
