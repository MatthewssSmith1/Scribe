import React from 'react'
import cx from 'classnames'

import RustInterface, { generateEvent } from '@/rust-bindings/rust_interface'
import { Event, EventType, EventListener } from '@/rust-bindings/binding_event'

export default class SidePanel extends React.Component implements EventListener {
   windowWidth = window.innerWidth
   actionBarWidth = 0

   isCollapsed = true
   width = window.innerWidth * 0.4

   minExpand = () => {
      return 0.15 * (this.windowWidth - this.actionBarWidth)
   }
   maxExpand = () => {
      return this.windowWidth - this.actionBarWidth - 32
      // return 0.9 * area_width
   }

   draggableEdgeRef: React.RefObject<HTMLDivElement>
   wrapperRef: React.RefObject<HTMLDivElement>

   constructor(props: any) {
      super(props)

      RustInterface.subscribe(this, EventType.ToggleSidePanel, EventType.ActionBarWidthChanged)

      this.draggableEdgeRef = React.createRef<HTMLDivElement>()
      this.wrapperRef = React.createRef<HTMLDivElement>()

      var handleDrag = (e: MouseEvent) => {
         this.width = window.innerWidth - e.clientX
         this.clampWidth()
         this.updateStyle()

         generateEvent(EventType.SidePanelWidthChanged, this.width.toString())
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

      window.onresize = () => {
         this.windowWidth = window.innerWidth

         if (this.clampWidth()) this.updateStyle()
      }
   }

   handleEvent(e: Event): void {
      if (e.is(EventType.ToggleSidePanel)) {
         this.isCollapsed = !this.isCollapsed
         this.updateStyle()
      } else if (e.is(EventType.ActionBarWidthChanged)) {
         console.log("action bar width change received at " + (new Date()).getTime());
         this.actionBarWidth = e.dataAsNum(0)
         if (this.clampWidth() && !this.isCollapsed) this.updateStyle()
      }
   }

   clampWidth(): boolean {
      let clampedWidth = Math.min(Math.max(this.width, this.minExpand()), this.maxExpand())

      if (this.width != clampedWidth) {
         this.width = clampedWidth
         return true
      }

      return false
   }

   updateStyle(): void {
      let wrapperDiv = this.wrapperRef.current

      var notePageRMargin = this.isCollapsed ? 0 : this.width
      generateEvent(EventType.SidePanelWidthChanged, notePageRMargin.toString())

      wrapperDiv.classList.toggle('collapsed', this.isCollapsed)

      wrapperDiv.style.right = `${this.isCollapsed ? -this.width : 0}px`
      wrapperDiv.style.width = `${this.width}px`
   }

   render() {
      var style: React.CSSProperties = {
         right: 0,
         width: 0,
      }

      return (
         <div id="content-panel-wrapper" ref={this.wrapperRef} className={cx({ collapsed: this.isCollapsed })} style={style}>
            <div id="content-panel">
               <div className="content-panel__draggable-edge" ref={this.draggableEdgeRef} />
            </div>
         </div>
      )
   }
}
