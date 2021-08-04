import {Viewport} from '@deck.gl/core';


const getBoundingBox = (data) => {
  var bounds = {}, coordinates, point, latitude, longitude;


  // Loop through each "feature"
  for (var i = 0; i < data.features.length; i++) {
    coordinates = data.features[i].geometry.coordinates;
    if(coordinates.length === 1){
      // It's only a single Polygon
      // For each individual coordinate in this feature's coordinates...
      for (var j = 0; j < coordinates[0].length; j++) {
        longitude = coordinates[0][j][0];
        latitude  = coordinates[0][j][1];
        // Update the bounds recursively by comparing the current xMin/xMax and yMin/yMax with the current coordinate
        bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
        bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
        bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
        bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
      }
    } else {
      // It's a MultiPolygon
      // Loop through each coordinate set
      for (var j = 0; j < coordinates.length; j++) {
        // For each individual coordinate in this coordinate set...
        for (var k = 0; k < coordinates[j][0].length; k++) {
          longitude = coordinates[j][0][k][0];
          latitude  = coordinates[j][0][k][1];
          // Update the bounds recursively by comparing the current xMin/xMax and yMin/yMax with the current coordinate
          bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
          bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
          bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
          bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
        }
      }
    }
  }
  // Returns an object that contains the bounds of this GeoJSON data.
  // The keys describe a box formed by the northwest (xMin, yMin) and southeast (xMax, yMax) coordinates.
  return bounds;
}


const viewportToExtension = (viewport) => {
  const proj = new Viewport(viewport);
  const [west, north] = proj.unproject([0, 0]);
  const [east, south] = proj.unproject([viewport.width, viewport.height]);
  return { west, south, east, north };
}


const typecheck = (obj, definition) =>{
  return new Proxy(obj, {
     set (obj, key, value) {
        if(key in definition && typeof value !== definition[key])
           throw new TypeError("Invalid type")

        return Reflect.set(obj, key, value)
     }
  })
}


export { getBoundingBox, viewportToExtension, typecheck }
