import generateGeoJsonLayer from './geojsonLayer'

export default async function addGisDomainLayerByStandardApi(layer, extent){
        let url = layer.layer + "/extent?";
        url += `xmin=${Math.max(-180, this.roundDegree(extent.west))}`
        url += `&ymin=${Math.max(-90, this.roundDegree(extent.south))}`
        url += `&xmax=${Math.min(180, this.roundDegree(extent.east))}`
        url += `&ymax=${Math.min(90, this.roundDegree(extent.north))}`
        url += `&props=code,unique_id,_id,domain,space,internal_id,type`
        if (layer.filter !== null) url += ("&" + layer.filter)
        if (url.indexOf('status') == -1) url += "&status=40"
        let options = {}
        if (this.remoteUser !== null && this.remoteUser.trim().length) {
            options = { headers: { 'REMOTE_USER': this.remoteUser } }
        }
        return fetch(url, options)
            .then((response) => {
                response.json().then(json => {
                    const newLayerData = { id: layer.id, type: layer.type, layer: json };
                    return generateGeoJsonLayer(newLayerData)
                });
            })
            .catch(() => { });
}   