import * as React from 'react'

import Icon from '@renderer/other_components/icon'
import { getContext } from '@renderer/state/context'
import { focusBullet } from '@renderer/state/context_actions'

export default function Breadcrumbs() {
   var {state, dispatch} = getContext()

   var elements: Array<JSX.Element> = []

   // old onclick for crumbs: onClick={() => NoteBody.selectBullet(crumbBullet)}s
   var selectedBullets = state.noteBody.focusedBullets
   // if (selectedBullets && selectedBullets.length > 0) {
   selectedBullets[0].breadCrumbs.forEach((crumbBullet, i) => {
      elements.push(<Crumb key={i * 2} text={crumbBullet.text} onClick={() => dispatch(focusBullet(crumbBullet))} />)
      elements.push(<Spacer key={i * 2 + 1} />)
   })
   elements.push(<Crumb text={selectedBullets.map(b => b.text).join(', ')} key={-1} />)
   // }

   return <div className="breadcrumbs">{elements}</div>
}

function Crumb(props: { text: string; onClick?: (event: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => void }): JSX.Element {
   return (
      <h1 className="breadcrumbs__crumb" onClick={props.onClick}>
         {props.text}
      </h1>
   )
}

function Spacer(): JSX.Element {
   return <Icon glyph="arrow_forward_ios" className="breadcrumbs__spacer" />
}
