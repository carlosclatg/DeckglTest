export default function eventMapReadyBuilder(){
    return new CustomEvent("topogisevt_map_ready",  { bubbles: true, detail:{ version: "test", releaseDate: "2021-08-01"}})
}