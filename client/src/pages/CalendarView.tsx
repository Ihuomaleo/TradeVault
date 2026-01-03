import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCalendarData, getDayTrades } from '@/api/trades';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<Record<string, unknown> | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [dayTrades, setDayTrades] = useState<Record<string, unknown>[]>([]);
  const [showDayPanel, setShowDayPanel] = useState(false);

  const loadCalendarData = useCallback(async () => {
    try {
      const data = await getCalendarData(currentDate.getFullYear(), currentDate.getMonth() + 1);
      setCalendarData(data);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    }
  }, [currentDate]);

  React.useEffect(() => {
    loadCalendarData();
  }, [currentDate, loadCalendarData]);

  const handleDayClick = async (day: number) => {
    try {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const trades = await getDayTrades(date);
      setDayTrades(trades);
      setSelectedDay(day);
      setShowDayPanel(true);
    } catch (error) {
      console.error('Error loading day trades:', error);
    }
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  if (!calendarData) {
    return <div className="text-center py-8">Loading calendar...</div>;
  }

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getDayData = (day: number) => {
    return calendarData.days[day] || { pnl: 0, trades: 0, status: 'none' };
  };

  const getDayColor = (status: string) => {
    switch (status) {
      case 'profit':
        return 'bg-emerald-100 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700';
      case 'loss':
        return 'bg-rose-100 dark:bg-rose-900 border-rose-300 dark:border-rose-700';
      default:
        return 'bg-muted border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Calendar View</h1>
        <p className="text-muted-foreground mt-1">Track your daily trading performance</p>
      </div>

      {/* Calendar Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{monthName}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dayData = getDayData(day);
              const isSelected = selectedDay === day;

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`aspect-square p-2 rounded-lg border-2 transition-all hover:shadow-md ${getDayColor(dayData.status)} ${
                    isSelected ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="text-sm font-semibold">{day}</div>
                  {dayData.trades > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      <div>{dayData.trades} trades</div>
                      <div className={dayData.pnl >= 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                        ${dayData.pnl.toFixed(0)}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-emerald-100 dark:bg-emerald-900 border-2 border-emerald-300 dark:border-emerald-700" />
              <span className="text-sm">Profitable Day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-rose-100 dark:bg-rose-900 border-2 border-rose-300 dark:border-rose-700" />
              <span className="text-sm">Loss Day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted border-2 border-border" />
              <span className="text-sm">No Trades</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day Trades Panel */}
      <Sheet open={showDayPanel} onOpenChange={setShowDayPanel}>
        <SheetContent className="w-full sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>
              {selectedDay && new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay).toLocaleDateString()}
            </SheetTitle>
            <SheetDescription>Trades for this day</SheetDescription>
          </SheetHeader>

          {dayTrades.length > 0 ? (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground">Total Trades</p>
                  <p className="text-xl font-bold">{dayTrades.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950">
                  <p className="text-xs text-muted-foreground">Wins</p>
                  <p className="text-xl font-bold text-emerald-600">{dayTrades.filter((t) => t.pnl > 0).length}</p>
                </div>
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950">
                  <p className="text-xs text-muted-foreground">Losses</p>
                  <p className="text-xl font-bold text-rose-600">{dayTrades.filter((t) => t.pnl < 0).length}</p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pair</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Entry</TableHead>
                    <TableHead>Exit</TableHead>
                    <TableHead>P/L</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dayTrades.map((trade) => (
                    <TableRow key={trade._id}>
                      <TableCell>
                        <Badge variant="outline">{trade.pair}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={trade.direction === 'LONG' ? 'default' : 'secondary'}>
                          {trade.direction}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{trade.entryPrice.toFixed(5)}</TableCell>
                      <TableCell className="font-mono text-sm">{trade.exitPrice?.toFixed(5) || '-'}</TableCell>
                      <TableCell className={`font-bold ${trade.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        ${trade.pnl.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="mt-6 text-center py-8 text-muted-foreground">No trades for this day</div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}