import { NextRequest, NextResponse } from 'next/server';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Sample users data
const users: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@telemetry.com', role: 'admin', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', name: 'Operator User', email: 'operator@telemetry.com', role: 'operator', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', name: 'Viewer User', email: 'viewer@telemetry.com', role: 'viewer', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// Get all users
export async function GET() {
  return NextResponse.json(users);
}

// Add a new user
export async function POST(req: NextRequest) {
  try {
    const { name, email, role } = await req.json();

    if (!name || !email || !role) {
      return NextResponse.json(
        { error: 'Name, email, and role are required' },
        { status: 400 }
      );
    }

    const newUser: User = {
      id: String(users.length + 1),
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
