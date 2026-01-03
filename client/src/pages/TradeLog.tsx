import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Download, Trash2, Edit2 } from 'lucide-react';
import { getAllTrades, deleteTrade } from '@/api/trades';
import { TradeFormPanel } from '@/components/TradeFormPanel';
import { useToast } from '@/hooks/useToast';

export function TradeLog() {
  const [trades, setTrades] = useState<any[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<any[]>([]);
  const [selectedTrades, setSelectedTrades] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editingTrade, setEditingTrade] = useState<any>(null);
  const [filters, setFilters] = useState({
    pair: '',
    direction: '',
    status: '',
    searchTerm: '',
  });
  const { toast } = useToast();

  React.useEffect(() => {
    loadTrades();
  }, []);

  React.useEffect(() => {
    applyFilters();
  }, [trades, filters]);

  const loadTrades = async () => {
    try {
      const data = await getAllTrades();
      setTrades(data);
    } catch (error) {
      console.error('Error loading trades:', error);
      toast({
        title: 'Error',
        description: 'Failed to load trades',
        variant: 'destructive',
      });
    }
  };

  const applyFilters = () => {
    let filtered = trades;

    if (filters.pair) {
      filtered = filtered.filter((t) => t.pair === filters.pair);
    }
    if (filters.direction) {
      filtered = filtered.filter((t) => t.direction === filters.direction);
    }
    if (filters.status) {
      filtered = filtered.filter((t) => t.status === filters.status);
    }
    if (filters.searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.pair.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          t.notes?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    setFilteredTrades(filtered);
  };

  const handleDeleteTrade = async (tradeId: string) => {
    try {
      await deleteTrade(tradeId);
      setTrades(trades.filter((t) => t._id !== tradeId));
      toast({
        title: 'Success',
        description: 'Trade deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting trade:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete trade',
        variant: 'destructive',
      });
    }
  };

  const handleSelectTrade = (tradeId: string) => {
    const newSelected = new Set(selectedTrades);
    if (newSelected.has(tradeId)) {
      newSelected.delete(tradeId);
    } else {
      newSelected.add(tradeId);
    }
    setSelectedTrades(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTrades.size === filteredTrades.length) {
      setSelectedTrades(new Set());
    } else {
      setSelectedTrades(new Set(filteredTrades.map((t) => t._id)));
    }
  };

  const handleExport = () => {
    const dataToExport = selectedTrades.size > 0
      ? filteredTrades.filter((t) => selectedTrades.has(t._id))
      : filteredTrades;

    const csv = [
      ['Date', 'Pair', 'Direction', 'Entry', 'Exit', 'P/L', 'Status', 'Setup Tags', 'Emotion Tags'],
      ...dataToExport.map((t) => [
        t.entryTime,
        t.pair,
        t.direction,
        t.entryPrice,
        t.exitPrice || '-',
        t.pnl,
        t.status,
        t.setupTags?.join(', ') || '',
        t.emotionTags?.join(', ') || '',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trades-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const uniquePairs = Array.from(new Set(trades.map((t) => t.pair)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trade Log</h1>
          <p className="text-muted-foreground mt-1">View and manage all your trades</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Trade
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Search trades..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            />
            <Select value={filters.pair} onValueChange={(value) => setFilters({ ...filters, pair: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All Pairs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Pairs</SelectItem>
                {uniquePairs.map((pair) => (
                  <SelectItem key={pair} value={pair}>
                    {pair}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.direction} onValueChange={(value) => setFilters({ ...filters, direction: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All Directions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Directions</SelectItem>
                <SelectItem value="LONG">Long</SelectItem>
                <SelectItem value="SHORT">Short</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedTrades.size > 0 && (
        <Card className="border-0 shadow-lg bg-blue-50 dark:bg-blue-950">
          <CardContent className="pt-6 flex items-center justify-between">
            <span className="text-sm font-medium">{selectedTrades.size} trades selected</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  selectedTrades.forEach((id) => handleDeleteTrade(id));
                  setSelectedTrades(new Set());
                }}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trades Table */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedTrades.size === filteredTrades.length && filteredTrades.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Pair</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Entry</TableHead>
                <TableHead>Exit</TableHead>
                <TableHead>P/L</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrades.map((trade) => (
                <TableRow key={trade._id} className="hover:bg-muted/50">
                  <TableCell>
                    <Checkbox
                      checked={selectedTrades.has(trade._id)}
                      onCheckedChange={() => handleSelectTrade(trade._id)}
                    />
                  </TableCell>
                  <TableCell className="text-sm">{new Date(trade.entryTime).toLocaleDateString()}</TableCell>
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
                  <TableCell>
                    <Badge variant={trade.status === 'CLOSED' ? 'default' : 'outline'}>
                      {trade.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingTrade(trade);
                          setShowForm(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTrade(trade._id)}
                        className="text-rose-600 hover:text-rose-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
        editingTrade={editingTrade}
        onTradeAdded={() => {
          loadTrades();
          setEditingTrade(null);
        }}
      />
    </div>
  );
}