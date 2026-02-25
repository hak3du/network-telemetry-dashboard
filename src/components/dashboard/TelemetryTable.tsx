'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, Zap, TrendingUp, Cpu } from 'lucide-react';
import { io } from 'socket.io-client';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TelemetryData {
  id: number;
  deviceId: string;
  uptime: number;
  latency: number;
  timestamp: string;
}

interface ChartData {
  time: string;
  device?: string;
  uptime?: number;
  [key: string]: number | string | undefined;
}

export default function TelemetryTable() {
  const [telemetry, setTelemetry] = useState<TelemetryData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [latencyHistory, setLatencyHistory] = useState<ChartData[]>([]);
  const [uptimeHistory, setUptimeHistory] = useState<ChartData[]>([]);

  const updateChartData = (data: TelemetryData[]) => {
    // Prepare latency chart data - keep last 20 readings
    const recentLatency = data.slice(0, 20).reverse();
    const latencyChartData: ChartData[] = recentLatency.map((t) => ({
      time: new Date(t.timestamp).toLocaleTimeString(),
      [t.deviceId]: t.latency,
    }));

    setLatencyHistory(latencyChartData);

    // Prepare uptime chart data - latest reading per device
    const deviceMap = new Map<string, TelemetryData>();
    data.forEach((t) => {
      if (!deviceMap.has(t.deviceId)) {
        deviceMap.set(t.deviceId, t);
      }
    });

    const uptimeChartData: ChartData[] = Array.from(deviceMap.values()).map((t) => ({
      device: t.deviceId,
      uptime: Math.round(t.uptime / 3600), // Convert to hours
    }));

    setUptimeHistory(uptimeChartData);
  };

  useEffect(() => {
    // Fetch initial telemetry data
    fetch('/api/telemetry')
      .then((res) => res.json())
      .then((data) => {
        setTelemetry(data);
        updateChartData(data);
      })
      .catch((error) => console.error('Error fetching telemetry:', error));

    // Connect to WebSocket for real-time updates
    const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || '/?XTransformPort=3004';
    console.log('TelemetryTable connecting to:', socketUrl);

    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('TelemetryTable connected to WebSocket');
    });

    socket.on('connect_error', (error) => {
      console.error('TelemetryTable WebSocket error:', error);
      setIsConnected(false);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('TelemetryTable disconnected from WebSocket');
    });

    socket.on('telemetry-update', (data: TelemetryData) => {
      setTelemetry((prev) => {
        const newData = [data, ...prev.slice(0, 49)];
        updateChartData(newData);
        return newData;
      });
    });

    socket.on('telemetry-batch-update', (data: TelemetryData[]) => {
      setTelemetry((prev) => {
        const newData = [...data, ...prev.slice(0, 50 - data.length)];
        updateChartData(newData);
        return newData;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 50) return 'text-green-400 bg-green-500/10 border-green-500/30';
    if (latency < 100) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    return 'text-red-400 bg-red-500/10 border-red-500/30';
  };

  const getUniqueDevices = () => {
    const devices = new Set(telemetry.map((t) => t.deviceId));
    return Array.from(devices);
  };

  const getLineColor = (index: number) => {
    const colors = [
      '#22d3ee', // cyan-400
      '#a855f7', // purple-500
      '#f472b6', // pink-400
      '#34d399', // emerald-400
      '#fbbf24', // amber-400
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
        <span className={`text-sm font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
          {isConnected ? 'LIVE CONNECTED' : 'OFFLINE'}
        </span>
      </div>

      {/* Live Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency Line Chart */}
        <Card className="bg-slate-900/50 border-cyan-500/30 backdrop-blur-sm overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <TrendingUp className="h-5 w-5" />
              Latency Trends
            </CardTitle>
            <CardDescription className="text-slate-400">Real-time latency per device (ms)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={latencyHistory}>
                <defs>
                  <linearGradient id="colorCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPink" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f472b6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid #22d3ee',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                  }}
                />
                <Legend />
                {getUniqueDevices().slice(0, 3).map((device, index) => (
                  <Area
                    key={device}
                    type="monotone"
                    dataKey={device}
                    stroke={getLineColor(index)}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(${
                      index === 0 ? 'colorCyan' : index === 1 ? 'colorPurple' : 'colorPink'
                    })`}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Uptime Bar Chart */}
        <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Cpu className="h-5 w-5" />
              Device Uptime
            </CardTitle>
            <CardDescription className="text-slate-400">Current uptime per device (hours)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={uptimeHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="device" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid #a855f7',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                  }}
                  formatter={(value: number) => [`${value}h`, 'Uptime']}
                />
                <Bar dataKey="uptime" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Telemetry Table */}
      <Card className="bg-slate-900/50 border-pink-500/30 backdrop-blur-sm overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-cyan-500 to-purple-500" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-400">
            <Activity className="h-5 w-5" />
            Live Telemetry Feed
          </CardTitle>
          <CardDescription className="text-slate-400">Real-time device performance monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 max-h-96 overflow-y-auto gradient-scrollbar">
            <Table>
              <TableHeader className="bg-slate-800/50 sticky top-0">
                <TableRow className="border-slate-700/50 hover:bg-transparent">
                  <TableHead className="text-cyan-400 font-semibold">Device ID</TableHead>
                  <TableHead className="text-purple-400 font-semibold">Uptime</TableHead>
                  <TableHead className="text-pink-400 font-semibold">Latency</TableHead>
                  <TableHead className="text-slate-400 font-semibold">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {telemetry.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                      <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Waiting for telemetry data...</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  telemetry.map((t, idx) => (
                    <TableRow
                      key={t.id}
                      className={`border-slate-700/30 ${
                        idx === 0 ? 'bg-cyan-500/5 animate-pulse' : 'hover:bg-slate-800/30'
                      } transition-colors`}
                    >
                      <TableCell className="font-mono text-cyan-300 font-medium">{t.deviceId}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-purple-300">
                          <Clock className="h-4 w-4" />
                          {formatUptime(t.uptime)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`border ${getLatencyColor(t.latency)} font-mono`}>
                          <Zap className="h-3 w-3 mr-1" />
                          {t.latency.toFixed(2)} ms
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-400 font-mono text-sm">
                        {new Date(t.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
