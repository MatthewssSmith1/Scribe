import * as React from 'react'

export default class ContentPanel extends React.Component {
   render(): JSX.Element {
      return (
         <div className="content-panel-wrapper">
            <div className="content-panel">
               <div className="content-panel__draggable-edge" />
            </div>
         </div>
      )
   }
}
