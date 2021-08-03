import {TileLayer} from '@deck.gl/geo-layers';
import { BitmapLayer, IconLayer } from '@deck.gl/layers';

export default function addGisDomainTileLayerByStandardApi(layer, mapStyle, remoteUser) {
    const DEFAULT_IMAGE_PUSHPIN_SIZE = 24
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
        getFillColor: [0, 255, 255],
        getRadius: 4,
        pointRadiusUnits: 'pixels',
        getIcon: d => 'marker',
        sizeScale: 1,
        getPosition: d => d.coordinates,
        getSize: d => 5,
        getColor: d => [Math.sqrt(d.exits), 140, 0]

    })
}