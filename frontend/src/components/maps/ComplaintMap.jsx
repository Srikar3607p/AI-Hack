import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { PriorityBadge, StatusBadge } from '../common/Badge';

export const ComplaintMap = ({ complaints = [], height = 'h-96', className = '' }) => {
  const center = complaints.length > 0 && complaints[0].location?.coordinates
    ? [complaints[0].location.coordinates[1], complaints[0].location.coordinates[0]]
    : [12.9716, 77.5946];

  const createCustomIcon = (priority) => {
    let color = '#0c87eb';
    if (priority === 'Critical') color = '#dc2626';
    else if (priority === 'High') color = '#ea580c';
    else if (priority === 'Medium') color = '#eab308';
    else if (priority === 'Low') color = '#64748b';

    return L.divIcon({
      className: 'custom-pin',
      html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.35);"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
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
        {complaints.map((c) => {
          if (!c.location || !c.location.coordinates || c.location.coordinates.length < 2) return null;
          const pos = [c.location.coordinates[1], c.location.coordinates[0]];
          return (
            <Marker key={c._id || c.complaintId} position={pos} icon={createCustomIcon(c.priority)}>
              <Popup>
                <div className="p-1 space-y-1.5 min-w-[200px] text-slate-800">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-civic-700">{c.complaintId}</span>
                    <PriorityBadge priority={c.priority} />
                  </div>
                  <h4 className="font-semibold text-xs leading-snug">{c.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{c.description}</p>
                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-600 border-t border-slate-100">
                    <span>{c.category}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="pt-1 text-center">
                    <Link
                      to={`/citizen/complaints/${c._id || c.complaintId}`}
                      className="text-[11px] font-bold text-civic-600 hover:underline"
                    >
                      View Case &rarr;
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
