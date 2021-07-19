import {WebMercatorViewport} from '@deck.gl/core';

export default function eventZoomChangedBuilder(viewPort){
    const proj = new WebMercatorViewport(viewPort)
    const [west, north] = proj.unproject([0,0])
    const [east, south] = proj.unproject([viewPort.width, viewPort.height])
    return new CustomEvent("zoom-changed",  { bubbles: true, detail:{zoom: Math.round(viewPort.zoom), west, north, east, south }});
}