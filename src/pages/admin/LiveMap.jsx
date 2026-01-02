import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import io from 'socket.io-client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import API, { BASE_URL } from '../../api/axios';
import { User, Navigation, X, Phone, ArrowLeft, Signal } from 'lucide-react';
const socket = io(BASE_URL);

const empIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048329.png',
  iconSize: [45, 45],
  className: "map-marker-transition"
});

function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 16, { animate: true, duration: 1.5 });
  }, [coords, map]);
  return null;
}

export default function AdminMapContainer() {
  const [staff, setStaff] = useState({});
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [isTracking, setIsTracking] = useState(false); // Toggle state

  useEffect(() => {
    socket.emit('joinAsAdmin');

    const loadInitial = async () => {
      try {
        const res = await API.get('/location/all/latest');
        const base = {};
        res.data.forEach(d => {
          const id = d.employee?._id || d._id;
          base[id] = d;
        });
        setStaff(base);
      } catch (err) { console.error(err); }
    };
    loadInitial();

    socket.on('employeeLocation', (data) => {
      setStaff(prev => ({
        ...prev,
        [data.employeeId]: { 
          ...prev[data.employeeId], 
          lat: data.lat, 
          lng: data.lng, 
          accuracy: data.accuracy,
          updatedAt: data.ts 
        }
      }));
    });

    return () => socket.off('employeeLocation');
  }, []);

  const startTracking = (id) => {
    setSelectedEmpId(id);
    setIsTracking(true); // Table hide, Map show
  };

  const stopTracking = () => {
    setIsTracking(false); // Map hide, Table show
    setSelectedEmpId(null);
  };

  const selectedStaffData = selectedEmpId ? staff[selectedEmpId] : null;

  return (
    <div className="p-4 md:p-6 bg-[#f1f5f9] min-h-screen">
      
      {/* --- CONDITION 1: SHOW TABLE (If NOT Tracking) --- */}
      {!isTracking && (
        <div className="max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-200">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Field Executive List</h2>
              <span className="bg-slate-100 text-slate-500 px-4 py-1 rounded-full text-xs font-bold uppercase">
                {Object.keys(staff).length} Connected
              </span>
            </div>

            <table className="w-full">
              <thead className="bg-slate-50/50 uppercase text-[10px] font-black text-slate-400 tracking-widest">
                <tr>
                  <th className="px-8 py-4 text-left">Employee</th>
                  <th className="px-8 py-4 text-left">Mobile Number</th>
                  <th className="px-8 py-4 text-center">Status</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.values(staff).map((p) => {
                  const id = p.employee?._id || p._id;
                  const isOnline = (new Date() - new Date(p.updatedAt || p.ts)) < 60000;

                  return (
                    <tr key={id} className="hover:bg-slate-50/50 transition-all">
                      <td className="px-8 py-5 flex items-center gap-4">
                        <img 
                          src={p.employee?.profileImage || `https://ui-avatars.com/api/?name=${p.employee?.name}`} 
                          className="w-10 h-10 rounded-xl shadow-sm border border-white"
                          alt="user"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700">{p.employee?.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{p.employee?.role || "Staff"}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-semibold text-slate-500">{p.employee?.mobile || "N/A"}</td>
                      <td className="px-8 py-5 text-center">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${isOnline ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                          {isOnline ? 'LIVE' : 'OFFLINE'}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => startTracking(id)}
                          className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-black hover:bg-emerald-600 transition-all flex items-center gap-2 ml-auto shadow-lg shadow-slate-200"
                        >
                          <Navigation size={14} /> Track
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- CONDITION 2: SHOW FULL SCREEN MAP (If Tracking) --- */}
      {isTracking && (
        <div className="fixed inset-0 z-50 bg-white animate-in slide-in-from-right duration-500 flex flex-col">
          
          {/* Map Header Toolbar */}
          <div className="h-20 bg-white border-b border-slate-100 px-6 flex items-center justify-between shadow-sm z-[1001]">
            <div className="flex items-center gap-4">
              <button onClick={stopTracking} className="p-3 hover:bg-slate-100 rounded-full transition-all text-slate-600">
                <ArrowLeft size={24} />
              </button>
              <div className="flex items-center gap-3 border-l pl-4 border-slate-200">
                <img src={selectedStaffData?.employee?.profileImage || `https://ui-avatars.com/api/?name=${selectedStaffData?.employee?.name}`} className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="font-black text-slate-800 leading-tight">Tracking: {selectedStaffData?.employee?.name}</h3>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Signal size={12} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Connected & Broadcasting</span>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={stopTracking} className="bg-rose-50 text-rose-600 px-6 py-2 rounded-2xl text-xs font-black hover:bg-rose-600 hover:text-white transition-all border border-rose-100 uppercase tracking-widest">
              Close Tracker
            </button>
          </div>

          {/* Full Screen Leaflet Map */}
          <div className="flex-grow relative">
            <MapContainer center={[20.59, 78.96]} zoom={5} scrollWheelZoom={true} className="h-full w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <RecenterMap coords={selectedStaffData?.lat ? [selectedStaffData.lat, selectedStaffData.lng] : null} />
              
              {selectedStaffData?.lat && (
                <>
                  <Circle 
                    center={[selectedStaffData.lat, selectedStaffData.lng]} 
                    radius={selectedStaffData.accuracy || 40} 
                    pathOptions={{ color: '#10b981', fillOpacity: 0.1, weight: 1 }} 
                  />
                  <Marker position={[selectedStaffData.lat, selectedStaffData.lng]} icon={empIcon}>
                    <Popup>Currently here</Popup>
                  </Marker>
                </>
              )}
            </MapContainer>

            {/* Float Info Card */}
            <div className="absolute bottom-10 left-10 z-[1000] bg-white/90 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl border border-white/50 max-w-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Location Intelligence</p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Last Update</span>
                  <span className="font-bold text-slate-800">{new Date(selectedStaffData?.updatedAt).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Contact Number</span>
                  <span className="font-bold text-slate-800">{selectedStaffData?.employee?.mobile || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}