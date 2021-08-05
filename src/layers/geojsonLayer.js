import { GeoJsonLayer} from '@deck.gl/layers';

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
        lineWidthUnits: 'pixels',
        getRadius: 3,
        pointRadiusUnits: 'pixels',
        autoHighlight: true,
        highlightColor: [255, 0, 0, 128],
        getFillColor: f =>
            {
                if(f.id === 'obj1'){
                    return  [200, 200, 100];
                } else return  [200, 100, 150];

            },
        
        getLineColor: () => {
            return [0, 0, 0];
        },
        getLineWidth: () => {
            return 2;
        } 
    }); //geojsonlayer does not accept min and max zoom
}



