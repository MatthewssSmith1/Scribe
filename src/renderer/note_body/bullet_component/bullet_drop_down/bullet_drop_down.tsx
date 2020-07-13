import * as React from 'react'

import * as cx from 'classnames'

import Bullet from '@/main/bullet'
import Icon from '@/renderer/other_components/icon'
import NoteBody from '@renderer/note_body/note_body'

export default class BulletDropDown extends React.Component {
   props: {
      bullet: Bullet
   }

   onClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      var bullet = this.props.bullet

      var newState = !bullet.isCollapsed

      bullet.isCollapsed = newState

      if (evt.altKey) {
         bullet.setCollapsedForAllDescendants(newState)
      }

      NoteBody.rebuild()
   }

   render(): JSX.Element {
      var bullet = this.props.bullet

      if (!bullet.hasChildren) {
         return <div className="bullet__line__drop-down" />
      }

      return <Icon glyph="keyboard_arrow_down" className={cx('bullet__line__drop-down', { rotated: bullet.isCollapsed })} onClick={this.onClick} />
   }
}
