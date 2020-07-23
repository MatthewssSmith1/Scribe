import React from 'react'

import * as d3 from 'd3'

export default class GraphPage extends React.Component {
   private svg: d3.Selection<SVGSVGElement, undefined, HTMLElement, any>
   private width = 800
   private height = 450

   private notchesMoved = 0
   private minNotchesMoved = -10 //zooming in limit
   private maxNotchesMoved = 6 //zooming out limit

   render() {
      return <div className="graph-page" />
   }

   updateSVGViewBox() {
      var zoomMultiplier = 1.1 ** this.notchesMoved
      var w = this.width * zoomMultiplier
      var h = this.height * zoomMultiplier

      this.svg.attr('viewBox', `${-w / 2} ${-h / 2} ${w} ${h}`)
   }

   componentDidMount() {
      this.createGraph()
      this.svg = d3.select('svg')

      this.updateSVGViewBox()

      var svg = document.querySelector('svg') as SVGSVGElement
      svg.addEventListener('wheel', this.handleMouseWheel)
   }

   componentWillUnmount() {
      var svg = document.querySelector('svg') as SVGSVGElement
      svg.removeEventListener('wheel', this.handleMouseWheel)
   }

   handleMouseWheel = (e: WheelEvent) => {
      var didWheelUp = e.deltaY < 0
      this.notchesMoved += didWheelUp ? -1 : 1

      if (this.notchesMoved > this.maxNotchesMoved) this.notchesMoved = this.maxNotchesMoved
      else if (this.notchesMoved < this.minNotchesMoved) this.notchesMoved = this.minNotchesMoved

      this.updateSVGViewBox()
   }

   createGraph() {
      const drag = simulation => {
         function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
         }

         function dragged(d) {
            d.fx = d3.event.x
            d.fy = d3.event.y
         }

         function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
         }

         return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended)
      }

      const scale = d3.scaleOrdinal(d3.schemeCategory10)
      const color = d => scale(d.group)

      //#region Data
      interface Node {
         id: number
         group: string
         radius: number
      }

      interface Link {
         source: number
         target: number
         width: number
      }

      interface Data {
         nodes: Array<Node>
         links: Array<Link>
      }

      const data: Data = {
         nodes: [
            { id: 0, group: 'grp1', radius: 5 },
            { id: 1, group: 'grp1', radius: 7 },
            { id: 2, group: 'grp5', radius: 5 },
            { id: 3, group: 'grp1', radius: 5 },
            { id: 4, group: 'grp1', radius: 5 },
            { id: 5, group: 'grp2', radius: 5 },
            { id: 6, group: 'grp2', radius: 5 },
            { id: 7, group: 'grp2', radius: 5 },
            { id: 8, group: 'grp1', radius: 5 },
            { id: 9, group: 'grp1', radius: 5 },
            { id: 10, group: 'grp3', radius: 5 },
            { id: 11, group: 'grp1', radius: 5 },
            { id: 12, group: 'grp1', radius: 6 },
            { id: 13, group: 'grp3', radius: 5 },
            { id: 14, group: 'grp4', radius: 5 },
            { id: 15, group: 'grp4', radius: 5 },
            { id: 16, group: 'grp4', radius: 5 },
            { id: 17, group: 'grp4', radius: 5 },
         ],
         links: [
            { source: 1, target: 2, width: 2 },
            { source: 1, target: 0, width: 2 },
            { source: 1, target: 3, width: 20 },
            { source: 1, target: 4, width: 2 },
            { source: 1, target: 5, width: 2 },
            { source: 1, target: 6, width: 2 },
            { source: 1, target: 7, width: 20 },
            { source: 16, target: 7, width: 20 },
            { source: 16, target: 17, width: 2 },
            { source: 10, target: 9, width: 2 },
            { source: 10, target: 11, width: 2 },
            { source: 8, target: 11, width: 20 },
            { source: 12, target: 13, width: 20 },
            { source: 12, target: 14, width: 2 },
            { source: 12, target: 15, width: 20 },
         ],
      }
      //#endregion

      var minID = Math.min(...data.nodes.map(n => n.id))
      var maxID = Math.max(...data.nodes.map(n => n.id))
      var colorGradient = d3.scaleLinear<string>().domain([minID, maxID]).range(['purple', 'blue'])

      const links = data.links.map(d => Object.create(d))
      const nodes = data.nodes.map(d => Object.create(d))

      const svg = d3.create('svg')

      const simulation: d3.Simulation<any, any> = d3
         .forceSimulation(nodes)
         .force('link', d3.forceLink(links).distance(25).strength(0.7))
         .force('charge', d3.forceManyBody().strength(-60))
         .force('x', d3.forceX())
         .force('y', d3.forceY())

      const link = svg
         .append('g')
         .attr('stroke', '#999')
         .attr('stroke-opacity', 0.6)
         .selectAll('line')
         .data(links)
         .join('line')
         .attr('stroke-width', l => Math.sqrt(l.width))

      const node = svg
         .append('g')
         .attr('stroke', '#ffffff00')
         .attr('stroke-width', 1.5)
         .selectAll('g')
         .data(nodes)
         .join('g')
         .call(drag(simulation))
         .append('circle')
         .attr('r', (n: Node) => n.radius)
         .attr('fill', (n: Node) => colorGradient(n.id))

      node.append('title').text(d => ` My ID is: ${d.id}`)

      simulation.on('tick', () => {
         link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y)

         node.attr('cx', d => d.x).attr('cy', d => d.y)
      })

      document.querySelector('.graph-page').appendChild(svg.node())
   }
}
