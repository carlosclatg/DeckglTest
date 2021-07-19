import './App.css';
import DeckGL from '@deck.gl/react';
import {LineLayer, GeoJsonLayer, IconLayer} from '@deck.gl/layers';
import { SelectionLayer } from '@nebula.gl/layers';
import React, { useEffect, useState, useRef } from 'react';
import { EditableGeoJsonLayer, DrawPolygonMode, ViewMode } from 'nebula.gl';
import ReactDOM from 'react-dom';
import reactToWebComponent from "react-to-webcomponent";
import ControlPanel from './controlPanel'
import getSelectionLayer from './layers/selectionLayer'
import getTileMapLayer from './layers/tileMapLayer'
import eventObjectSelectedBuilder from './events/eventObjectSelectedBuilder'
import generateGeoJsonLayer from './layers/geojsonLayer'
import gjv from 'geojson-validation'
import eventMapReadyBuilder from './events/eventMapReadyBuilder'
import { GEOJSON_LAYER, WMS_LAYER } from './constants';



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

  const geojson_data = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "domain_code":"domain",
          "space_code": "space",
          "layer_id": "layer_id_xxxx"
        },
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
  }


  const geojsonLayer = new GeoJsonLayer({
    id: 'geojson-layer',
    data: geojson_data ,
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



  //STATE
  const [previousZoom, setPreviousZoom] = useState(4)
  const [layerList, setLayerList] = useState(new Array(getTileMapLayer('https://c.tile.openstreetmap.org/{z}/{x}/{y}.png', 1, 19), new LineLayer({id: 'line-layer-init2', data: data2, pickable: true, visible: true})))
  const [viewport, setViewport] = useState({
    width: "50%",
    height: "50%",
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
  useEffect(()=>{
    document.addEventListener('topogisevt_add_layer', addLayer);
    const event = eventMapReadyBuilder();
    ReactDOM.findDOMNode(myRef.current).dispatchEvent(event)
  }, [])

  useEffect(()=>{
    if(viewport.zoom !== previousZoom){
      const event = new CustomEvent("zoom-changed",  { bubbles: true, detail:{zoom: Math.round(viewport.zoom), west: 0, north: 1, east: 2, south:4 }});
      ReactDOM.findDOMNode(myRef.current).dispatchEvent(event)
    }
  }, [viewport])


  useEffect(()=>{
    let layer = layerList.filter(e => e.id != "selection")
    console.log(layer.map(e=>e.id))
    if(!isdrawMode){
      setLayerList(new Array(...layer))
    } else {
      setLayerList(new Array(...layer, getSelectionLayer(layer)))
    }
  },[isdrawMode])

  
  useEffect(()=>{
    console.log(layerList)
  },[layerList])

  const onDeckClick = (info) => {

    let objectSelected = deckRef.current.pickObject({x: info.x, y: info.y, radius: 10 })
    // if(objectSelected){
    const event = eventObjectSelectedBuilder(objectSelected)
    //   ReactDOM.findDOMNode(myRef.current).dispatchEvent(event)
    // }

    
  }


  const addLayer = ({detail}) => { 
    console.log("handling layer")
    console.log(detail)
    let newLayer = null

    //check if a layer has already the new id
    if(layerList.some(e => detail.id === e.id)) return;
    //case layer geojson
    if(detail.type === GEOJSON_LAYER){
      if(gjv.valid(detail.layer)){ //check valid geojson otherwise nothing
        newLayer = generateGeoJsonLayer(detail)
      }
    } else if(detail.type === WMS_LAYER){ //case layer WMS

    }


    //Force update over selectable layers
    let layer = layerList.filter(e => e.id != "selection")
    layer.push(newLayer)
    //miss add the new layer to the selectable layer
    if(!isdrawMode){
      setLayerList(new Array(...layer ))
    } else {
      setLayerList(new Array(...layer,getSelectionLayer(layer)))
    }
  }


  const zoomControl = (viewState) => {
    setPreviousZoom(viewport.zoom)
    setViewport(viewState)
  }

  const toogleDrawingMode = (ischecked) => {
    setdrawMode(ischecked)
  }




  const zoomIn = () => {
    let previousZoom = viewport.zoom
    setPreviousZoom(previousZoom)
    setViewport({
      width: "100%",
      height: "100%",
      latitude: viewport.latitude,
      longitude: viewport.longitude,
      zoom: previousZoom+1 < MAXZOOM ? previousZoom + 1: previousZoom,
    })
  }

  const zoomOut = () => {
    let previousZoom = viewport.zoom
    setPreviousZoom(previousZoom)
    setViewport({
      width: "100%",
      height: "100%",
      latitude: viewport.latitude,
      longitude: viewport.longitude,
      zoom: previousZoom-1 > MINZOOM ? previousZoom - 1: previousZoom,
    })
  }
  

  return (
    <div className="App" ref={myRef} style={{ height: '50vh', width: '50vw', position: 'relative' }}>
      <ControlPanel toogleDraw={toogleDrawingMode} emitevent={()=>console.log(layerList)} zoommin={zoomIn} zoomout={zoomOut} addLayer={addLayer}/>
      <DeckGL
        ref={deckRef}
        initialViewState={viewport}
        controller={true}
        onViewStateChange={({ viewState }) => zoomControl(viewState)}
        layers={[layerList ]} 
        pickable={true}
        onClick={onDeckClick}
        canvas={canvas}>
          <LineLayer id="line-layer-xx" data={data2} pickable={true} visible={true} opacity= {1} 
          autoHighlight= {true} 
          />
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

//console.log(gjv.valid(geojson_data)) //Expect true
//console.log(gjv.valid({myapp: 1})) //expect false


//Highlight
//https://stackoverflow.com/questions/60734315/change-colour-of-clicked-item-in-deck-gl

//MISSING

