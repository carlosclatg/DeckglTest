export default function eventObjectSelectedBuilder(detail){
    return new CustomEvent("topogisevt_map_object_selected",  { bubbles: true, detail});
}