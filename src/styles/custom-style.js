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


//POINTS OK WITH ID AND DOMAIN-SPACE
//POINT OK

export const defaultStyle = {
    "layers": [
        {
            "id": "layer3",
            "type": "symbol",
            "source": "grid-act-maintenance.gam-issue",
            "layout": [ //In case colouring is needed provide in different URLs an icon with different color
                {
                    "condition": "type == 'issue-level-1'", //condition matched by property.type
                    "image": "data:image/png;base64,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", //number1
                    "imageWidth": 200, "imageHeight": 200, "imageAnchorY": 200, "imageAnchorX": 200,
                },
                {
                    "condition": "type == 'issue-level-2'",
                    "image": "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png",//number2
                },
                {
                    "condition": "type == 'issue-level-3'",
                    "image": "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",//number3
                    "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17,
                },
                {
                    "condition": "true",
                    "image": "https://img2.freepng.es/20180522/eww/kisspng-web-development-computer-icons-website-5b043775017c54.2851318415270029970061.jpg",
                    "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17,
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
                    "lineColor": [0, 0, 170, 255],
                    "lineWidth": 3,
                    "dashArray": [20,20]
                }              
            ],

        },
        {
            "id": "layer-geojson-point",
            "type": "symbol",
            "source": "Coors.Baseball",
            "layout": [
                {
                    "condition": "true",
                    "image": "https://img2.freepng.es/20180522/eww/kisspng-web-development-computer-icons-website-5b043775017c54.2851318415270029970061.jpg",
                    "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17,
                }             
            ],

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
            "id": "polygontest1",
            "type": "polygon",
            "source": "grid-act-maintenance.gam-issue",
            "layout": [
                {
                    "condition": "true",
                    "fillColor": [240, 120, 100, 130],
                    "lineColor": [100, 100, 200, 255],
                    "selectedFillColor": [0,0,200,200],
                    "lineWidth": 3,
                    "dashArray": [5,2]
                }              
            ]
        },
        {
            // "id": "layer-geojson-point-line-cazzi",
            "type": "polygon",
            "source": "province.bologna",
            "layout": [
                {
                    "condition": "true",
                    "fillColor": [230, 120, 100, 100],
                    "lineColor": [200, 100, 0, 255],
                    "selectedFillColor": [0,0,200,200],
                    "lineWidth": 2,
                    "dashArray": [6,12]
                }              
            ]
        },
        {
            "id": "2-m",
            "type": "symbol",
            "source": "topology.1-h",
            "layout": [
                {
                    "condition": "true",
                    "image": "https://www.iconpacks.net/icons/1/free-pin-icon-48-thumb.png",
                    "imageWidth": 20, "imageHeight": 20, "imageAnchorY": 20, "imageAnchorX": 11
                }              
            ]
        },
        {
            // "id": "ticketlayer",
            "type": "symbol",
            "source": "ohmygod.god",
            "layout": [
                {
                    "condition": "true",
                    "image": "https://toppng.com/uploads/preview/two-tickets-icon-ticket-ico-11562902873mix2fznwjo.png",
                    "imageWidth": 20, "imageHeight": 20, "imageAnchorY": 20, "imageAnchorX": 11
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

// export const defaultStyle = {
//     "layers": [
//       {
//         "id": "layer1",
//         "type": "symbol",
//         "source": "topology.1-h",
//         "layout": [{ "condition": "true", "image": "https://raw.githubusercontent.com/carlosclatg/DeckglTest/master/src/icons/blackPoint.svg" }]
//       },
//       {
//         "id": "layer2",
//         "type": "symbol",
//         "source": "grid-act-maintenance.gam-activity",
//         "layout": [{ "condition": "true", "image": "../../../../assets/images/small/activity-marker.png" }]
//       },
//       {
//         "id": "layer3",
//         "type": "symbol",
//         "source": "grid-act-maintenance.gam-issue",
//         "layout": [
//           {
//             "condition": "type == 'issue-level-1'",
//             "image": "../../../../assets/images/small/issue-marker-high.png"
//           },
//           {
//             "condition": "type == 'issue-level-2'",
//             "image": "../../../../assets/images/small/issue-marker-medium.png"
//           },
//           {
//             "condition": "type == 'issue-level-3'",
//             "image": "../../../../assets/images/small/issue-marker-low.png"
//           },
//           { "condition": "true", "image": "../../../../assets/images/small/issue-marker-low.png" }
//         ]
//       },
//       {
//         "id": "issuelayer",
//         "type": "symbol",
//         "source": "issuelayer",
//         "layout": [
//           {
//             "condition": "type == 'issue-level-1'",
//             "image": "../../../../assets/images/medium/issue-marker-high.png",
//             "imageWidth": 72,
//             "imageHeight": 90,
//             "imageAnchorY": 90,
//             "imageAnchorX": 36,
//             "iconSize": 70
//           },
//           {
//             "condition": "type == 'issue-level-2'",
//             "image": "../../../../assets/images/medium/issue-marker-medium.png",
//             "imageWidth": 72,
//             "imageHeight": 90,
//             "imageAnchorY": 90,
//             "imageAnchorX": 36,
//             "iconSize": 70
//           },
//           {
//             "condition": "type == 'issue-level-3'",
//             "image": "../../../../assets/images/medium/issue-marker-low.png",
//             "imageWidth": 72,
//             "imageHeight": 90,
//             "imageAnchorY": 90,
//             "imageAnchorX": 36,
//             "iconSize": 70
//           },
//           {
//             "condition": "true",
//             "image": "../../../../assets/images/medium/issue-marker-low.png",
//             "imageWidth": 72,
//             "imageHeight": 90,
//             "imageAnchorY": 90,
//             "imageAnchorX": 36,
//             "iconSize": 70
//           }
//         ]
//       },
//       {
//         "id": "activitylayer",
//         "type": "symbol",
//         "source": "activitylayer",
//         "layout": [
//           {
//             "condition": "true",
//             "image": "../../../../assets/images/medium/activity-marker.png",
//             "imageWidth": 72,
//             "imageHeight": 90,
//             "imageAnchorY": 90,
//             "imageAnchorX": 36,
//             "iconSize": 70
//           }
//         ]
//       },
//       {
//         "id": "ticketlayer",
//         "type": "symbol",
//         "source": "ticketlayer",
//         "layout": [
//           {
//             "condition": "true",
//             "image": "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8Y2hhbmdlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
//             "imageWidth": 72,
//             "imageHeight": 90,
//             "imageAnchorY": 90,
//             "imageAnchorX": 36,
//             "iconSize": 70
//           }
//         ]
//       }
//     ]
//   }