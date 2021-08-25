import {TileLayer} from '@deck.gl/geo-layers';
import { IconLayer, SolidPolygonLayer} from '@deck.gl/layers';

export default function addGisDomainTileLayerByStandardApi(layer, mapStyle, remoteUser) {
    let url = layer.layer + "/tile/{z}/{x}/{y}?props=code,unique_id,_id,domain,space,internal_id,type"
    if (layer.filter) url += ("&" + layer.filter)
    if (url.indexOf('status') == -1) url += "&status=40"
    let loadOptions = {}
    if (remoteUser && remoteUser.trim().length) {
        loadOptions = { fetch: { headers: { 'REMOTE_USER': remoteUser } } }
    }
    return new TileLayer({
        id: layer.id,
        data: url,
        minZoom: layer.minZoom ? layer.minZoom : 0,
        maxZoom: layer.maxZoom ? layer.maxZoom : 23,
        pickable: true,
        loadOptions: loadOptions,
        tileSize: 512,
        getRadius: 4,
        _subLayerProps: {
            points: {
                type: IconLayer,
                getIcon: d =>mapStyle.getIcon(d),
                getSize: d => mapStyle.getIconSize(d),
                pickable: true,
                sizeScale: 1,
            },
            'polygons-fill': {
                type: SolidPolygonLayer,
                getFillColor: f =>
                    {
                        return mapStyle.getPolygonFillColor(f);
            
                    },
            }
        },
        getPosition: d => d.coordinates,
        pointRadiusUnits: 'pixels',
        autoHighlight: true,
        highlightColor: [255, 0, 0, 128],
        getLineWidth: d => {
            if (d && d.geometry && d.geometry.type == 'Polygon') {
                return mapStyle.getPolygonLineWidth(d)
            } 
            if(d && d.geometry && d.geometry.type == 'LineString') {
                return mapStyle.getLineWidth(d)
            }

            return mapStyle.DEFAULT_LINE_WIDTH
        },
        getLineColor: d => {
            if (d && d.geometry && d.geometry.type == 'Polygon') {
                return mapStyle.getPolygonLineColor(d)
            } 
            if(d && d.geometry && d.geometry.type == 'LineString') {
                return mapStyle.getLineColor(d)
            }

            return mapStyle.DEFAULT_LINE_COLOR
        },
    })
}