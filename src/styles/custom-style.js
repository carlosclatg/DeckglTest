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



// export const defaultStyle = {
//     "layers": [
//         {
//             "id": "layer3",
//             "type": "symbol",
//             "source": "grid-act-maintenance.gam-issue",
//             "layout": [
//                 {
//                     "condition": "type == 'issue-level-1'", //condition matched by property.type
//                     "image": "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png", //number1
//                     "imageWidth": 25, "imageHeight": 25, "imageAnchorY": 35, "imageAnchorX": 17,
//                     "color": [0,100,0,240],
//                     "selectedColor": selectedColor,
//                 },
//                 {
//                     "condition": "type == 'issue-level-2'",
//                     "image": "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png",//number2
//                     "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17,
//                     "color": [0,200,100,240],
//                     "selectedColor": selectedColor2
//                 },
//                 {
//                     "condition": "type == 'issue-level-3'",
//                     "image": "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",//number3
//                     "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17,
//                     "color": [200,50,50,240],
//                     "selectedColor": selectedColor3
//                 },
//                 {
//                     "condition": "true",
//                     "image": "https://img2.freepng.es/20180522/eww/kisspng-web-development-computer-icons-website-5b043775017c54.2851318415270029970061.jpg",
//                     "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17,
//                     "color": [0,100,200,240],
//                     "selectedColor": selectedColor
//                 }              
//             ]
//         },
//         {
//             "id": "linetest",
//             "type": "line",
//             "source": "grid-act-maintenance.gam-issue",
//             "layout": [
//                 {
//                     "condition": "true",
//                     "lineColor": [0, 0, 70, 255],
//                     "lineWidth": 3,
//                 }              
//             ]
//         },
//         {
//             "id": "cazzi",
//             "type": "line",
//             "source": "cazzo.cazzo",
//             "layout": [
//                 {
//                     "condition": "true",
//                     "lineColor": [0, 0, 0, 50],
//                     "lineWidth": 2
//                 }              
//             ]
            
//         },
//         {
//             "id": "polygontest",
//             "type": "polygon",
//             "source": "grid-act-maintenance.gam-issue",
//             "layout": [
//                 {
//                     "condition": "true",
//                     "fillColor": [230, 120, 100, 100],
//                     "lineColor": [200, 100, 0, 255],
//                     "selectedFillColor": [0,0,200,200],
//                     "lineWidth": 5
//                 }              
//             ]
//         },
//         {
//             "id": "polygontest",
//             "type": "symbol",
//             "source": "topology.1-h",
//             "layout": [
//                 {
//                     "condition": "true",
//                     "image": "https://www.iconpacks.net/icons/1/free-pin-icon-48-thumb.png",
//                     "imageWidth": 20, "imageHeight": 20, "imageAnchorY": 20, "imageAnchorX": 11,
//                     "color": selectedColor,
//                     "selectedColor": selectedColor2
//                 }              
//             ]
//         }
//     ]
// }



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

export const defaultStyle = {
    "layers": [
      {
        "id": "layer1",
        "type": "symbol",
        "source": "topology.1-h",
        "layout": [{ "condition": "true", "image": "../../../../assets/images/small/substation-marker.png" }]
      },
      {
        "id": "layer2",
        "type": "symbol",
        "source": "grid-act-maintenance.gam-activity",
        "layout": [{ "condition": "true", "image": "../../../../assets/images/small/activity-marker.png" }]
      },
      {
        "id": "layer3",
        "type": "symbol",
        "source": "grid-act-maintenance.gam-issue",
        "layout": [
          {
            "condition": "type == 'issue-level-1'",
            "image": "../../../../assets/images/small/issue-marker-high.png"
          },
          {
            "condition": "type == 'issue-level-2'",
            "image": "../../../../assets/images/small/issue-marker-medium.png"
          },
          {
            "condition": "type == 'issue-level-3'",
            "image": "../../../../assets/images/small/issue-marker-low.png"
          },
          { "condition": "true", "image": "../../../../assets/images/small/issue-marker-low.png" }
        ]
      },
      {
        "id": "issuelayer",
        "type": "symbol",
        "source": "issuelayer",
        "layout": [
          {
            "condition": "type == 'issue-level-1'",
            "image": "../../../../assets/images/medium/issue-marker-high.png",
            "imageWidth": 72,
            "imageHeight": 90,
            "imageAnchorY": 90,
            "imageAnchorX": 36,
            "iconSize": 70
          },
          {
            "condition": "type == 'issue-level-2'",
            "image": "../../../../assets/images/medium/issue-marker-medium.png",
            "imageWidth": 72,
            "imageHeight": 90,
            "imageAnchorY": 90,
            "imageAnchorX": 36,
            "iconSize": 70
          },
          {
            "condition": "type == 'issue-level-3'",
            "image": "../../../../assets/images/medium/issue-marker-low.png",
            "imageWidth": 72,
            "imageHeight": 90,
            "imageAnchorY": 90,
            "imageAnchorX": 36,
            "iconSize": 70
          },
          {
            "condition": "true",
            "image": "../../../../assets/images/medium/issue-marker-low.png",
            "imageWidth": 72,
            "imageHeight": 90,
            "imageAnchorY": 90,
            "imageAnchorX": 36,
            "iconSize": 70
          }
        ]
      },
      {
        "id": "activitylayer",
        "type": "symbol",
        "source": "activitylayer",
        "layout": [
          {
            "condition": "true",
            "image": "../../../../assets/images/medium/activity-marker.png",
            "imageWidth": 72,
            "imageHeight": 90,
            "imageAnchorY": 90,
            "imageAnchorX": 36,
            "iconSize": 70
          }
        ]
      },
      {
        "id": "ticketlayer",
        "type": "symbol",
        "source": "ticketlayer",
        "layout": [
          {
            "condition": "true",
            "image": "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8Y2hhbmdlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
            "imageWidth": 72,
            "imageHeight": 90,
            "imageAnchorY": 90,
            "imageAnchorX": 36,
            "iconSize": 70
          }
        ]
      }
    ]
  }