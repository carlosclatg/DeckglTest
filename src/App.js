import DeckGL from '@deck.gl/react';
import { GeoJsonLayer} from '@deck.gl/layers';
import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import reactToWebComponent from "react-to-webcomponent";
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
import PropTypes from 'prop-types';
import { defaultStyle } from './styles/custom-style';

//PROPS AND COMPONENT-
const App = (props) =>{

  //MOCK DATA
  const MAXZOOM = 20
  const MINZOOM=1

  //STATE
  const [previousZoom, setPreviousZoom] = useState(parseInt(props.zoom))
  const [viewport, setViewport] = useState({
    width: 1,
    height: 1,
    latitude: props.center.lat,
    longitude: props.center.lng,
    zoom: parseInt(props.zoom),
  })
  const [isdrawMode, setdrawMode] = useState(false)
  const [mapStyle, setMapStyle] = useState(new MapStyle(null))
  const [layerList, setLayerList] = useState(()=>[getTileMapLayer(props.backgroud_tile_url, MINZOOM, MAXZOOM)])
  
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
          console.log(e)
          setMapStyle(new MapStyle(defaultStyle))
        });
    } else {
      setMapStyle(new MapStyle(defaultStyle))
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


  //zoom paramter changed
  useEffect(()=>{
    console.log(props)
    setViewport({
      width: viewport.width,
      height: viewport.height,
      latitude: viewport.latitude,
      longitude: viewport.longitude,
      zoom: parseInt(props.zoom.value),
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
      setLayerList((layerList) =>new Array(...layerList, getSelectionLayer(layerList, handleSelectedObjects)))
    } else {
      setLayerList((layerList) =>new Array(...layerList.filter(e=>e.id!=="selection")))
    }
  },[isdrawMode])


  const onDeckClick = (info) => {
    console.log(info)
    if(props.enable_select_object && !isdrawMode){ //in case selectionPolygonMode is on, nothing should happen when clicking.
      let objectSelected = deckRef.current.pickObject({x: info.x, y: info.y, radius: 10 })
      if(objectSelected){
        handleSelectedObjects(objectSelected)
      }
    }
  }

  const handleRemoveLayer = ({detail}) => {
    if(detail){
      let layer = deckRef.current.props.layers.filter(e => e.id !== detail)
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
        if (props.remoteuser && props.remoteuser.trim().length) {
            options = { headers: { 'REMOTE_USER': props.remoteuser } }
        }
        fetch(detail, options)
            .then((response) => {
                response.json().then(json => {
                    if(!gjv.isGeoJSONObject(json)) return
                    console.log(json)
                    const extent = getBoundingBox(json);
                    const newviewport = new WebMercatorViewport(viewport);
                    if(extent.xMin === extent.xMax === extent.yMax === extent.yMin === 0){
                      //Polygon not provided --> Nothing to do in the viewport
                      console.log('not inside')
                    } else {
                      console.log('inside')
                      let {latitude, longitude, zoom} = newviewport.fitBounds([[extent.xMin, extent.yMin], [extent.xMax, extent.yMax]])
                      console.log(zoom)
                      if(zoom < 0) zoom = Math.abs(zoom) +1
                      console.log(zoom)
                      setViewport({width: viewport.width,height: viewport.height,latitude,longitude,zoom})
                    }
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
    
    //case layer geojson
    if(detail.type === GEOJSON_LAYER){
      if(detail.layer instanceof Object){
        if(gjv.valid(detail.layer)){ //check valid geojson otherwise nothing
          newLayer = generateGeoJsonLayer(detail, mapStyle)
        } else return
      } else {
        if(detail.tiled){
          newLayer = addGisDomainTileLayerByStandardApi(detail, mapStyle, props.remoteuser)
        } else {
          let extent = viewportToExtension(viewport)
          return addGisDomainLayerByStandardApi(detail, extent,props.remoteuser).then(layer=>{
            if(layer) setLayerList((layerList)=>[...layerList, layer])
            return
          })
        }
      }
    } else if(detail.type === WMS_LAYER){ //case layer WMS
      if(detail.layer instanceof Object){
        console.log("WMS does not support layer object")
        return
      }
      newLayer = new WMSTileLayer({id: detail.id, baseWMSUrl: detail.layer, remoteUser: props.remoteuser})
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

  const toogleDrawingMode = () => {
    setdrawMode(isdrawMode ? !isdrawMode : true)
  }

  //Valorar si podemos enviar el polygono de seleccion.
  const handleSelectedObjects = (selectedObjects) => {
    console.log(selectedObjects)
    setdrawMode(false)
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
    if(!isdrawMode)setLayerList((layerList) => [layerList]) //re-initialize layers in order to get the selected items. 
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


  return (
    <div className="App" ref={myRef} style={{ height: props.height + "px", width: props.width + "px", position: 'relative' }}>
      <slot name="top-left" style={{...hostStyle,...divInsideHost,...slotTopLeft}}></slot>
        <div style={{...divInsideHost, ...topRight}} id="top-right">
            <div style={divInsideTopRight} onClick={zoomIn}><img height="24" viewBox="0 0 24 24" width="24" src="https://w7.pngwing.com/pngs/618/94/png-transparent-computer-icons-zooming-user-interface-zoom-lens-sign-share-icon-zooming-user-interface.png" alt="Zoom in" /></div>
            <div style={divInsideTopRight} onClick={zoomOut}><img height="24" viewBox="0 0 24 24" width="24" src="https://img1.freepng.es/20180320/fdq/kisspng-computer-icons-macintosh-iconfinder-zoom-out-save-icon-format-5ab09cc9ca9ed1.4091764015215239138299.jpg" alt="Zoom out" /></div>
            <div style={divInsideTopRight}>{Math.round(viewport.zoom)}</div>
            { props.enable_select_object ?
              <div style={divInsideTopRight} onClick={toogleDrawingMode}><img height="24" viewBox="0 0 24 24" width="24" src={!isdrawMode? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFEoc-j7y2Vq3-VZ9VkGRF0v__zUr7k408BA&usqp=CAU" : "https://img.icons8.com/ios/452/unchecked-checkbox.png"} alt="Selection" /></div>
              : 
              null
            }
            </div>
      <slot style={{...hostStyle, ...slotBottomLeft}} name="bottom-left" />
      <slot style={{...hostStyle, ...slotBottomRight}} name="bottom-right" />
      <DeckGL
        ref={deckRef}
        initialViewState={viewport}
        controller={true}
        onViewStateChange={({ viewState }) => zoomControl(viewState)}
        layers={layerList} 
        pickable={true}
        onClick={onDeckClick}
        canvas={canvas}>
      </DeckGL>
    </div>
  );
}

//:host
const hostStyle = {
  display: "block",
  position: "relative"
}

//:host > div:host > div
const divInsideHost ={
  zIndex: 1000
}

//#top-right
const topRight= {
  position:"absolute",
  top:"10px",
  right:"10px",
  width:"30px",
  minHeight:"50px",
  backgroundColor:"#f2f2f2",
  borderRadius:"8px",
  border:"1px solid darkgray",
  zIndex:"1000"
}

//#top-right > div 
const divInsideTopRight = {
  margin: "4px",
  textAlign: "center",
  cursor: "pointer"
}

//::slotted([slot=top-left])
const slotTopLeft = {
  position:"absolute",
  top: "10px",
  left: "10px",
  zIndex: 1000,
}


//::slotted([slot=bottom-left])
const slotBottomLeft = {
  position:"absolute",
  bottom: "10px",
  left: "10px",
  zIndex: 1000,
}

//::slotted([slot=bottom-right])
const slotBottomRight = {
  position:"absolute",
  bottom: "10px",
  right: "10px",
  zIndex: 1000,
}


export default App;

App.defaultProps = {
  backgroud_tile_url: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
  width :  600,
  height: 600,
  center: {lat: 41.8788383, lng: 12.3594608},
  zoom: 4,
  enable_select_object: true, 
  map_style: null,
  remoteuser: null
};

App.propTypes = {
  backgroud_tile_url: PropTypes.string,
  width :  PropTypes.number,
  height: PropTypes.number,
  center: PropTypes.any,
  zoom: PropTypes.any, 
  enable_select_object: PropTypes.bool,
  map_style:   PropTypes.string, 
  remoteuser:   PropTypes.string
};

const WebApp = reactToWebComponent(App, React, ReactDOM, {shadow: true});
customElements.define("my-map", WebApp);



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


//New value of zoom, should be passed as an object, otherwise no change is detected.

*/

