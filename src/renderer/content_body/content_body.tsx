import React from 'react'

import NotePage from '@/renderer/content_body/note_page/note_page'
import GraphPage from '@/renderer/content_body/graph_page/graph_page'

export enum Page {
   Note,
   Graph,
}

export default class ContentBody extends React.Component {
   //#region Static
   private static _SINGLETON: ContentBody

   constructor(props: any) {
      super(props)

      ContentBody._SINGLETON = this
   }

   static openNotePage() {
      ContentBody._SINGLETON.setState({ currentPage: Page.Note })
   }

   static openGraphPage() {
      ContentBody._SINGLETON.setState({ currentPage: Page.Graph })
   }
   //#endregion

   state = {
      currentPage: Page.Note,
   }

   render() {
      return this.state.currentPage == Page.Note ? <NotePage /> : <GraphPage />
   }
}
