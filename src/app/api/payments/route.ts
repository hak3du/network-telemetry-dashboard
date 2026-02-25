import { NextRequest, NextResponse } from 'next/server';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface Payment {
  id: string;
  userId: string;
  amount: number;
  method: string;
  date: string;
  user: User;
}

// Sample users data
const users: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@telemetry.com', role: 'admin', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', name: 'Operator User', email: 'operator@telemetry.com', role: 'operator', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// Sample payments data
const payments: Payment[] = [
  { id: '1', userId: '1', amount: 99.99, method: 'credit_card', date: new Date().toISOString(), user: users[0] },
  { id: '2', userId: '2', amount: 49.99, method: 'paypal', date: new Date(Date.now() - 86400000).toISOString(), user: users[1] },
  { id: '3', userId: '1', amount: 149.99, method: 'credit_card', date: new Date(Date.now() - 172800000).toISOString(), user: users[0] },
];

// Get all payments
export async function GET() {
  return NextResponse.json(payments);
}

// Add payment record
export async function POST(req: NextRequest) {
  try {
    const { userId, amount, method } = await req.json();

    if (!userId || amount === undefined || !method) {
      return NextResponse.json(
        { error: 'userId, amount, and method are required' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = users.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const newPayment: Payment = {
      id: String(payments.length + 1),
      userId,
      amount,
      method,
      date: new Date().toISOString(),
      user,
    };

    payments.unshift(newPayment);

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
