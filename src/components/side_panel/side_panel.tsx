import React from 'react'
import cx from 'classnames'

import RustInterface, { generateEvent } from '@/rust-bindings/rust_interface'
import { Event, EventType, EventListener } from '@/rust-bindings/binding_event'

type SidePanelState = {
   isCollapsed: boolean
   width: number
   minWidthPercentage: number
   maxWidthPercentage: number
}

export default class SidePanel extends React.Component implements EventListener {
   state: SidePanelState
   draggableEdgeRef: React.RefObject<HTMLDivElement>

   constructor(props: any) {
      super(props)

      RustInterface.subscribe(this, EventType.ToggleSidePanel)

      this.draggableEdgeRef = React.createRef<HTMLDivElement>()

      this.state = {
         isCollapsed: true,
         width: 350,
         minWidthPercentage: 0.2,
         maxWidthPercentage: 0.5,
      }

      var handleDrag = (e: MouseEvent) => {
         var width = window.innerWidth - e.clientX
         this.setState({ width })

         generateEvent(EventType.ChangeNotePageRMargin, width.toString())

         //! set style of html element here (don't need to rebuild every time)
      }

      document.addEventListener('mousedown', (e: MouseEvent) => {
         if (e.button == 0 && e.target == this.draggableEdgeRef.current) {
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

   handleEvent(e: Event): void {
      if (e.is(EventType.ToggleSidePanel)) {
         var isCollapsed = !this.state.isCollapsed

         this.setState({ isCollapsed })

         var notePageRMargin = isCollapsed ? 0 : this.state.width
         generateEvent(EventType.ChangeNotePageRMargin, notePageRMargin.toString())

         //modifies the class list in the front facing HTML independent of React
         var contentPanelWrapper = document.querySelector('#content-panel-wrapper') as HTMLDivElement
         if (isCollapsed) contentPanelWrapper.classList.add('collapsed')
         else contentPanelWrapper.classList.remove('collapsed')

         //sets the style of the HTML element, also independent from React
         var right = isCollapsed ? -this.state.width : 0
         contentPanelWrapper.style.right = `right: ${right}px`
      }
   }

   render() {
      var { isCollapsed, width } = this.state

      var style: React.CSSProperties = {
         right: `${isCollapsed ? -width : 0}px`,
         width: width,
      }

      return (
         <div id="content-panel-wrapper" className={cx({ collapsed: isCollapsed })} style={style}>
            <div id="content-panel">
               <div className="content-panel__draggable-edge" ref={this.draggableEdgeRef} />
            </div>
         </div>
      )
   }
}
