'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, CreditCard, Wallet, Calendar } from 'lucide-react';

interface Payment {
  id: string;
  userId: string;
  amount: number;
  method: string;
  date: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/payments')
      .then((res) => res.json())
      .then((data) => {
        setPayments(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching payments:', error);
        setLoading(false);
      });
  }, []);

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'paypal':
        return <Wallet className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'paypal':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      default:
        return 'text-pink-400 bg-pink-500/10 border-pink-500/30';
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <DollarSign className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-slate-500 py-8">Loading payments...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <DollarSign className="h-5 w-5" />
          Payment History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 max-h-96 overflow-y-auto gradient-scrollbar">
          <Table>
            <TableHeader className="bg-slate-800/50 sticky top-0">
              <TableRow className="border-slate-700/50 hover:bg-transparent">
                <TableHead className="text-cyan-400 font-semibold">User</TableHead>
                <TableHead className="text-purple-400 font-semibold">Amount</TableHead>
                <TableHead className="text-pink-400 font-semibold">Method</TableHead>
                <TableHead className="text-slate-400 font-semibold">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                    <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No payments recorded</p>
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id} className="border-slate-700/30 hover:bg-slate-800/30">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{payment.user.name}</div>
                        <div className="text-xs text-slate-500">{payment.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-lg text-cyan-300 font-semibold">
                      ${payment.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={`border ${getMethodColor(payment.method)} flex items-center gap-1 w-fit`}>
                        {getMethodIcon(payment.method)}
                        {payment.method.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(payment.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
