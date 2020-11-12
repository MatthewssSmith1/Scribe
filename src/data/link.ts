export default class Link {
   constructor(public fromDocName: string, public fromLine: number, public toDocName: string, public toLine: number) {}

   //#region Serialization
   toString(): string {
      return `${this.fromDocName},${this.fromLine}->${this.toDocName},${this.toLine}`
   }

   static fromString(str: string): Link {
      var fromDocName = str.slice(0, str.indexOf(','))
      var fromLine = parseInt(str.slice(str.indexOf(',') + 1, str.indexOf('->')))
      var toDocName = str.slice(str.indexOf('->') + 2, str.lastIndexOf(','))
      var toLine = parseInt(str.slice(str.lastIndexOf(',') + 1))

      return new Link(fromDocName, fromLine, toDocName, toLine)
   }
   //#endregion
}
