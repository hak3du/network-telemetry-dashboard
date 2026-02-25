'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Users, DollarSign, Settings, Play, Square, Shield, LogOut, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { io } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';
import TelemetryTable from '@/components/dashboard/TelemetryTable';
import PaymentHistory from '@/components/dashboard/PaymentHistory';
import UserList from '@/components/dashboard/UserList';
import SettingsPanel from '@/components/dashboard/SettingsPanel';
import NetworkSummary from '@/components/security/NetworkSummary';
import PacketMonitoring from '@/components/security/PacketMonitoring';
import AnomalyDetection from '@/components/security/AnomalyDetection';
import SecurityEventsFeed from '@/components/security/SecurityEventsFeed';
import dynamic from 'next/dynamic';

const LoginForm = dynamic(() => import('@/components/security/LoginForm').then(mod => ({ default: mod.default })), { ssr: false });

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationInterval, setSimulationInterval] = useState<NodeJS.Timeout | null>(null);
  const [activeTab, setActiveTab] = useState<'telemetry' | 'payments' | 'users' | 'settings'>('telemetry');
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch with theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    // Add login event to security feed
    if (typeof window !== 'undefined' && (window as any).addSecurityEvent) {
      (window as any).addSecurityEvent({
        type: 'login',
        severity: 'info',
        message: `User ${user?.username} logged in successfully`,
        user: user?.username,
      });
    }
  }, [isAuthenticated, user]);

  const startSimulation = () => {
    if (isSimulating) return;

    setIsSimulating(true);
    toast.success('Telemetry simulation initiated');

    // Use Render WebSocket URL in production, or local gateway in development
    const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || '/?XTransformPort=3004';
    console.log('Connecting to WebSocket:', socketUrl);

    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('WebSocket connected:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      toast.error('WebSocket connection failed', {
        description: 'Real-time updates may not work',
      });
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    const interval = setInterval(() => {
      const devices = ['DEVICE-001', 'DEVICE-002', 'DEVICE-003', 'DEVICE-004', 'DEVICE-005'];
      const randomDevice = devices[Math.floor(Math.random() * devices.length)];
      const randomUptime = Math.floor(Math.random() * 864000) + 3600;
      const randomLatency = Math.random() * 150 + 10;

      const telemetryData = {
        deviceId: randomDevice,
        uptime: randomUptime,
        latency: parseFloat(randomLatency.toFixed(2)),
      };

      socket.emit('telemetry', {
        ...telemetryData,
        timestamp: new Date().toISOString(),
      });

      fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telemetryArray: [telemetryData] }),
      }).catch(console.error);
    }, 2000);

    setSimulationInterval(interval);
  };

  const stopSimulation = () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    setIsSimulating(false);
    toast.info('Simulation terminated');
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined' && (window as any).addSecurityEvent) {
      (window as any).addSecurityEvent({
        type: 'logout',
        severity: 'info',
        message: `User ${user?.username} logged out`,
        user: user?.username,
      });
    }
    logout();
  };

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0 animated-grid"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
        {/* Top Header Row */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-30 animate-pulse-glow" />
                <div className="relative bg-gradient-to-br from-cyan-500 to-purple-600 p-3 rounded-xl">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  SECURE DASHBOARD
                </h1>
                <p className="text-xs text-slate-500 uppercase tracking-widest">
                  Network Operations Center
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50">
                <Shield className="h-4 w-4 text-cyan-400" />
                <span className="text-sm text-slate-300 font-mono">{user?.username}</span>
                <Badge
                  className={`ml-2 font-mono text-xs ${
                    user?.role === 'admin'
                      ? 'bg-red-500/20 text-red-400 border-red-500/30'
                      : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                  }`}
                >
                  {user?.role.toUpperCase()}
                </Badge>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-slate-400 hover:text-slate-200"
              >
                {mounted && theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="px-6 border-t border-slate-800/50">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                activeTab === 'telemetry'
                  ? 'text-cyan-400 border-cyan-500 bg-cyan-500/10'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="h-4 w-4" />
              Telemetry
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                activeTab === 'payments'
                  ? 'text-purple-400 border-purple-500 bg-purple-500/10'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <DollarSign className="h-4 w-4" />
              Payments
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                activeTab === 'users'
                  ? 'text-pink-400 border-pink-500 bg-pink-500/10'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Users className="h-4 w-4" />
              Users
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                activeTab === 'settings'
                  ? 'text-emerald-400 border-emerald-500 bg-emerald-500/10'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 relative z-10">
        {activeTab === 'telemetry' && (
          <div className="space-y-6">
            {/* Control Bar */}
            <div className="flex justify-end">
              <div className="flex gap-2">
                <Button
                  onClick={startSimulation}
                  disabled={isSimulating}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Simulation
                </Button>
                <Button
                  onClick={stopSimulation}
                  disabled={!isSimulating}
                  variant="outline"
                  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop Simulation
                </Button>
              </div>
            </div>

            {/* Network Summary - Full Width */}
            <div>
              <NetworkSummary />
            </div>

            {/* Middle Row - Packet Monitoring + Anomaly Detection */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PacketMonitoring />
              </div>
              <div>
                <AnomalyDetection />
              </div>
            </div>

            {/* Telemetry Table - Full Width */}
            <div>
              <TelemetryTable />
            </div>

            {/* Security Events Feed */}
            <div>
              <SecurityEventsFeed />
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            <PaymentHistory />
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <UserList />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <SettingsPanel />
          </div>
        )}
      </main>
    </div>
  );
}
