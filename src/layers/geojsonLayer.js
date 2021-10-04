import { GeoJsonLayer, IconLayer, SolidPolygonLayer, PathLayer} from '@deck.gl/layers';
import { v4 as uuidv4 } from 'uuid';
import MapStyle from '../styles';
import {PathStyleExtension} from '@deck.gl/extensions'


/**
 * Configurable parameters:
 * ICON LAYER:
 * ImageURL, width, height, imageAnchorX, imageAnchorY
 * 
 * LINELAYER:
 *  LineWidth, LineColor
 * 
 * POLYGONLAYER:
 * LineWidth, LineColor, FillColor
 *
 */

/**
 * 
 * @param {json} data 
 * @param {MapStyle} mapStyle 
 * @param {boolean} isNew --> true= new Layer, false => reinit layer to redraw after selection
 * @returns new GeoJSONLayer
 */
export default function generateGeoJsonLayer(data, mapStyle, isNew){

    let selectedItems = null
    console.log("THE LOCAL STYLES ARE ++++++++++++++++++++++++++++")
    console.log(mapStyle)
    if(JSON.parse(localStorage.getItem("selectedItems"))){
      selectedItems = new Set(JSON.parse(localStorage.getItem("selectedItems")))
    }
    //validate if data has unique_id; else add new one
    if(isNew){
        data.layer.features.forEach(element => {
            if(element.properties && !element.properties.unique_id){
                element.properties.unique_id = uuidv4();
            }
        })
    }

    console.log(data.layer)
    console.log(data.props && data.props.data)
    // const gap = mapStyle.getLineGap()
    debugger
    return new GeoJsonLayer({
        id: data.id,
        data: isNew ? data.layer : data.props.data,
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
                    return mapStyle.getIcon(d, data.id)
                  }
                  return mapStyle.getIcon(d, data.id)
                },
                getSize: d => {
                  if(selectedItems && selectedItems.has(d.__source.object.properties.unique_id)){
                    return mapStyle.getIconSize(d) * 1.5
                  }
                    return mapStyle.getIconSize(d)
                },
                // getColor: (d) => {
                //   if(selectedItems && selectedItems.has(d.__source.object.properties.unique_id)){
                //     return mapStyle.getSelectedColor(d);
                //   }
                //   return mapStyle.getColor(d);
                // },
                pickable: true,
                updateTriggers: {
                  getIcon: [JSON.parse(localStorage.getItem("selectedItems"))],
                  getSize: [JSON.parse(localStorage.getItem("selectedItems"))],
                  //getColor: [JSON.parse(localStorage.getItem("selectedItems"))],
                  id: [data.id]
                },
            },
            'polygons-stroke': {
                type: PathLayer,
                getDashArray: d => {
                  if(d && d.__source && d.__source.object && d.__source.object.properties){
                    return mapStyle.getLineDashArrayForPolygon(d,data.id) 
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
                  return mapStyle.getLineDashArray(d, d.__source.parent.id)
                  
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
          
          // if(selectedItems && f.properties.unique_id && selectedItems.has(f.properties.unique_id)){
          //   return mapStyle.getPolygonFillColorSelected(f, data.id)
          // }
          return mapStyle.getPolygonFillColor(f, data.id);
        },
        updateTriggers: {
          getLineWidth: [JSON.parse(localStorage.getItem("selectedItems"))],
          getLineColor: [JSON.parse(localStorage.getItem("selectedItems"))],
          getFillColor: [JSON.parse(localStorage.getItem("selectedItems"))],
          getIcon: [JSON.parse(localStorage.getItem("selectedItems"))],
          getSize: [JSON.parse(localStorage.getItem("selectedItems"))],
          id: [data.id]
        }
    });
}