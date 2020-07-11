import * as React from 'react'

//TODO use or uninstall package 'materialize-css'
export default class Icon extends React.Component {
   props: {
      glyph: string
      className?: string
      onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
   }

   render() {
      var classes = ''
      if (this.props.className) classes += this.props.className + ' '
      classes += 'icon'
      if (this.props.onClick != null) classes += ' has-on-click'

      return (
         <div className={classes} onClick={this.props.onClick}>
            <i className="material-icons icon__glyph">{this.props.glyph}</i>
         </div>
      )
   }
}
