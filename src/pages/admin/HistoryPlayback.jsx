import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import API from '../../api/axios';

export default function HistoryPlayback({ employeeId }) {
  const [path, setPath] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchHistory = async () => {
    // Note: Iske liye aapko backend mein history route banana hoga 
    // jo particular date ke locations return kare
    const res = await API.get(`/location/history/${employeeId}?date=${date}`);
    const coords = res.data.map(loc => [loc.lat, loc.lng]);
    setPath(coords);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="p-2 border rounded-xl" />
        <button onClick={fetchHistory} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm">View Path</button>
      </div>
      <div className="h-[400px] rounded-3xl overflow-hidden shadow-inner bg-slate-100">
        <MapContainer center={path[0] || [20.59, 78.96]} zoom={15} className="h-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {path.length > 0 && <Polyline positions={path} color="emerald" weight={5} opacity={0.7} />}
          {path.length > 0 && <Marker position={path[path.length - 1]} />}
        </MapContainer>
      </div>
    </div>
  );
}