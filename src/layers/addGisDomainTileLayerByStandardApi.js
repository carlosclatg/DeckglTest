import {TileLayer} from '@deck.gl/geo-layers';
import { GeoJsonLayer, IconLayer, SolidPolygonLayer, PathLayer} from '@deck.gl/layers';
import MapStyle from '../styles';
import {PathStyleExtension} from '@deck.gl/extensions'




const ICON_MAPPING = {
    marker: {x: 0, y: 0, width: 128, height: 128, mask: true}
};

/**
 * 
 * @param {layer} layer 
 * @param {MapStyle} mapStyle 
 * @param {String} remoteUser 
 * @param {boolean} isNew 
 * @returns 
 */
export default function addGisDomainTileLayerByStandardApi(data, mapStyle, remoteUser, isNew) {
  let minZoom, maxZoom, url, selectedItems;
  if(isNew) { //take new data.
    if(!data.id) throw new Error("Layer must have an id!")  
    url = data.layer + "/tile/{z}/{x}/{y}?props=code,unique_id,_id,domain,space,external_id,type"
    if (data.filter) url += ("&" + data.filter)
    if (url.indexOf('status') == -1) url += "&status=40"

    minZoom = data.minZoom ? data.minZoom : 0
    maxZoom = data.maxZoom ? data.maxZoom : 23
  } else { //reinit layer, take data from previous layer
    url = data.props.data
    minZoom = data.props.minZoom
    maxZoom = data.props.maxZoom
  }
  let loadOptions = {}
  if (remoteUser && remoteUser.trim().length) {
      loadOptions = { fetch: { headers: { 'REMOTE_USER': remoteUser } } }
  }
  if(JSON.parse(localStorage.getItem("selectedItems"))){
    selectedItems = new Set(JSON.parse(localStorage.getItem("selectedItems")))
  }
  debugger
  return new TileLayer({
    id: data.id,
    data: url,
    loadOptions,
    pickable: true,
    filled: true,
    stroke: true,
    lineWidthUnits: 'pixels',
    autoHighlight: true,
    highlightColor: [255, 0, 0, 128],        
    _subLayerProps: {
        points: {
            type: IconLayer,
            getIcon: d =>{ //sublayer props include d.__source.id
              debugger
              if(selectedItems && selectedItems.has(d.__source.object.properties.unique_id)){
                const res = mapStyle.getIcon(d, data.id)
                return res
              }
              debugger
              const res = mapStyle.getIcon(d, data.id)
              return res
            },
            getSize: d => {
              if(selectedItems && selectedItems.has(d.__source.object.properties.unique_id)){
                return mapStyle.getIconSize(d, data.id) * 1.5
              }
                return mapStyle.getIconSize(d, data.id)
            },
            pickable: true,
            updateTriggers: {
              getIcon: [JSON.parse(localStorage.getItem("selectedItems"))],
              getSize: [JSON.parse(localStorage.getItem("selectedItems"))],
              id: [data]
            },
        },
        'polygons-stroke': {
            type: PathLayer,
            getDashArray: d => {
              if(d && d.__source && d.__source.object && d.__source.object.properties){
                const a = mapStyle.getLineDashArrayForPolygon(d,data.id)
                
                return a
              }
              return [0,0] //line without any dashing, even if it is on true PathStyle
            },
            dashJustified: true,
            dashGapPickable: true,
            extensions: [new PathStyleExtension({dash: true})],
            updateTriggers: {
              getLineWidth: [JSON.parse(localStorage.getItem("selectedItems"))],
              getLineColor: [JSON.parse(localStorage.getItem("selectedItems"))],
              getFillColor: [JSON.parse(localStorage.getItem("selectedItems"))],
              id: [data.id]
            },
        },
        'line-strings': { //It is bad on documentation! https://deck.gl/docs/api-reference/layers/geojson-layer#sub-layers
          type: PathLayer,
          getDashArray: d => {
            
            if(d && d.__source && d.__source.object && d.__source.object.properties){
              return mapStyle.getLineDashArray(d)
            }
            return [0,0] //line without any dashing, even if it is on true PathStyle
          },
          dashJustified: false,
          dashGapPickable: true,
          extensions: [new PathStyleExtension({dash: true})],
          updateTriggers: {
            getLineWidth: [JSON.parse(localStorage.getItem("selectedItems"))],
            getLineColor: [JSON.parse(localStorage.getItem("selectedItems"))],
            getFillColor: [JSON.parse(localStorage.getItem("selectedItems"))],
            id: [data.id]
          },
        }
    },
    getLineWidth: d => {
        if (d && d.geometry && d.geometry.type === 'Polygon') {
          if(selectedItems && selectedItems.has(d.properties.unique_id)){
            return mapStyle.getPolygonLineWidth(d, data.id) * 1.5
          }
            return mapStyle.getPolygonLineWidth(d, data.id)
        } 
        if(d && d.geometry && d.geometry.type === 'LineString') {
          if(selectedItems && selectedItems.has(d.properties.unique_id)){
            return mapStyle.getLineWidth(d, data.id) * 1.5
          }
            return mapStyle.getLineWidth(d, data.id)
        }
        return mapStyle.DEFAULT_LINE_WIDTH
    },
    getLineColor: d => {
      
        if (d && d.geometry && d.geometry.type === 'Polygon') {
            return mapStyle.getPolygonLineColor(d, data.id)
        } 
        if(d && d.geometry && d.geometry.type === 'LineString') {
            return mapStyle.getLineColor(d, data.id)
        }

        return mapStyle.DEFAULT_LINE_COLOR
    },
    getFillColor: f => {
      
      if(selectedItems && f.properties.unique_id && selectedItems.has(f.properties.unique_id)){
        return mapStyle.getPolygonFillColorSelected(f, data.id)
      }
      return mapStyle.getPolygonFillColor(f, data.id);
    },
    updateTriggers: {
      getLineWidth: [JSON.parse(localStorage.getItem("selectedItems"))],
      getLineColor: [JSON.parse(localStorage.getItem("selectedItems"))],
      getFillColor: [JSON.parse(localStorage.getItem("selectedItems"))],
      id: [data.id],

    }
  });
}