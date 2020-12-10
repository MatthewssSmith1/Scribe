import React from 'react'

import NotePage from '@/components/content_body/note_page/note_page'
import GraphPage from '@/components/content_body/graph_page/graph_page'

import { Event, EventType, EventListener } from '@/rust-bindings/binding_event'
import RustInterface from '@/rust-bindings/rust_interface'

export enum Page {
   Note,
   Graph,
}

export default class ContentBody extends React.Component implements EventListener {
   state = {
      currentPage: Page.Note,
   }

   constructor(props: any) {
      super(props)

      RustInterface.subscribe(this, EventType.OpenGraphPage, EventType.OpenTodayPage)
   }

   handleEvent(e: Event) {
      switch (e.type) {
         case EventType.OpenGraphPage:
            this.setState({ currentPage: Page.Graph })
            break
         case EventType.OpenTodayPage:
            this.setState({ currentPage: Page.Note })
            break
      }
   }

   render() {
      return this.state.currentPage == Page.Note ? <NotePage /> : <GraphPage />
   }
}
