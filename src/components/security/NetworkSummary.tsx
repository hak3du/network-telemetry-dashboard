'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Server, Network, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function NetworkSummary() {
  const stats = [
    {
      title: 'Active Devices',
      value: '5',
      icon: Server,
      color: 'text-cyan-400',
      bgGradient: 'from-cyan-500/20 to-cyan-600/20',
      borderColor: 'border-cyan-500/30',
      change: '+2 from yesterday',
    },
    {
      title: 'Network Status',
      value: 'Healthy',
      icon: Activity,
      color: 'text-green-400',
      bgGradient: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/30',
      change: 'All systems operational',
    },
    {
      title: 'Total Packets',
      value: '2.4M',
      icon: Network,
      color: 'text-purple-400',
      bgGradient: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-500/30',
      change: '+12% from last hour',
    },
    {
      title: 'Alerts',
      value: '3',
      icon: AlertTriangle,
      color: 'text-yellow-400',
      bgGradient: 'from-yellow-500/20 to-yellow-600/20',
      borderColor: 'border-yellow-500/30',
      change: '2 high priority',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className={`bg-slate-900/50 backdrop-blur-sm border ${stat.borderColor} overflow-hidden relative`}
          >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.bgGradient}`} />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.bgGradient}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="h-3 w-3" />
                {stat.change}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
