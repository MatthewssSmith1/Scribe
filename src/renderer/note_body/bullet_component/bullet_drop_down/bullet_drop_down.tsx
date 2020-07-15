import React from 'react'

import cx from 'classnames'

import Bullet from '@/main/bullet'
import Icon from '@/renderer/other_components/icon'

var BulletDropDown = (props: { bullet: Bullet; forceUpdate: React.Dispatch<unknown> }) => {
   var { bullet, forceUpdate } = props

   var onClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      bullet.toggleCollapsed()

      if (evt.altKey) bullet.setCollapsedForAllDescendants(bullet.isCollapsed)

      forceUpdate(0)
   }

   var className = cx({
      'bullet__line__drop-down': true,
      rotated: bullet.isCollapsed,
   })

   if (!bullet.hasChildren) {
      return <div className={className} />
   }

   return <Icon glyph="keyboard_arrow_down" className={className} onClick={onClick} />
}

export default BulletDropDown
