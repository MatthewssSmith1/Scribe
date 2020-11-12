import React from 'react'
import cx from 'classnames'

type SidePanelState = {
   isCollapsed: boolean
   width: number
   minWidthPercentage: number
   maxWidthPercentage: number
}

export default class SidePanel extends React.Component {
   //#region State & Members
   private static _SINGLETON: SidePanel

   draggableEdgeRef: React.RefObject<HTMLDivElement>

   state: SidePanelState

   constructor(props: any) {
      super(props)

      SidePanel._SINGLETON = this

      this.draggableEdgeRef = React.createRef<HTMLDivElement>()

      this.state = {
         isCollapsed: true,
         width: 350,
         minWidthPercentage: 0.2,
         maxWidthPercentage: 0.5,
      }

      var handleDrag = (e: MouseEvent) => {
         this.setState({ width: window.innerWidth - e.clientX })

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

   //? consider removing react state storage and just store a static value/set of values on the class
   shouldComponentUpdate(_nextProps: any, nextState: SidePanelState) {
      // console.log('update checked')
      return true
   }
   //#endregion

   //#region Getters & Setters
   static get width(): number {
      return this._SINGLETON.state.width
   }

   static get isCollapsed(): boolean {
      return this._SINGLETON.state.isCollapsed
   }

   static set isCollapsed(_isCollapsed: boolean) {
      //stores it in state for the next rebuild
      this._SINGLETON.setState({ isCollapsed: _isCollapsed })

      //modifies the class list in the front facing HTML independent of React
      var contentPanelWrapper = document.querySelector('#content-panel-wrapper') as HTMLDivElement
      if (_isCollapsed) contentPanelWrapper.classList.add('collapsed')
      else contentPanelWrapper.classList.remove('collapsed')

      //sets the style of the HTML element, also independent from React
      var right = _isCollapsed ? -this._SINGLETON.state.width : 0
      contentPanelWrapper.style.right = `right: ${right}px`
   }

   static toggleIsCollapsed(): void {
      SidePanel.isCollapsed = !SidePanel.isCollapsed
   }
   //#endregion

   render() {
      // console.log('SidePanel built')

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
