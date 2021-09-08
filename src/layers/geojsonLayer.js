import { GeoJsonLayer, IconLayer, SolidPolygonLayer} from '@deck.gl/layers';
import { v4 as uuidv4 } from 'uuid';

export default function generateGeoJsonLayer(data, mapStyle){


    //validate if data has unique_id; else add new one
    data.layer.features.forEach(element => {
        if(element.properties && !element.properties.unique_id){
            element.properties.unique_id = uuidv4();
        }
    })

    return new GeoJsonLayer({
        id: data.id,
        data: data.layer,
        autoHighLight: true,
        pickable: true,
        filled: true,
        stroke: true,
        lineWidthUnits: 'pixels',
        _subLayerProps: {
            points: {
                type: IconLayer,
                getIcon: d =>mapStyle.getIcon(d),
                getSize: d => mapStyle.getIconSize(d),
                pickable: true,
            },
            'polygons-fill': {
                type: SolidPolygonLayer,
                getFillColor: f =>
                    {
                        return mapStyle.getPolygonFillColor(f);
            
                    },
            }
        },
        autoHighlight: true,
        highlightColor: [255, 0, 0, 128],
        getLineWidth: d => {
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
    });
}