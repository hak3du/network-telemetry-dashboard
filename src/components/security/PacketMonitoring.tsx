'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, ArrowDown, ArrowUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function PacketMonitoring() {
  const [packetData, setPacketData] = useState<any[]>([]);

  useEffect(() => {
    // Generate initial data
    const generateData = () => {
      const data = [];
      for (let i = 0; i < 20; i++) {
        data.push({
          time: new Date(Date.now() - (19 - i) * 5000).toLocaleTimeString(),
          inbound: Math.floor(Math.random() * 500) + 200,
          outbound: Math.floor(Math.random() * 300) + 100,
        });
      }
      return data;
    };

    setPacketData(generateData());

    // Update data every 5 seconds
    const interval = setInterval(() => {
      setPacketData((prev) => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: new Date().toLocaleTimeString(),
          inbound: Math.floor(Math.random() * 500) + 200,
          outbound: Math.floor(Math.random() * 300) + 100,
        });
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const totalInbound = packetData.reduce((sum, d) => sum + d.inbound, 0);
  const totalOutbound = packetData.reduce((sum, d) => sum + d.outbound, 0);

  return (
    <Card className="bg-slate-900/50 border-cyan-500/30 backdrop-blur-sm overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-400">
          <Activity className="h-5 w-5" />
          Packet Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDown className="h-4 w-4 text-green-400" />
              <span className="text-sm text-slate-400">Inbound</span>
            </div>
            <div className="text-2xl font-bold text-white">{totalInbound.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-1">Total packets received</div>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUp className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-slate-400">Outbound</span>
            </div>
            <div className="text-2xl font-bold text-white">{totalOutbound.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-1">Total packets sent</div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={packetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid #22d3ee',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                }}
              />
              <Line
                type="monotone"
                dataKey="inbound"
                stroke="#22d3ee"
                strokeWidth={2}
                dot={false}
                name="Inbound"
              />
              <Line
                type="monotone"
                dataKey="outbound"
                stroke="#a855f7"
                strokeWidth={2}
                dot={false}
                name="Outbound"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
