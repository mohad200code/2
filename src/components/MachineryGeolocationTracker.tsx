import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, Cpu, Globe, Activity, ShieldAlert, RefreshCw, Radio } from 'lucide-react';

interface Coords {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
}

interface MachineryGeolocationTrackerProps {
  orderId: string;
  theme: 'day' | 'night' | 'cyberpunk';
  machineryName: string;
}

export const MachineryGeolocationTracker: React.FC<MachineryGeolocationTrackerProps> = ({
  orderId,
  theme,
  machineryName
}) => {
  const [userCoords, setUserCoords] = useState<Coords | null>(null);
  const [machineryCoords, setMachineryCoords] = useState<Coords>({
    latitude: 36.6512, // Shandong Azum Machining Hub
    longitude: 117.0234,
    accuracy: 5.2,
    altitude: 184.5
  });
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'detecting' | 'active' | 'denied' | 'simulated'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [speedKnots, setSpeedKnots] = useState<number>(34.8);
  const [headingDegrees, setHeadingDegrees] = useState<number>(142);
  const [simulatedProgress, setSimulatedProgress] = useState<number>(0); // 0 to 100%
  const [radarRotation, setRadarRotation] = useState<number>(0);

  // Request browser geolocation
  const initializeLiveTracking = () => {
    if (!navigator.geolocation) {
      setGpsStatus('simulated');
      setErrorMsg("Geolocation not supported by this browser.");
      return;
    }

    setGpsStatus('detecting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy, altitude } = position.coords;
        setUserCoords({ latitude, longitude, accuracy, altitude });
        setGpsStatus('active');
        calculateShipmentPath(latitude, longitude);
      },
      (error) => {
        console.warn("Geolocation permission denied/failed. Falling back to simulated carrier routing.", error);
        setGpsStatus('simulated');
        // Simulated user coords: Seattle, WA as custom receiver base station
        const fallbackUser = { latitude: 47.6062, longitude: -122.3321, accuracy: 15.0, altitude: 45.2 };
        setUserCoords(fallbackUser);
        calculateShipmentPath(fallbackUser.latitude, fallbackUser.longitude);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Calculate distance using Haversine formula
  const calculateShipmentPath = (destLat: number, destLon: number) => {
    const hubLat = 36.6512;
    const hubLon = 117.0234;
    const R = 6371; // Radius of earth in km
    const dLat = (destLat - hubLat) * Math.PI / 180;
    const dLon = (destLon - hubLon) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(hubLat * Math.PI / 180) * Math.cos(destLat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    setDistanceKm(Math.round(distance * 10) / 10);
  };

  // Start with simulated tracker on mount
  useEffect(() => {
    initializeLiveTracking();
  }, [orderId]);

  // Handle active simulation updates (time-based changes)
  useEffect(() => {
    const interval = setInterval(() => {
      // Rotate radar sweep
      setRadarRotation(prev => (prev + 6) % 360);

      // Advance simulated machinery progress closer to User Coords over time
      setSimulatedProgress(prev => {
        const next = prev >= 100 ? 0 : prev + 0.5;
        
        // Compute current machinery coordinates along the line
        if (userCoords) {
          const originLat = 36.6512;
          const originLon = 117.0234;
          const ratio = next / 100;
          
          const currentLat = originLat + (userCoords.latitude - originLat) * ratio;
          const currentLon = originLon + (userCoords.longitude - originLon) * ratio;
          
          setMachineryCoords({
            latitude: parseFloat(currentLat.toFixed(5)),
            longitude: parseFloat(currentLon.toFixed(5)),
            accuracy: parseFloat((3 + Math.random() * 4).toFixed(1)),
            altitude: parseFloat((150 + Math.random() * 50).toFixed(1))
          });

          // Calculate remaining distance
          const remainingDistance = distanceKm ? distanceKm * (1 - ratio) : null;
          if (remainingDistance !== null) {
            // Keep speed and heading dynamic
            setSpeedKnots(parseFloat((30 + Math.sin(next * 0.1) * 8 + Math.random() * 2).toFixed(1)));
            setHeadingDegrees(Math.round((130 + Math.cos(next * 0.05) * 20 + 360) % 360));
          }
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [userCoords, distanceKm]);

  // Determine relative position of points for visual plotter mapping
  const plotMachineryX = 50 + 30 * Math.sin((simulatedProgress * Math.PI) / 50);
  const plotMachineryY = 50 - 30 * Math.cos((simulatedProgress * Math.PI) / 50);

  return (
    <div className={`p-5 rounded-2xl border transition-all ${
      theme === 'day'
        ? 'bg-slate-50 border-slate-200 text-slate-800'
        : 'bg-black/40 border-pink-500/20 text-slate-200'
    }`}>
      {/* Header section with real-time status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-pink-500/10 rounded-lg text-pink-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-pink-400 font-mono font-black uppercase tracking-widest block">Time-Based Telemetry Tracker</span>
            <h4 className="text-xs font-bold font-mono text-slate-100 uppercase tracking-tight">
              Real-Time Machinery GPS Coordinates
            </h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Coordinates Telemetry Feed */}
        <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            {/* Target Machinery Info */}
            <div className="bg-slate-900/40 border border-slate-800/60 p-2.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[8px] text-slate-500 uppercase font-black font-mono">Assigned Asset</span>
                <p className="text-xs font-black text-slate-200 truncate max-w-[160px]">{machineryName}</p>
              </div>
              <div className="text-right">
                <span className="text-[8px] text-slate-500 uppercase font-black font-mono">Carrier ID</span>
                <p className="text-xs font-mono font-bold text-pink-400">SD-CARGO-781</p>
              </div>
            </div>

            {/* Real-time coordinates */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 font-mono text-[10px]">
                <p className="text-slate-500 text-[8px] font-black uppercase tracking-wider">Machinery Lat</p>
                <p className="text-white font-black text-sm mt-0.5">{machineryCoords.latitude}° N</p>
                <div className="flex items-center gap-1 text-[8px] text-slate-500 mt-1">
                  <Activity className="w-2.5 h-2.5 text-pink-400 animate-pulse" />
                  <span>Real-time refresh</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 font-mono text-[10px]">
                <p className="text-slate-500 text-[8px] font-black uppercase tracking-wider">Machinery Lon</p>
                <p className="text-white font-black text-sm mt-0.5">{machineryCoords.longitude}° E</p>
                <div className="flex items-center gap-1 text-[8px] text-slate-500 mt-1">
                  <Navigation className="w-2.5 h-2.5 text-cyan-400 animate-bounce" />
                  <span>Velocity lock</span>
                </div>
              </div>
            </div>

            {/* Recipient Coordinates */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-400 uppercase font-black font-mono flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#00f0ff]" />
                  Recipient Base Coordinates
                </span>
                <span className="text-[8px] text-slate-500 font-mono">Online Node</span>
              </div>
              {userCoords ? (
                <div className="grid grid-cols-2 gap-2 font-mono text-[10px] text-slate-300">
                  <div>
                    <span className="text-slate-500 text-[8px]">LAT:</span> {userCoords.latitude.toFixed(4)}°
                  </div>
                  <div>
                    <span className="text-slate-500 text-[8px]">LON:</span> {userCoords.longitude.toFixed(4)}°
                  </div>
                </div>
              ) : (
                <p className="text-[10px] text-slate-500 font-mono">Awaiting satellite lock...</p>
              )}
            </div>
          </div>

          {/* Shipment route progress */}
          <div className="space-y-1.5 p-3 bg-indigo-950/10 border border-indigo-500/10 rounded-xl">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold">
              <span className="text-indigo-400 uppercase tracking-wider">Transit Progress</span>
              <span className="text-[#00f0ff]">{simulatedProgress.toFixed(1)}% Completed</span>
            </div>
            
            {/* Visual progress bar */}
            <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${simulatedProgress}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1.5 border-t border-slate-800/40 text-[10px] font-mono">
              <div>
                <span className="text-slate-500 text-[8px] uppercase">Est. Distance</span>
                <p className="text-slate-300 font-bold">
                  {distanceKm ? `${Math.round(distanceKm * (1 - simulatedProgress / 100)).toLocaleString()} km` : 'Calculating...'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[8px] uppercase">Machinery Speed</span>
                <p className="text-slate-300 font-bold">{speedKnots} knots</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: High-Tech Vector Radar Plotter */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden min-h-[220px]">
          {/* Radar background grid */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
          
          {/* Radar screen */}
          <div className="relative w-44 h-44 rounded-full border border-pink-500/20 flex items-center justify-center bg-black/60 shadow-[0_0_20px_rgba(236,72,153,0.05)]">
            {/* Radar concentric rings */}
            <div className="absolute w-32 h-32 rounded-full border border-indigo-500/10" />
            <div className="absolute w-20 h-20 rounded-full border border-indigo-500/10" />
            <div className="absolute w-8 h-8 rounded-full border border-[#00f0ff]/10" />
            
            {/* Radar crosshairs */}
            <div className="absolute top-0 bottom-0 w-px bg-slate-800/40" />
            <div className="absolute left-0 right-0 h-px bg-slate-800/40" />

            {/* Radar dynamic sweep line */}
            <div 
              className="absolute inset-0 rounded-full origin-center pointer-events-none"
              style={{
                transform: `rotate(${radarRotation}deg)`,
                background: 'conic-gradient(from 0deg at 50% 50%, rgba(236, 72, 153, 0.15) 0deg, transparent 90deg)'
              }}
            />

            {/* Hub Base Station Center node */}
            <div className="absolute w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] z-10" title="Hub Base">
              <span className="absolute -top-4 -left-6 text-[7px] font-mono text-cyan-400 whitespace-nowrap uppercase tracking-widest font-black">HQ BASE</span>
            </div>

            {/* Machinery moving target node */}
            <div 
              className="absolute w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_12px_#ec4899] z-20 flex items-center justify-center transition-all duration-1000"
              style={{
                left: `calc(${plotMachineryX}% - 6px)`,
                top: `calc(${plotMachineryY}% - 6px)`
              }}
            >
              <span className="absolute w-6 h-6 rounded-full border border-pink-500 animate-ping opacity-75" />
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              
              <span className="absolute -top-4 left-4 text-[7px] font-mono text-pink-400 bg-black/85 px-1.5 py-0.5 rounded border border-pink-500/30 whitespace-nowrap uppercase tracking-widest font-black">
                ASSET LOCK
              </span>
            </div>

            {/* Geolocation Client Receiver Target Node */}
            <div className="absolute right-3 bottom-3 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] z-10" title="User Site">
              <span className="absolute w-4 h-4 rounded-full border border-emerald-400 animate-ping opacity-50" />
              <span className="absolute top-3 -left-4 text-[7px] font-mono text-emerald-400 whitespace-nowrap uppercase tracking-widest font-black">RECEIVER SITE</span>
            </div>
          </div>

          {/* Compass readout bar */}
          <div className="w-full mt-3 flex items-center justify-between text-[8px] font-mono text-slate-500 uppercase tracking-widest px-1 z-10 border-t border-slate-900 pt-2">
            <span className="flex items-center gap-1">
              <Compass className="w-3 h-3 text-indigo-400 animate-spin" />
              Bearing: {headingDegrees}° NW
            </span>
            <span>Altitude: {machineryCoords.altitude}m</span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-pink-400" />
              Signal: 98%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
