import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';
import { getDashboardStats, getEquityCurveData, getRecentTrades } from '@/api/trades';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Toggle } from '@/components/ui/toggle';
import { TradeFormPanel } from '@/components/TradeFormPanel';
import { FloatingActionButton } from '@/components/FloatingActionButton';

export function Dashboard() {
  const [filterMistakes, setFilterMistakes] = useState(false);
  const [stats, setStats] = React.useState<any>(null);
  const [equityData, setEquityData] = React.useState<any[]>([]);
  const [recentTrades, setRecentTrades] = React.useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const statsData = await getDashboardStats(filterMistakes);
        const equityData = await getEquityCurveData(filterMistakes);
        const tradesData = await getRecentTrades();
        
        setStats(statsData);
        setEquityData(equityData);
        setRecentTrades(tradesData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadData();
  }, [filterMistakes]);

  if (!stats) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your trading overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter Mistakes</span>
          <Toggle
            pressed={filterMistakes}
            onPressedChange={setFilterMistakes}
            className="data-[state=on]:bg-emerald-500 data-[state=on]:text-white"
          >
            {filterMistakes ? 'ON' : 'OFF'}
          </Toggle>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total P/L"
          value={`$${stats.totalPL.toFixed(2)}`}
          icon={stats.totalPL >= 0 ? TrendingUp : TrendingDown}
          color={stats.totalPL >= 0 ? 'text-emerald-500' : 'text-rose-500'}
          subtext={`${stats.totalPL >= 0 ? '+' : ''}${((stats.totalPL / stats.accountSize) * 100).toFixed(2)}%`}
        />
        <StatCard
          title="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          icon={Target}
          color="text-blue-500"
          subtext={`${stats.wins}W / ${stats.losses}L`}
        />
        <StatCard
          title="Profit Factor"
          value={stats.profitFactor.toFixed(2)}
          icon={Zap}
          color="text-amber-500"
          subtext="Gross Profit / Gross Loss"
        />
        <StatCard
          title="Expectancy"
          value={`$${stats.expectancy.toFixed(2)}`}
          icon={TrendingUp}
          color={stats.expectancy >= 0 ? 'text-emerald-500' : 'text-rose-500'}
          subtext="Per trade average"
        />
      </div>

      {/* Equity Curve */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Equity Curve</CardTitle>
          <CardDescription>
            {filterMistakes ? 'Equity curve without emotional trades' : 'Your account balance over time'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={equityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke={equityData[equityData.length - 1]?.balance >= equityData[0]?.balance ? '#10b981' : '#ef4444'}
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Trades */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
          <CardDescription>Your last 5 closed trades</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pair</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Entry</TableHead>
                <TableHead>Exit</TableHead>
                <TableHead>P/L</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTrades.map((trade) => (
                <TableRow key={trade._id} className="hover:bg-muted/50 cursor-pointer">
                  <TableCell>
                    <Badge variant="outline">{trade.pair}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={trade.direction === 'LONG' ? 'default' : 'secondary'}>
                      {trade.direction}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">{trade.entryPrice.toFixed(5)}</TableCell>
                  <TableCell className="font-mono">{trade.exitPrice?.toFixed(5) || '-'}</TableCell>
                  <TableCell className={`font-bold ${trade.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    ${trade.pnl.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={trade.status === 'CLOSED' ? 'default' : 'outline'}>
                      {trade.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Trade Form Panel */}
      <TradeFormPanel
        open={showForm}
        onOpenChange={setShowForm}
        onTradeAdded={() => {
          // Reload data
        }}
      />

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setShowForm(true)} />
    </div>
  );
}