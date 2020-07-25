export default class Node {
   //#region Variables
   private _nextNode: Node = null
   get nextNode() {
      return this._nextNode
   }

   private _prevNode: Node = null
   get prevNode() {
      return this._prevNode
   }

   private _text: string
   get text() {
      return this._text
   }
   set text(text: string) {
      this._text = text
   }

   private _numIndents: number
   get numIndents() {
      return this._numIndents
   }
   // set numIndents(numIndents: number) {
   //    this._numIndents = numIndents
   // }

   private _key: number = null
   get key() {
      return this._key
   }

   isCollapsed: boolean = false
   shouldRebuild: boolean = false
   //#endregion

   //#region Constructing
   //remove all leading tabs from text, if numIndents is not provided then use the number of removed tabs instead
   constructor(text: string = '', numIndents?: number, prevNode?: Node, nextNode?: Node) {
      var countNumberOfTabs = (str: string) => {
         var count = 0
         var index = 0
         while (str.charAt(index++) === '\t') {
            count++
         }
         return count
      }
      var numLeadingTabs = countNumberOfTabs(text)

      this._text = text.slice(numLeadingTabs)
      this._numIndents = numIndents || numLeadingTabs

      if (prevNode) Node.linkNodes(prevNode, this)
      if (nextNode) Node.linkNodes(this, nextNode)

      this.updateKey()
   }

   static headFromStringArray(strings: Array<string>): Node {
      var firstNode = new Node(strings.shift())

      var prevNode = firstNode

      strings.forEach(str => {
         prevNode = new Node(str, null, prevNode)
      })

      return firstNode
   }
   //#endregion

   //#region Insertion & Deletion
   private static linkNodes(first: Node, second: Node): void {
      if (first) first._nextNode = second

      if (second) second._prevNode = first
   }

   remove(): Node {
      Node.linkNodes(this._prevNode, this._nextNode)

      this._prevNode = null
      this._nextNode = null
      this._key = null

      return this
   }

   insertAfter(newNode: Node): void {
      Node.linkNodes(newNode, this._nextNode)
      Node.linkNodes(this, newNode)

      this.updateKey()
   }

   insertBefore(newNode: Node): void {
      Node.linkNodes(this._prevNode, newNode)
      Node.linkNodes(newNode, this)

      this.updateKey()
   }

   updateKey(): void {
      var maxKey = 0

      var prevNode = this._prevNode
      while (prevNode) {
         maxKey = Math.max(maxKey, prevNode._key || 0)
         prevNode = prevNode._prevNode
      }

      var nextNode = this._nextNode
      while (nextNode) {
         maxKey = Math.max(maxKey, nextNode._key || 0)
         nextNode = nextNode._nextNode
      }

      this._key = maxKey + 1
   }
   //#endregion

   //#region Getters
   get arrayIndex(): number {
      var countPrevNodes = 0
      var prevNode = this._prevNode

      while (prevNode) {
         countPrevNodes++
         prevNode = prevNode._prevNode
      }

      return countPrevNodes
   }

   get nextNodeToRender(): Node {
      if (!this.isCollapsed) return this._nextNode

      var nextNode = this._nextNode
      while (nextNode) {
         if (nextNode._numIndents <= this._numIndents) return nextNode

         nextNode = nextNode._nextNode
      }

      return null
   }
   //#endregion

   //#region Collapsing
   toggleCollapsed(newState?: boolean, applyToDescendants: boolean = false): void {
      var isCollapsed = newState || !this.isCollapsed

      this.isCollapsed = isCollapsed

      if (!applyToDescendants) return

      var node: Node = this._nextNode
      while (node) {
         if (node._numIndents <= this._numIndents) break

         node.isCollapsed = isCollapsed

         node = node._nextNode
      }
   }
   //#endregion

   //#region Family Members (parents, children, etc.)
   get parent(): Node {
      if (this._numIndents == 0) console.warn('node.parent() getter method called on node with 0 indents')

      var prevNode = this._prevNode
      while (prevNode) {
         if (prevNode._numIndents < this._numIndents) return prevNode
         prevNode = prevNode._prevNode
      }

      console.warn('node.parent() getter method called on node without parent')
      return null
   }

   get siblingBefore(): Node {
      var prevNode = this._prevNode
      while (prevNode) {
         if (prevNode._numIndents < this._numIndents) return null

         if (prevNode._numIndents == this._numIndents) return prevNode

         prevNode = prevNode._prevNode
      }

      return null
   }

   get siblingAfter(): Node {
      var nextNode = this._nextNode
      while (nextNode) {
         if (nextNode._numIndents < this._numIndents) return null

         if (nextNode._numIndents == this._numIndents) return nextNode

         nextNode = nextNode._nextNode
      }
   }

   get isFirstSibling(): boolean {
      return this.siblingBefore == null
   }

   get isLastSibling(): boolean {
      return this.siblingAfter == null
   }

   get childCount(): number {
      var numChildren = 0

      var childIndentCount = this._numIndents + 1

      var node = this._nextNode
      while (node) {
         if (childIndentCount == node._numIndents) numChildren++
         else if (node._numIndents < childIndentCount) break
      }

      return numChildren
   }
   //#endregion

   //#region Other
   swapTextWith(other: Node): void {
      var tempText = this.text
      this.text = other.text
      other.text = tempText
   }

   removeIndent(): void {
      if (this._numIndents == 0) {
         console.warn(`node.removeIndent() called on ${this as Node} with no indents`)
         return
      }

      if (this._nextNode && this._nextNode._numIndents > this._numIndents) this._nextNode.removeIndent()

      this._numIndents--
   }

   addIndent(): void {
      if (this._prevNode == null) {
         console.warn(`node.addIndent() called on ${this as Node} with no prevNode (first in list)`)
         return
      } else if (this._numIndents > this._prevNode._numIndents) {
         console.warn(`node.addIndent() called on ${this as Node} where prevNode is its parent`)
         return
      }

      this._numIndents--
   }
   //#endregion
}
