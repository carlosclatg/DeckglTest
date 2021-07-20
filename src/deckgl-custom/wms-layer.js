import { BitmapLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';

const defaultProps = {
    baseWMSUrl: null,
    remoteUser: null,
    renderSubLayers: props => {
        const {bbox: {west, south, east, north}} = props.tile;
        return new BitmapLayer(props, { data: null, image: props.data, bounds: [west, south, east, north]});
      }    
}

export default class WMSTileLayer extends TileLayer {
    
    getTileData(tile) {
        console.log(this.props.tileSize)
        let url = `${this.props.baseWMSUrl}&format=image/png`
        url += `&width=${this.props.tileSize}&height=${this.props.tileSize}`
        url += `&bbox=${tile.bbox.west},${tile.bbox.south},${tile.bbox.east},${tile.bbox.north}`
        url += `&srs=EPSG:4326`
        let headers = null
        if (this.props.remoteUser && this.props.remoteUser.trim().length) headers = { 'REMOTE_USER': this.props.remoteUser }
        const { signal } = tile;
        if (signal.aborted) return null
        console.log(url)
        return fetch(url, {signal})
            .then(response => {console.log(response); return response.blob()})
            .then(image => URL.createObjectURL(image))
    }
}

WMSTileLayer.layerName = 'WMSTileLayer';
WMSTileLayer.defaultProps = defaultProps;