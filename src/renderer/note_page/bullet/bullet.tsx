import React from 'react'

import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import cx from 'classnames'
import { markDownConverter } from '@renderer/renderer'

import Node from '@main/node'

import { GlobalContext, Context } from '@renderer/state/context'

import Icon from '@renderer/other_components/icon'

export default class Bullet extends React.Component {
   static contextType = GlobalContext

   editableRef: React.RefObject<HTMLDivElement>

   props: { node: Node }

   constructor(props: any) {
      super(props)

      this.editableRef = React.createRef()
   }

   shouldComponentUpdate(nextProps: { node: Node }, _nextState: any): boolean {
      var { node } = nextProps

      if (!node.shouldRebuild) return false

      node.shouldRebuild = false
      return true
   }

   render() {
      var { node } = this.props

      var style = {
         marginLeft: `${node.numIndents * 2}rem`,
      }

      return (
         <div className={cx('bullet', { collapsed: node.isCollapsed })} style={style}>
            <Icon className="bullet__chevron" glyph="keyboard_arrow_down" onClick={this.handleChevronClick} />
            <div className="bullet__dot">
               <div className="bullet__dot__circle" />
            </div>
            <ContentEditable
               innerRef={this.editableRef}
               className="bullet__editable"
               html={markDownConverter.makeHtml(node.text)}
               onChange={this.handleEditableChange}
               onFocus={this.handleEditableFocus}
               onBlur={this.handleEditableBlur}
            />
         </div>
      )
   }

   handleChevronClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      var { node } = this.props

      node.toggleCollapsed(null, e.altKey)
      node.shouldRebuild = true

      var ctx = this.context as Context
      ctx.state.noteBody.updateCallback()
   }

   //#region Editable Callbacks
   handleEditableFocus = () => {
      //this is wrapped in a listener so that the selection from the focus event is contained in the output from window.getSelection()
      var handleSelectionChange = () => {
         document.removeEventListener('selectionchange', handleSelectionChange)

         var sel = window.getSelection()

         var caretPos = sel.anchorOffset

         this.editableRef.current.innerHTML = this.props.node.text

         var range = new Range()
         range.setStart(this.editableRef.current.childNodes[0], 0)

         sel.removeAllRanges()
         sel.addRange(range)
      }

      document.addEventListener('selectionchange', handleSelectionChange)
   }

   handleEditableBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      this.editableRef.current.innerHTML = markDownConverter.makeHtml(this.props.node.text)
   }

   handleEditableChange = (e: ContentEditableEvent) => {
      this.props.node.text = e.target.value
   }
   //#endregion
}
