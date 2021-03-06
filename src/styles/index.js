
//https://github.com/visgl/deck.gl/blob/8.4-release/examples/website/highway/app.js

import { GeoJsonLayer} from '@deck.gl/layers';
import { Parser } from 'expr-eval';
import { defaultStyle } from './custom-style';


export default class MapStyle {

    constructor(l){
        try {
            if(!l) {
                this.layers = defaultStyle.layers
            } else {
                this.layers = l.layers
            }
            
        } catch (e){
            this.layers = defaultStyle.layers
        }
        
        console.log("++++++++++++++++++++++++STYLES ARE HERE")
        console.log(this.layers)
    }

    //LINE
    DEFAULT_LINE_COLOR = [0, 0, 0, 255];
    DEFAULT_LINE_WIDTH = 1;
    getLineWidth =(d, id)=>{
        let layout = this.getStyleLayoutLine(d, id)
        if(!layout) return this.DEFAULT_LINE_WIDTH
        if(!layout.lineWidth) return this.DEFAULT_LINE_WIDTH
        return layout.lineWidth
    }

    getLineColor =(d, id)=>{
        let layout = this.getStyleLayoutLine(d, id)
        if(!layout)return this.DEFAULT_LINE_COLOR
        if(!layout.lineColor) return this.DEFAULT_LINE_COLOR
        return layout.lineColor
    }

    getStyleLayoutLine = (d, id) => {
        if (!this.layers)
            return null;
        let layout = null;
        if (d.properties && id) 
            layout = this.getLayout(id, d.properties, 'line');
        if (!layout && d.properties.domain && d.properties.space) 
            layout = this.getLayout(`${d.properties.domain}.${d.properties.space}`, d.properties, 'line');
        return layout
    }

    getLineDashArray(d, id){ //Without Id
        if (!this.layers)
            return null;
        let layout = null;
        if(d && d.__source && d.__source.object ){
            debugger
            layout = this.getLayout(id, d.__source.object.properties, 'line');
            debugger
        }
        if (!layout && d && d.__source && d.__source.object && d.__source.object.properties.domain && d.__source.object.properties.space){
            debugger
            layout = this.getLayout(`${d.__source.object.properties.domain}.${d.__source.object.properties.space}`, d.__source.object.properties, 'line');
            debugger
        } 
        debugger
        if(!layout || !layout.dashArray) return [0,0]
        return layout.dashArray

    }



    //POLYGON
    DEFAULT_FILL_COLOR = [0, 0, 0, 100];
    DEFAULT_LINE_COLOR = [0, 0, 0, 255];
    getPolygonLineColor =(d, id)=>{
        let layout = this.getStyleLayoutPolygon(d, id)
        if(!layout) return this.DEFAULT_LINE_COLOR
        if(!layout.lineColor) return this.DEFAULT_LINE_COLOR
        return layout.lineColor
    }

    getPolygonFillColor =(d, id)=>{
        let layout = this.getStyleLayoutPolygon(d, id)
        if(!layout) return this.DEFAULT_FILL_COLOR
        if(!layout.fillColor) return this.DEFAULT_FILL_COLOR
        return layout.fillColor
    }

    getPolygonFillColorSelected =(d, id)=> {
        let layout = this.getStyleLayoutPolygon(d, id)
        if(!layout) return this.DEFAULT_FILL_COLOR
        if(!layout.selectedFillColor) return this.DEFAULT_FILL_COLOR
        return layout.selectedFillColor
    }
    

    getPolygonLineWidth =(d, id)=> {
        let layout = this.getStyleLayoutPolygon(d, id)
        if(!layout) return this.DEFAULT_LINE_WIDTH
        if(!layout.lineWidth) return this.DEFAULT_LINE_WIDTH
        return layout.lineWidth
    }

    getStyleLayoutPolygon(d, id) {
        if (!this.layers)
            return null;
        let layout = null;
        if (id) 
            layout = this.getLayout(id, d.properties, 'polygon');
        if (!layout && d.properties.domain && d.properties.space) 
            layout = this.getLayout(`${d.properties.domain}.${d.properties.space}`, d.properties, 'polygon');
        return layout
    }

    getLineDashArrayForPolygon =(d,id)=> {
        if (!this.layers)
        return null;
        let layout = null;
        if(id ){
            layout = this.getLayout(id, d.__source.object.properties, 'polygon');
        }
        if (d && d.__source && d.__source.object && d.__source.object.properties.domain && d.__source.object.properties.space){
            layout = this.getLayout(`${d.__source.object.properties.domain}.${d.__source.object.properties.space}`, d.__source.object.properties, 'polygon');
        } 
        if(!layout || !layout.dashArray) return [0,0]
        return layout.dashArray
    }



    //ICON
    DEFAULT_IMAGE_PUSHPIN_SIZE = 36
    DEFAULT_ICON_URL= 'https://raw.githubusercontent.com/carlosclatg/DeckglTest/master/src/icons/blackPoint.svg'
    getIconSize =(d, id)=> {
        let layout = this.getStyleLayoutIcon(d)
        if(!layout) return 36
        return layout.iconSize || 36
    }

    // getColor = (d) => {
    //     let layout = this.getStyleLayoutIcon(d)
        
    //     if(!layout || !layout.color) return this.DEFAULT_LINE_COLOR
    //     return layout.color
    // }

    // getSelectedColor = (d) => {
    //     let layout = this.getStyleLayoutIcon(d)
        
    //     if(!layout || !layout.selectedColor) return this.DEFAULT_LINE_COLOR
    //     return layout.selectedColor
    // }

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

    getIcon =(d, id)=> {
        let layout = this.getStyleLayoutIcon(d, id)
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

    getStyleLayoutIcon (d, id) {
        if (!this.layers)
            return null;
        if (!(d.__source && d.__source.object && d.__source.object.properties)) 
            return null;
        const props = d.__source.object.properties;
        let layout = null;
        if (d.__source.parent instanceof GeoJsonLayer && d.__source.parent) 
            layout = this.getLayout(id, props);
        if (!layout) 
            layout = this.getLayout(`${props.domain}.${props.space}`, props);
        return layout
    }

    

    //https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/



    //COMMON 
    
    //type = symbol, line, polygon
    getLayout(source, model, type ='symbol'){
        let layer  = this.findLayerById(source, type);
        if(!layer) layer = this.findLayerBySource(source, type);
        if(!layer) return null
        for(let layout of layer.layout) {
            if(layout.condition === undefined) continue;
            let conditionArray = layout.condition.split(' && ')
            try{
                let value = true
                for(let cond of conditionArray){
                    value = value && Parser.evaluate(cond, model) 
                }
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