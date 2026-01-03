import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Download, Trash2, Save, Palette } from 'lucide-react';
import { getUserSettings, updateUserSettings, exportUserData, deleteAccount } from '@/api/settings';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/components/ui/theme-provider';

export function Settings() {
  const [settings, setSettings] = useState<Record<string, unknown> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const loadSettings = useCallback(async () => {
    try {
      const data = await getUserSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load settings',
        variant: 'destructive',
      });
    }
  }, [toast]);

  React.useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await updateUserSettings(settings);
      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      await exportUserData();
      toast({
        title: 'Success',
        description: 'Your data has been exported',
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Error',
        description: 'Failed to export data',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      logout();
      navigate('/login');
      toast({
        title: 'Success',
        description: 'Your account has been deleted',
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete account',
        variant: 'destructive',
      });
    }
  };

  if (!settings) {
    return <div className="text-center py-8">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and trading preferences</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  disabled
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Change Password</Label>
                <Input id="password" type="password" placeholder="New password" />
              </div>

              <Button onClick={handleSaveSettings} disabled={isSaving} className="gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme Preferences
              </CardTitle>
              <CardDescription>Customize the appearance of your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'light' ? 'border-blue-600 bg-blue-50 dark:bg-blue-950' : 'border-border hover:border-blue-400'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="w-full h-16 bg-white border rounded flex items-center justify-center">
                      <div className="text-xs font-medium text-slate-900">Light</div>
                    </div>
                    <p className="text-sm font-medium text-center">Light</p>
                  </div>
                </button>

                <button
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'dark' ? 'border-blue-600 bg-blue-50 dark:bg-blue-950' : 'border-border hover:border-blue-400'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="w-full h-16 bg-slate-900 border rounded flex items-center justify-center">
                      <div className="text-xs font-medium text-white">Dark</div>
                    </div>
                    <p className="text-sm font-medium text-center">Dark</p>
                  </div>
                </button>

                <button
                  onClick={() => setTheme('system')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'system' ? 'border-blue-600 bg-blue-50 dark:bg-blue-950' : 'border-border hover:border-blue-400'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="w-full h-16 border rounded flex">
                      <div className="w-1/2 bg-white flex items-center justify-center">
                        <div className="text-xs font-medium text-slate-900">L</div>
                      </div>
                      <div className="w-1/2 bg-slate-900 flex items-center justify-center">
                        <div className="text-xs font-medium text-white">D</div>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-center">System</p>
                  </div>
                </button>

                <button
                  onClick={() => setTheme('blue')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'blue' ? 'border-blue-600 bg-blue-50 dark:bg-blue-950' : 'border-border hover:border-blue-400'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="w-full h-16 bg-blue-100 border border-blue-300 rounded flex items-center justify-center">
                      <div className="text-xs font-medium text-blue-900">Blue</div>
                    </div>
                    <p className="text-sm font-medium text-center">Blue</p>
                  </div>
                </button>

                <button
                  onClick={() => setTheme('purple')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'purple' ? 'border-blue-600 bg-blue-50 dark:bg-blue-950' : 'border-border hover:border-blue-400'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="w-full h-16 bg-purple-100 border border-purple-300 rounded flex items-center justify-center">
                      <div className="text-xs font-medium text-purple-900">Purple</div>
                    </div>
                    <p className="text-sm font-medium text-center">Purple</p>
                  </div>
                </button>

                <button
                  onClick={() => setTheme('green')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'green' ? 'border-blue-600 bg-blue-50 dark:bg-blue-950' : 'border-border hover:border-blue-400'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="w-full h-16 bg-green-100 border border-green-300 rounded flex items-center justify-center">
                      <div className="text-xs font-medium text-green-900">Green</div>
                    </div>
                    <p className="text-sm font-medium text-center">Green</p>
                  </div>
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Theme changes are saved automatically and applied across all your devices.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg border-rose-200 dark:border-rose-800">
            <CardHeader>
              <CardTitle className="text-rose-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All your data will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex gap-2 justify-end">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-rose-600 hover:bg-rose-700">
                      Delete
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trading Preferences */}
        <TabsContent value="trading" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Trading Preferences</CardTitle>
              <CardDescription>Configure your default trading settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="accountSize">Account Size ($)</Label>
                  <Input
                    id="accountSize"
                    type="number"
                    value={settings.accountSize}
                    onChange={(e) => setSettings({ ...settings, accountSize: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultLotSize">Default Lot Size</Label>
                  <Input
                    id="defaultLotSize"
                    type="number"
                    step="0.1"
                    value={settings.defaultLotSize}
                    onChange={(e) => setSettings({ ...settings, defaultLotSize: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => setSettings({ ...settings, timezone: value })}>
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">EST</SelectItem>
                      <SelectItem value="CST">CST</SelectItem>
                      <SelectItem value="MST">MST</SelectItem>
                      <SelectItem value="PST">PST</SelectItem>
                      <SelectItem value="GMT">GMT</SelectItem>
                      <SelectItem value="CET">CET</SelectItem>
                      <SelectItem value="JST">JST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select value={settings.currency} onValueChange={(value) => setSettings({ ...settings, currency: value })}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="JPY">JPY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultPairs">Default Trading Pairs (comma-separated)</Label>
                <Textarea
                  id="defaultPairs"
                  value={settings.defaultPairs?.join(', ')}
                  onChange={(e) => setSettings({ ...settings, defaultPairs: e.target.value.split(',').map((p) => p.trim()) })}
                  rows={4}
                />
              </div>

              <Button onClick={handleSaveSettings} disabled={isSaving} className="gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Milestone Notifications</p>
                    <p className="text-sm text-muted-foreground">Get notified when you reach trading milestones</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Daily Summary</p>
                    <p className="text-sm text-muted-foreground">Receive daily trading summary emails</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Weekly Report</p>
                    <p className="text-sm text-muted-foreground">Receive weekly performance reports</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
              </div>

              <Button onClick={handleSaveSettings} disabled={isSaving} className="gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data & Privacy */}
        <TabsContent value="data" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>Manage your data and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                  <p className="font-medium mb-2">Export Your Data</p>
                  <p className="text-sm text-muted-foreground mb-4">Download all your trading data as JSON or CSV</p>
                  <Button onClick={handleExportData} variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export Data
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-muted">
                  <p className="font-medium mb-2">Privacy Policy</p>
                  <p className="text-sm text-muted-foreground mb-4">Read our privacy policy to understand how we handle your data</p>
                  <Button variant="outline">Read Privacy Policy</Button>
                </div>

                <div className="p-4 rounded-lg bg-muted">
                  <p className="font-medium mb-2">Terms of Service</p>
                  <p className="text-sm text-muted-foreground mb-4">Review our terms of service</p>
                  <Button variant="outline">Read Terms</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}