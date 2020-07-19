import React, { useRef, useState } from 'react'
import cx from 'classnames'

import { useContext } from '@/renderer/state/context'
import { State, resizeContentPanel } from '@renderer/state/context_actions'

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
            document.body.classList.add('all-descendants-w-resize')
         }
      })

      document.addEventListener('mouseup', e => {
         if (e.button == 0) {
            document.removeEventListener('mousemove', handleDrag, false)
            document.body.classList.remove('all-descendants-w-resize')
         }
      })
   }

   return (
      <div id="content-panel-wrapper" className={cx({ collapsed: state.contentPanel.isCollapsed })} style={getStyle(state)}>
         <div id="content-panel">
            <div className="content-panel__draggable-edge" ref={draggableEdgeRef} />
         </div>
      </div>
   )
}

function getStyle(state: State): React.CSSProperties {
   var { isCollapsed, width } = state.contentPanel

   return {
      right: `${isCollapsed ? -width : 0}px`,
      width: width,
   }
}
