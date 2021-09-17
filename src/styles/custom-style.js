/**
 * const ICON_MAPPING = {
    marker: {x: 0, y: 0, width: 128, height: 128, mask: true}
};
 */
const trans = 240
const selectedColor = [100,0,0,255]
const selectedColor2 = [200,0,80,255]
const selectedColor3 = [100,0,200,255]

//OPTION 1:
// Fornire una imagine
// png o svg



export const defaultStyle = {
    "layers": [
        {
            "id": "layer3",
            "type": "symbol",
            "source": "grid-act-maintenance.gam-issue",
            "layout": [
                {
                    "condition": "type == 'issue-level-1'", //condition matched by property.type
                    "image": "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png", //number1
                    "imageWidth": 25, "imageHeight": 25, "imageAnchorY": 35, "imageAnchorX": 17,
                    "color": [0,100,0,240],
                    "selectedColor": selectedColor,
                },
                {
                    "condition": "type == 'issue-level-2'",
                    "image": "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png",//number2
                    "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17,
                    "color": [0,200,100,240],
                    "selectedColor": selectedColor2
                },
                {
                    "condition": "type == 'issue-level-3'",
                    "image": "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",//number3
                    "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17,
                    "color": [200,50,50,240],
                    "selectedColor": selectedColor3
                },
                {
                    "condition": "true",
                    "image": "https://img2.freepng.es/20180522/eww/kisspng-web-development-computer-icons-website-5b043775017c54.2851318415270029970061.jpg",
                    "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17,
                    "color": [0,100,200,240],
                    "selectedColor": selectedColor
                }              
            ]
        },
        {
            "id": "linetest",
            "type": "line",
            "source": "grid-act-maintenance.gam-issue",
            "layout": [
                {
                    "condition": "true",
                    "lineColor": [0, 0, 70, 255],
                    "lineWidth": 3
                }              
            ]
        },
        {
            "id": "cazzi",
            "type": "line",
            "source": "cazzo.cazzo",
            "layout": [
                {
                    "condition": "true",
                    "lineColor": [0, 0, 0, 50],
                    "lineWidth": 2
                }              
            ]
            
        },
        {
            "id": "polygontest",
            "type": "polygon",
            "source": "grid-act-maintenance.gam-issue",
            "layout": [
                {
                    "condition": "true",
                    "fillColor": [230, 120, 100, 100],
                    "lineColor": [200, 100, 0, 255],
                    "selectedFillColor": [0,0,200,200],
                    "lineWidth": 5
                }              
            ]
        },
        {
            "id": "polygontest",
            "type": "symbol",
            "source": "topology.1-h",
            "layout": [
                {
                    "condition": "true",
                    "image": "https://cdn1.iconfinder.com/data/icons/logos-brands-in-colors/231/among-us-player-white-512.png",
                    "imageWidth": 10, "imageHeight": 10, "imageAnchorY": 10, "imageAnchorX": 8,
                    "color": selectedColor,
                    "selectedColor": selectedColor2
                }              
            ]
        }
    ]
}



/**
 * 
 * ACCEPETED PROPERTIES PER LAYER:
 * 
 * LAYER TYPE: 
 *    LINE:
*         lineWidth: Integer || Default: 1
          lineColor: RGBA [A, B, C, D] : Default [0,0,0,255]
 * 
 *      POLYGON:
 *          lineColor: RGBA [A, B, C, D]  : Default [0,0,0,255]
 *          fillColor: RGBA [A, B, C, D]: Default [0,0,0,100]
*       ICON: 
            iconSize: integer : 24
            image?: URL : xxxx.
            imageWidth?: number | 24,
            imageHeight?: number | 24,
            imageAnchorY?: number | 24,
            imageAnchorX?: number | 12
 *          
 * 
 */




//OPTION 2 PNG MAP WITH DIMENSIONS

const defaultStyle2222 = {
"layers": [
    {
        "id": "layer3",
        "type": "symbol",
        "source": "grid-act-maintenance.gam-issue",
        "iconAtlas": "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
        "layout": [
            {
                condition: "type == 'issue-level-1'", //condition matched by property.type
                icon: "nameOfTheIcon",
                image: "marker", 
                x: 0, x: 0, width: 128, height: 128,
                color: [100,100,100,255],
                highLightColor: [0,0,0,255]
            },
            {
                "condition": "type == 'issue-level-2'",
                "image": "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png",//number2
                "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17
            },
            {
                "condition": "type == 'issue-level-3'",
                "image": "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",//number3
                "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17
            },
            {
                "condition": "true",
                "image": "https://img2.freepng.es/20180522/eww/kisspng-web-development-computer-icons-website-5b043775017c54.2851318415270029970061.jpg",
                "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17
            }              
        ]
    }
]
}