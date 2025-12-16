import { useState, useEffect } from 'react';

// List of random starting points (Major Cities)
const CITIES = [
    { name: 'New York', lat: 40.7128, lng: -74.0060 },
    { name: 'London', lat: 51.5074, lng: -0.1278 },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
    { name: 'Paris', lat: 48.8566, lng: 2.3522 }
];

export const useRiderLocation = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 1. Pick a random city on mount
        const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
        let currentLat = randomCity.lat;
        let currentLng = randomCity.lng;

        // Initial set
        setLocation({ lat: currentLat, lng: currentLng });
        console.log(`[Simulation] Started in ${randomCity.name}`);

        // 2. Simulate movement interval
        const interval = setInterval(() => {
            // Add small random movement
            // Roughly 0.0001 degrees is ~11 meters
            const moveLat = (Math.random() - 0.5) * 0.0005;
            const moveLng = (Math.random() - 0.5) * 0.0005;

            currentLat += moveLat;
            currentLng += moveLng;

            setLocation({
                lat: currentLat,
                lng: currentLng
            });

        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, []);

    return { location, error };
};
