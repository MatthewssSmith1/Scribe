import * as React from 'react'
import cx from 'classnames'

interface IconProps {
   glyph: string
   className?: string
   onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
   disabled?: boolean
}

//TODO don't use link tab to get materialize css over the internet
export default function Icon(props: IconProps) {
   var { glyph, className, onClick, disabled } = props

   //convert null to default values
   if (disabled == null) disabled = false
   if (className == null) className = ''

   return (
      <div
         className={cx(className, 'icon', {
            'has-on-click': onClick != null,
            disabled: disabled,
         })}
         onClick={disabled ? () => {} : onClick}
      >
         <i className="material-icons icon__glyph">{glyph}</i>
      </div>
   )
}
