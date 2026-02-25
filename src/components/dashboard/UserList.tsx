'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Shield, Calendar } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'operator':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'viewer':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-900/50 border-pink-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-400">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-slate-500 py-8">Loading users...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-pink-500/30 backdrop-blur-sm overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-cyan-500 to-purple-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-pink-400">
          <Users className="h-5 w-5" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 max-h-96 overflow-y-auto gradient-scrollbar">
          <Table>
            <TableHeader className="bg-slate-800/50 sticky top-0">
              <TableRow className="border-slate-700/50 hover:bg-transparent">
                <TableHead className="text-cyan-400 font-semibold">Name</TableHead>
                <TableHead className="text-purple-400 font-semibold">Email</TableHead>
                <TableHead className="text-pink-400 font-semibold">Role</TableHead>
                <TableHead className="text-slate-400 font-semibold">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No users found</p>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="border-slate-700/30 hover:bg-slate-800/30">
                    <TableCell className="font-medium text-white">{user.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`border ${getRoleColor(user.role)} flex items-center gap-1 w-fit`}>
                        <Shield className="h-3 w-3" />
                        {user.role.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(user.createdAt).toLocaleDateString()}
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
