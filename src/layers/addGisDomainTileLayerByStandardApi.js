import {TileLayer} from '@deck.gl/geo-layers';
import { IconLayer, SolidPolygonLayer, PathLayer} from '@deck.gl/layers';

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
        maxZoom: layer.maxZoom ? layer.maxZoom : 22,
        pickable: true,
        loadOptions: loadOptions,
        tileSize: 512,
        getRadius: 4,
        pointRadiusUnits: 'pixels',
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
                        return mapStyle.getPolygonFillColor(f)
            
                    },
                getLineColor: f => {
                    return mapStyle.getPolygonLineColor(f)
                }
            },
            'linestrings' : {
                type: PathLayer,
                getColor: f =>
                    {
                        return mapStyle.getLineColor(f);
            
                    },
                getWidth : f => {
                    return mapStyle.getLineWidth(f)
                }
            }
        },
        sizeScale: 1,
        getPosition: d => d.coordinates,
        getLineColor: d => mapStyle.getLineColor(d),
        getLineWidth: d => mapStyle.getLineWidth(d)
    })
}