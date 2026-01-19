import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import io from 'socket.io-client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import API, { BASE_URL } from '../../api/axios';
import { ArrowLeft, Signal, BatteryFull, Users, Map as MapIcon } from 'lucide-react';

// Socket setup (ensure it points to your server root)
const socket = io(BASE_URL.replace('/api', ''));

const createIcon = (color) => new L.DivIcon({
  html: `<div style="position: relative;">
          <img src="https://cdn-icons-png.flaticon.com/512/1048/1048329.png" style="width: 40px; height: 40px; filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.2));" />
          <div style="position: absolute; bottom: 0; right: 0; width: 14px; height: 14px; background: ${color}; border: 2.5px solid white; border-radius: 50%;"></div>
         </div>`,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || map.getZoom(), { animate: true, duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function AdminMapContainer() {
  const [staff, setStaff] = useState({}); // Stores all employees as { empId: data }
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    // 1. Join room and load all existing locations
    socket.emit('joinAsAdmin');

    const loadInitialLocations = async () => {
      try {
        const res = await API.get('/location/all/latest');
        const initialStaff = {};
        res.data.forEach(d => {
          const id = d.employee?._id || d.employee; // Support both populated and ID
          if (id) {
            initialStaff[id] = { 
              ...d, 
              batteryLevel: d.batteryLevel || 100,
              ts: d.updatedAt || d.ts || new Date().toISOString()
            };
          }
        });
        setStaff(initialStaff);
      } catch (err) {
        console.error("Error loading initial locations:", err);
      }
    };
    
    loadInitialLocations();

    // 2. Listen for REAL-TIME updates from ALL employees
    socket.on('employeeLocation', (data) => {
      console.log("New location received for:", data.employeeId);
      setStaff(prev => ({
        ...prev,
        [data.employeeId]: { 
          ...prev[data.employeeId], // Keep existing name/details
          ...data,                  // Update lat, lng, accuracy, battery
          updatedAt: new Date().toISOString() 
        }
      }));
    });

    return () => {
      socket.off('employeeLocation');
    };
  }, []);

  const allStaffArray = Object.values(staff);
  const selectedStaffData = selectedEmpId ? staff[selectedEmpId] : null;

  return (
    <div className="w-full h-screen bg-slate-50 flex flex-col overflow-hidden">
      
      {/* Top Navbar */}
      <div className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-[1001] shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
            <MapIcon size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none mb-1">Fleet Tracker</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Tracking {allStaffArray.length} Employees Live
            </p>
          </div>
        </div>
        
        {isTracking && (
          <button 
            onClick={() => { setIsTracking(false); setSelectedEmpId(null); }} 
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black hover:bg-slate-800 transition-all shadow-md"
          >
            <ArrowLeft size={16} /> RESET VIEW
          </button>
        )}
      </div>

      <div className="flex-grow flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Sidebar: Staff List */}
        <div className={`w-full md:w-80 bg-white border-r border-slate-200 flex flex-col transition-all z-[1000] ${isTracking ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
            <span>Live Directory</span>
            <Users size={12} />
          </div>
          <div className="flex-grow overflow-y-auto divide-y divide-slate-50 custom-scrollbar">
            {allStaffArray.map((p) => {
              const id = p.employee?._id || p.employeeId || p._id;
              // Online if updated in last 2 minutes
              const isOnline = (new Date() - new Date(p.updatedAt || p.ts)) < 120000;
              const isSelected = selectedEmpId === id;

              return (
                <div 
                  key={id} 
                  onClick={() => { setSelectedEmpId(id); setIsTracking(true); }}
                  className={`p-4 cursor-pointer transition-all hover:bg-indigo-50/50 flex items-center gap-3 ${isSelected ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''}`}
                >
                  <div className="relative shrink-0">
                    <img 
                      src={p.employee?.profileImage ? `${BASE_URL}${p.employee.profileImage}` : `https://ui-avatars.com/api/?name=${p.employee?.name || 'User'}&background=random`} 
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200" 
                      alt="profile"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <p className="font-black text-slate-800 text-sm truncate uppercase tracking-tight">{p.employee?.name || 'Unknown'}</p>
                    <div className="flex items-center justify-between mt-1">
                       <span className="text-[10px] font-bold text-slate-400 tracking-tighter">{isOnline ? 'Active Now' : 'Last seen ' + new Date(p.updatedAt || p.ts).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                       <div className={`flex items-center gap-1 text-[10px] font-black ${p.batteryLevel < 20 ? 'text-rose-500' : 'text-emerald-600'}`}>
                          <BatteryFull size={12} /> {p.batteryLevel || 100}%
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full Screen Map Area */}
        <div className="flex-grow relative h-full">
          <MapContainer center={[20.59, 78.96]} zoom={5} className="h-full w-full" zoomControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            <MapController 
              center={selectedStaffData?.lat ? [selectedStaffData.lat, selectedStaffData.lng] : null} 
              zoom={isTracking ? 16 : null} 
            />

            {/* Render EVERY employee from the staff state */}
            {allStaffArray.map((p) => {
              const id = p.employee?._id || p.employeeId || p._id;
              if (!p.lat || !p.lng) return null;

              const isOnline = (new Date() - new Date(p.updatedAt || p.ts)) < 120000;
              
              return (
                <React.Fragment key={id}>
                  <Circle 
                    center={[p.lat, p.lng]} 
                    radius={p.accuracy || 40} 
                    pathOptions={{ 
                      color: isOnline ? '#10b981' : '#94a3b8', 
                      fillOpacity: 0.1, 
                      weight: 1 
                    }} 
                  />
                  <Marker 
                    position={[p.lat, p.lng]} 
                    icon={createIcon(isOnline ? '#10b981' : '#94a3b8')}
                    eventHandlers={{ 
                      click: () => { setSelectedEmpId(id); setIsTracking(true); } 
                    }}
                  >
                    <Popup className="custom-popup">
                      <div className="p-1">
                        <p className="font-black text-slate-800 text-xs uppercase mb-1">{p.employee?.name}</p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                           <Signal size={10} /> {isOnline ? 'Signal Strong' : 'Offline'}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                </React.Fragment>
              );
            })}
          </MapContainer>

          {/* Detailed Stats Card (Bottom Right) */}
          {selectedStaffData && (
             <div className="absolute bottom-6 right-6 z-[1000] bg-white/95 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl border border-white max-w-xs animate-in slide-in-from-right duration-500">
                <div className="flex items-center gap-4 mb-4">
                   <div className="relative">
                      <img 
                        src={selectedStaffData.employee?.profileImage ? `${BASE_URL}${selectedStaffData.employee.profileImage}` : `https://ui-avatars.com/api/?name=${selectedStaffData.employee?.name}`} 
                        className="w-14 h-14 rounded-2xl border border-slate-100 shadow-sm object-cover" 
                      />
                      <div className="absolute -top-2 -right-2 bg-indigo-600 text-white p-1 rounded-lg">
                        <Users size={12} />
                      </div>
                   </div>
                   <div>
                     <h4 className="font-black text-slate-800 uppercase text-base tracking-tight leading-none mb-1">{selectedStaffData.employee?.name}</h4>
                     <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                        <Signal size={12} className="animate-pulse" /> Live Tracking
                     </p>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                   <div className="bg-slate-50 p-3 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Battery</p>
                      <p className="text-sm font-black text-slate-700">{selectedStaffData.batteryLevel}%</p>
                   </div>
                   <div className="bg-slate-50 p-3 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
                      <p className="text-sm font-black text-slate-700">±{Math.round(selectedStaffData.accuracy || 0)}m</p>
                   </div>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}