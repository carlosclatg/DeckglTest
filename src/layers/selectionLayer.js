import { SelectionLayer } from '@nebula.gl/layers';

export default function getSelectionLayer(layerlist, handleSelectedObject){
  return new SelectionLayer({
      id: 'selection',
      selectionType: 'rectangle',
      layerIds: layerlist.map(e=>e.id),
      onSelect: ({ pickingInfos }) => handleSelectedObject(pickingInfos),
      getTentativeFillColor: () => [255, 0, 255, 100],
      getTentativeLineColor: () => [0, 0, 255, 255],
      getTentativeLineDashArray: () => [0, 0],
      lineWidthMinPixels: 1,
    })
}

//SELECTIONTYPE.RECTANGLE or SELECTIONTYPE.POLYGON

