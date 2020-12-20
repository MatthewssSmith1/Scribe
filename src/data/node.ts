export default class Node {
   text: string
   numIndents: number
   id: number

   constructor(text: string, id: number) {
      var countNumberOfTabs = (str: string) => {
         var count = 0
         var index = 0
         while (str.charAt(index++) === '\t') {
            count++
         }
         return count
      }
      var numLeadingTabs = countNumberOfTabs(text)

      this.text = text.slice(numLeadingTabs)
      this.numIndents = numLeadingTabs

      this.id = id
   }

   swapText(other: Node): void {
      var tempText = this.text
      this.text = other.text
      other.text = tempText
   }
}
