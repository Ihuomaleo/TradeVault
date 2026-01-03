import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createTrade, updateTrade } from '@/api/trades';
import { useToast } from '@/hooks/useToast';
import { X } from 'lucide-react';
import { ScreenshotUpload } from '@/components/ScreenshotUpload';

const tradeSchema = z.object({
  pair: z.string().min(1, 'Pair is required'),
  direction: z.enum(['LONG', 'SHORT']),
  entryPrice: z.number().positive('Entry price must be positive'),
  exitPrice: z.number().positive('Exit price must be positive').optional(),
  stopLoss: z.number().positive('Stop loss must be positive'),
  takeProfit: z.number().positive('Take profit must be positive').optional(),
  lotSize: z.number().positive('Lot size must be positive'),
  commission: z.number().min(0, 'Commission cannot be negative').default(0),
  entryTime: z.string(),
  setupTags: z.array(z.string()).default([]),
  emotionTags: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

type TradeFormData = z.infer<typeof tradeSchema>;

const SETUP_TAGS = ['Breakout', 'FVG', 'Support/Resistance', 'Trend Following', 'Scalp', 'News Trade'];
const EMOTION_TAGS = ['Disciplined', 'FOMO', 'Greedy', 'Fearful', 'Confident', 'Hesitant'];

interface TradeFormPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTrade?: Record<string, unknown>;
  onTradeAdded: () => void;
}

export function TradeFormPanel({ open, onOpenChange, editingTrade, onTradeAdded }: TradeFormPanelProps) {
  const [selectedSetupTags, setSelectedSetupTags] = useState<string[]>([]);
  const [selectedEmotionTags, setSelectedEmotionTags] = useState<string[]>([]);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<TradeFormData>({
    resolver: zodResolver(tradeSchema),
    defaultValues: {
      entryTime: new Date().toISOString().slice(0, 16),
      commission: 0,
      setupTags: [],
      emotionTags: [],
    },
  });

  useEffect(() => {
    if (editingTrade) {
      reset({
        pair: editingTrade.pair,
        direction: editingTrade.direction,
        entryPrice: editingTrade.entryPrice,
        exitPrice: editingTrade.exitPrice,
        stopLoss: editingTrade.stopLoss,
        takeProfit: editingTrade.takeProfit,
        lotSize: editingTrade.lotSize,
        commission: editingTrade.commission,
        entryTime: editingTrade.entryTime,
        setupTags: editingTrade.setupTags,
        emotionTags: editingTrade.emotionTags,
        notes: editingTrade.notes,
      });
      setSelectedSetupTags(editingTrade.setupTags || []);
      setSelectedEmotionTags(editingTrade.emotionTags || []);
      setScreenshots(editingTrade.screenshots || []);
    } else {
      reset({
        entryTime: new Date().toISOString().slice(0, 16),
        commission: 0,
        setupTags: [],
        emotionTags: [],
      });
      setSelectedSetupTags([]);
      setSelectedEmotionTags([]);
      setScreenshots([]);
    }
  }, [editingTrade, open, reset]);

  const entryPrice = watch('entryPrice');
  const exitPrice = watch('exitPrice');
  const stopLoss = watch('stopLoss');
  const takeProfit = watch('takeProfit');
  const lotSize = watch('lotSize');
  const direction = watch('direction');
  const commission = watch('commission');

  // Calculate values
  const pipValue = 0.0001; // Standard pip value for most pairs
  const pnl =
    exitPrice && direction === 'LONG'
      ? (exitPrice - entryPrice) * lotSize * (1 / pipValue) - commission
      : exitPrice && direction === 'SHORT'
        ? (entryPrice - exitPrice) * lotSize * (1 / pipValue) - commission
        : 0;

  const pipGain =
    exitPrice && direction === 'LONG'
      ? (exitPrice - entryPrice) * 10000
      : exitPrice && direction === 'SHORT'
        ? (entryPrice - exitPrice) * 10000
        : 0;

  const rMultiple =
    stopLoss && takeProfit && direction === 'LONG'
      ? (takeProfit - entryPrice) / (entryPrice - stopLoss)
      : stopLoss && takeProfit && direction === 'SHORT'
        ? (entryPrice - takeProfit) / (stopLoss - entryPrice)
        : 0;

  const riskAmount =
    stopLoss && direction === 'LONG'
      ? (entryPrice - stopLoss) * lotSize * (1 / pipValue)
      : stopLoss && direction === 'SHORT'
        ? (stopLoss - entryPrice) * lotSize * (1 / pipValue)
        : 0;

  const rewardAmount =
    takeProfit && direction === 'LONG'
      ? (takeProfit - entryPrice) * lotSize * (1 / pipValue)
      : takeProfit && direction === 'SHORT'
        ? (entryPrice - takeProfit) * lotSize * (1 / pipValue)
        : 0;

  const onSubmit = async (data: TradeFormData) => {
    setIsSubmitting(true);
    try {
      const tradeData = {
        ...data,
        setupTags: selectedSetupTags,
        emotionTags: selectedEmotionTags,
        screenshots: screenshots,
      };

      if (editingTrade) {
        await updateTrade(editingTrade._id, tradeData);
        toast({
          title: 'Success',
          description: 'Trade updated successfully',
        });
      } else {
        await createTrade(tradeData);
        toast({
          title: 'Success',
          description: 'Trade created successfully',
        });
      }

      onTradeAdded();
      onOpenChange(false);
      reset();
      setSelectedSetupTags([]);
      setSelectedEmotionTags([]);
      setScreenshots([]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save trade';
      console.error('Error saving trade:', error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{editingTrade ? 'Edit Trade' : 'New Trade'}</SheetTitle>
          <SheetDescription>Log a new trade or edit an existing one</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Trade Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pair">Trading Pair *</Label>
                <Controller
                  name="pair"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pair" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR/USD">EUR/USD</SelectItem>
                        <SelectItem value="GBP/USD">GBP/USD</SelectItem>
                        <SelectItem value="USD/JPY">USD/JPY</SelectItem>
                        <SelectItem value="USD/CHF">USD/CHF</SelectItem>
                        <SelectItem value="AUD/USD">AUD/USD</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.pair && <p className="text-xs text-rose-600">{errors.pair.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="direction">Direction *</Label>
                <Controller
                  name="direction"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LONG">Long</SelectItem>
                        <SelectItem value="SHORT">Short</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.direction && <p className="text-xs text-rose-600">{errors.direction.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entryPrice">Entry Price *</Label>
                <Input
                  id="entryPrice"
                  type="number"
                  step="0.00001"
                  placeholder="1.0500"
                  {...register('entryPrice', { valueAsNumber: true })}
                />
                {errors.entryPrice && <p className="text-xs text-rose-600">{errors.entryPrice.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="exitPrice">Exit Price</Label>
                <Input
                  id="exitPrice"
                  type="number"
                  step="0.00001"
                  placeholder="1.0550"
                  {...register('exitPrice', { valueAsNumber: true })}
                />
                {errors.exitPrice && <p className="text-xs text-rose-600">{errors.exitPrice.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stopLoss">Stop Loss *</Label>
                <Input
                  id="stopLoss"
                  type="number"
                  step="0.00001"
                  placeholder="1.0450"
                  {...register('stopLoss', { valueAsNumber: true })}
                />
                {errors.stopLoss && <p className="text-xs text-rose-600">{errors.stopLoss.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="takeProfit">Take Profit</Label>
                <Input
                  id="takeProfit"
                  type="number"
                  step="0.00001"
                  placeholder="1.0600"
                  {...register('takeProfit', { valueAsNumber: true })}
                />
                {errors.takeProfit && <p className="text-xs text-rose-600">{errors.takeProfit.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lotSize">Lot Size *</Label>
                <Input
                  id="lotSize"
                  type="number"
                  step="0.1"
                  placeholder="1.0"
                  {...register('lotSize', { valueAsNumber: true })}
                />
                {errors.lotSize && <p className="text-xs text-rose-600">{errors.lotSize.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="commission">Commission</Label>
                <Input
                  id="commission"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  {...register('commission', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entryTime">Entry Time *</Label>
              <Input id="entryTime" type="datetime-local" {...register('entryTime')} />
            </div>
          </div>

          {/* Trade Summary */}
          {exitPrice && (
            <Card className="border-0 bg-muted">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Trade Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Net P/L:</span>
                  <span className={`font-bold ${pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>${pnl.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pip Gain/Loss:</span>
                  <span className={`font-bold ${pipGain >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {pipGain >= 0 ? '+' : ''}{pipGain.toFixed(1)} pips
                  </span>
                </div>
                {rMultiple > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">R-Multiple:</span>
                    <span className="font-bold">1:{rMultiple.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk Amount:</span>
                  <span className="font-bold text-rose-600">${riskAmount.toFixed(2)}</span>
                </div>
                {rewardAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reward Amount:</span>
                    <span className="font-bold text-emerald-600">${rewardAmount.toFixed(2)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="font-semibold">Tags</h3>

            <div className="space-y-2">
              <Label>Setup Tags</Label>
              <div className="flex flex-wrap gap-2">
                {SETUP_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedSetupTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedSetupTags((prev) =>
                        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                      );
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Emotion Tags</Label>
              <div className="flex flex-wrap gap-2">
                {EMOTION_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedEmotionTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedEmotionTags((prev) =>
                        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                      );
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Add any notes about this trade..." {...register('notes')} rows={4} />
          </div>

          {/* Screenshots */}
          <ScreenshotUpload screenshots={screenshots} onChange={setScreenshots} />

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Saving...' : editingTrade ? 'Update Trade' : 'Save Trade'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}