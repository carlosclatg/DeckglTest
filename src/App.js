import './App.css';
import DeckGL from '@deck.gl/react';
import _ from 'lodash';
import {LineLayer, GeoJsonLayer, IconLayer} from '@deck.gl/layers';
import {Viewport, MapView} from '@deck.gl/core';
import { SelectionLayer } from '@nebula.gl/layers';
import EventEmitter from 'events'
import React, { useEffect, useState, useRef, useCallback } from 'react';
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
import MapStyle from './styles';
import {WebMercatorViewport} from '@deck.gl/core';
import { fromEvent } from 'rxjs';







//PROPS AND COMPONENT-
const App = ({backgroud_tile_url="https://c.tile.openstreetmap.org/{z}/{x}/{y}.png", width=600, height=600, center={ lat: 41.8788383, lng: 12.3594608 }, zoom=4, enable_select_object=true , map_style= null, remoteuser= null  }) =>{

  //MOCK DATA
  const MAXZOOM = 19
  const MINZOOM=1
  const data2 = [
    {sourcePosition: [-122.41669, 37.7853], targetPosition: [-60, 38]}
  ];



  const INITIAL_VIEW_STATE = {
    width: 1,
    height: 1,
    latitude: center.lat,
    longitude: center.lng,
    zoom: zoom,
  };

  //STATE
  const [previousZoom, setPreviousZoom] = useState(INITIAL_VIEW_STATE.zoom)
  const [viewport, setViewport] = useState(INITIAL_VIEW_STATE)
  const [isdrawMode, setdrawMode] = useState(false)
  const [mapStyle, setMapStyle] = useState(new MapStyle(null))
  const [layerList, setLayerList] = useState(()=>[getTileMapLayer(backgroud_tile_url, MINZOOM, MAXZOOM)])
  
  //REFS TO DOM
  const myRef = useRef();
  const deckRef = useRef();
  const canvas = useRef();

  //HOOKS
  useEffect(()=>{
    if(map_style){
      fetch(map_style)
        .then(d => d.ok && d.json().then(j => { setMapStyle(new MapStyle(j)) }))
        .catch(e => console.log(e));
    }
    const event = eventMapReadyBuilder();
    ReactDOM.findDOMNode(myRef.current).dispatchEvent(event)
    fromEvent(document, "topogisevt_add_layer").subscribe(event=>handleAddLayer(event)) //BE very careful... handleAddLayer is inmunatable after initial load. 
    fromEvent(document, "topogisevt_remove_layer").subscribe(event=>handleRemoveLayer(event))
    fromEvent(document, "topogisevt_center_on_object").subscribe(event=>handleCenterOnObject(event))
  },[])

  useEffect(()=>{
    console.log(layerList)
  }, [layerList])

  useEffect(()=>{
    if(Math.round(viewport.zoom) !== Math.round(previousZoom)){
      const { west, south, east, north } = viewportToExtension(viewport)
      const event = new CustomEvent("topogisevt_map_zoom_changed",  { bubbles: true, detail:{zoom: Math.round(viewport.zoom), west, south, east, north  }});
      ReactDOM.findDOMNode(myRef.current).dispatchEvent(event)
    }
  }, [viewport])


  useEffect(()=>{
    if(isdrawMode){
      setLayerList((layerList) =>new Array(...layerList, getSelectionLayer(layerList, handleSelectedObjects)))
    } else {
      setLayerList((layerList) =>new Array(...layerList.filter(e=>e.id!=="selection")))
    }
  },[isdrawMode])


  const onDeckClick = (info) => {
    if(enable_select_object && !isdrawMode){ //in case selectionPolygonMode is on, nothing should happen when clicking.
      let objectSelected = deckRef.current.pickObject({x: info.x, y: info.y, radius: 10 })
      if(objectSelected){
        handleSelectedObjects(objectSelected)
      }
    }
  }

  const handleRemoveLayer = ({detail}) => {
    console.log(detail)
    if(detail){
      console.log(layerList)
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
                    if(!gjv.isGeoJSONObject(json)) return
                    console.log(json)
                    const extent = getBoundingBox(json);
                    const geojsonLayer = generateGeoJsonLayerfromJSON(json)
                    const newviewport = new WebMercatorViewport(viewport);
                    let {latitude, longitude, zoom} = newviewport.fitBounds([[extent.xMin, extent.yMin], [extent.xMax, extent.yMax]])
                    if(zoom < 0) zoom = Math.abs(zoom + 1)
                    let layer = layerList.filter(e => e.id != "selection")
                    layer.push(geojsonLayer)
                    if(!isdrawMode){
                      setLayerList(new Array(...layer ))
                    } else {
                      setLayerList(new Array(...layer,getSelectionLayer(layer, handleSelectedObjects)))
                    }
                    setViewport({width: viewport.width,height: viewport.height,latitude: latitude,longitude: longitude,zoom: zoom})
                });
            })
            .catch((err) => console.log('An error ocurred while fetching or transforming the layer from the URL'));
    }
  }

  const handleAddLayer = ({detail})=> { 
    let newLayer = null
    if(deckRef.current.props.layers.some(e=>{ //reference to DOM!!!!!
      return e.id == detail.id
    })) return
    console.log("Not to reach")
    
    //case layer geojson
    if(detail.type === GEOJSON_LAYER){
      if(detail.layer instanceof Object){
        if(gjv.valid(detail.layer)){ //check valid geojson otherwise nothing
          newLayer = generateGeoJsonLayer(detail, mapStyle)
        } else return
      } else {
        if(detail.tiled){
          newLayer = addGisDomainTileLayerByStandardApi(detail, mapStyle, remoteuser)
        } else {
          let extent = viewportToExtension(viewport)
          newLayer = addGisDomainLayerByStandardApi(detail, extent,remoteuser)
        }
      }
    } else if(detail.type === WMS_LAYER){ //case layer WMS
      if(detail.layer instanceof Object){
        console.log("WMS does not support layer object")
        return
      }
      newLayer = new WMSTileLayer({id: detail.id, baseWMSUrl: detail.layer, remoteUser: null})
    } else {

    }

    if(newLayer){
      //https://github.com/visgl/deck.gl/discussions/5593
      //Diferencia entre:
      setLayerList((layerList)=>[...layerList, newLayer])
      
    }
  }



  const zoomControl = (viewState) => {
    setPreviousZoom(viewport.zoom)
    setViewport(viewState)
  }

  const toogleDrawingMode = (ischecked) => {
    setdrawMode(ischecked)
  }

  //Valorar si podemos enviar el polygono de seleccion.
  const handleSelectedObjects = (selectedObjects) => {
    // console.log(selectedObjects)
    if(!selectedObjects) return //case nothing
    if(Array.isArray(selectedObjects) && !selectedObjects.length) return
    if(!selectedObjects instanceof Object && !Array.isArray(selectedObjects))return //safety type-check single or multiple selection
    if(selectedObjects instanceof Object) {
      if(!Array.isArray(selectedObjects)){
        selectedObjects = new Array(selectedObjects) //case single selection.
      }
    }    
    const detail = selectedObjects.map(sel => {
      let obj = new Object();
      obj.domain_code = sel.object.properties && sel.object.properties.domain_code || undefined
      obj.space_code = sel.object.properties && sel.object.properties.space_code || undefined
      obj.id = sel.layer.id
      obj.object_id = sel.object && sel.object.properties && sel.object.properties.internal_id || undefined
      obj.object = sel.object

      if(sel.coordinate){ //case picked
        obj.position = {
          lat: sel.coordinate[1],
          lng: sel.coordinate[0]
        }
      } else {//case selected
        obj.position = {
          lat: null,
          lng: null
        }
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
    console.log(layerList)
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

  //That does not work as it does not prevent triggering other events like getFillColor...
  const _layerFilter =({layer, renderPass})=>{
    if(layer.id == 'layer-geojson-point'){
      console.log("returning false")
      return false
    } else {
      console.log("-----------returning true-----------------")
      return true
    }
  }

  //At this moment, what it will do is simply filter in the display, not removing from memory the layer itself.
  const removeLayer = () => {
    setLayerList((layerList)=>layerList
      .filter(e => {
        if(!e) return false
        if(e.id === 'layer-geojson-point') return false
        return true
      })
    )
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
    <div className="App" ref={myRef} style={{ height, width, position: 'relative' }}>
      <ControlPanel removeLayer={removeLayer} drawMode={isdrawMode} toogleDraw={toogleDrawingMode} emitevent={(checked)=>console.log(layerList)} zoommin={zoomIn} zoomout={zoomOut} addLayer={handleAddLayer}/>
      <DeckGL
        ref={deckRef}
        initialViewState={viewport}
        controller={true}
        onViewStateChange={({ viewState }) => zoomControl(viewState)}
        layers={layerList} 
        pickable={true}
        onClick={onDeckClick}
        canvas={canvas}>
          {/* <LineLayer id="line-layer-xx" data={data2} pickable={true} visible={true} opacity= {1} 
          autoHighlight= {true} getColor={[200, 140, 0]} getWidth= {50}
          /> */}
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



/*

KNOWN ERRORS:

1. ADD WMS, remove WMS, ADD again WMS (it is not displayed) and then add a new layer --> WMS is seen again but with trace errors
https://rxjs.dev/api/index/function/fromEvent#overloads

*/

