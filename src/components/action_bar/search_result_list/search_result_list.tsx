import React from 'react'

export default class SearchResultList extends React.Component {
   //#region State
   private static _SINGLETON: SearchResultList

   static updateUI() {
      if (SearchResultList._SINGLETON) SearchResultList._SINGLETON.forceUpdate()
   }

   constructor(props: any) {
      super(props)

      SearchResultList._SINGLETON = this
   }
   //#endregion

   render() {
      console.log('SearchResultList built')

      return <div className="search-result-list"></div>
   }
}
