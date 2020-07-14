import React, { useRef, useState } from 'react'
import cx from 'classnames'

import { useContext } from '@renderer/context'
import { ContextState, resizeContentPanel } from '@renderer/context_actions'

//as a percentage of the window width, the range of widths that content panel can take up
const maxWidthPercentage = 0.6
const minWidthPercentage = 0.2

export default function ContentPanel() {
   const [state, dispatch] = useContext()
   const draggableEdgeRef = useRef()
   const [isInit, setIsInit] = useState(() => false)

   //add document listeners once
   if (!isInit) {
      var handleDrag = (e: MouseEvent) => dispatch(resizeContentPanel(window.innerWidth - e.clientX))

      setIsInit(true)

      document.addEventListener('mousedown', (e: MouseEvent) => {
         if (e.button == 0 && e.target == draggableEdgeRef.current) {
            document.addEventListener('mousemove', handleDrag, false)
         }
      })

      document.addEventListener('mouseup', e => {
         if (e.button == 0) {
            document.removeEventListener('mousemove', handleDrag, false)
         }
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
   var { isCollapsed, width } = state.contentPanel

   var minWidth = window.innerWidth * minWidthPercentage
   var maxWidth = window.innerWidth * maxWidthPercentage

   var actualWidth = Math.max(Math.min(maxWidth, width), minWidth)

   return {
      right: `${isCollapsed ? -actualWidth : 0}px`,
      width: actualWidth,
   }
}
