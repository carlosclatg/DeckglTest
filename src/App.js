import './App.css';
import DeckGL from '@deck.gl/react';
import {LineLayer, GeoJsonLayer, IconLayer} from '@deck.gl/layers';
import {WebMercatorViewport} from '@deck.gl/core';
import { SelectionLayer } from '@nebula.gl/layers';
import React, { useEffect, useState, useRef } from 'react';
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
import addGisDomainTileLayerByStandardApi from './layers/addGisDomainTileLayerByStandardApi';
import addGisDomainLayerByStandardApi from './layers/addGisDomainLayerByStandardApi'
import { WMSTileLayer } from './deckgl-custom'
import {getBoundingBox, viewportToExtension} from './utilities/index'




//PROPS AND COMPONENT-
const App = ({backgroud_tile_url="https://c.tile.openstreetmap.org/{z}/{x}/{y}.png", zoom=true, enable_select_object=true , map_style= null, remoteuser= null  }) =>{

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
  const [layerList, setLayerList] = useState(new Array(getTileMapLayer(backgroud_tile_url, 1, 19), new LineLayer({id: 'line-layer-init2', data: data2, pickable: true, visible: true})))
  const [viewport, setViewport] = useState({
    width: 1,
    height: 1,
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
    document.addEventListener('topogisevt_add_layer', handleAddLayer);
    document.addEventListener('topogisevt_remove_layer', handleRemoveLayer);
    document.addEventListener('topogisevt_center_on_object', handleCenterOnObject);
    const event = eventMapReadyBuilder();
    ReactDOM.findDOMNode(myRef.current).dispatchEvent(event)
  }, [])

  useEffect(()=>{
    if(Math.round(viewport.zoom) !== Math.round(previousZoom)){
      const { west, south, east, north } = viewportToExtension(viewport)
      const event = new CustomEvent("topogisevt_map_zoom_changed",  { bubbles: true, detail:{zoom: Math.round(viewport.zoom), west, south, east, north  }});
      ReactDOM.findDOMNode(myRef.current).dispatchEvent(event)
    }
  }, [viewport])


  useEffect(()=>{
    let layer = layerList.filter(e => e.id != "selection")
    console.log(layer.map(e=>e.id))
    if(!isdrawMode){
      setLayerList(new Array(...layer))
    } else {
      setLayerList(new Array(...layer, getSelectionLayer(layer, handleSelectedObjects)))
    }
  },[isdrawMode])

  
  useEffect(()=>{
    console.log('updated layer list')
  },[layerList])

  const onDeckClick = (info) => {
    if(enable_select_object){
      let objectSelected = deckRef.current.pickObject({x: info.x, y: info.y, radius: 10 })
      if(objectSelected){
        handleSelectedObjects(objectSelected)
      }
    }
  }

  const handleRemoveLayer = ({detail}) => {
    if(detail){
      let layer = layerList.filter(e => e.id !== detail)
      if(isdrawMode){
        setLayerList(new Array(...layer,getSelectionLayer(layer, handleSelectedObjects))) //update selectable layers as well.
      } else {
        setLayerList(new Array(...layer))
      }
    }
  }

  const handleCenterOnObject = ({detail}) => {
    if(detail){
        let options = {}
        if (remoteuser !== null && remoteuser.trim().length) {
            options = { headers: { 'REMOTE_USER': remoteuser } }
        }
          fetch(detail, options)
              .then((response) => {
                  response.json().then(json => {
                      console.log(json)
                      const extent = getBoundingBox(json);
                      const geojsonLayer = generateGeoJsonLayerfromJSON(json)
                      const viewportWebMercator = new WebMercatorViewport(viewport);
                      console.log(viewportWebMercator)
                      //const {longitude, latitude, zoom} = viewportWebMercator.fitBounds([[extent.xMin, 10], [10, 20]]); this line fails
                      let layer = layerList.filter(e => e.id != "selection")
                      layer.push(geojsonLayer)
                      //miss add the new layer to the selectable layer
                      if(!isdrawMode){
                        setLayerList(new Array(...layer ))
                      } else {
                        setLayerList(new Array(...layer,getSelectionLayer(layer, handleSelectedObjects)))
                      }
                      setViewport({
                        width: "100%",
                        height: "100%",
                        latitude: extent.xMin,
                        longitude: extent.yMax,
                        zoom: 2,
                      })
                  });
              })
              .catch(() => { });
      
    }
  }


  const handleAddLayer = async ({detail}) => { 
    console.log("handling layer")
    console.log(detail)
    let newLayer = null

    //check if a layer has already the new id
    if(layerList.some(e => detail.id === e.id)) return;
    //case layer geojson
    if(detail.type === GEOJSON_LAYER){
      if(detail.layer instanceof Object){
        if(gjv.valid(detail.layer)){ //check valid geojson otherwise nothing
          newLayer = generateGeoJsonLayer(detail)
        } else return
      } else {
        if(detail.tiled){
          newLayer = addGisDomainTileLayerByStandardApi(detail)
        } else {
          let extent = null
          newLayer = await addGisDomainLayerByStandardApi(detail, extent)
        }
      }
    } else if(detail.type === WMS_LAYER){ //case layer WMS
      if(detail.layer instanceof Object){
        console.log("WMS does not support layer object")
        return
      }
      newLayer = await new WMSTileLayer({id: detail.id, baseWMSUrl: detail.layer, remoteUser: null}) //arrives as prop
    }

    //Force update over selectable layers
    let layer = layerList.filter(e => e.id != "selection")
    layer.push(newLayer)
    //miss add the new layer to the selectable layer
    if(!isdrawMode){
      setLayerList(new Array(...layer ))
    } else {
      setLayerList(new Array(...layer,getSelectionLayer(layer, handleSelectedObjects)))
    }
  }

  const zoomControl = (viewState) => {
    setPreviousZoom(viewport.zoom)
    setViewport(viewState)
  }

  const toogleDrawingMode = (ischecked) => {
    setdrawMode(ischecked)
  }


  const handleSelectedObjects = (selectedObjects) => {
    if(!selectedObjects) return //case nothing
    if(Array.isArray(selectedObjects) && !selectedObjects.length) return
    if(!selectedObjects instanceof Object && !Array.isArray(selectedObjects))return //safety type-check single or multiple selection
    if(selectedObjects instanceof Object) {
      if(!Array.isArray(selectedObjects)){
        selectedObjects = new Array(selectedObjects) //case single selection.
      }
    }    
    const detail = selectedObjects.map(elem => {
      let obj = new Object();
      obj.domain_code = elem.layer.props.domain_code
      obj.space_code = elem.layer.props.space_code
      obj.id = elem.layer.id
      obj.object_id = elem.layer.props.object_id
      obj.object = elem.object
      obj.position = {
        lat: 12,
        lng: 15
      }
      return obj
    })   
    const ev = eventObjectSelectedBuilder(detail)
    ReactDOM.findDOMNode(myRef.current).dispatchEvent(ev)
  }




  const zoomIn = () => {
    let previousZoom = viewport.zoom
    setViewport({
      width: viewport.width,
      height: viewport.height,
      latitude: viewport.latitude,
      longitude: viewport.longitude,
      zoom: previousZoom+1 < MAXZOOM ? previousZoom + 1: previousZoom,
    })
    setPreviousZoom(previousZoom)
  }

  const zoomOut = () => {
    let previousZoom = viewport.zoom
    setViewport({
      width: viewport.width,
      height: viewport.height,
      latitude: viewport.latitude,
      longitude: viewport.longitude,
      zoom: previousZoom-1 > MINZOOM ? previousZoom - 1: previousZoom,
    })
    setPreviousZoom(previousZoom)
  }
  

  const removeLayer = () => {
    let layer = layerList.filter(e => e.id != "wms")
    setLayerList(new Array(...layer ))
  }


  const generateGeoJsonLayerfromJSON = (data) => {
    return new GeoJsonLayer({
        id: 'data.id',
        data: data,
        autoHighLight: true,
        highlightColor: [255, 255, 0],
        pickable: true,
        filled: true,
        extruded: false,
        stroke: true,
        lineWidthUnits: 'pixels',
        getFillColor: [0, 255, 255],
        getRadius: 3,
        pointRadiusUnits: 'pixels',
    });
}

  return (
    <div className="App" ref={myRef} style={{ height: '50vh', width: '50vw', position: 'relative' }}>
      <ControlPanel removeLayer={removeLayer} toogleDraw={toogleDrawingMode} emitevent={()=>console.log(layerList)} zoommin={zoomIn} zoomout={zoomOut} addLayer={handleAddLayer}/>
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

