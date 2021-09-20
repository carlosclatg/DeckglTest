import DeckGL from '@deck.gl/react';
import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import reactToWebComponent from "react-to-webcomponent";
import getSelectionLayer from './layers/getSelectionLayer'
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
import PropTypes from 'prop-types';
import { defaultStyle } from './styles/custom-style';
import { divInsideHost, divInsideTopRight, hostStyle, slotBottomLeft, slotBottomRight, slotTopLeft, topRight } from './css-styles';
import { GeoJsonLayer } from '@deck.gl/layers';
import {TileLayer} from '@deck.gl/geo-layers';

//PROPS AND COMPONENT-
const App = (props) =>{

  //MOCK DATA
  const MAXZOOM=23
  const MINZOOM=0
  

  //STATE
  const [previousZoom, setPreviousZoom] = useState(parseInt(props.zoom))
  const [viewport, setViewport] = useState({width: 1,height: 1,latitude: props.center.lat,longitude: props.center.lng,zoom: parseInt(props.zoom)})
  const [isdrawMode, setdrawMode] = useState(false)
  const [mapStyle, setMapStyle] = useState(new MapStyle(null))
  const [layerList, setLayerList] = useState(()=>[getTileMapLayer(props.background_tile_url, MINZOOM, MAXZOOM, defaultStyle)])

  //REFS TO DOM
  const myRef = useRef();
  const deckRef = useRef();
  const canvas = useRef();

  //HOOKS
  useEffect(()=>{
    console.log(props)
    if(props.map_style){
      fetch(props.map_style)
        .then(d => d.ok && d.json().then(j => { setMapStyle(new MapStyle(j)) }))
        .catch(e => {
          setMapStyle(new MapStyle(null)) //default style
        });
    } else {
      setMapStyle(new MapStyle(null)) //default style
    }
    const event = eventMapReadyBuilder();
    ReactDOM.findDOMNode(myRef.current).dispatchEvent(event)
    fromEvent(document, "topogisevt_add_layer").subscribe(event=>handleAddLayer(event)) //BE very careful... handleAddLayer is inmunatable after initial load. 
    fromEvent(document, "topogisevt_remove_layer").subscribe(event=>handleRemoveLayer(event))
    fromEvent(document, "topogisevt_center_on_object").subscribe(event=>handleCenterOnObject(event))
    localStorage.removeItem("selectedItems")
    return () => { //when unmounting
      localStorage.removeItem("selectedItems")
    }
  },[])

  useEffect(()=>{
  }, [layerList])


  //zoom paramter changed
  useEffect(()=>{
    setViewport({
      width: viewport.width,
      height: viewport.height,
      latitude: viewport.latitude,
      longitude: viewport.longitude,
      zoom: parseInt(props.zoom),
    })
  }, [props.zoom])

  //center parameter changed
  useEffect(()=>{
    setViewport({
      width: viewport.width,
      height: viewport.height,
      latitude: props.center.lat,
      longitude: props.center.lng,
      zoom: viewport.zoom,
    })
  }, [props.center])

  //zoom changed in current viewport
  useEffect(()=>{
    if(Math.round(viewport.zoom) !== Math.round(previousZoom)){
      const { west, south, east, north } = viewportToExtension(viewport)
      const event = new CustomEvent("topogisevt_map_zoom_changed",  { bubbles: true, cancelable: true, composed: true, detail:{zoom: Math.round(viewport.zoom), west, south, east, north  }});
      ReactDOM.findDOMNode(myRef.current).dispatchEvent(event)
    }
  }, [viewport])


  useEffect(()=>{
    if(isdrawMode){
      setLayerList((layerList) =>new Array(...layerList, getSelectionLayer(layerList, handleSelectedObjects, props.multi_polygon_selector)))
    } else {
      setLayerList((layerList) =>new Array(...layerList.filter(e=>e.id!=="SelectionLayer")))
    }
  },[isdrawMode])

  const onDeckClick = (info, event) => {
    console.log(event)
    if(props.enable_select_object && !isdrawMode){ //in case selectionPolygonMode is on, nothing should happen when clicking.
      let objectSelected = deckRef.current.pickMultipleObjects({x: info.x, y: info.y, radius: 1 })
      if(objectSelected){
        handleSelectedObjects(objectSelected, event)
      }
    }
  }

  const handleRemoveLayer = ({detail}) => {
    if(detail){
      if(!deckRef.current.props.layers.some(e => e.id == detail)) return
      let layer = deckRef.current.props.layers.filter(e => e.id !== detail)
      if(isdrawMode){
        setLayerList((layers) =>new Array(...layer.filter(e => e.id !== 'SelectionLayer'),getSelectionLayer(layer, handleSelectedObjects, props.multi_polygon_selector))) //update selectable layers as well.
      } else {
        setLayerList((layers) =>new Array(...layer))
      }
    }
  }

  const handleCenterOnObject = ({detail}) => {
    if(detail){
        let options = {}
        if (props.remote_user && props.remote_user.trim().length) {
            options = { headers: { 'REMOTE_USER': props.remote_user } }
        }
        fetch(detail, options)
            .then((response) => {
                response.json().then(json => {
                    if(!gjv.isGeoJSONObject(json)) return
                    const extent = getBoundingBox(json);
                    const newviewport = new WebMercatorViewport(viewport);
                    if(extent.xMin === extent.xMax === extent.yMax === extent.yMin === 0){
                      //Polygon not provided --> Nothing to do in the viewport
                    } else {
                      let {latitude, longitude, zoom} = newviewport.fitBounds([[extent.xMin, extent.yMin], [extent.xMax, extent.yMax]])
                      if(zoom < 0) zoom = Math.abs(zoom) +1
                      setViewport({width: viewport.width,height: viewport.height,latitude,longitude,zoom})
                    }
                });
            })
            .catch((err) => console.log('An error ocurred while fetching or transforming the layer from the URL'));
    }
  }

  const handleAddLayer = ({detail})=> { 
    let newLayer = null
    if(!deckRef.current.props.layers) return 
    if(deckRef.current.props.layers.some(e=>{ //reference to DOM!!!!!
      return e.id == detail.id
    })) return
    
    //case layer geojson
    if(detail.type === GEOJSON_LAYER){
      if(detail.layer instanceof Object){
        if(gjv.valid(detail.layer)){ //check valid geojson otherwise nothing
          //Verify if unique_id is present or not, else generate.
          newLayer = generateGeoJsonLayer(detail,mapStyle, true)
        } else return
      } else {
        if(detail.tiled){
          newLayer = addGisDomainTileLayerByStandardApi(detail, mapStyle, props.remote_user, true)
        } else {
          let extent = viewportToExtension(viewport)
          return addGisDomainLayerByStandardApi(detail, extent,props.remote_user, mapStyle).then(layer=>{
            if(layer) setLayerList((layerList)=>[...layerList, layer])
          })
        }
      }
    } else if(detail.type === WMS_LAYER){ //case layer WMS
      if(detail.layer instanceof Object){
        console.log("WMS does not support layer object")
        return
      }
      newLayer = new WMSTileLayer({id: detail.id, baseWMSUrl: detail.layer, remote_user: props.remote_user})
    } else {

    }
    if(newLayer){
      //https://github.com/visgl/deck.gl/discussions/5593
      setLayerList((layerList)=>[...layerList, newLayer])
    }
  }

  const zoomControl = (viewState) => {
    setPreviousZoom(viewport.zoom)
    setViewport(viewState)
  }

  const toogleDrawingMode = () => {
    setdrawMode(!isdrawMode)
  }

  const handleSelectedObjects = (selectedObjects, event = null) => {
    setdrawMode(false)
    if(!selectedObjects){
      localStorage.removeItem("selectedItems")
      console.log("removed elements")
      reinitLayer()
      return //case nothing
    } 
    if(Array.isArray(selectedObjects) && !selectedObjects.length) return
    if(!selectedObjects instanceof Object && !Array.isArray(selectedObjects))return //safety type-check single or multiple selection
    if(selectedObjects instanceof Object) {
      if(!Array.isArray(selectedObjects)){
        selectedObjects = new Array(selectedObjects) //case single selection.
      }
    }
    let newSelectedItems =  []
    if(event && event.srcEvent && event.srcEvent.ctrlKey){//add to the previous selected items
      if(localStorage.getItem("selectedItems")){ 
        newSelectedItems =  new Set([...new Set(JSON.parse(localStorage.getItem("selectedItems"))), ...selectedObjects.map(e => e.object.properties.unique_id)])
      } else { //no one is previously selected
        newSelectedItems =  new Set([...selectedObjects.map(e => e.object.properties.unique_id)])
      }
    } else { //only new elements
      newSelectedItems =  new Set([...selectedObjects.map(e => e.object.properties.unique_id)])
    }
    
    localStorage.removeItem("selectedItems") //remove all, add all + new ones.
    localStorage.setItem("selectedItems", JSON.stringify([...newSelectedItems]))
    const ev = eventObjectSelectedBuilder(buildSelectedObjects(selectedObjects))
    ReactDOM.findDOMNode(myRef.current).dispatchEvent(ev)
    reinitLayer()
  }

  const buildSelectedObjects =(selectedObjects)=> {
    return selectedObjects.map(sel => {
      let obj = new Object();
      obj.domain_code = sel.object.properties && sel.object.properties.domain || undefined;
      obj.space_code = sel.object.properties && sel.object.properties.space || undefined;
      obj.layer_id = sel.layer.id;
      obj.external_id = sel.object && sel.object.properties && sel.object.properties.internal_id || undefined;
      obj.object = sel.object;
      obj.unique_id = sel.object && sel.object.properties && sel.object.properties.unique_id || undefined; //will send even if it has been added manually
  
      if (sel.coordinate) {
        obj.position = {
          lat: sel.coordinate[1] ? sel.coordinate[1] : null,
          lng: sel.coordinate[0] ? sel.coordinate[0] : null
        };
      }
      return obj;
    });
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

  const deleteSelectedItems = () => {
    localStorage.removeItem('selectedItems')
    reinitLayer(); 
  }

  const reinitLayer = () => {
    const reinitLayerList = layerList.map(layer => {
      if (layer instanceof GeoJsonLayer) {
        return generateGeoJsonLayer(layer, mapStyle, false);
      }
      if (layer instanceof WMSTileLayer) {
        return layer;
      }
      if (layer instanceof TileLayer && layer.id !== "main-map-tile-layer") {
        return addGisDomainTileLayerByStandardApi(layer, mapStyle, props.remote_user, false);
      }
      return layer;
    });
    setLayerList((layerList) => reinitLayerList);
  }
    
  const getTooltip = ({object}) => {
    
    return (
      object && !isdrawMode && {
        html: `\
        <div style="opacity: 0.5">
    <div><b>INFO</b></div>
    <div>unique id : ${object.properties.code}</div>
    <div>domain : ${object.properties.description}</div>
    </div>
    `,
    style: {
      background: 'rgba(0,0,0,0.7)',
      color: 'white'
    }
      }
    );
  }

  return (
    <div className="App" ref={myRef} style={{width: props.width, height: props.height, position: "relative"}}>
      <slot name="top-left" style={{...hostStyle,...divInsideHost,...slotTopLeft}}></slot>
        <div style={{...divInsideHost, ...topRight}} id="top-right">
            <div style={divInsideTopRight} onClick={zoomIn}><img height="24" viewBox="0 0 24 24" width="24" src="https://raw.githubusercontent.com/carlosclatg/DeckglTest/master/src/icons/zoom_in-24px.svg" alt="Zoom in" /></div>
            <div style={divInsideTopRight} onClick={zoomOut}><img height="24" viewBox="0 0 24 24" width="24" src="https://raw.githubusercontent.com/carlosclatg/DeckglTest/master/src/icons/zoom_out-24px.svg" alt="Zoom out" /></div>
            <div style={divInsideTopRight}>{Math.round(viewport.zoom)}</div>
            { props.enable_select_object ?
              <div>
              <div style={divInsideTopRight} onClick={toogleDrawingMode}><img height="24" viewBox="0 0 24 24" width="24" src={!isdrawMode? "https://raw.githubusercontent.com/carlosclatg/DeckglTest/master/src/icons/selection.svg" : "https://raw.githubusercontent.com/carlosclatg/DeckglTest/master/src/icons/polygon.svg"} alt="Selection" /></div>
              <div style={divInsideTopRight} onClick={deleteSelectedItems}><img height="24" viewBox="0 0 24 24" width="24" src={"https://raw.githubusercontent.com/carlosclatg/DeckglTest/master/src/icons/waste.svg"} alt="Delete" /></div>
              </div>
              : 
              null
            }
            </div>
      <slot style={{...hostStyle, ...slotBottomLeft}} name="bottom-left" />
      <slot style={{...hostStyle, ...slotBottomRight}} name="bottom-right" />
      <DeckGL
        mapStyle={defaultStyle}
        ref={deckRef}
        initialViewState={viewport}
        controller={true}
        onViewStateChange={({ viewState }) => zoomControl(viewState)}
        layers={layerList} 
        pickable={true}
        onClick={onDeckClick}
        canvas={canvas}
        getTooltip={getTooltip}>
      </DeckGL>
    </div>
  );
}




export default App;

App.defaultProps = {
  background_tile_url: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
  width : "500px",
  height : "500px",
  center: {lat: 41.8788383, lng: 12.3594608},
  zoom: 7,
  enable_select_object: true, 
  map_style: null,
  remote_user: null,
  multi_polygon_selector: false
};

App.propTypes = {
  background_tile_url: PropTypes.string,
  width : PropTypes.string,
  height : PropTypes.string,
  center: PropTypes.any,
  zoom: PropTypes.number, 
  enable_select_object: PropTypes.bool,
  map_style:   PropTypes.string, 
  remote_user:   PropTypes.string,
  multi_polygon_selector: PropTypes.bool
};





const WebApp = reactToWebComponent(App, React, ReactDOM, {shadow: true});
customElements.define("enel-gis-map", WebApp);



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





//google-chrome --disable-web-security --user-data-dir="./"

//Highlight
//https://stackoverflow.com/questions/60734315/change-colour-of-clicked-item-in-deck-gl

//MISSING



/*

KNOWN ERRORS:


//New value of zoom, should be passed as an object, otherwise no change is detected.

*/

