import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dashboardApi } from '@/services/api';
import { DashboardStats } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, PriorityBadge, Avatar } from '@/components/common/Badges';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (error: any) {
      console.error('Error loading dashboard stats:', error);
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ECONNREFUSED') {
        toast({
          title: 'Error loading dashboard',
          description: error.response?.data?.message || 'Failed to load dashboard statistics',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleGreeting = () => {
    switch (user?.role) {
      case 'admin':
        return 'System Overview';
      case 'manager':
        return 'Team Performance';
      case 'technician':
        return 'My Assignments';
      case 'employee':
        return 'My Requests';
      default:
        return 'Dashboard';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome back, {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            {getRoleGreeting()}
          </p>
        </div>
        {hasRole(['admin', 'manager', 'technician']) && (
          <Button asChild size="lg" className="shadow-lg">
            <Link to="/requests">
              <ClipboardList className="mr-2 h-4 w-4" />
              New Request
            </Link>
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Equipment
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalEquipment}</div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <span className="text-success font-semibold">+2</span>
              <span>added this month</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Requests
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center">
              <ClipboardList className="h-5 w-5 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeRequests}</div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              {stats.overdueRequests > 0 ? (
                <>
                  <span className="text-warning font-semibold">{stats.overdueRequests}</span>
                  <span>overdue</span>
                </>
              ) : (
                <span>{hasRole('technician') ? 'Assigned to you' : 'No overdue items'}</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="border-success/20 bg-gradient-to-br from-success/5 to-success/10 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completedThisMonth}</div>
            <p className="text-xs text-muted-foreground mt-2">This month</p>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{stats.overdueRequests}</div>
            <p className="text-xs text-muted-foreground mt-2">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Requests */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
            <div>
              <CardTitle className="text-lg font-bold">Recent Requests</CardTitle>
              <CardDescription className="mt-1">Latest maintenance activities</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/requests" className="flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {stats.recentRequests && stats.recentRequests.length > 0 ? (
                stats.recentRequests.map((request) => (
                  <Link
                    key={request.id}
                    to={`/requests?id=${request.id}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all cursor-pointer border border-transparent hover:border-primary/20"
                  >
                    <Avatar name={request.assignedTo?.name || request.requestedBy?.name || 'Unknown'} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{request.subject}</p>
                      <p className="text-sm text-muted-foreground truncate mt-0.5">
                        {request.equipment?.name || 'Unknown Equipment'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <PriorityBadge priority={request.priority} />
                      <StatusBadge status={request.status} />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No recent requests
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Maintenance */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
            <div>
              <CardTitle className="text-lg font-bold">Upcoming Maintenance</CardTitle>
              <CardDescription className="mt-1">Scheduled preventive maintenance</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/calendar" className="flex items-center gap-1">
                View calendar <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {stats.upcomingMaintenance && stats.upcomingMaintenance.length > 0 ? (
                stats.upcomingMaintenance.map((item) => (
                  <Link
                    key={item.id}
                    to={`/requests?id=${item.id}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all cursor-pointer border border-transparent hover:border-accent/20"
                  >
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{item.subject}</p>
                      <p className="text-sm text-muted-foreground truncate mt-0.5">
                        {item.equipment?.name || 'Unknown Equipment'}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-muted-foreground flex-shrink-0">
                      {item.scheduledDate
                        ? new Date(item.scheduledDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'Unscheduled'}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No upcoming maintenance scheduled
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions for different roles */}
      {hasRole('technician') && stats.activeRequests === 0 && (
        <Card className="border-info/20 bg-gradient-to-br from-info/5 to-info/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-info/20 flex items-center justify-center flex-shrink-0">
                <ClipboardList className="h-6 w-6 text-info" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">No Active Assignments</h3>
                <p className="text-muted-foreground mt-1">
                  You currently have no maintenance requests assigned to you. When a manager assigns work to you, it will appear here and in the requests page.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/requests">View All Requests</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/equipment">Browse Equipment</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {hasRole('technician') && stats.activeRequests > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" asChild className="hover:bg-primary hover:text-primary-foreground">
                <Link to="/requests?status=new">View New Requests</Link>
              </Button>
              <Button variant="outline" asChild className="hover:bg-primary hover:text-primary-foreground">
                <Link to="/requests?assigned=me">My Assignments</Link>
              </Button>
              <Button variant="outline" asChild className="hover:bg-primary hover:text-primary-foreground">
                <Link to="/calendar">Today's Schedule</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
