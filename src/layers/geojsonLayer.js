import { GeoJsonLayer} from '@deck.gl/layers';
import MapStyle from '../styles';
import { BitmapLayer, IconLayer } from '@deck.gl/layers';

export default function generateGeoJsonLayer(data, mapStyle){
    return new GeoJsonLayer({
        id: data.id,
        data: data.layer,
        autoHighLight: true,
        highlightColor: [255, 255, 0],
        pickable: true,
        filled: true,
        extruded: false,
        stroke: true,
        getFilterValue: ()=> false,
        lineWidthUnits: 'pixels',
        getFillColor: d=>mapStyle.getFillColor(d),
        getRadius: 3,
        pointRadiusUnits: 'pixels',
        
        getLineColor: () => {
            return [0, 0, 0];
        },
        getLineWidth: () => {
            return 1;
        } 
    }); //geojsonlayer does not accept min and max zoom
}



