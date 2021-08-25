import generateGeoJsonLayer from './geojsonLayer'
import {promisify} from 'es6-promisify'

export default function addGisDomainLayerByStandardApi(layer, extent, remoteUser, mapStyle){
    let url = layer.layer + "/extent?";
    url += `xmin=${Math.max(-180, roundDegree(extent.west))}`
    url += `&ymin=${Math.max(-90, roundDegree(extent.south))}`
    url += `&xmax=${Math.min(180, roundDegree(extent.east))}`
    url += `&ymax=${Math.min(90, roundDegree(extent.north))}`
    url += `&props=code,unique_id,_id,domain,space,internal_id,type`
    if (layer.filter) url += ("&" + layer.filter)
    if (url.indexOf('status') == -1) url += "&status=AP"
    let options = {}
    if (remoteUser && remoteUser.trim().length) {
        options = { headers: { 'REMOTE_USER': remoteUser } }
    }

    return fetch(url, options)
        .then((response) => {
            return response.json()
                .then(json => {
                    const jsonreponse = {id: layer.id, type: layer.type, layer: json}
                    return generateGeoJsonLayer(jsonreponse, mapStyle)
                });
        })
        .catch(() => { });
    
    function roundDegree (num) {
        return Math.round(num * 100000000) / 100000000;
    }
}


// const jsonreponse ={
//     id: "cazzi",
//     type: "geojson",
//     layer: {
//     "type": "FeatureCollection",
//     "features": [
//       {
//         "type": "Feature",
//         "properties": {
//         },
//         "geometry": {
//           "type": "LineString",
//           "coordinates": [
//             [
//               -2.08740234375,
//               42.02481360781777
//             ],
//             [
//               0.32958984375,
//               43.03677585761058
//             ],
//             [
//               4.0869140625,
//               41.47566020027821
//             ],
//             [
//               3.570556640625,
//               44.653024159812
//             ],
//             [
//               1.021728515625,
//               44.36313311380771
//             ],
//             [
//               -0.142822265625,
//               45.31352900692258
//             ],
//             [
//               5.6689453125,
//               45.213003555993964
//             ],
//             [
//               6.767578125,
//               44.49650533109348
//             ],
//             [
//               6.416015625,
//               43.48481212891603
//             ],
//             [
//               7.734374999999999,
//               43.70759350405294
//             ],
//             [
//               8.349609375,
//               44.55916341529182
//             ],
//             [
//               9.184570312499998,
//               45.30580259943578
//             ],
//             [
//               10.01953125,
//               45.42929873257377
//             ],
//             [
//               10.2392578125,
//               44.809121700077355
//             ],
//             [
//               10.2392578125,
//               44.213709909702054
//             ],
//             [
//               10.72265625,
//               43.03677585761058
//             ],
//             [
//               10.6787109375,
//               42.09822241118974
//             ],
//             [
//               11.6455078125,
//               41.96765920367816
//             ],
//             [
//               12.436523437499998,
//               41.80407814427234
//             ],
//             [
//               12.83203125,
//               41.73852846935917
//             ],
//             [
//               13.447265624999998,
//               41.50857729743935
//             ],
//             [
//               13.623046875,
//               41.21172151054787
//             ],
//             [
//               12.744140625,
//               39.87601941962116
//             ],
//             [
//               12.6123046875,
//               39.436192999314095
//             ],
//             [
//               11.557617187499998,
//               38.993572058209466
//             ],
//             [
//               10.546875,
//               38.788345355085625
//             ],
//             [
//               9.228515625,
//               38.47939467327645
//             ],
//             [
//               8.349609375,
//               37.82280243352756
//             ],
//             [
//               8.4375,
//               37.50972584293751
//             ],
//             [
//               9.0966796875,
//               37.405073750176925
//             ],
//             [
//               11.6015625,
//               36.87962060502676
//             ],
//             [
//               11.42578125,
//               36.27970720524017
//             ],
//             [
//               7.207031249999999,
//               36.10237644873644
//             ],
//             [
//               -5.9765625,
//               38.20365531807149
//             ],
//             [
//               -2.5048828125,
//               32.43561304116276
//             ],
//             [
//               2.3291015625,
//               32.95336814579932
//             ],
//             [
//               2.548828125,
//               33.063924198120645
//             ]
//           ]
//         }
//       }
//     ]
//   }
// }

