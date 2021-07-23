
//https://github.com/visgl/deck.gl/blob/8.4-release/examples/website/highway/app.js

import {typecheck} from './../utilities'
import { GeoJsonLayer} from '@deck.gl/layers';
import {TileLayer} from '@deck.gl/geo-layers';
import { Parser } from 'expr-eval';

export default class MapStyle {


    constructor(l){

        //check layers is an array
        if(Array.isArray(l)){
            this.layers = l.map(e=>e)
        }else {
            this.layers = l
        }
        

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


    getLineWidth =(layer)=>{
        return this.DEFAULT_LINE_WIDTH
    }

    getLineColor =(layer)=>{
        return this.DEFAULT_LINE_COLOR
    }

    getFillColor =(layer, data)=>{
        console.log(123456789)
        console.log(layer, data)
        return this.DEFAULT_OUTLINE_FILL_COLOR
    }

    getFillOutlineColor =(layer)=> {
        return this.DEFAULT_OUTLINE_FILL_COLOR
    }
    
    getStyleLayout (d) {
        if (this.layers === null)
            return null;
        if (!(d.__source && d.__source.object && d.__source.object.properties)) 
            return null;
        const props = d.__source.object.properties;
        let layout = null;
        if (d.__source.parent instanceof GeoJsonLayer && d.__source.parent.parent != null && d.__source.parent.parent instanceof TileLayer) 
            layout = this.getLajyout(`${d.__source.parent.parent.id}`, props);
        if (layout === null) 
            layout = this.getLayout(`${props.domain}.${props.space}`, props);
        return null
    }

    getIconSize =(d)=> {
        const layout = this.getStyleLayout(d)
        if(layout === null) return this.DEFAULT_IMAGE_PUSHPIN_SIZE
        return layout.iconSize || this.DEFAULT_IMAGE_PUSHPIN_SIZE
    }


    getIcon =(d)=> {
        const layout = this.getStyleLayout(d)
        if(layout === null) return
        return {
            url: layout.image,
            width: layout.imageWidth || this.DEFAULT_IMAGE_PUSHPIN_SIZE,
            height: layout.imageHeight || this.DEFAULT_IMAGE_PUSHPIN_SIZE,
            anchorY: layout.imageAnchorY || this.DEFAULT_IMAGE_PUSHPIN_SIZE,
            anchorX: layout.imageAnchorX || (this.DEFAULT_IMAGE_PUSHPIN_SIZE / 2),
        }
    }

    getLayout(source, model){
        const layer  = this.findLayer(source);
        if(layer === null || layer === undefined) return null;
        for(let layout of layer.layout) {
            if(layout.condition === undefined) continue;
            const value = Parser.evaluate(layout.condition, model)
            if(value) return layout
        }
        return null
    }
    

    findLayer(source){
        const layer = this.style.layers.filter( l => l.source === source);
        return layer === undefined ? null : layer[0];
    }
}




// interface MapStyleLayout {
//     condition?: string,
//     image?: string
//     imageWidth?: number | 24,
//     imageHeight?: number | 24,
//     imageAnchorY?: number | 24,
//     imageAnchorX?: number | 12
// }
//  interface MapStyleLayer {
//     id: string,
//     type: MapStyleLayerType,
//     source: string,
//     layout: Array<MapStyleLayout>
// }

//  interface MapStyle {
//     layers: Array<MapStyleLayer>
// }

class Layer{

}