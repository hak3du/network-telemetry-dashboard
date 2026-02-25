'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, CheckCircle, XCircle } from 'lucide-react';

export default function AnomalyDetection() {
  const anomalies = [
    {
      id: 1,
      type: 'High Latency',
      severity: 'warning',
      device: 'DEVICE-003',
      message: 'Latency exceeded threshold',
      time: '2 min ago',
    },
    {
      id: 2,
      type: 'Packet Loss',
      severity: 'critical',
      device: 'DEVICE-001',
      message: 'Detected packet loss pattern',
      time: '5 min ago',
    },
    {
      id: 3,
      type: 'Unusual Traffic',
      severity: 'info',
      device: 'DEVICE-005',
      message: 'Spike in outbound traffic',
      time: '8 min ago',
    },
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'info':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <Shield className="h-4 w-4 text-slate-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500/50 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-500/10';
      case 'info':
        return 'border-green-500/50 bg-green-500/10';
      default:
        return 'border-slate-500/50 bg-slate-500/10';
    }
  };

  return (
    <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <AlertTriangle className="h-5 w-5" />
          Anomaly Detection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto gradient-scrollbar">
          {anomalies.map((anomaly) => (
            <div
              key={anomaly.id}
              className={`p-3 rounded-lg border ${getSeverityColor(anomaly.severity)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getSeverityIcon(anomaly.severity)}
                  <span className="text-sm font-medium text-white">
                    {anomaly.type}
                  </span>
                </div>
                <span className="text-xs text-slate-400">{anomaly.time}</span>
              </div>
              <div className="text-xs text-slate-400">
                <span className="font-medium text-cyan-400">{anomaly.device}</span>
                {' - '}
                {anomaly.message}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
