import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  getStrategyPerformance,
  getEmotionAnalysis,
  getSessionAnalysis,
  getPairPerformance,
} from '@/api/analytics';

export function StrategyAnalytics() {
  const [strategyData, setStrategyData] = useState<any>(null);
  const [emotionData, setEmotionData] = useState<any>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [pairData, setPairData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'winRate' | 'pnl'>('winRate');

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const strategy = await getStrategyPerformance();
        const emotion = await getEmotionAnalysis();
        const session = await getSessionAnalysis();
        const pair = await getPairPerformance();

        setStrategyData(strategy);
        setEmotionData(emotion);
        setSessionData(session);
        setPairData(pair);
      } catch (error) {
        console.error('Error loading analytics:', error);
      }
    };

    loadData();
  }, []);

  if (!strategyData || !emotionData || !sessionData || !pairData) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  const StatBox = ({ label, value, color }: any) => (
    <div className="p-4 rounded-lg bg-muted">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Strategy Analytics</h1>
        <p className="text-muted-foreground mt-1">Analyze your trading performance and patterns</p>
      </div>

      {/* Strategy Performance */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Strategy Performance by Setup</CardTitle>
              <CardDescription>Win rate and profitability by trading setup</CardDescription>
            </div>
            <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
              <TabsList>
                <TabsTrigger value="winRate">Win Rate</TabsTrigger>
                <TabsTrigger value="pnl">P/L</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={strategyData.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="setup" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar
                dataKey={viewMode === 'winRate' ? 'winRate' : 'pnl'}
                fill={viewMode === 'winRate' ? '#3b82f6' : '#10b981'}
              />
            </BarChart>
          </ResponsiveContainer>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Setup</TableHead>
                <TableHead>Trades</TableHead>
                <TableHead>Win Rate</TableHead>
                <TableHead>Profit Factor</TableHead>
                <TableHead>Avg Win</TableHead>
                <TableHead>Avg Loss</TableHead>
                <TableHead>Total P/L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {strategyData.tableData.map((row: any) => (
                <TableRow key={row.setup}>
                  <TableCell className="font-medium">{row.setup}</TableCell>
                  <TableCell>{row.trades}</TableCell>
                  <TableCell className="text-blue-600 font-semibold">{row.winRate.toFixed(1)}%</TableCell>
                  <TableCell>{row.profitFactor.toFixed(2)}</TableCell>
                  <TableCell className="text-emerald-600">${row.avgWin.toFixed(2)}</TableCell>
                  <TableCell className="text-rose-600">${row.avgLoss.toFixed(2)}</TableCell>
                  <TableCell className={`font-bold ${row.totalPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    ${row.totalPnl.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Emotion Impact */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Emotion Impact Analysis</CardTitle>
          <CardDescription>How your emotions affect trading performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={emotionData.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="emotion" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="winRate" fill="#3b82f6" name="Win Rate %" />
              <Bar dataKey="avgPnl" fill="#10b981" name="Avg P/L" />
            </BarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950">
              <p className="text-sm text-muted-foreground">Best Emotion</p>
              <p className="text-xl font-bold text-emerald-600">{emotionData.bestEmotion}</p>
              <p className="text-xs text-muted-foreground mt-1">{emotionData.bestEmotionWinRate.toFixed(1)}% win rate</p>
            </div>
            <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950">
              <p className="text-sm text-muted-foreground">Worst Emotion</p>
              <p className="text-xl font-bold text-rose-600">{emotionData.worstEmotion}</p>
              <p className="text-xs text-muted-foreground mt-1">{emotionData.worstEmotionWinRate.toFixed(1)}% win rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Analysis */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Trading Session Analysis</CardTitle>
          <CardDescription>Performance by trading session (based on your timezone)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sessionData.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="session" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="pnl" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session</TableHead>
                <TableHead>Trades</TableHead>
                <TableHead>Win Rate</TableHead>
                <TableHead>Avg Win</TableHead>
                <TableHead>Avg Loss</TableHead>
                <TableHead>Total P/L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessionData.tableData.map((row: any) => (
                <TableRow key={row.session}>
                  <TableCell className="font-medium">{row.session}</TableCell>
                  <TableCell>{row.trades}</TableCell>
                  <TableCell className="text-blue-600 font-semibold">{row.winRate.toFixed(1)}%</TableCell>
                  <TableCell className="text-emerald-600">${row.avgWin.toFixed(2)}</TableCell>
                  <TableCell className="text-rose-600">${row.avgLoss.toFixed(2)}</TableCell>
                  <TableCell className={`font-bold ${row.totalPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    ${row.totalPnl.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Expectancy */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardHeader>
          <CardTitle>Expectancy Value</CardTitle>
          <CardDescription>Your average expected profit per trade</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className={`text-5xl font-bold ${strategyData.expectancy >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ${strategyData.expectancy.toFixed(2)}
            </p>
            <p className="text-muted-foreground mt-2">
              {strategyData.expectancy >= 0
                ? 'Your strategy has a positive expectancy. Keep trading with discipline!'
                : 'Your strategy has a negative expectancy. Consider reviewing your approach.'}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4">
            <StatBox label="Win Rate" value={`${strategyData.winRate.toFixed(1)}%`} color="text-blue-600" />
            <StatBox label="Avg Win" value={`$${strategyData.avgWin.toFixed(2)}`} color="text-emerald-600" />
            <StatBox label="Avg Loss" value={`$${strategyData.avgLoss.toFixed(2)}`} color="text-rose-600" />
          </div>
        </CardContent>
      </Card>

      {/* Pair Performance */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Pair Performance</CardTitle>
          <CardDescription>Statistics for each trading pair</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pair</TableHead>
                <TableHead>Trades</TableHead>
                <TableHead>Win Rate</TableHead>
                <TableHead>Profit Factor</TableHead>
                <TableHead>Total P/L</TableHead>
                <TableHead>Avg Win</TableHead>
                <TableHead>Avg Loss</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pairData.map((row: any) => (
                <TableRow key={row.pair}>
                  <TableCell>
                    <Badge variant="outline">{row.pair}</Badge>
                  </TableCell>
                  <TableCell>{row.trades}</TableCell>
                  <TableCell className="text-blue-600 font-semibold">{row.winRate.toFixed(1)}%</TableCell>
                  <TableCell>{row.profitFactor.toFixed(2)}</TableCell>
                  <TableCell className={`font-bold ${row.totalPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    ${row.totalPnl.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-emerald-600">${row.avgWin.toFixed(2)}</TableCell>
                  <TableCell className="text-rose-600">${row.avgLoss.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}