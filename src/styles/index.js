
//https://github.com/visgl/deck.gl/blob/8.4-release/examples/website/highway/app.js

import { GeoJsonLayer} from '@deck.gl/layers';
import {TileLayer} from '@deck.gl/geo-layers';
import { Parser } from 'expr-eval';
import { defaultStyle } from './custom-style';


export default class MapStyle {

    constructor(l){
        if(!l) {
            this.layers = defaultStyle.layers
        } else {
            if(!l.layers){
                this.layers = defaultStyle.layers
            } else {
                this.layers = l.layers

            }
        }
        console.log(this.layers)
    }

    //LINE
    DEFAULT_LINE_COLOR = [0, 0, 0, 255];
    DEFAULT_LINE_WIDTH = 1;
    getLineWidth =(d)=>{
        let layout = this.getStyleLayoutLine(d)
        if(!layout) return this.DEFAULT_LINE_WIDTH
        if(!layout.lineWidth) return this.DEFAULT_LINE_WIDTH
        return layout.lineWidth
    }

    getLineColor =(d)=>{
        let layout = this.getStyleLayoutLine(d)
        if(!layout)return this.DEFAULT_LINE_COLOR
        if(!layout.lineColor) return this.DEFAULT_LINE_COLOR
        return layout.lineColor
    }

    getStyleLayoutLine(d) {
        if (!this.layers)
            return null;
        let layout = null;
        if (d.id ) 
            layout = this.getLayout(`${d.id}`, d.properties, 'line');
        if (!layout && d.properties.domain && d.properties.space) 
            layout = this.getLayout(`${d.properties.domain}.${d.properties.space}`, d.properties, 'line');
        return layout
    }



    //POLYGON
    DEFAULT_FILL_COLOR = [0, 0, 0, 100];
    DEFAULT_LINE_COLOR = [0, 0, 0, 255];
    getPolygonLineColor =(d)=>{
        let layout = this.getStyleLayoutPolygon(d)
        if(!layout) return this.DEFAULT_LINE_COLOR
        if(!layout.lineColor) return this.DEFAULT_LINE_COLOR
        return layout.lineColor
    }

    getPolygonFillColor =(d)=>{
        let layout = this.getStyleLayoutPolygon(d)
        if(!layout) return this.DEFAULT_FILL_COLOR
        if(!layout.fillColor) return this.DEFAULT_FILL_COLOR
        return layout.fillColor
    }

    getPolygonFillColorSelected =(d)=> {
        let layout = this.getStyleLayoutPolygon(d)
        if(!layout) return this.DEFAULT_FILL_COLOR
        if(!layout.selectedFillColor) return this.DEFAULT_FILL_COLOR
        return layout.selectedFillColor
    }
    

    getPolygonLineWidth =(d)=> {
        let layout = this.getStyleLayoutPolygon(d)
        if(!layout) return this.DEFAULT_LINE_WIDTH
        if(!layout.lineWidth) return this.DEFAULT_LINE_WIDTH
        return layout.lineWidth
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



    //ICON
    DEFAULT_IMAGE_PUSHPIN_SIZE = 36
    DEFAULT_ICON_URL= 'https://raw.githubusercontent.com/carlosclatg/DeckglTest/master/src/icons/blackPoint.svg'
    getIconSize =(d)=> {
        let layout = this.getStyleLayoutIcon(d)
        if(!layout) return 36
        return layout.iconSize || 36
    }

    getColor = (d) => {
        let layout = this.getStyleLayoutIcon(d)
        debugger
        if(!layout || !layout.color) return this.DEFAULT_LINE_COLOR
        return layout.color
    }

    getSelectedColor = (d) => {
        let layout = this.getStyleLayoutIcon(d)
        debugger
        if(!layout || !layout.selectedColor) return this.DEFAULT_LINE_COLOR
        return layout.selectedColor
    }

    getDefaultIcon = (d) => {
        return {
            url:  this.DEFAULT_ICON_URL,
            width:  this.DEFAULT_IMAGE_PUSHPIN_SIZE,
            height:  this.DEFAULT_IMAGE_PUSHPIN_SIZE,
            anchorY:  this.DEFAULT_IMAGE_PUSHPIN_SIZE,
            anchorX:  this.DEFAULT_IMAGE_PUSHPIN_SIZE,
            mask: false
        }
    }

    getIcon =(d)=> {
        let layout = this.getStyleLayoutIcon(d)
        if(!layout) layout = {}
        return {
            url: layout.image || this.DEFAULT_ICON_URL,
            width: layout.imageWidth || this.DEFAULT_IMAGE_PUSHPIN_SIZE,
            height: layout.imageHeight || this.DEFAULT_IMAGE_PUSHPIN_SIZE,
            anchorY: layout.imageAnchorY || this.DEFAULT_IMAGE_PUSHPIN_SIZE,
            anchorX: layout.imageAnchorX || this.DEFAULT_IMAGE_PUSHPIN_SIZE,
            mask: false
        }
    }

    getStyleLayoutIcon (d) {
        debugger
        if (!this.layers)
            return null;
        if (!(d.__source && d.__source.object && d.__source.object.properties)) 
            return null;
        const props = d.__source.object.properties;
        let layout = null;
        if (d.__source.parent instanceof GeoJsonLayer && d.__source.parent) 
            layout = this.getLayout(`${d.__source.parent.id}`, props);
        if (!layout) 
            layout = this.getLayout(`${props.domain}.${props.space}`, props);
        return layout
    }

    

    //https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/



    //COMMON 
    
    //type = symbol, line, polygon
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