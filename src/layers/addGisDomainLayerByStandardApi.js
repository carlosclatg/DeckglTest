import generateGeoJsonLayer from './geojsonLayer'
import { BitmapLayer, IconLayer } from '@deck.gl/layers';

export default async function addGisDomainLayerByStandardApi(layer, extent, remoteUser){
    let url = layer.layer + "/extent?";
    url += `xmin=${Math.max(-180, roundDegree(extent.west))}`
    url += `&ymin=${Math.max(-90, roundDegree(extent.south))}`
    url += `&xmax=${Math.min(180, roundDegree(extent.east))}`
    url += `&ymax=${Math.min(90, roundDegree(extent.north))}`
    url += `&props=code,unique_id,_id,domain,space,internal_id,type`
    if (layer.filter !== null) url += ("&" + layer.filter)
    if (url.indexOf('status') == -1) url += "&status=40"
    let options = {}
    if (remoteUser !== null && remoteUser.trim().length) {
        options = { headers: { 'REMOTE_USER': remoteUser } }
    }
    return fetch(url, options)
        .then((response) => {
            response.json().then(json => {
                const newLayerData = { id: layer.id, type: layer.type, layer: json };
                return generateGeoJsonLayer(newLayerData)
            });
        })
        .catch(() => { });
    
    function roundDegree (num) {
        return Math.round(num * 100000000) / 100000000;
    }
}  

