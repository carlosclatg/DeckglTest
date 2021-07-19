import {TileLayer} from '@deck.gl/geo-layers';
import {BitmapLayer} from '@deck.gl/layers';


export default function addGisDomainTileLayerByStandardApi(layer) {
    let url = layer.layer + "/tile/{z}/{x}/{y}?props=code,unique_id,_id,domain,space,internal_id,type"
    if (layer.filter !== null) url += ("&" + layer.filter)
    if (url.indexOf('status') == -1) url += "&status=40"
    let loadOptions = {}
    if (this.remoteUser !== null && this.remoteUser.trim().length) {
        loadOptions = { fetch: { headers: { 'REMOTE_USER': this.remoteUser } } }
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
        pointRadiusUnits: 'pixels'
        // _subLayerProps: {
        //     points: {
        //         type: IconLayer,
        //         getIcon: getIcon,
        //         getColor: [255, 200, 0],
        //         getSize: getIconSize,
        //         updateTriggers: {
        //             getIcon: null
        //         }
        //     }
        // },
        // getLineColor: () => {
        //     return [0, 0, 0];
        // },
        // getLineWidth: () => {
        //     return 1;
        // }
    })
    // this.layers.push(new ()({
    //     id: layer.id,
    //     data: url,
    //     minZoom: layer.minZoom !== undefined ? layer.minZoom : 0,
    //     maxZoom: layer.maxZoom !== undefined ? layer.maxZoom : 22,
    //     pickable: true,
    //     loadOptions: loadOptions,
    //     tileSize: 512,
    //     getFillColor: [0, 255, 255],
    //     getRadius: 25,
    //     pointRadiusUnits: 'pixels',
    //     _subLayerProps: {
    //         points: {
    //             type: IconLayer,
    //             getIcon: this.getIcon.bind(this),
    //             getColor: [255, 200, 0],
    //             getSize: this.getIconSize.bind(this),
    //             updateTriggers: {
    //                 getIcon: null
    //             }
    //         }
    //     },
    //     getLineColor: () => {
    //         return [0, 0, 0];
    //     },
    //     getLineWidth: () => {
    //         return 1;
    //     }
    // }));
    // this.deck.setProps({ layers: [...this.layers] });
}