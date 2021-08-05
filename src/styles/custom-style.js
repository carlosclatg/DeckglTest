export const defaultStyle = {
    "layers": [
        {
            "id": "layer1",
            "type": "symbol",
            "source": "topology.1-h",
            "layout": [
                {
                    "condition": "true",
                    "image": "http://localhost:18080/context_replaceme/assets/images/icons_gis/small/issue_marker-sm-low.png",
                    "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17, "iconSize": 44
                  }              
            ]
        },
        {
          "id": "layer2",
          "type": "symbol",
          "source": "grid-act-maintenance.gam-activity",
          "layout": [
              {
                  "condition": "true",
                  "image": "http://localhost:18080/context_replaceme/assets/images/icons_gis/small/activity_marker-sm.png",
                  "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17
              }              
          ]
      },
      {
        "id": "layer3",
        "type": "symbol",
        "source": "grid-act-maintenance.gam-issue",
        "layout": [
            {
                "condition": "type == 'issue-level-1'",
                "image": "http://localhost:18080/context_replaceme/assets/images/icons_gis/small/issue_marker-sm-high.png",
                "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17
            },
            {
                "condition": "type == 'issue-level-2'",
                "image": "http://localhost:18080/context_replaceme/assets/images/icons_gis/small/issue_marker-sm-medium.png",
                "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17
            },
            {
                "condition": "type == 'issue-level-3'",
                "image": "http://localhost:18080/context_replaceme/assets/images/icons_gis/small/issue_marker-sm-low.png",
                "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17
            },
            {
                "condition": "true",
                "image": "http://localhost:18080/context_replaceme/assets/images/icons_gis/small/issue_marker-sm-low.png",
                "imageWidth": 27, "imageHeight": 35, "imageAnchorY": 35, "imageAnchorX": 17
            }              
        ]
    }]
  }
  