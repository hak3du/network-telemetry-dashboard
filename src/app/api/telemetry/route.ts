import { NextRequest, NextResponse } from 'next/server';

interface TelemetryData {
  id: number;
  deviceId: string;
  uptime: number;
  latency: number;
  timestamp: string;
}

// Sample data for in-memory storage
let telemetryData: TelemetryData[] = [];

// Initialize with sample data
for (let i = 0; i < 10; i++) {
  telemetryData.push({
    id: i + 1,
    deviceId: `DEVICE-00${(i % 5) + 1}`,
    uptime: Math.floor(Math.random() * 86400) + 3600,
    latency: Math.floor(Math.random() * 100) + 10,
    timestamp: new Date(Date.now() - i * 60000).toISOString(),
  });
}

// Get telemetry for dashboard
export async function GET() {
  return NextResponse.json(telemetryData.slice(0, 50));
}

// Batch insert telemetry data
export async function POST(req: NextRequest) {
  try {
    const { telemetryArray } = await req.json();

    if (!Array.isArray(telemetryArray) || telemetryArray.length === 0) {
      return NextResponse.json(
        { error: 'telemetryArray must be a non-empty array' },
        { status: 400 }
      );
    }

    // Add new telemetry entries
    const newEntries = telemetryArray.map((t: any) => ({
      id: telemetryData.length + 1,
      deviceId: t.deviceId,
      uptime: t.uptime,
      latency: t.latency,
      timestamp: new Date().toISOString(),
    }));

    telemetryData = [...newEntries, ...telemetryData].slice(0, 100);

    return NextResponse.json({
      status: 'success',
      count: newEntries.length,
    });
  } catch (error) {
    console.error('Error creating telemetry:', error);
    return NextResponse.json(
      { error: 'Failed to create telemetry' },
      { status: 500 }
    );
  }
}
