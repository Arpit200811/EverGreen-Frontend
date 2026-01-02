import { useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import { BASE_URL } from '../../api/axios';

const socket = io(BASE_URL); // Backend URL

export default function LiveTrackerWorker() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'EMPLOYEE') return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const payload = {
          employeeId: user._id,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestampClient: new Date()
        };
        socket.emit('locationUpdate', payload);
      },
      (err) => console.error("GPS Error:", err),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [user]);

  return null; 
}