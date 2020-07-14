import React, { useState, useRef } from 'react'
import cx from 'classnames'

import { useContext } from '@renderer/context'

// document.addEventListener('mousedown', (e: MouseEvent) => {
//    if (e.button != 0) return

//    if (e.target != this.draggableEdgeRef.current) return

//    document.addEventListener('mousemove', this.handleDrag, false)
//    this.isDragging = true
// })

// document.addEventListener('mouseup', e => {
//    if (!this.isDragging || e.button != 0) return

//    document.removeEventListener('mousemove', this.handleDrag, false)
//    this.isDragging = false
// })

// handleDrag = (e: MouseEvent) => {
//    var newWidth = window.innerWidth - e.clientX

// RootChildren.setContentPanelWidth(newWidth)
// }

export default function ContentPanel() {
   const [state, dispatch] = useContext()
   // const [isDragging, setIsDragging] = useState(() => false)
   const draggableEdgeRef = useRef(null)

   var { isCollapsed, width, minWidth } = state.contentPanel

   var actualWidth = Math.max(minWidth, width)

   var style = {
      right: `${isCollapsed ? -actualWidth : 0}px`,
      width: actualWidth,
   }

   return (
      <div id="content-panel-wrapper" className={cx({ collapsed: state.contentPanel.isCollapsed })} style={style} /* style based on being collapsed or not */>
         <div id="content-panel">
            <div className="content-panel__draggable-edge" ref={draggableEdgeRef} />
         </div>
      </div>
   )
}
