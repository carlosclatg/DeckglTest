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
                getColor: d => {
                    return[240, 0,0,255]
                },
                getIcon: d =>{return mapStyle.getIcon(d)},
                  // icon size is based on data point's contributions, between 2 - 25
                  //(1)
                getSize: d => 2,
                pickable: true,
                sizeScale: 15,
            },
            'polygons-fill': {
                type: SolidPolygonLayer,
                getFillColor: f =>
                    {
                        return mapStyle.getPolygonFillColor(f);
            
                    },
                getLineColor: f => {
                    return [100,100,100,255]
                },
            },
        },
        pointRadiusUnits: 'pixels',
        autoHighlight: true,
        highlightColor: [255, 0, 0, 128],
        getLineColor: d => mapStyle.getLineColor(d),
        getLineWidth: d => mapStyle.getLineWidth(d)
    });
}



//(1)
/*
geometry:
coordinates: (2) [12.799072265624998, 41.775408403663285]
type: "Point"
__proto__: Object
__source:
index: 0
object:
geometry: {type: "Point", coordinates: Array(2)}
id: "obj1"
properties: {type: "issue-level-1", space: "gam-issue", domain: "grid-act-maintenance"}
type: "Feature"
__proto__: Object
parent: GeoJsonLayer
context: {layerManager: LayerManager, resourceManager: ResourceManager, deck: Deck, gl: WebGL2RenderingContext, stats: Stats, …}
count: 18
id: "layer-geojson-point-line"
internalState: LayerState {component: GeoJsonLayer, asyncProps: {…}, oldProps: {…}, oldAsyncProps: null, onAsyncPropUpdated: ƒ, …}
lifecycle: "Initialized"
parent: null
props: {id: "layer-geojson-point-line", autoHighLight: true, highlightColor: Array(4), pickable: true, filled: true, …}
state: {layerProps: {…}, features: {…}, binary: false, featuresDiff: {…}}
*/
