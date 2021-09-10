import {TileLayer} from '@deck.gl/geo-layers';
import { IconLayer, SolidPolygonLayer} from '@deck.gl/layers';
import MapStyle from '../styles';

/**
 * 
 * @param {layer} layer 
 * @param {MapStyle} mapStyle 
 * @param {String} remoteUser 
 * @param {boolean} isNew 
 * @returns 
 */
export default function addGisDomainTileLayerByStandardApi(data, mapStyle, remoteUser, isNew) {
    let url = data.layer + "/tile/{z}/{x}/{y}?props=code,unique_id,_id,domain,space,external_id,type"
    if (data.filter) url += ("&" + data.filter)
    if (url.indexOf('status') == -1) url += "&status=40"
    let loadOptions = {}
    if (remoteUser && remoteUser.trim().length) {
        loadOptions = { fetch: { headers: { 'REMOTE_USER': remoteUser } } }
    }
    let selectedItems = null
    if(JSON.parse(localStorage.getItem("selectedItems"))){
      selectedItems = new Set(JSON.parse(localStorage.getItem("selectedItems")))
    }
    debugger
    let minZoom, maxZoom;

    if(isNew) {
        minZoom = data.minZoom ? data.minZoom : 0
        maxZoom = data.maxZoom ? data.maxZoom : 23
    } else {
        minZoom = data.props.minZoom
        maxZoom = data.props.maxZoom
    }
    return new TileLayer({
        id: data.id,
        data: isNew ? url : data.props.data,
        minZoom : minZoom,
        maxZoom : maxZoom,
        pickable: true,
        loadOptions: {},
        tileSize: 512,
        getRadius: 4,
        _subLayerProps: {
            points: {
                type: IconLayer,
                getIcon: d =>{
                  if(selectedItems && selectedItems.has(d.__source.object.properties.unique_id)){
                    return mapStyle.getIcon(d)
                  }
                    return mapStyle.getIcon(d)
                },
                getSize: d => {
                    if(selectedItems && selectedItems.has(d.__source.object.properties.unique_id)){
                      return mapStyle.getIconSize(d) * 2
                    }
                      return mapStyle.getIconSize(d)
                  },
                pickable: true,
                sizeScale: 1,
                updateTriggers: {
                  getIcon: [JSON.parse(localStorage.getItem("selectedItems"))],
                  getSize: [JSON.parse(localStorage.getItem("selectedItems"))],
                  id: [data.id]
                },
            },
            'polygons-fill': {
                type: SolidPolygonLayer,
                getFillColor: f => mapStyle.getPolygonFillColor(f)
            }
        },
        getPosition: d => d.coordinates,
        pointRadiusUnits: 'pixels',
        autoHighlight: true,
        highlightColor: [255, 0, 0, 128],
        getLineWidth: d => {
            if (d && d.geometry && d.geometry.type === 'Polygon') {
                return mapStyle.getPolygonLineWidth(d)
            } 
            if(d && d.geometry && d.geometry.type === 'LineString') {
                return mapStyle.getLineWidth(d)
            }

            return mapStyle.DEFAULT_LINE_WIDTH
        },
        getLineColor: d => {
            if (d && d.geometry && d.geometry.type === 'Polygon') {
                return mapStyle.getPolygonLineColor(d)
            } 
            if(d && d.geometry && d.geometry.type === 'LineString') {
                return mapStyle.getLineColor(d)
            }

            return mapStyle.DEFAULT_LINE_COLOR
        },
    })
}