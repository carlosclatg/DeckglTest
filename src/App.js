import DeckGL from '@deck.gl/react';
import React, { useEffect, useState, useRef, Fragment } from 'react';
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
import geojsonstyles from '../src/styles/geojsonstyles.json';



//PROPS AND COMPONENT-
const App = (props) =>{

  const getProperty =(obj, key)=> {
    var o = obj[key];
    return(o);
  }

  //MOCK DATA
  const MAXZOOM=23
  const MINZOOM=0
  

  //STATE
  const [previousZoom, setPreviousZoom] = useState(parseInt(props.zoom))
  const [viewport, setViewport] = useState({width: 1,height: 1,latitude: props.center.lat,longitude: props.center.lng,zoom: parseInt(props.zoom)})
  const [isdrawMode, setdrawMode] = useState(false)
  const [mapStyle, setMapStyle] = useState()
  const [layerList, setLayerList] = useState(()=>[getTileMapLayer(getProperty(props,'background-tile-url'), MINZOOM, MAXZOOM, defaultStyle)])

  //REFS TO DOM
  const deckRef = useRef();
  const canvas = useRef();

  //HOOKS
  useEffect(()=>{
    console.log(props)
    console.log(getProperty(props, 'map-style'))
    
    if(getProperty(props, 'map-style')){
      fetch(getProperty(props, 'map-style'))
        .then(d => {
          if(d.ok) return d.json()
        })
        .then(j => {
           setMapStyle(new MapStyle(j)) 
           return initListeners();
        })
        .catch(e => {
          setMapStyle(new MapStyle(geojsonstyles)) //default style
          return initListeners();
        });
    } else {
      
      setMapStyle(new MapStyle(geojsonstyles)) //default style
      return initListeners();
    }
  },[])


  const initListeners =()=> {
    fromEvent(document, "topogisevt_add_layer").subscribe(event => handleAddLayer(event)); //BE very careful... handleAddLayer is inmunatable after initial load. 
    fromEvent(document, "topogisevt_remove_layer").subscribe(event => handleRemoveLayer(event));
    fromEvent(document, "topogisevt_center_on_object").subscribe(event => handleCenterOnObject(event));
    localStorage.removeItem("selectedItems");
    const event = eventMapReadyBuilder();
    ReactDOM.findDOMNode(deckRef.current).dispatchEvent(event);
    return () => {
      localStorage.removeItem("selectedItems");
      localStorage.removeItem("mapstyle")
    };
  }
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
      ReactDOM.findDOMNode(deckRef.current).dispatchEvent(event)
    }
  }, [viewport])


  useEffect(()=>{
    if(isdrawMode){
      setLayerList((layerList) =>new Array(...layerList, getSelectionLayer(layerList, handleSelectedObjects,getProperty(props, 'multi-polygon-selector'))))
    } else {
      setLayerList((layerList) =>new Array(...layerList.filter(e=>e.id!=="SelectionLayer")))
    }
  },[isdrawMode])

  const onDeckClick = (info, event) => {
    console.log(event)
    if(getProperty(props, 'enable-select-object') && !isdrawMode){ //in case selectionPolygonMode is on, nothing should happen when clicking.
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
        setLayerList((layers) =>new Array(...layer.filter(e => e.id !== 'SelectionLayer'),getSelectionLayer(layer, handleSelectedObjects, getProperty(props, 'multi-polygon-selector')))) //update selectable layers as well.
      } else {
        setLayerList((layers) =>new Array(...layer))
      }
    }
  }

  const handleCenterOnObject = ({detail}) => {
    console.log('The detail is ......')
    console.log(detail)
    if(detail){
        let options = {}
        if (getProperty(props,'remote-user') && getProperty(props,'remote-user').trim().length) {
            options = { headers: { 'REMOTE_USER': getProperty(props,'remote-user') } }
        }
        return fetch(detail, options)
            .then((response) => {
              response.json()
                .then(json => {
                  if(!gjv.isGeoJSONObject(json)) return
                  const extent = getBoundingBox(json);
                  console.log("The dimensions of the map are when getting by Tag:")
                  // console.log(document.getElementsByTagName('enel-gis-map')[0].clientWidth)
                  // console.log(document.getElementsByTagName('enel-gis-map')[0].clientHeight)
                  console.log("The dimensions of the map are when using refs:")
                  console.log(deckRef.current.viewports[0].width)
                  console.log(deckRef.current.viewports[0].height)
                  const newviewport =  new WebMercatorViewport({
                    width: deckRef.current.viewports[0].width ? deckRef.current.viewports[0].width: 500,
                    height: deckRef.current.viewports[0].height ? deckRef.current.viewports[0].height: 500,
                  });
                  if(extent.xMin === extent.xMax === extent.yMax === extent.yMin === 0){
                    //Polygon not provided --> Nothing to do in the viewport
                  } else {
                    let {latitude, longitude, zoom} = newviewport.fitBounds([[extent.xMin, extent.yMin], [extent.xMax, extent.yMax]])
                    if(zoom < 0) zoom = Math.abs(zoom) +1
                    setViewport(viewport => ({width: viewport.width, height: viewport.height,latitude,longitude,zoom}))
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
    debugger
    if(detail.type === GEOJSON_LAYER){
      if(detail.layer instanceof Object){
        if(gjv.valid(detail.layer)){ //check valid geojson otherwise nothing
          //Verify if unique_id is present or not, else generate.
          newLayer = generateGeoJsonLayer(detail,deckRef.current.props.mapStyle, true)
        } else return
      } else {
        if(detail.tiled){
          newLayer = addGisDomainTileLayerByStandardApi(detail, deckRef.current.props.mapStyle, getProperty(props,'remote-user'), true)
        } else {
          let extent = viewportToExtension(viewport)
          return addGisDomainLayerByStandardApi(detail, extent,getProperty(props,'remote-user'), deckRef.current.props.mapStyle).then(layer=>{
            if(layer) setLayerList((layerList)=>[...layerList, layer])
          })
        }
      }
    } else if(detail.type === WMS_LAYER){ //case layer WMS
      if(detail.layer instanceof Object){
        console.log("WMS does not support layer object")
        return
      }
      newLayer = new WMSTileLayer({id: detail.id, baseWMSUrl: detail.layer, remote_user: getProperty(props,'remote-user')})
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
    ReactDOM.findDOMNode(deckRef.current).dispatchEvent(ev)
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
        return addGisDomainTileLayerByStandardApi(layer, mapStyle, getProperty(props,'remote-user'), false);
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
        <div>code : ${object.properties.code}</div>
        <div>description : ${object.properties.description}</div>
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
    <Fragment>
      <slot name="top-left" style={{...hostStyle,...divInsideHost,...slotTopLeft}}></slot>
        <div style={{...divInsideHost, ...topRight}} id="top-right">
            <div style={divInsideTopRight} onClick={zoomIn}><img height="24" viewBox="0 0 24 24" width="24" src="https://raw.githubusercontent.com/carlosclatg/DeckglTest/master/src/icons/zoom_in-24px.svg" alt="Zoom in" /></div>
            <div style={divInsideTopRight} onClick={zoomOut}><img height="24" viewBox="0 0 24 24" width="24" src="https://raw.githubusercontent.com/carlosclatg/DeckglTest/master/src/icons/zoom_out-24px.svg" alt="Zoom out" /></div>
            <div style={divInsideTopRight}>{Math.round(viewport.zoom)}</div>
            { getProperty(props,'enable-select-object') ?
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
        mapStyle={mapStyle}
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
    </Fragment>
  );
}




export default App;



App.defaultProps = {
  'background-tile-url': "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
  center: {lat: 41.8788383, lng: 12.3594608},
  zoom: 7,
  'enable-select-object': true, 
  'map-style': 'https://raw.githubusercontent.com/carlosclatg/DeckglTest/selectitems/src/styles/geojsonstyles.json',
  'remote-user': null,
  'multi-polygon-selector': false,
  'tool-tip': null
};

App.propTypes = {
  'background-tile-url': PropTypes.string,
  center: PropTypes.any,
  zoom: PropTypes.number, 
  'enable-select-object': PropTypes.bool,
  'map-style':   PropTypes.string, 
  'remote-user':   PropTypes.string,
  'multi-polygon-selector': PropTypes.bool,
  'tool-tip': PropTypes.string
};


const WebApp = reactToWebComponent(App, React, ReactDOM, {shadow: true});
customElements.define("enel-gis-map", WebApp);



/*Make the build:

const WebApp = reactToWebComponent(App, React, ReactDOM);
customElements.define("enel-gis-map", WebApp);

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

