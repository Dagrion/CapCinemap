import maplibregl from "https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl.mjs";

const map = new maplibregl.Map({
    container: "map",
    style: "https://tiles.openfreemap.org/styles/liberty",
    center: [2.35, 48.85],
    zoom: 10
});

map.addControl(
    new maplibregl.NavigationControl(),
    "top-right"
);
