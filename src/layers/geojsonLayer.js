import { GeoJsonLayer, IconLayer, SolidPolygonLayer, PathLayer} from '@deck.gl/layers';


export default function generateGeoJsonLayer(data, mapStyle){
    return new GeoJsonLayer({
        id: data.id,
        data: data.layer,
        autoHighLight: true,
        highlightColor: [255, 255, 0],
        pickable: true,
        filled: true,
        stroke: true,
        lineWidthUnits: 'pixels',
        _subLayerProps: {
            points: {
                type: IconLayer,
                getIcon: d =>mapStyle.getIcon(d),
                getSize: d => 1,
                pickable: true,
                sizeScale: 15,
            },
            'polygons-fill': {
                type: SolidPolygonLayer,
                getFillColor: f =>
                    {
                        return mapStyle.getPolygonFillColor(f);
            
                    }
            },
        },
        pointRadiusUnits: 'pixels',
        autoHighlight: true,
        highlightColor: [255, 0, 0, 128],
        getLineColor: d => mapStyle.getLineColor(d),
        getLineWidth: d => mapStyle.getLineWidth(d)
    });
}