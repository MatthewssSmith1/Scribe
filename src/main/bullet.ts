export default class Bullet {
   text: string
   parent: Bullet
   children: Array<Bullet> = []
   //used to show/hide children if it is collapsed or not
   isCollapsed: boolean = false
   //used for setting the cursor/caret position on rebuild
   caretIndex: number = -1
   //passed to react.js components in children lists
   key: number = 0

   // #region Constructor, Factory, Serializing
   constructor(text: string = '', children: Array<Bullet> = [], parent: Bullet = null) {
      this.text = text.replace('\t', '')

      this.parent = parent

      this.children = children
      this.children.forEach((child, i) => {
         child.parent = this
         child.key = i
      })
   }

   static fromStringArray(text: string, _lines: Array<string>): Bullet {
      //todo delete if it doesn't need to be copied
      var lines = [..._lines]

      var children = []

      while (lines.length > 0) {
         //childLines are removed from lines up until the second index where
         var childName = lines.shift()
         var childLines = []
         while (lines.length > 0 && lines[0].charAt(0) == '\t') {
            childLines.push(lines.shift().slice(1))
         }

         children.push(Bullet.fromStringArray(childName, childLines))
      }

      return new Bullet(text, children)
   }

   toString(): string {
      return this.toStringList().join('\n')
   }

   toStringList(strList: Array<string> = [], depth: number = 0): Array<string> {
      const childrenDepth = depth + 1
      this.children.forEach(c => {
         strList.push('\t'.repeat(childrenDepth) + c.text)
         c.toStringList(strList, childrenDepth)
      })

      return strList
   }
   // #endregion

   // #region Siblings
   sibling(offset: number): Bullet {
      if (offset == 0) throw 'bullet.sibling() called with offset of 0'

      var parent = this.parent
      if (!parent) return null

      return parent.childAt(parent.children.indexOf(this) + offset)
   }

   siblingCoords(offset: number): Array<number> {
      if (offset == 0) throw 'bullet.siblingCoords() called with offset of 0'

      var coords = this.coords
      coords[coords.length - 1] += offset

      return coords
   }

   addSibling(offset: number, bullet: Bullet) {
      if (offset == 0) throw 'bullet.addSibling() called with offset of 0'

      var parent = this.parent
      if (!parent) return

      if (offset < 0) offset += 1

      parent.addChildren(this.indexInParent + offset, bullet)
   }

   get siblingBefore(): Bullet {
      if (this.isFirstSibling) throw 'get bullet.siblingBefore() called even though it is the first sibling'

      return this.sibling(-1)
   }

   get siblingAfter(): Bullet {
      if (this.isLastSibling) throw 'get bullet.siblingAfter() called even though it is the last sibling'

      return this.sibling(1)
   }

   get isFirstSibling(): boolean {
      if (this.isRoot) return true
      return this.indexInParent == 0
   }

   get isLastSibling(): boolean {
      if (this.isRoot) return true
      return this.indexInParent == this.parent.childCount - 1
   }
   // #endregion

   // #region Getters
   get childCount(): number {
      return this.children.length
   }

   get isRoot(): boolean {
      return this.parent === null
   }

   get hasGrandParent(): boolean {
      return !this.parent.isRoot
   }

   get hasParent(): boolean {
      return !this.isRoot
   }

   get hasChildren(): boolean {
      return this.childCount > 0
   }

   get isChildless(): boolean {
      return !this.hasChildren
   }

   get coords(): Array<number> {
      var parent = this.parent
      if (!parent) return []

      return [...parent.coords, this.indexInParent]
   }

   get indexInParent(): number {
      if (this.isRoot) throw 'bullet.indexInParent() called on root bullet'
      return this.parent.children.indexOf(this)
   }

   get lastChild(): Bullet {
      if (this.childCount == 0) throw 'get bullet.lastChild() called on element without children'

      return this.children[this.children.length - 1]
   }

   get lastDescendant(): Bullet {
      if (this.children.length == 0) return this

      return this.lastChild.lastDescendant
   }

   get bulletBefore(): Bullet {
      if (this.isRoot) {
         return null
      }
      if (this.isFirstSibling) {
         return this.parent
      }

      return this.siblingBefore.lastDescendant
   }

   get bulletAfter(): Bullet {
      if (this.hasChildren) {
         return this.children[0]
      }
      if (!this.isLastSibling) {
         return this.siblingAfter
      }

      var ancestor = this.parent
      while (ancestor) {
         if (!ancestor.isLastSibling) {
            return ancestor.siblingAfter
         } else {
            ancestor = ancestor.parent
         }
      }

      return null
   }

   get childrenKeys() {
      return this.children.map<number>(c => c.key)
   }

   get newChildKey(): number {
      function findMissingPositive(nums: Array<number>) {
         var i: any

         // Mark arr[i] as visited by making arr[arr[i] - 1] negative.
         // Note that 1 is subtracted because index start
         // from 0 and positive numbers start from 1
         for (i = 0; i < nums.length; i++) {
            if (Math.abs(nums[i]) - 1 < nums.length && nums[Math.abs(nums[i]) - 1] > 0) {
               nums[Math.abs(nums[i]) - 1] = -nums[Math.abs(nums[i]) - 1]
            }
         }

         // Return the first index value at which is positive
         for (i = 0; i < nums.length; i++)
            if (nums[i] > 0)
               // 1 is added because indexes start from 0
               return i + 1

         return nums.length + 1
      }

      return findMissingPositive(this.childrenKeys)
   }

   //includes root and does not include itself
   get breadCrumbs(): Array<Bullet> {
      if (this.isRoot) return []

      return [...this.parent.breadCrumbs, this.parent]
   }
   // #endregion

   // #region Tree Interaction
   select(_caretIndex: number): Bullet {
      this.caretIndex = _caretIndex

      //make sure that the selected bullet is not a child of a collapsed bullet
      if (this.hasParent) {
         var ancestor = this.parent

         while (ancestor != null) {
            ancestor.isCollapsed = false
            ancestor = ancestor.parent
         }
      }

      return this
   }

   unselect(): Bullet {
      this.caretIndex = -1

      return this
   }

   childAt(_indexOrCoords: number | Array<number>): Bullet {
      if (!Array.isArray(_indexOrCoords)) {
         var index = _indexOrCoords
         if (index < 0 || index >= this.childCount) throw 'bullet.childAt() called with index out of bounds'
         return this.children[index]
      }

      var coords = [..._indexOrCoords]

      if (coords.length == 0) return this

      return this.childAt(coords.shift()).childAt(coords)
   }

   addChildren(index: number, _bullets: Bullet | Array<Bullet>) {
      var bullets = Array.isArray(_bullets) ? [..._bullets] : [_bullets]

      while (bullets.length > 0) {
         var newChild = bullets.pop()

         newChild.remove()
         newChild.parent = this
         newChild.key = this.newChildKey

         this.children.splice(index, 0, newChild)
      }
   }

   addChildrenToEnd(_bullets: Bullet | Array<Bullet>) {
      var bullets = Array.isArray(_bullets) ? [..._bullets] : [_bullets]

      while (bullets.length > 0) {
         var newChild = bullets.pop()

         newChild.remove()
         newChild.parent = this
         newChild.key = this.newChildKey

         this.children.push(newChild)
      }
   }

   remove(): Bullet {
      if (this.hasParent) {
         this.parent.removeChild(this.parent.children.indexOf(this))
      }

      this.parent = null
      this.key = null

      return this
   }

   removeChild(index: number): Bullet {
      if (index >= this.childCount) return null

      var removedBullet = this.childAt(index)

      removedBullet.parent = null
      removedBullet.key = null
      removedBullet.caretIndex = -1
      this.children.splice(index, 1)

      return removedBullet
   }

   removeChildren(index: number, count: number = null): Array<Bullet> {
      if (index >= this.childCount) return []

      if (!count) count = this.childCount - index

      var removedBullets = []

      for (var i = 0; i < count; i++) {
         removedBullets.push(this.removeChild(index))
      }

      return removedBullets
   }

   toggleCollapsed() {
      this.isCollapsed = !this.isCollapsed
   }

   setCollapsed(isCollapsed: boolean) {
      this.isCollapsed = isCollapsed
   }

   setCollapsedForAllDescendants(isCollapsed: boolean) {
      if (this.hasChildren) {
         this.children.forEach(c => c.setCollapsedForAllDescendants(isCollapsed))
         this.isCollapsed = isCollapsed
      }
   }
   // #endregion
}
