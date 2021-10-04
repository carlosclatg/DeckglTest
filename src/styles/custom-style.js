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
            "image": "https://wonder-day.com/wp-content/uploads/2020/10/wonder-day-among-us-21.png",
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
            "image": "../../../../assets/images/medium/st-marker-low.png",
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



// export const defaultStyle = {
//   layers:[
//      {
//         "id":"RAMI AT",
//         "type":"line",
//         "source":"topology.tmat",
//         "layout":[
//            {
//               "condition":"NETWORK_TYPE = 'H' && V_NOMINAL > 132",
//               "lineColor":[
//                  255,
//                  0,
//                  0,
//                  100
//               ],
//               "lineWidth":2
//            },
//            {
//               "condition":"NETWORK_TYPE = 'H' && V_NOMINAL > 132 && EDIT_TYPE_ID = 'EHHVLSAC'",
//               "lineColor":[
//                  255,
//                  0,
//                  0,
//                  100
//               ],
//               "lineWidth":2,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'H' && V_NOMINAL > 132 && EDIT_TYPE_ID = 'EHHVLSUC'",
//               "lineColor":[
//                  255,
//                  0,
//                  0,
//                  100
//               ],
//               "lineWidth":2,
//               "dashArray":[
//                  4,
//                  4
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'H' && V_NOMINAL <= 132",
//               "lineColor":[
//                  255,
//                  0,
//                  0,
//                  100
//               ],
//               "lineWidth":2
//            },
//            {
//               "condition":"NETWORK_TYPE = 'H' && V_NOMINAL <= 132 && EDIT_TYPE_ID = 'EHVLSAC'",
//               "lineColor":[
//                  255,
//                  0,
//                  0,
//                  100
//               ],
//               "lineWidth":2,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'H' && V_NOMINAL <= 132 && EDIT_TYPE_ID = 'EHVLSUC'",
//               "lineColor":[
//                  255,
//                  0,
//                  0,
//                  100
//               ],
//               "lineWidth":2,
//               "dashArray":[
//                  4,
//                  4
//               ]
//            },
//            {
//               "condition":"true",
//               "lineColor":[
//                  255,
//                  0,
//                  0,
//                  100
//               ],
//               "lineWidth":8
//            }
//         ]
//      },
//      {
//         "id":"NODI MT 2 - CABINE",
//         "type":"symbol",
//         "source":"topology.2-m",
//         "layout":[
//            {
//               "condition":"LEGACY_NODE_TYPE = 2 && BUILDING_TYPE = 'PA'",
//               "image":"http://10.151.1.168/p3/app/img/map-markers/214-PTP-small.svg",
//               "imageWidth":25,
//               "imageHeight":25,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            },
//            {
//               "condition":"LEGACY_NODE_TYPE = 2 && BUILDING_TYPE <> 'PA' && STATION_TYPE <> ('CU','UT')",
//               "image":"http://10.151.1.168/p3/app/img/map-markers/cabina-secondaria-blk.svg",
//               "imageWidth":27,
//               "imageHeight":35,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            },
//            {
//               "condition":"LEGACY_NODE_TYPE = 2 && BUILDING_TYPE <> 'PA' && STATION_TYPE = 'CU'",
//               "image":"http://10.151.1.168/p3/app/img/map-markers/cabina-secondaria-blk.svg",
//               "imageWidth":27,
//               "imageHeight":35,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            },
//            {
//               "condition":"LEGACY_NODE_TYPE = 2 && BUILDING_TYPE <> 'PA' && STATION_TYPE = 'UT'",
//               "image":"http://10.151.1.168/p3/app/img/map-markers/cabina-secondaria-ut-blk-fill.svg",
//               "imageWidth":27,
//               "imageHeight":35,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            },
//            {
//               "condition":"true",
//               "image":"",
//               "imageWidth":27,
//               "imageHeight":35,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            }
//         ]
//      },
//      {
//         "id":"NODI BT 7 - DI CONSEGNA",
//         "type":"symbol",
//         "source":"topology.7-l",
//         "layout":[
//            {
//               "condition":"LEGACY_NODE_TYPE = 7",
//               "image":"http://10.151.1.168/p3/app/img/map-markers/nodo-consegna-passivo-blk.svg",
//               "imageWidth":25,
//               "imageHeight":25,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            },
//            {
//               "condition":"true",
//               "image":"",
//               "imageWidth":27,
//               "imageHeight":35,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            }
//         ]
//      },
//      {
//         "id":"NODI BT G",
//         "type":"symbol",
//         "source":"topology.g-l",
//         "layout":[
//            {
//               "condition":"LEGACY_NODE_TYPE = 'G' && NETWORK_TYPE = 'L'",
//               "image":"black point",
//               "imageWidth":25,
//               "imageHeight":25,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            },
//            {
//               "condition":"true",
//               "image":"",
//               "imageWidth":27,
//               "imageHeight":35,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            }
//         ]
//      },
//      {
//         "id":"NODI BT T",
//         "type":"symbol",
//         "source":"topology.t-l",
//         "layout":[
//            {
//               "condition":"LEGACY_NODE_TYPE = 'T' && NETWORK_TYPE = 'L'",
//               "image":"http://10.151.1.168/p3/app/img/map-markers/cambio-posa-mt-blk.svg",
//               "imageWidth":25,
//               "imageHeight":25,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            },
//            {
//               "condition":"true",
//               "image":"",
//               "imageWidth":27,
//               "imageHeight":35,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            }
//         ]
//      },
//      {
//         "id":"NODI BT 6",
//         "type":"symbol",
//         "source":"topology.6-l",
//         "layout":[
//            {
//               "condition":"LEGACY_NODE_TYPE = 6 && SYMBOL_ID = 111",
//               "image":"http://10.151.1.168/p3/app/img/map-markers/nodo-rigido-MT.svg",
//               "imageWidth":25,
//               "imageHeight":25,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            },
//            {
//               "condition":"LEGACY_NODE_TYPE = 6 && SYMBOL_ID = 176",
//               "image":"http://10.151.1.168/p3/app/img/map-markers/square-green.svg",
//               "imageWidth":27,
//               "imageHeight":35,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            },
//            {
//               "condition":"true",
//               "image":"",
//               "imageWidth":27,
//               "imageHeight":35,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            }
//         ]
//      },
//      {
//         "id":"RAMI MT",
//         "type":"line",
//         "source":"topology.tmmt",
//         "layout":[
//            {
//               "condition":"NETWORK_TYPE = 'M' && LAYING_TYPE = 'A' && STATUS_ID = 38",
//               "lineColor":[
//                  165,
//                  42,
//                  42,
//                  100
//               ],
//               "lineWidth":2
//            },
//            {
//               "condition":"NETWORK_TYPE = 'M' && LAYING_TYPE = 'A' && STATUS_ID = 39",
//               "lineColor":[
//                  255,
//                  255,
//                  0,
//                  100
//               ],
//               "lineWidth":2
//            },
//            {
//               "condition":"NETWORK_TYPE = 'M' && LAYING_TYPE = 'A' && STATUS_ID = 40",
//               "lineColor":[
//                  0,
//                  0,
//                  255,
//                  100
//               ],
//               "lineWidth":2
//            },
//            {
//               "condition":"NETWORK_TYPE = 'M' && LAYING_TYPE = 'A' && STATUS_ID = 41",
//               "lineColor":[
//                  112,
//                  48,
//                  160,
//                  100
//               ],
//               "lineWidth":2
//            },
//            {
//               "condition":"NETWORK_TYPE = 'M' && LAYING_TYPE = 'A' && STATUS_ID = 42",
//               "lineColor":[
//                  165,
//                  42,
//                  42,
//                  100
//               ],
//               "lineWidth":2
//            },
//            {
//               "condition":"NETWORK_TYPE = 'M' && LAYING_TYPE = 'A' && STATUS_ID = 43",
//               "lineColor":[
//                  255,
//                  255,
//                  0,
//                  100
//               ],
//               "lineWidth":2
//            },
//            {
//               "condition":"NETWORK_TYPE = 'M' && LAYING_TYPE = 'B' && STATUS_ID = 38",
//               "lineColor":[
//                  165,
//                  42,
//                  42,
//                  100
//               ],
//               "lineWidth":2,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'M' && LAYING_TYPE = 'B' && STATUS_ID = 39",
//               "lineColor":[
//                  255,
//                  255,
//                  0,
//                  100
//               ],
//               "lineWidth":2,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'M' && LAYING_TYPE = 'B' && STATUS_ID = 40",
//               "lineColor":[
//                  0,
//                  0,
//                  255,
//                  100
//               ],
//               "lineWidth":2,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'M' && LAYING_TYPE = 'B' && STATUS_ID = 41",
//               "lineColor":[
//                  112,
//                  48,
//                  160,
//                  100
//               ],
//               "lineWidth":2,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'M' && LAYING_TYPE = 'B' && STATUS_ID = 42",
//               "lineColor":[
//                  165,
//                  42,
//                  42,
//                  100
//               ],
//               "lineWidth":2,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'M' && LAYING_TYPE = 'B' && STATUS_ID = 43",
//               "lineColor":[
//                  255,
//                  255,
//                  0,
//                  100
//               ],
//               "lineWidth":2,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'M' && LAYING_TYPE = 'C' && STATUS_ID = 38",
//               "lineColor":[
//                  165,
//                  42,
//                  42,
//                  100
//               ],
//               "lineWidth":2,
//               "dashArray":[
//                  10,
//                  4
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'M' && LAYING_TYPE = 'C' && STATUS_ID = 39",
//               "lineColor":[
//                  255,
//                  255,
//                  0,
//                  100
//               ],
//               "lineWidth":2,
//               "dashArray":[
//                  10,
//                  4
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'M' && LAYING_TYPE = 'C' && STATUS_ID = 40",
//               "lineColor":[
//                  0,
//                  0,
//                  255,
//                  100
//               ],
//               "lineWidth":2,
//               "dashArray":[
//                  10,
//                  4
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'M' && LAYING_TYPE = 'C' && STATUS_ID = 41",
//               "lineColor":[
//                  112,
//                  48,
//                  160,
//                  100
//               ],
//               "lineWidth":2,
//               "dashArray":[
//                  10,
//                  4
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'M' && LAYING_TYPE = 'C' && STATUS_ID = 42",
//               "lineColor":[
//                  165,
//                  42,
//                  42,
//                  100
//               ],
//               "lineWidth":2,
//               "dashArray":[
//                  10,
//                  4
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'M' && LAYING_TYPE = 'C' && STATUS_ID = 43",
//               "lineColor":[
//                  255,
//                  255,
//                  0,
//                  100
//               ],
//               "lineWidth":2,
//               "dashArray":[
//                  10,
//                  4
//               ]
//            },
//            {
//               "condition":"true",
//               "lineColor":[
//                  0,
//                  200,
//                  70,
//                  100
//               ],
//               "lineWidth":2,
//               "dashArray":[
//                  10,
//                  4
//               ]
//            }
//         ]
//      },
//      {
//         "id":"CAVIDOTTO",
//         "type":"line",
//         "source":"topology.trc",
//         "layout":[
//            {
//               "condition":"true",
//               "lineColor":[
//                  250,
//                  128,
//                  114,
//                  100
//               ],
//               "dashArray":[
//                  10,
//                  4
//               ]
//            }
//         ]
//      },
//      {
//         "id":"SOSTEGNO MT - NODO COMPLESSO 3",
//         "type":"symbol",
//         "source":"topology.3-m",
//         "layout":[
//            {
//               "condition":"LEGACY_NODE_TYPE = 3",
//               "image":"http://10.151.1.168/p3/app/img/map-markers/sezionatore-mt-blk-fill_S.svg",
//               "imageWidth":25,
//               "imageHeight":25,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            },
//            {
//               "condition":"true",
//               "image":"",
//               "imageWidth":27,
//               "imageHeight":35,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            }
//         ]
//      },
//      {
//         "id":"SOSTEGNO MT - NODO COMPLESSO 4",
//         "type":"symbol",
//         "source":"topology.4-m",
//         "layout":[
//            {
//               "condition":"LEGACY_NODE_TYPE = 4",
//               "image":"http://10.151.1.168/p3/app/img/map-markers/nodo-rigido-MT.svg",
//               "imageWidth":25,
//               "imageHeight":25,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            },
//            {
//               "condition":"true",
//               "image":"",
//               "imageWidth":27,
//               "imageHeight":35,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            }
//         ]
//      },
//      {
//         "id":"SOSTEGNO MT - NODO COMPLESSO m",
//         "type":"symbol",
//         "source":"topology.-m",
//         "layout":[
//            {
//               "condition":"VOLTAGE_LEVEL = M",
//               "image":"http://10.151.1.168/p3/app/img/map-markers/216-sezionatori-misti.svg",
//               "imageWidth":25,
//               "imageHeight":25,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            },
//            {
//               "condition":"true",
//               "image":"",
//               "imageWidth":27,
//               "imageHeight":35,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            }
//         ]
//      },
//      {
//         "id":"RAMI BT",
//         "type":"line",
//         "source":"topology.tmbt",
//         "layout":[
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS_ID <> 'P' && LINE_TYPE = 'A' && STATUS_ID = 38",
//               "lineColor":[
//                  165,
//                  42,
//                  42,
//                  100
//               ],
//               "lineWidth":1
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS_ID <> 'P' && LINE_TYPE = 'A' && STATUS_ID = 39",
//               "lineColor":[
//                  255,
//                  255,
//                  0,
//                  100
//               ],
//               "lineWidth":1
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS_ID <> 'P' && LINE_TYPE = 'A' && STATUS_ID = 40",
//               "lineColor":[
//                  0,
//                  176,
//                  80,
//                  100
//               ],
//               "lineWidth":1
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS_ID <> 'P' && LINE_TYPE = 'A' && STATUS_ID = 41",
//               "lineColor":[
//                  112,
//                  48,
//                  160,
//                  100
//               ],
//               "lineWidth":1
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS_ID <> 'P' && LINE_TYPE = 'A' && STATUS_ID = 42",
//               "lineColor":[
//                  165,
//                  42,
//                  42,
//                  1
//               ],
//               "lineWidth":1
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS_ID <> 'P' && LINE_TYPE = 'A' && STATUS_ID = 43",
//               "lineColor":[
//                  255,
//                  255,
//                  0,
//                  100
//               ],
//               "lineWidth":1
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS <> 'P' && LINE_TYPE = 'B' && CONDUCTOR_SUPPORT <> 'G' && STATUS_ID = 38",
//               "lineColor":[
//                  165,
//                  42,
//                  42,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS <> 'P' && LINE_TYPE = 'B' && CONDUCTOR_SUPPORT <> 'G' && STATUS_ID = 39",
//               "lineColor":[
//                  255,
//                  255,
//                  0,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS <> 'P' && LINE_TYPE = 'B' && CONDUCTOR_SUPPORT <> 'G' && STATUS_ID = 40",
//               "lineColor":[
//                  0,
//                  176,
//                  80,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS <> 'P' && LINE_TYPE = 'B' && CONDUCTOR_SUPPORT <> 'G' && STATUS_ID = 41",
//               "lineColor":[
//                  112,
//                  48,
//                  160,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS <> 'P' && LINE_TYPE = 'B' && CONDUCTOR_SUPPORT <> 'G' && STATUS_ID = 42",
//               "lineColor":[
//                  165,
//                  42,
//                  42,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS <> 'P' && LINE_TYPE = 'B' && CONDUCTOR_SUPPORT <> 'G' && STATUS_ID = 43",
//               "lineColor":[
//                  255,
//                  255,
//                  0,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS <> 'P' && LINE_TYPE = 'B' && CONDUCTOR_SUPPORT = 'G' && STATUS_ID = 38",
//               "lineColor":[
//                  165,
//                  42,
//                  42,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS <> 'P' && LINE_TYPE = 'B' && CONDUCTOR_SUPPORT = 'G' && STATUS_ID = 39",
//               "lineColor":[
//                  255,
//                  255,
//                  0,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS <> 'P' && LINE_TYPE = 'B' && CONDUCTOR_SUPPORT = 'G' && STATUS_ID = 40",
//               "lineColor":[
//                  0,
//                  176,
//                  80,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS <> 'P' && LINE_TYPE = 'B' && CONDUCTOR_SUPPORT = 'G' && STATUS_ID = 41",
//               "lineColor":[
//                  112,
//                  48,
//                  160,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS <> 'P' && LINE_TYPE = 'B' && CONDUCTOR_SUPPORT = 'G' && STATUS_ID = 42",
//               "lineColor":[
//                  165,
//                  42,
//                  42,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS <> 'P' && LINE_TYPE = 'B' && CONDUCTOR_SUPPORT = 'G' && STATUS_ID = 43",
//               "lineColor":[
//                  255,
//                  255,
//                  0,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS <> 'P' && LINE_TYPE = 'C' && STATUS_ID = 38",
//               "lineColor":[
//                  165,
//                  42,
//                  42,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  10,
//                  4
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS <> 'P' && LINE_TYPE = 'C' && STATUS_ID = 39",
//               "lineColor":[
//                  255,
//                  255,
//                  0,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  10,
//                  4
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS <> 'P' && LINE_TYPE = 'C' && STATUS_ID = 40",
//               "lineColor":[
//                  0,
//                  176,
//                  80,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  10,
//                  4
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS <> 'P' && LINE_TYPE = 'C' && STATUS_ID = 41",
//               "lineColor":[
//                  112,
//                  48,
//                  160,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  10,
//                  4
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS <> 'P' && LINE_TYPE = 'C' && STATUS_ID = 42",
//               "lineColor":[
//                  165,
//                  42,
//                  42,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  10,
//                  4
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS <> 'P' && LINE_TYPE = 'C' && STATUS_ID = 43",
//               "lineColor":[
//                  255,
//                  255,
//                  0,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  10,
//                  4
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS = 'P' && LINE_TYPE = ('A','B') && STATUS_ID = 38",
//               "lineColor":[
//                  165,
//                  42,
//                  42,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS = 'P' && LINE_TYPE = ('A','B') && STATUS_ID = 39",
//               "lineColor":[
//                  255,
//                  255,
//                  0,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS = 'P' && LINE_TYPE = ('A','B') && STATUS_ID = 40",
//               "lineColor":[
//                  0,
//                  176,
//                  80,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS = 'P' && LINE_TYPE = ('A','B') && STATUS_ID = 41",
//               "lineColor":[
//                  112,
//                  48,
//                  160,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS = 'P' && LINE_TYPE = ('A','B') && STATUS_ID = 42",
//               "lineColor":[
//                  165,
//                  42,
//                  42,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS = 'P' && LINE_TYPE = ('A','B') && STATUS_ID = 43",
//               "lineColor":[
//                  255,
//                  255,
//                  0,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  4,
//                  1
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS = 'P' && LINE_TYPE = 'C' && STATUS_ID = 38",
//               "lineColor":[
//                  165,
//                  42,
//                  42,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  10,
//                  4
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS = 'P' && LINE_TYPE = 'C' && STATUS_ID = 39",
//               "lineColor":[
//                  255,
//                  255,
//                  0,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  10,
//                  4
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS = 'P' && LINE_TYPE = 'C' && STATUS_ID = 40",
//               "lineColor":[
//                  112,
//                  48,
//                  160,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  10,
//                  4
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS = 'P' && LINE_TYPE = 'C' && STATUS_ID = 41",
//               "lineColor":[
//                  112,
//                  48,
//                  160,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  10,
//                  4
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS = 'P' && LINE_TYPE = 'C' && STATUS_ID = 42",
//               "lineColor":[
//                  165,
//                  42,
//                  42,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  10,
//                  4
//               ]
//            },
//            {
//               "condition":"NETWORK_TYPE = 'L' && LINE_SEGMENT_CLASS = 'P' && LINE_TYPE = 'C' && STATUS_ID = 43",
//               "lineColor":[
//                  255,
//                  255,
//                  0,
//                  100
//               ],
//               "lineWidth":1,
//               "dashArray":[
//                  10,
//                  4
//               ]
//            },
//            {
//               "condition":"true",
//               "lineColor":[
//                  0,
//                  0,
//                  0,
//                  100
//               ],
//               "lineWidth":1
//            }
//         ]
//      },
//      {
//         "id":"VIA/CIVICO",
//         "type":"symbol",
//         "source":"topology.stnum",
//         "layout":[
//            {
//               "condition":"true",
//               "image":"black point",
//               "label":"number street",
//               "imageWidth":27,
//               "imageHeight":35,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            }
//         ]
//      },
//      {
//         "id":"NODI AT",
//         "type":"symbol",
//         "source":"topology.1-h",
//         "layout":[
//            {
//               "condition":"LEGACY_NODE_TYPE = 1 && BUILDING_TYPE <> 'SA'",
//               "image":"http://10.151.1.168/p3/app/img/map-markers/cabina-primaria.svg",
//               "imageWidth":25,
//               "imageHeight":25,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            },
//            {
//               "condition":"LEGACY_NODE_TYPE = 1 && BUILDING_TYPE = 'SA'",
//               "image":"http://10.151.1.168/p3/app/img/map-markers/cabina-primaria.svg",
//               "imageWidth":27,
//               "imageHeight":35,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            },
//            {
//               "condition":"true",
//               "image":"",
//               "imageWidth":27,
//               "imageHeight":35,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            }
//         ]
//      },
//      {
//         "id":"NODO MT G",
//         "type":"symbol",
//         "source":"topology.g-m",
//         "layout":[
//            {
//               "condition":"LEGACY_NODE_TYPE = 'G' && NETWORK_TYPE = 'M'",
//               "image":"black point",
//               "imageWidth":25,
//               "imageHeight":25,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            },
//            {
//               "condition":"true",
//               "image":"",
//               "imageWidth":27,
//               "imageHeight":35,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            }
//         ]
//      },
//      {
//         "id":"NODI MT T",
//         "type":"symbol",
//         "source":"topology.t-m",
//         "layout":[
//            {
//               "condition":"LEGACY_NODE_TYPE = 'T' && NETWORK_TYPE = 'L'",
//               "image":"http://10.151.1.168/p3/app/img/map-markers/cambio-posa-mt-blk.svg",
//               "imageWidth":25,
//               "imageHeight":25,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            },
//            {
//               "condition":"true",
//               "image":"",
//               "imageWidth":27,
//               "imageHeight":35,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            }
//         ]
//      },
//      {
//         "id":"NODI BT 5 - SEZIONAMENTI",
//         "type":"symbol",
//         "source":"topology.5-l",
//         "layout":[
//            {
//               "condition":"LEGACY_NODE_TYPE = 5",
//               "image":"http://10.151.1.168/p3/app/img/map-markers/sezionamento-bt-blk.svg",
//               "imageWidth":25,
//               "imageHeight":25,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            },
//            {
//               "condition":"true",
//               "image":"",
//               "imageWidth":27,
//               "imageHeight":35,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            }
//         ]
//      },
//      {
//         "id":"NODI BT 9",
//         "type":"symbol",
//         "source":"topology.9-l",
//         "layout":[
//            {
//               "condition":"LEGACY_NODE_TYPE = 9",
//               "image":"http://10.151.1.168/p3/app/img/map-markers/trafo-BT.svg",
//               "imageWidth":25,
//               "imageHeight":25,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            },
//            {
//               "condition":"true",
//               "image":"",
//               "imageWidth":27,
//               "imageHeight":35,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            }
//         ]
//      },
//      {
//         "id":"MONTANTI",
//         "type":"symbol",
//         "source":"topology.8-l",
//         "layout":[
//            {
//               "condition":"LEGACY_NODE_TYPE = 8 && LEGACY_NODE_TYPE = '?'",
//               "image":"http://10.151.1.168/p3/app/img/map-markers/giunto.svg",
//               "imageWidth":25,
//               "imageHeight":25,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            },
//            {
//               "condition":"true",
//               "image":"",
//               "imageWidth":27,
//               "imageHeight":35,
//               "imageAnchorY":35,
//               "imageAnchorX":17
//            }
//         ]
//      }
//   ]
// } 