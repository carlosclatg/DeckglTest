import { GeoJsonLayer} from '@deck.gl/layers';

export default function generateGeoJsonLayer(data){
    return new GeoJsonLayer({
        id: data.id,
        data: data.layer,
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


