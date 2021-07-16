import './App.css';
import DeckGL from '@deck.gl/react';
import {LineLayer, GeoJsonLayer} from '@deck.gl/layers';
import { SelectionLayer } from '@nebula.gl/layers';
import React, { useEffect, useState, useRef } from 'react';
import { EditableGeoJsonLayer, DrawPolygonMode, ViewMode } from 'nebula.gl';
import ReactDOM from 'react-dom';
import reactToWebComponent from "react-to-webcomponent";
import {BitmapLayer} from '@deck.gl/layers';
import {TileLayer} from '@deck.gl/geo-layers';
import ControlPanel from './controlPanel'
import getSelectionLayer from './selectionLayer/selectionLayer'


//PROPS AND COMPONENT
const App = ({namesss}) =>{

  //MOCK DATA
  const MAXZOOM = 19
  const MINZOOM=1
  const data = [
    {sourcePosition: [-122.41669, 37.7853], targetPosition: [-70, 45]}
  ];
  const data2 = [
    {sourcePosition: [-122.41669, 37.7853], targetPosition: [-60, 38]}
  ];
  const INITIAL_VIEW_STATE = {
    longitude: -122.41669,
    latitude: 37.7853,
    zoom: 13,
    pitch: 0,
    bearing: 0
  };
  const data3 = [
    {sourcePosition: [-122.41669, 35], targetPosition: [-122.41669, 46]}
  ];

  


  const geojsonLayer = new GeoJsonLayer({
    id: 'geojson-layer',
    data: {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -56.25,
                  26.115985925333536
                ],
                [
                  -8.7890625,
                  -21.616579336740593
                ],
                [
                  22.148437499999996,
                  -13.581920900545844
                ],
                [
                  52.03125,
                  38.54816542304656
                ],
                [
                  -3.8671874999999996,
                  62.2679226294176
                ],
                [
                  -56.25,
                  26.115985925333536
                ]
              ]
            ]
          }
        }
      ]
    },
    pickable: true,
    stroked: false,
    filled: true,
    extruded: true,
    lineWidthScale: 20,
    lineWidthMinPixels: 2,
    getFillColor: [160, 160, 180, 200],
    getRadius: 100,
    getLineWidth: 1,
    getElevation: 30
  });


  const tilelayer = new TileLayer({
    data: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',

    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,

    renderSubLayers: props => {
      const {
        bbox: {west, south, east, north}
      } = props.tile;

      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north]
      });
    }
  });


  //STATE
  const [count, setCount] = useState(0);
  const [layerList, setLayerList] = useState(new Array(tilelayer, new LineLayer({id: 'line-layer-init2', data: data2, pickable: true, visible: true})))
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    latitude: 45,
    longitude: 9,
    zoom: 4,
  })
  const [isdrawMode, setdrawMode] = useState(false)

  //REFS TO DOM
  const myRef = useRef();
  const deckRef = useRef();
  const canvas = useRef()



  //HOOKS
  useEffect(()=>{ // in case a new layer is added, it should be available for selection. See how because no useState inside useEffect
  }, [layerList])
  
  useEffect(()=>{
    document.addEventListener('nv-event', handleNVEvent);
  })
  


  //EVENT HANDLING
  const handleNVEvent = ({detail}) => {
    console.log("component handling event")
  }

  const onDeckClick = (info) => {
    console.log(deckRef.current.pickObject({x: info.x, y: info.y, radius: 10 }))
  }


  const addLayer = () => { 
    setLayerList(new Array(...layerList ,new LineLayer({id: 'line-layer-' + count, data, visible: true, pickable: true})))
    setCount(count + 1)
  }


  const zoomControl = (viewState) => {
    setViewport(viewState)
    const event = new CustomEvent("zoom-changed",  { bubbles: true, detail: Math.round(viewState.zoom)});
    ReactDOM.findDOMNode(myRef.current).dispatchEvent(event)
  }

  const toogleDrawingMode = (ischecked) => {
    let layer = layerList.filter(e => e.id != "selection")
    console.log(layer)
    if(!ischecked){
      setLayerList(new Array(...layer))
    } else {
      setLayerList(new Array(...layer, getSelectionLayer(layer)))
    }
    setdrawMode(ischecked)
  }




  const zoomIn = () => {
    setViewport({
      width: "100%",
      height: "100%",
      latitude: viewport.latitude,
      longitude: viewport.longitude,
      zoom: viewport.zoom+1 < MAXZOOM ? viewport.zoom + 1: viewport.zoom,
    }) 
  }

  const zoomOut = () => {
    setViewport({
      width: "100%",
      height: "100%",
      latitude: viewport.latitude,
      longitude: viewport.longitude,
      zoom: viewport.zoom-1 > MINZOOM ? viewport.zoom - 1: viewport.zoom,
    }) 
  }
  

  return (
    <div className="App" ref={myRef}>
      <ControlPanel toogleDraw={toogleDrawingMode} emitevent={()=>console.log(123)} zoommin={zoomIn} zoomout={zoomOut} addLayer={addLayer}/>
      <DeckGL
        ref={deckRef}
        initialViewState={viewport}
        controller={true}
        onViewStateChange={({ viewState }) => zoomControl(viewState)}
        layers={[layerList ]} 
        pickable={true}
        onClick={onDeckClick}
        canvas={canvas}>
          <LineLayer id="line-layer-xx" data={data2} pickable={true} visible={true} opacity= {1}/>
      </DeckGL>
      </div>
  );
}

export default App;





/*Make the build:

const WebApp = reactToWebComponent(App, React, ReactDOM);
customElements.define("my-map", WebApp);

from the folder that contains App.js (the component itself):
parcel build App.js

See the output in dist/App.js --> import it by using tag script

example WMS:
https://github.com/visgl/deck.gl/issues/5058

example of control panel:
https://github.com/visgl/deck.gl/blob/6.4-release/showcases/wind/src/control-panel.js
**/


//Proxies for type checking: https://medium.com/@SylvainPV/type-safety-in-javascript-using-es6-proxies-eee8fbbbd600
// validate geojson https://www.npmjs.com/package/geojson-validation



//MISSING

