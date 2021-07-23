import {TileLayer} from '@deck.gl/geo-layers';
import { BitmapLayer, IconLayer } from '@deck.gl/layers';

export default function addGisDomainTileLayerByStandardApi(layer, mapStyle, remoteUser) {
    const DEFAULT_IMAGE_PUSHPIN_SIZE = 24
    let url = layer.layer + "/tile/{z}/{x}/{y}?props=code,unique_id,_id,domain,space,internal_id,type"
    if (layer.filter !== null) url += ("&" + layer.filter)
    if (url.indexOf('status') == -1) url += "&status=40"
    let loadOptions = {}
    if (remoteUser !== null && remoteUser.trim().length) {
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
        getRadius: 25,
        pointRadiusUnits: 'pixels',
        _subLayerProps: {
            points: {
                type: IconLayer,
                getIcon: (d)=>mapStyle.getIcon(d),
                getColor: [255, 200, 0],
                getSize: (d)=>mapStyle.getIconSize(d),
                updateTriggers: {
                    getIcon: null
                }
            }
        },
        getLineColor: () => {
            return [0, 0, 0];
        },
        getLineWidth: () => {
            return 1;
        }
    })
}