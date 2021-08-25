export const defaultStyle = {
    "layers": [
        {
            "id": "layer3",
            "type": "symbol",
            "source": "grid-act-maintenance.gam-issue",
            "layout": [
                {
                    "condition": "type == 'issue-level-1'", //condition matched by property.type
                    "image": "https://img1.freepng.es/20171220/dsw/number-1-png-5a3ab5345bc7e2.1804244915137969163759.jpg", //number1
                    "imageWidth": 25, "imageHeight": 25, "imageAnchorY": 35, "imageAnchorX": 17
                },
                {
                    "condition": "type == 'issue-level-2'",
                    "image": "https://img2.freepng.es/20171218/5bf/number-2-png-5a381d2bacb7e3.8432563115136269237075.jpg",//number2
                    "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17
                },
                // {
                //     "condition": "type == 'issue-level-3'",
                //     "image": "https://img1.freepng.es/20171220/eqe/number-3-png-5a3a8773513d90.6776457915137852033328.jpg",//number3
                //     "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17
                // },
                {
                    "condition": "true",
                    "image": "https://img2.freepng.es/20180522/eww/kisspng-web-development-computer-icons-website-5b043775017c54.2851318415270029970061.jpg",
                    "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17
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
                    "lineColor": [0, 200, 70, 100],
                    "lineWidth": 5
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
                    "imageWidth": 25, "imageHeight": 25, "imageAnchorY": 25, "imageAnchorX": 17
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
  