import React from 'react'

import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import cx from 'classnames'
import { markDownConverter } from '@/renderer'

import Node from '@/data/node'
import Icon from '@/components/icon/icon'

export default class Bullet extends React.Component {
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
   }

   //#region Editable Callbacks
   handleEditableFocus = (e: React.FocusEvent<HTMLDivElement>) => {
      var getSelectionCharacterOffsetWithin = element => {
         var start = 0
         var end = 0

         var sel = window.getSelection()

         if (sel.rangeCount > 0) {
            var range = sel.getRangeAt(0)
            var preCaretRange = range.cloneRange()
            preCaretRange.selectNodeContents(element)
            preCaretRange.setEnd(range.startContainer, range.startOffset)
            start = preCaretRange.toString().length
            preCaretRange.setEnd(range.endContainer, range.endOffset)
            end = preCaretRange.toString().length
         }

         return { start: start, end: end }
      }

      //this is wrapped in a listener so that the selection from the focus event is contained in the output from window.getSelection()
      var handleSelectionChange = () => {
         // document.removeEventListener('selectionchange', handleSelectionChange)

         // var sel = window.getSelection()

         // var caretPos = getSelectionCharacterOffsetWithin(this.editableRef.current.childNodes[0]).start

         // this.editableRef.current.innerHTML = this.props.node.text

         // var range = new Range()
         // range.setStart(this.editableRef.current.childNodes[0], caretPos) //caretPos is out of range

         // sel.removeAllRanges()
         // sel.addRange(range)
      }

      document.addEventListener('selectionchange', handleSelectionChange)
   }

   handleEditableBlur = () => {
      var { node } = this.props

      //disable headers, but not hashtags
      node.text = node.text.replace('# ', '')

      this.editableRef.current.innerHTML = markDownConverter.makeHtml(node.text)
   }

   handleEditableChange = (e: ContentEditableEvent) => {
      this.props.node.text = e.target.value
   }
   //#endregion
}
