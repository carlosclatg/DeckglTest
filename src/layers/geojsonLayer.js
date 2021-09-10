import { GeoJsonLayer, IconLayer, SolidPolygonLayer} from '@deck.gl/layers';
import { v4 as uuidv4 } from 'uuid';
import MapStyle from '../styles';

/**
 * 
 * @param {json} data 
 * @param {MapStyle} mapStyle 
 * @param {boolean} isNew --> true= new Layer, false => reinit layer to redraw after selection
 * @returns new GeoJSONLayer
 */
export default function generateGeoJsonLayer(data, mapStyle, isNew){

    let selectedItems = null
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
                getIcon: d =>{
                  if(selectedItems && selectedItems.has(d.__source.object.properties.unique_id)){
                    return mapStyle.getDefaultIcon(d)
                  }
                    return mapStyle.getIcon(d)
                },
                getSize: d => {
                  if(selectedItems && selectedItems.has(d.__source.object.properties.unique_id)){
                    return 50
                  }
                    return mapStyle.getIconSize(d)
                },
                pickable: true,
                updateTriggers: {
                  getIcon: [JSON.parse(localStorage.getItem("selectedItems"))],
                  getSize: [JSON.parse(localStorage.getItem("selectedItems"))],
                  id: [data.id]
                },
            },
            'polygons-fill': {
                type: SolidPolygonLayer,
                getFillColor: f =>
                    {
                        return mapStyle.getPolygonFillColor(f);
            
                    },
                updateTriggers: {
                  getFillColor: [JSON.parse(localStorage.getItem("selectedItems"))],
                  id: [data.id]
                },
            }
        },
        getLineWidth: d => {
            if(selectedItems && selectedItems.has(d.properties.unique_id)){
              return 50
            }
            if (d && d.geometry && d.geometry.type === 'Polygon') {
                return mapStyle.getPolygonLineWidth(d)
            } 
            if(d && d.geometry && d.geometry.type === 'LineString') {
                return mapStyle.getLineWidth(d)
            }
            return mapStyle.DEFAULT_LINE_WIDTH
        },
        getLineColor: d => {
            if (d && d.geometry && d.geometry.type === 'Polygon') {
                return mapStyle.getPolygonLineColor(d)
            } 
            if(d && d.geometry && d.geometry.type === 'LineString') {
                return mapStyle.getLineColor(d)
            }

            return mapStyle.DEFAULT_LINE_COLOR
        },
        updateTriggers: {
          getLineWidth: [JSON.parse(localStorage.getItem("selectedItems"))],
          id: [data.id]
        },
    });
}