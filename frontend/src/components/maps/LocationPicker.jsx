import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { Button } from '../common/Button';

// Fix leaflet marker icon asset path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

const defaultCenter = [12.9716, 77.5946]; // Bangalore center default

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export const LocationPicker = ({
  latitude,
  longitude,
  address,
  ward,
  onChange,
  className = ''
}) => {
  const [position, setPosition] = useState([
    latitude || defaultCenter[0],
    longitude || defaultCenter[1]
  ]);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (latitude && longitude) {
      setPosition([latitude, longitude]);
    }
  }, [latitude, longitude]);

  const handleSelect = async (lat, lon) => {
    setPosition([lat, lon]);
    let resolvedAddress = address || `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
    
    // Reverse Geocoding attempt via OpenStreetMap Nominatim
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await res.json();
      if (data && data.display_name) {
        resolvedAddress = data.display_name;
      }
    } catch (e) {
      // Fallback
    }

    onChange({
      latitude: lat,
      longitude: lon,
      address: resolvedAddress,
      ward: ward || 'Ward 12'
    });
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        handleSelect(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err.message);
        alert('Could not retrieve GPS location. Please click on the map to pin location.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-civic-600" />
          Location & GIS Mapping (Click on map to pin)
        </label>
        <Button
          size="sm"
          variant="secondary"
          icon={isLocating ? Loader2 : Navigation}
          isLoading={isLocating}
          onClick={handleUseCurrentLocation}
        >
          Use Current GPS Location
        </Button>
      </div>

      {/* Map Container */}
      <div className="h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner relative z-0">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} />
          <MapClickHandler onLocationSelect={handleSelect} />
        </MapContainer>
      </div>

      {/* Address & Ward Input Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="sm:col-span-2">
          <input
            type="text"
            placeholder="Address or landmark description..."
            value={address || ''}
            onChange={(e) => onChange({ latitude: position[0], longitude: position[1], address: e.target.value, ward })}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-civic-500"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Ward / Zone (e.g. Ward 12)"
            value={ward || ''}
            onChange={(e) => onChange({ latitude: position[0], longitude: position[1], address, ward: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-civic-500"
          />
        </div>
      </div>
    </div>
  );
};
