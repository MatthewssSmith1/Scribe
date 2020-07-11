import * as React from 'react'

import cx from 'classnames'

import Bullet from '@/main/bullet'
import NoteBody from '@renderer/note_body/note_body'

export default class BulletDot extends React.Component {
   props: {
      bullet: Bullet
   }

   render() {
      return (
         <div className="bullet__line__dot">
            <div
               className={cx('bullet__line__dot__circle', {
                  // 'click-disabled': NoteBody.rootBullet == this.props.bullet,
                  highlighted: this.props.bullet.isCollapsed,
               })}
               onClick={() => {
                  // if (NoteBody.rootBullet == this.props.bullet) return
                  NoteBody.selectBullet(this.props.bullet)
               }}
            />
         </div>
      )
   }
}
