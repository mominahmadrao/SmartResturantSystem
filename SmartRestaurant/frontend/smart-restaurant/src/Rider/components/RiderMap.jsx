import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function RiderMap({ restaurant, customer, riderLocation, className }) {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef({});

    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Init map
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapContainerRef.current).setView([40.7128, -74.0060], 13);

            // Dark matter map style
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap &copy; CARTO',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(mapInstanceRef.current);
        }

        const map = mapInstanceRef.current;
        const markers = markersRef.current; // Store markers to remove them later

        // Clear previous markers
        Object.values(markers).forEach(m => m.remove());
        markersRef.current = {};

        const bounds = L.latLngBounds();

        // Restaurant Marker
        if (restaurant) {
            const marker = L.marker([restaurant.lat, restaurant.lng])
                .bindPopup(`<b>Restaurant:</b> ${restaurant.name}`)
                .addTo(map);
            markersRef.current.restaurant = marker;
            bounds.extend(marker.getLatLng());
        }

        // Customer Marker
        if (customer) {
            const marker = L.marker([customer.lat, customer.lng])
                .bindPopup(`<b>Customer:</b> ${customer.name}`)
                .addTo(map);
            markersRef.current.customer = marker;
            bounds.extend(marker.getLatLng());
        }

        // Rider Marker
        if (riderLocation) {
            const riderIcon = L.divIcon({
                className: 'bg-transparent',
                html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });

            const marker = L.marker([riderLocation.lat, riderLocation.lng], { icon: riderIcon })
                .bindPopup('You')
                .addTo(map);
            markersRef.current.rider = marker;
            bounds.extend(marker.getLatLng());
        }

        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }

        // Clean up on unmount is tricky with refs/effects in StrictMode, usually better to leave the map instance
        // but verify existence

        // Create Path Sequence: Rider -> Restaurant -> Customer
        const routePoints = [];

        if (riderLocation) routePoints.push([riderLocation.lat, riderLocation.lng]);
        if (restaurant) routePoints.push([restaurant.lat, restaurant.lng]);
        if (customer) routePoints.push([customer.lat, customer.lng]);

        if (routePoints.length > 1) {
            const path = L.polyline(routePoints, {
                color: '#3b82f6', // Blue-500
                weight: 4,
                opacity: 0.8,
                dashArray: '10, 10', // Dashed line to indicate path
                lineCap: 'round'
            }).addTo(map);
            markersRef.current.path = path;

            // Adjust bounds to include the path if needed (markers usually cover it)
        }
    }, [restaurant, customer, riderLocation]);

    return <div ref={mapContainerRef} className={`w-full h-full z-0 ${className}`} />;
}
