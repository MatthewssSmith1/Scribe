import React from 'react'
import cx from 'classnames'

import RustInterface, { generateEvent } from '@/rust-bindings/rust_interface'
import { Event, EventType, EventListener } from '@/rust-bindings/binding_event'

export default class SidePanel extends React.Component implements EventListener {
   windowWidth = window.innerWidth
   actionBarWidth = 0

   isDragging = false

   isCollapsed = true
   width = window.innerWidth * 0.4

   minExpand = () => {
      return 0.15 * (this.windowWidth - this.actionBarWidth)
   }
   maxExpand = () => {
      // return this.windowWidth - this.actionBarWidth - 32
      return 0.6 * this.windowWidth
   }

   draggableEdgeRef: React.RefObject<HTMLDivElement>
   wrapperRef: React.RefObject<HTMLDivElement>

   constructor(props: any) {
      super(props)

      RustInterface.subscribe(this, EventType.ToggleSidePanel, EventType.ActionBarWidthChanged)

      this.draggableEdgeRef = React.createRef<HTMLDivElement>()
      this.wrapperRef = React.createRef<HTMLDivElement>()

      var handleDrag = (e: MouseEvent) => {
         let newWidth = window.innerWidth - e.clientX
         if (this.width == newWidth) {
            return
         }
         this.width = Math.min(this.maxExpand(), newWidth)
         // this.clampWidth()
         this.updateStyle()
      }

      document.addEventListener('mousedown', (e: MouseEvent) => {
         if (e.button == 0 && e.target == this.draggableEdgeRef.current) {
            document.addEventListener('mousemove', handleDrag, false)
            document.body.classList.add('all-descendants-w-resize')
            this.isDragging = true
         }
      })

      document.addEventListener('mouseup', e => {
         if (e.button == 0 && this.isDragging) {
            document.removeEventListener('mousemove', handleDrag, false)
            document.body.classList.remove('all-descendants-w-resize')
            this.isDragging = false

            if (this.width < this.minExpand()) {
               generateEvent(EventType.ToggleSidePanel)
               return
            }
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
         if (!this.isCollapsed) {
            this.width = window.innerWidth * 0.4
         }
         this.updateStyle()
      } else if (e.is(EventType.ActionBarWidthChanged)) {
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

      if (this.isCollapsed) {
         generateEvent(EventType.SidePanelWidthChanged, `${0}`)
      } else if (this.width >= this.minExpand()) {
         var notePageRMargin = this.isCollapsed ? 0 : this.width
         generateEvent(EventType.SidePanelWidthChanged, notePageRMargin.toString())
      }

      wrapperDiv.classList.toggle('collapsed', this.isCollapsed)

      wrapperDiv.style.right = `${this.isCollapsed ? -this.width : 0}px`
      wrapperDiv.style.width = `${this.width}px`
      wrapperDiv.style.opacity = `${Math.min(1.0, this.width / this.minExpand())}`
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
