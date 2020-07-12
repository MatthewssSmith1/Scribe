import * as React from 'react'

export default class ContentPanel extends React.Component {
   isDragging: boolean = false

   panelWrapperRef: any

   constructor(props) {
      super(props)

      this.panelWrapperRef = React.createRef()
   }

   handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!this.isDragging) return

      console.log('dragging')

      var newWidth = window.innerWidth - e.clientX

      //TODO set the width of the panel somehow using newWidth
      //! might need to move the content panel as a child of root and make t a child of NoteBody
   }

   handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.button != 0) return

      this.isDragging = true
   }

   handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.button != 0) return

      this.isDragging = false
   }

   render(): JSX.Element {
      return (
         <div className="content-panel-wrapper" ref={this.panelWrapperRef}>
            <div className="content-panel">
               <div
                  className="content-panel__draggable-edge"
                  onMouseDown={this.handleMouseDown}
                  onMouseUp={this.handleMouseUp}
                  onMouseMove={this.handleMouseMove}
                  onMouseLeave={() => (this.isDragging = false)}
               />
            </div>
         </div>
      )
   }
}
