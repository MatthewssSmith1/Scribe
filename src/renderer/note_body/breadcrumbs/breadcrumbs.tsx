import * as React from 'react'

import Bullet from '@main/bullet'
import Icon from '@renderer/other_components/icon'
import NoteBody from '@renderer/note_body/note_body'

export default class Breadcrumbs extends React.Component {
   props: {
      selectedBullets: Array<Bullet>
      isRootSelected: boolean
   }

   render() {
      var elements: Array<JSX.Element> = []

      //old onclick for crumbs: onClick={() => NoteBody.selectBullet(crumbBullet)}s
      var selectedBullets = this.props.selectedBullets
      selectedBullets[0].breadCrumbs.forEach((crumbBullet, i) => {
         elements.push(<this.Crumb text={crumbBullet.text} key={i * 2} />)
         elements.push(<this.Spacer key={i * 2 + 1} />)
      })

      elements.push(<this.Crumb text={selectedBullets.map(b => b.text).join(', ')} key={-1} />)

      return <div className="breadcrumbs">{elements}</div>
   }

   Crumb(props: { text: string; onClick?: (event: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => void }): JSX.Element {
      var hasOnClick: boolean = props.onClick != null

      return (
         <h1 className="breadcrumbs__crumb" onClick={hasOnClick ? props.onClick : null}>
            {props.text}
         </h1>
      )
   }

   Spacer(): JSX.Element {
      return <Icon glyph="arrow_forward_ios" className="breadcrumbs__spacer" />
   }
}
