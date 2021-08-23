
//https://github.com/visgl/deck.gl/blob/8.4-release/examples/website/highway/app.js

import { GeoJsonLayer} from '@deck.gl/layers';
import {TileLayer} from '@deck.gl/geo-layers';
import { Parser } from 'expr-eval';
import { defaultStyle } from './custom-style';


export default class MapStyle {

    constructor(l){
        


        this.layers = defaultStyle.layers
    
        
        

        /*
        forEach elem
            id: string
            type: enum value
            filter: optional
            source: string
            layout [] -> {
                    condition?: string,
                    image?: string
                    imageWidth?: number | 24,
                    imageHeight?: number | 24,
                    imageAnchorY?: number | 24,
                    imageAnchorX?: number | 12
            }
            minzoom
            maxzoom

        */
    }

    DEFAULT_LINE_COLOR = [25, 100, 100, 255];
    DEFAULT_FILL_COLOR = [0, 0, 0, 255];
    DEFAULT_OUTLINE_FILL_COLOR = [100, 230, 23, 255];
    DEFAULT_LINE_WIDTH = 5;
    DEFAULT_IMAGE_PUSHPIN_SIZE = 24


    getLineWidth =(d)=>{
        let layout = this.getStyleLayoutLine(d)
        debugger
        if(!layout) return this.DEFAULT_LINE_WIDTH
        if(!layout.lineWidth) return this.DEFAULT_LINE_WIDTH
        return layout.lineWidth
    }

    getLineColor =(d)=>{
        let layout = this.getStyleLayoutLine(d)
        debugger
        if(!layout)return this.DEFAULT_LINE_COLOR
        if(!layout.lineColor) return this.DEFAULT_LINE_COLOR
        return layout.lineColor
    }


    getPolygonLineColor =(d)=>{
        let layout = this.getStyleLayoutPolygon(d)
        if(!layout) return this.DEFAULT_LINE_COLOR
        if(!layout.lineColor) return this.DEFAULT_LINE_COLOR
        return layout.lineColor
    }

    getPolygonFillColor =(d)=>{
        let layout = this.getStyleLayoutPolygon(d)
        if(!layout) return this.DEFAULT_LINE_COLOR
        if(!layout.fillColor) return this.DEFAULT_LINE_COLOR
        return layout.fillColor
    }



    getFillColor =(d)=>{
        let layout = this.getStyleLayoutPolygon(d)
        if(!layout) return this.DEFAULT_FILL_COLOR
        if(!layout.fillColor) return this.DEFAULT_FILL_COLOR
        return layout.fillColor
    }

    getFillOutlineColor =(layer)=> {
        return this.DEFAULT_OUTLINE_FILL_COLOR
    }
    
    getStyleLayoutIcon (d) {
        if (!this.layers)
            return null;
        if (!(d.__source && d.__source.object && d.__source.object.properties)) 
            return null;
        const props = d.__source.object.properties;
        let layout = null;
        debugger
        if (d.__source.parent instanceof GeoJsonLayer && d.__source.parent.parent && d.__source.parent.parent instanceof TileLayer) 
            layout = this.getLayout(`${d.__source.parent.parent.id}`, props);
        if (!layout) 
            layout = this.getLayout(`${props.domain}.${props.space}`, props);
        return layout
    }

    getIconSize =(d)=> {
        let layout = this.getStyleLayoutIcon(d)
        if(!layout) return this.DEFAULT_IMAGE_PUSHPIN_SIZE
        return layout.iconSize || this.DEFAULT_IMAGE_PUSHPIN_SIZE
    }


    getIcon =(d)=> {
        let layout = this.getStyleLayoutIcon(d)
        if(!layout) layout = {}
        return {
            url: layout.image || 'https://i.pinimg.com/originals/fc/c5/77/fcc57757270fbcacb3ec70a4ec384d26.jpg',
            width: layout.imageWidth || this.DEFAULT_IMAGE_PUSHPIN_SIZE,
            height: layout.imageHeight || this.DEFAULT_IMAGE_PUSHPIN_SIZE,
            anchorY: layout.imageAnchorY || this.DEFAULT_IMAGE_PUSHPIN_SIZE,
            anchorX: layout.imageAnchorX || (this.DEFAULT_IMAGE_PUSHPIN_SIZE / 2),
        }
    }

    //https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/
    getLayout(source, model, type ='symbol'){
        let layer  = this.findLayerBySource(source, type);
        if(!layer) layer = this.findLayerById(source, type);
        if(!layer) return null
        for(let layout of layer.layout) {
            if(layout.condition === undefined) continue;
            try{
                const value = Parser.evaluate(layout.condition, model)
                if(value) return layout
            } catch(err) { //case any condition is matched 2 lines above
                continue
            }
        }
        return null
    }
    

    findLayerBySource(source, type){
        const layer = this.layers.filter( l => l.source === source && l.type === type);
        return layer === undefined ? null : layer[0];
    }


    findLayerById(id, type){
        const layer = this.layers.filter( l => l.id === id && l.type === type);
        return layer === undefined ? null : layer[0];
    }

    getStyleLayoutLine(d) {
        if (!this.layers)
            return null;
        let layout = null;
        if (d.id ) 
            layout = this.getLayout(`${d.id}`, d.properties, 'line');
        if (!layout && d.properties.domain && d.properties.space) 
            layout = this.getLayout(`${d.properties.domain}.${d.properties.space}`, d.properties, 'line');
        debugger
        return layout
    }


    getStyleLayoutPolygon(d) {
        if (!this.layers)
            return null;
        let layout = null;
        if (d.id) 
            layout = this.getLayout(`${d.id}`, d.properties, 'polygon');
        if (!layout && d.properties.domain && d.properties.space) 
            layout = this.getLayout(`${d.properties.domain}.${d.properties.space}`, d.properties, 'polygon');
        return layout
    }
}



/*

dudas styling:

Como hacer distinguir cuando es un punto entre Point y Icon
https://deck.gl/docs/api-reference/layers/geojson-layer#sub-layers

specs de custom-style.json --> la hacemos nosotros?

Icon: {url, imagewidth, imageHeight} - default icon? default point
Line: color, width
Polygon: fillColor, lineColor
.
Style:
-ById
-Bydomainspace

*/