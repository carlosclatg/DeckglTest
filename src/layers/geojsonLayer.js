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

    const ICON_MAPPING = {
      marker: {x: 0, y: 0, width: 128, height: 128, mask: true}
    };
    
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
                    const res = mapStyle.getIcon(d)
                    res.mask = true
                    return res
                  }
                  const res = mapStyle.getIcon(d)
                  return res
                },
                getSize: d => {
                  if(selectedItems && selectedItems.has(d.__source.object.properties.unique_id)){
                    return mapStyle.getIconSize(d) * 1.5
                  }
                    return mapStyle.getIconSize(d)
                },
                getColor: (d) => {
                  if(selectedItems && selectedItems.has(d.__source.object.properties.unique_id)){
                    return mapStyle.getSelectedColor(d);
                  }
                  debugger
                  return mapStyle.getColor(d);
                },
                pickable: true,
                updateTriggers: {
                  getIcon: [JSON.parse(localStorage.getItem("selectedItems"))],
                  getSize: [JSON.parse(localStorage.getItem("selectedItems"))],
                  getColor: [JSON.parse(localStorage.getItem("selectedItems"))],
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
            
            if (d && d.geometry && d.geometry.type === 'Polygon') {
                return mapStyle.getPolygonLineWidth(d)
            } 
            if(d && d.geometry && d.geometry.type === 'LineString') {
              if(selectedItems && selectedItems.has(d.properties.unique_id)){
                return mapStyle.getLineWidth(d) * 1.5
              }
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