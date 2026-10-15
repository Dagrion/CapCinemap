import * as maplibregl from
"https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl.mjs";

const locations = [
    {
        id: "bay-of-biscay",
        name: "Bay of Biscay",
        description: "Gulf of the northeast Atlantic Ocean, south of the Celtic Sea",
        country: "France",
        lngLat: [-4.4, 45.5],
        zoom: 6,
        films: [
            { title: "The Spy Who Loved Me", year: 1977 },
            { title: "The Colossus of Rhodes", year: 1961 }
        ]
    }
];

const locationById = Object.fromEntries(
    locations.map((location) => [location.id, location])
);

const defaultView = {
    center: [-4.4, 45.5],
    zoom: 6
};

function locationFromHash() {
    const match = /^#loc=([a-z0-9-]+)$/i.exec(window.location.hash);
    return match ? locationById[match[1]] : undefined;
}

function popupHtml(location) {
    const films = location.films
        .map((film) => `<li>${film.title} (${film.year})</li>`)
        .join("");

    return `
        <div class="location-popup">
            <h2>${location.name}</h2>
            <p class="location-meta">${location.country} · ${location.lngLat[1].toFixed(4)}, ${location.lngLat[0].toFixed(4)}</p>
            <p>${location.description}</p>
            <h3>Filmed here</h3>
            <ul>${films}</ul>
        </div>
    `;
}

const initialLocation = locationFromHash();

const map = new maplibregl.Map({
    container: "map",
    style: "./custom-style.json",
    center: initialLocation?.lngLat ?? defaultView.center,
    zoom: initialLocation?.zoom ?? defaultView.zoom
});

map.addControl(
    new maplibregl.NavigationControl(),
    "top-right"
);

const markers = {};

for (const location of locations) {
    const popup = new maplibregl.Popup({ offset: 16, maxWidth: "280px" })
        .setHTML(popupHtml(location));

    popup.on("open", () => {
        const nextHash = `#loc=${location.id}`;
        if (window.location.hash !== nextHash) {
            history.replaceState(null, "", nextHash);
        }
    });

    markers[location.id] = new maplibregl.Marker()
        .setLngLat(location.lngLat)
        .setPopup(popup)
        .addTo(map);
}

function showLocation(location, { fly = true } = {}) {
    if (fly) {
        map.flyTo({
            center: location.lngLat,
            zoom: location.zoom
        });
    }

    const popup = markers[location.id].getPopup();
    if (!popup.isOpen()) {
        markers[location.id].togglePopup();
    }
}

if (initialLocation) {
    showLocation(initialLocation, { fly: false });
}

window.addEventListener("hashchange", () => {
    const location = locationFromHash();
    if (location) {
        showLocation(location);
    }
});
