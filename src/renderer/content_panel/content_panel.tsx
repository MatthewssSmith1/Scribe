import React, { useRef, useEffect, useState } from 'react'
import cx from 'classnames'

import { useContext, useWindowEvent } from '@renderer/context'
import { ContextState, resizeContentPanel } from '@renderer/context_actions'

export default function ContentPanel() {
   const [state, dispatch] = useContext()
   const draggableEdgeRef = useRef()
   const [isInit, setIsInit] = useState(() => false)
   const [isDragging, setIsDragging] = useState(() => false)

   var handleDrag = (e: MouseEvent) => dispatch(resizeContentPanel(window.innerWidth - e.clientX))

   if (!isInit) {
      setIsInit(true)

      document.addEventListener('mousedown', (e: MouseEvent) => {
         if (e.button != 0 || e.target != draggableEdgeRef.current) return

         document.addEventListener('mousemove', handleDrag, false)
         setIsDragging(true)
      })

      document.addEventListener('mouseup', e => {
         if (e.button != 0) return

         document.removeEventListener('mousemove', handleDrag, false)
         setIsDragging(false)
      })
   }

   return (
      <div id="content-panel-wrapper" className={cx({ collapsed: state.contentPanel.isCollapsed })} style={contentPanelStyle(state)}>
         <div id="content-panel">
            <div className="content-panel__draggable-edge" ref={draggableEdgeRef} />
         </div>
      </div>
   )
}

function contentPanelStyle(state: ContextState) {
   var { isCollapsed, width, minWidth } = state.contentPanel

   var actualWidth = Math.max(minWidth, width)

   return {
      right: `${isCollapsed ? -actualWidth : 0}px`,
      width: actualWidth,
   }
}

// var handleDrag = (e: MouseEvent) => {
//    if(!isDragging)

//    dispatch(resizeContentPanel(window.innerWidth - e.clientX))

//    console.log('dragging')
// }

// console.log('render')

// if (!isInit) {
//    console.log('init')

//    document.addEventListener('mousedown', (e: MouseEvent) => {
//       if (e.button !== 0) return

//       if (e.target != draggableEdgeRef.current) return

//       console.log('start drag')

//       setIsDragging(true)
//       document.addEventListener('mousemove', handleDrag, false)
//    })

//    document.addEventListener('mouseup', (e: MouseEvent) => {
//       if (e.button !== 0) return

//       console.log('end drag')

//       setIsDragging(false)
//       window.removeEventListener('mousemove', handleDrag, false)
//    })

//    setIsInit(true)
// }

//if isDragging and the left mouse button is released anywhere, stop dragging (isDragging=false, remove handleDrag)
// useEffect(() => {
//    if (!isDragging) return

//    var handleMouseUp = (e: MouseEvent) => {
//       if (e.button !== 0 || !isDragging) return

//       console.log('mb0 released')

//       document.removeEventListener('mousemove', handleDrag)
//       setIsDragging(false)
//    }

//    //ensure there is only one listener of this type at a time,
//    //returning the function cleans up the listener before the next render
//    document.addEventListener('mouseup', handleMouseUp)
//    console.log('listener attatched')
//    return () => {
//       document.removeEventListener('mouseup', handleMouseUp)
//       console.log('listener removed')
//    }
// })
