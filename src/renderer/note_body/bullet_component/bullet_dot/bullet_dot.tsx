import * as React from 'react'

import cx from 'classnames'

import Bullet from '@/main/bullet'
import { useContext } from '@renderer/state/context'
import { focusBullet } from '@renderer/state/context_actions'

var BulletDot = (props: { bullet: Bullet }) => {
   const [state, dispatch] = useContext()

   var bullet = props.bullet

   return (
      <div className="bullet__line__dot">
         <div
            className={cx('bullet__line__dot__circle', {
               'click-disabled': state.noteBody.focusedBullets.includes(bullet),
               highlighted: bullet.isCollapsed,
            })}
            onClick={() => dispatch(focusBullet(bullet))}
         />
      </div>
   )
}

export default BulletDot
