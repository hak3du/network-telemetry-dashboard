'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Bell, Lock, Database, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function SettingsPanel() {
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('5');
  const [thresholdLatency, setThresholdLatency] = useState('100');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Settings saved', {
        description: 'Your preferences have been updated successfully.',
      });
    }, 1000);
  };

  const handleReset = () => {
    setNotifications(true);
    setAutoRefresh(true);
    setRefreshInterval('5');
    setThresholdLatency('100');
    toast.info('Settings reset', {
      description: 'All settings have been reset to defaults.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <Card className="bg-slate-900/50 border-cyan-500/30 backdrop-blur-sm overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Email Notifications</Label>
              <p className="text-sm text-slate-400">Receive alerts via email</p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
              className="data-[state=checked]:bg-cyan-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Push Notifications</Label>
              <p className="text-sm text-slate-400">Receive browser push notifications</p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
              className="data-[state=checked]:bg-cyan-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Monitoring Settings */}
      <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <Database className="h-5 w-5" />
            Monitoring Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Auto Refresh</Label>
              <p className="text-sm text-slate-400">Automatically refresh data</p>
            </div>
            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
              className="data-[state=checked]:bg-purple-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="refresh" className="text-white">Refresh Interval (seconds)</Label>
            <Input
              id="refresh"
              type="number"
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(e.target.value)}
              className="bg-slate-800/50 border-slate-700/50 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="latency" className="text-white">Latency Threshold (ms)</Label>
            <Input
              id="latency"
              type="number"
              value={thresholdLatency}
              onChange={(e) => setThresholdLatency(e.target.value)}
              className="bg-slate-800/50 border-slate-700/50 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="bg-slate-900/50 border-pink-500/30 backdrop-blur-sm overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-cyan-500 to-purple-500" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-400">
            <Lock className="h-5 w-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Two-Factor Authentication</Label>
              <p className="text-sm text-slate-400">Add an extra layer of security</p>
            </div>
            <Switch
              checked={false}
              className="data-[state=checked]:bg-pink-500"
            />
          </div>
          <Button
            variant="outline"
            className="w-full border-slate-700/50 text-slate-300 hover:bg-slate-800/50"
          >
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0"
        >
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-slate-700/50 text-slate-300 hover:bg-slate-800/50"
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
