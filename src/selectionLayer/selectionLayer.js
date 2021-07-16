import { SelectionLayer } from '@nebula.gl/layers';

export default function getSelectionLayer(layerlist){
  let arr = layerlist.map(e=>e.id)
  return new SelectionLayer({
      id: 'selection',
      selectionType: 'rectangle',
      layerIds: arr,
      onSelect: ({ pickingInfos }) => console.log(pickingInfos),
      getTentativeFillColor: () => [255, 0, 255, 100],
      getTentativeLineColor: () => [0, 0, 255, 255],
      getTentativeLineDashArray: () => [0, 0],
      lineWidthMinPixels: 1,
    })
}

//SELECTIONTYPE.RECTANGLE or SELECTIONTYPE.POLYGON

