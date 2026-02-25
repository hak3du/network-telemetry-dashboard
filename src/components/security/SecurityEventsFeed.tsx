'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertCircle, CheckCircle, Info, User, LogOut } from 'lucide-react';

interface SecurityEvent {
  id: number;
  type: 'login' | 'logout' | 'alert' | 'info';
  severity: 'info' | 'warning' | 'success' | 'error';
  message: string;
  user?: string;
  timestamp: string;
}

export default function SecurityEventsFeed() {
  const [events, setEvents] = useState<SecurityEvent[]>([
    {
      id: 1,
      type: 'info',
      severity: 'info',
      message: 'System scan completed - no vulnerabilities found',
      timestamp: new Date(Date.now() - 60000).toISOString(),
    },
    {
      id: 2,
      type: 'alert',
      severity: 'warning',
      message: 'Unusual login pattern detected from IP 192.168.1.100',
      timestamp: new Date(Date.now() - 120000).toISOString(),
    },
    {
      id: 3,
      type: 'info',
      severity: 'success',
      message: 'Firewall rules updated successfully',
      timestamp: new Date(Date.now() - 180000).toISOString(),
    },
  ]);

  // Make this function available globally for the main page to use
  useEffect(() => {
    (window as any).addSecurityEvent = (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => {
      setEvents((prev) => [
        {
          ...event,
          id: prev.length + 1,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 50));
    };
  }, []);

  const getEventIcon = (type: string, severity: string) => {
    if (type === 'login') return <User className="h-4 w-4" />;
    if (type === 'logout') return <LogOut className="h-4 w-4" />;
    if (severity === 'error' || severity === 'warning') return <AlertCircle className="h-4 w-4" />;
    if (severity === 'success') return <CheckCircle className="h-4 w-4" />;
    return <Info className="h-4 w-4" />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'success':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      default:
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    }
  };

  return (
    <Card className="bg-slate-900/50 border-emerald-500/30 backdrop-blur-sm overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emerald-400">
          <Shield className="h-5 w-5" />
          Security Events Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto gradient-scrollbar">
          {events.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No security events recorded</p>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${getSeverityColor(
                  event.severity
                )} transition-all hover:scale-[1.01]`}
              >
                <div className="mt-0.5">{getEventIcon(event.type, event.severity)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{event.message}</p>
                  {event.user && (
                    <p className="text-xs text-slate-400 mt-1">
                      User: <span className="text-cyan-400">{event.user}</span>
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
