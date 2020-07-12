import * as React from 'react'
import RootChildren from '../renderer'
import cx from 'classnames'

export default class ContentPanel extends React.Component {
   panelWrapperRef: any
   draggableEdgeRef: any

   isDragging: boolean = false

   props: {
      isCollapsed: boolean
      width: number
   }

   state: {
      isDragging: boolean
   }

   constructor(props: any) {
      super(props)

      this.draggableEdgeRef = React.createRef()
      this.panelWrapperRef = React.createRef()
      this.state = { isDragging: false }

      document.addEventListener('mousedown', (e: MouseEvent) => {
         if (e.button != 0) return

         if (e.target != this.draggableEdgeRef.current) return

         document.addEventListener('mousemove', this.handleDrag, false)
         this.isDragging = true
      })

      document.addEventListener('mouseup', e => {
         if (!this.isDragging || e.button != 0) return

         document.removeEventListener('mousemove', this.handleDrag, false)
         this.isDragging = false
      })
   }

   render(): JSX.Element {
      return (
         <div
            id="content-panel-wrapper"
            className={cx({ collapsed: this.props.isCollapsed })}
            ref={this.panelWrapperRef}
            style={this.getStyle()} /* style based on being collapsed or not */
         >
            <div id="content-panel">
               <div className="content-panel__draggable-edge" ref={this.draggableEdgeRef} />
            </div>
         </div>
      )
   }

   handleDrag = (e: MouseEvent) => {
      var newWidth = window.innerWidth - e.clientX

      RootChildren.setContentPanelWidth(newWidth)
   }

   getStyle() {
      var props = this.props

      return {
         right: props.isCollapsed ? `${-props.width}px` : '0px',
         width: props.width,
      }
   }
}
