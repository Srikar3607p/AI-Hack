import React from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Badge } from '../common/Badge';

export const HotspotMap = ({ clusters = [], height = 'h-96', className = '' }) => {
  const center = clusters.length > 0 && clusters[0].coordinates
    ? [clusters[0].coordinates[1], clusters[0].coordinates[0]]
    : [12.9716, 77.5946];

  const getClusterColor = (severity) => {
    if (severity === 'Critical Chronic') return '#dc2626';
    if (severity === 'High') return '#ea580c';
    return '#eab308';
  };

  const createIcon = (severity) => {
    const color = getClusterColor(severity);
    return L.divIcon({
      className: 'cluster-pin',
      html: `<div style="background-color: ${color}; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.4);">!</div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });
  };

  return (
    <div className={`w-full ${height} rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative z-0 ${className}`}>
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {clusters.map((cl) => {
          if (!cl.coordinates || cl.coordinates.length < 2) return null;
          const pos = [cl.coordinates[1], cl.coordinates[0]];
          const color = getClusterColor(cl.severity);
          return (
            <React.Fragment key={cl.clusterId || cl._id}>
              <Circle
                center={pos}
                radius={cl.radiusMeters || 300}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.25,
                  weight: 2
                }}
              />
              <Marker position={pos} icon={createIcon(cl.severity)}>
                <Popup>
                  <div className="p-1 space-y-1 text-slate-800 min-w-[220px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-rose-700">{cl.clusterId}</span>
                      <Badge variant={cl.severity === 'Critical Chronic' ? 'danger' : 'warning'} size="sm">
                        {cl.severity}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-xs">{cl.name}</h4>
                    <p className="text-[11px] text-slate-600">
                      <strong>{cl.complaintCount} Complaints</strong> clustered in {cl.ward || 'Ward 12'}.
                    </p>
                    <p className="text-[10px] text-slate-500 italic mt-1">{cl.mitigationNotes}</p>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};
