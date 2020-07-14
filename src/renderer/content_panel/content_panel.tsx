import * as React from 'react'
import cx from 'classnames'

import { Store } from 'redux'
import { contentPanelSelector, resize, setIsDragging, State } from '@/reducers/content_panel_reducer'

export default function ContentPanel() {
   var { isDragging, isCollapsed, width, minWidth } = contentPanelSelector((state: State) => state)

   var actualWidth = Math.max(width, minWidth)

   var style = {
      right: isCollapsed ? `${-actualWidth}px` : '0px',
      width: actualWidth,
   }

   return (
      <div id="content-panel-wrapper" className={cx({ collapsed: isCollapsed })} style={style}>
         <div id="content-panel">
            <div className="content-panel__draggable-edge" />
         </div>
      </div>
   )
}

export function initContentPanelCallbacks(store: Store) {
   var handleDrag = (e: MouseEvent) => {
      var newWidth = window.innerWidth - e.clientX

      store.dispatch(resize(newWidth))
   }

   document.addEventListener('mousedown', (e: MouseEvent) => {
      if (e.button != 0) return

      var target = e.target as HTMLElement
      if (!target.classList.contains('content-panel__draggable-edge')) return

      document.addEventListener('mousemove', handleDrag, false)
      store.dispatch(setIsDragging(true))
   })

   document.addEventListener('mouseup', e => {
      var isDragging = store.getState().contentPanel.isDragging
      if (!isDragging || e.button != 0) return

      document.removeEventListener('mousemove', handleDrag, false)
      store.dispatch(setIsDragging(false))
   })
}

//* //////////////////////////////////////////////////////////////////////////////
import * as React from 'react'
import * as Redux from 'redux'

import { MyReduxState } from './my-root-reducer.ts'

export interface OwnProps {
  propFromParent: number
}

interface StateProps {
  propFromReduxStore: string
}

interface DispatchProps {
  onSomeEvent: () => void
}

type Props = StateProps & DispatchProps & OwnProps

interface State {
  internalComponentStateField: string
}

class MyComponent extends React.Component<Props, State> {
  ...
}

function mapStateToProps(state: MyReduxState, ownProps: OwnProps): StateProps {
  ...
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>, ownProps: OwnProps): DispatchProps {
  ...
}

export default connect<StateProps, DispatchProps, OwnProps>
  (mapStateToProps, mapDispatchToProps)(MyComponent)
