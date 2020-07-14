import * as React from 'react'

import Icon from '@renderer/other_components/icon'
import { useContext } from '@/renderer/state/context'

export default function Breadcrumbs() {
   // var [state, dispatch] = useContext()

   var elements: Array<JSX.Element> = []

   //old onclick for crumbs: onClick={() => NoteBody.selectBullet(crumbBullet)}s
   // var selectedBullets = state.noteBody.selectedBullets
   // selectedBullets[0].breadCrumbs.forEach((crumbBullet, i) => {
   //    elements.push(<this.Crumb text={crumbBullet.text} key={i * 2} />)
   //    elements.push(<this.Spacer key={i * 2 + 1} />)
   // })

   // elements.push(<this.Crumb text={selectedBullets.map(b => b.text).join(', ')} key={-1} />)

   return <div className="breadcrumbs">{elements}</div>
}

// function Crumb(props: { text: string; onClick?: (event: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => void }): JSX.Element {
//    var hasOnClick: boolean = props.onClick != null

//    return (
//       <h1 className="breadcrumbs__crumb" onClick={hasOnClick ? props.onClick : null}>
//          {props.text}
//       </h1>
//    )
// }

// function Spacer(): JSX.Element {
//    return <Icon glyph="arrow_forward_ios" className="breadcrumbs__spacer" />
// }
