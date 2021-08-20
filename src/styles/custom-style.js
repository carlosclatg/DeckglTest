export const defaultStyle = {
    "layers": [
        {
            "id": "layer3",
            "type": "symbol",
            "source": "grid-act-maintenance.gam-issue",
            "layout": [
                {
                    "condition": "type == 'issue-level-1'",
                    "image": "https://img1.freepng.es/20171220/dsw/number-1-png-5a3ab5345bc7e2.1804244915137969163759.jpg", //number1
                    "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17
                },
                {
                    "condition": "type == 'issue-level-2'",
                    "image": "https://img2.freepng.es/20171218/5bf/number-2-png-5a381d2bacb7e3.8432563115136269237075.jpg",//number2
                    "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17
                },
                {
                    "condition": "type == 'issue-level-3'",
                    "image": "https://w7.pngwing.com/pngs/747/547/png-transparent-logo-brand-pattern-number-3-text-logo-number.png",//number3
                    "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17
                },
                {
                    "condition": "true",
                    "image": "https://img1.freepng.es/20180716/hbl/kisspng-computer-icons-symbol-clip-art-unknown-person-5b4d6406f17676.576714911531798534989.jpg",
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
                    "color": [100, 200, 70, 100],
                    "width": 25
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
                    "fillColor": [230, 0, 100, 100],
                    "lineColor": [100, 100, 90, 255]
                }              
            ]
        }
    ]
  }
  