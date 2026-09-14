import React, { useState, useRef, useEffect } from 'react';
import { useGames } from '../context/GameContext';
import { useGoals } from '../context/GoalContext';
import { useTheme } from '../context/ThemeContext';
import { storageService } from '../services/storageService';
import { notificationService } from '../services/notificationService';
import { downloadJsonFile, parseBackupFile } from '../utils/exportImport';
import { ExportDataPayload } from '../types';
import { usePWA } from '../context/PWAContext';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import {
  Download,
  Upload,
  Trash2,
  Check,
  AlertCircle,
  Sun,
  Moon,
  ShieldAlert,
  Database,
  Palette,
  Bell,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { games, refreshGames, clearAllGames } = useGames();
  const { goals, refreshGoals } = useGoals();
  const { theme, setTheme } = useTheme();
  const { isInstalled, promptInstall, resetInstallStatus, markAsInstalled, isIos } = usePWA();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [pendingImportPayload, setPendingImportPayload] = useState<ExportDataPayload | null>(null);

  // Notification state
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    return notificationService.getPermission();
  });

  const showNotify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleRequestNotification = async () => {
    const res = await notificationService.requestPermission();
    setPermission(res);
    if (res === 'granted') {
      showNotify('success', 'Web notifications enabled successfully!');
      notificationService.sendNotification('🎉 GameVault Notifications Enabled!', {
        body: 'You will now receive milestone reminders and deadline alerts directly in your browser.',
      });
    } else {
      showNotify('error', 'Notification permission was denied or dismissed.');
    }
  };

  const handleInstallPWA = async () => {
    if (isIos) {
      showNotify('success', 'To install on iOS: tap the Share button in Safari and select "Add to Home Screen".');
      return;
    }
    const success = await promptInstall();
    if (success) {
      showNotify('success', 'Thank you for installing GameVault!');
    } else {
      showNotify('success', 'To install: open your browser menu (⋮) and select "Install GameVault" or "Add to Home screen".');
    }
  };

  // Export
  const handleExport = () => {
    try {
      const payload = storageService.exportAll();
      const dateStr = new Date().toISOString().split('T')[0];
      downloadJsonFile(payload, `gamevault-backup-${dateStr}.json`);
      showNotify('success', 'Backup exported successfully!');
    } catch {
      showNotify('error', 'Failed to export library.');
    }
  };

  // Import file selected
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const payload = await parseBackupFile(file);
      setPendingImportPayload(payload);
    } catch (err: any) {
      showNotify('error', err.message || 'Invalid backup file format.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Confirm Import
  const handleConfirmImport = () => {
    if (!pendingImportPayload) return;

    const result = storageService.importAll(pendingImportPayload);
    if (result.success) {
      refreshGames();
      refreshGoals();
      if (pendingImportPayload.settings?.theme) {
        setTheme(pendingImportPayload.settings.theme);
      }
      showNotify('success', result.message);
    } else {
      showNotify('error', result.message);
    }
    setPendingImportPayload(null);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Settings & Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Configure notifications, PWA offline behavior, themes, and backups
        </p>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 border ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
          }`}
        >
          {notification.type === 'success' ? (
            <Check className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="text-sm font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Web Notifications & Reminders Section */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-500" />
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
              Web Notifications & Goal Reminders
            </h3>
          </div>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
              permission === 'granted'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : permission === 'denied'
                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
            }`}
          >
            {permission === 'granted' ? 'Enabled' : permission === 'denied' ? 'Blocked' : 'Not Enabled'}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Receive browser notifications for upcoming gaming goal deadlines and completion milestones directly on your desktop or mobile screen.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {permission !== 'granted' ? (
            <button
              type="button"
              onClick={handleRequestNotification}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/20 active:scale-95 transition-all"
            >
              <Bell className="w-4 h-4" />
              <span>Enable Web Notifications</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Notifications are active!</span>
            </div>
          )}
        </div>
      </div>

      {/* PWA Offline & Installation Section */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-accent-cyan" />
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
              Progressive Web App (PWA)
            </h3>
          </div>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
              isInstalled
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-cyan-500/15 text-cyan-700 dark:text-accent-cyan border border-cyan-500/30'
            }`}
          >
            {isInstalled ? 'Installed' : 'Ready to Install'}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          GameVault operates as an offline-first Progressive Web App. You can install it on your PC or mobile home screen to run in a dedicated borderless window with instant offline loading.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {isInstalled ? (
            <>
              <div className="inline-flex items-center gap-2.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/25 px-4 py-2.5 rounded-xl select-none pointer-events-none cursor-default">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>GameVault is installed on this device</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetInstallStatus();
                  showNotify('success', 'Installation status reset.');
                }}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline underline-offset-2 transition-colors cursor-pointer"
              >
                Recheck / Reset
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleInstallPWA}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-700 dark:text-accent-cyan border border-cyan-500/30 text-xs font-semibold transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Install GameVault App</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  markAsInstalled();
                  showNotify('success', 'Marked as installed!');
                }}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline underline-offset-2 transition-colors cursor-pointer"
              >
                Already installed?
              </button>
            </>
          )}
        </div>
      </div>

      {/* Appearance Section */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <Palette className="w-5 h-5 text-brand-500" />
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">Appearance</h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Interface Theme</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose your preferred visual appearance
            </p>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-dark-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 gap-1 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                theme === 'dark'
                  ? 'bg-brand-600 text-white shadow'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark (Obsidian)</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                theme === 'light'
                  ? 'bg-brand-600 text-white shadow'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Backup & Restore Section */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <Database className="w-5 h-5 text-cyan-600 dark:text-accent-cyan" />
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">Backup & Restore</h3>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Your games, playtime logs, notes, and goals are stored 100% locally in your browser.
          Export a JSON backup periodically to transfer your collection between devices or keep safe copies.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Export button */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-slate-200">Export Library Backup</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Download a JSON archive containing {games.length} games and {goals.length} goals.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="mt-4 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-700 dark:text-accent-cyan border border-cyan-500/30 text-xs font-semibold transition-colors active:scale-95 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* Import button */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-slate-200">Restore from Backup</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Upload a valid JSON backup file previously exported from GameVault.
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".json,application/json"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-brand-500/15 hover:bg-brand-500/25 text-brand-700 dark:text-brand-300 border border-brand-500/30 text-xs font-semibold transition-colors active:scale-95 shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Select Backup File...</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset & Danger Zone */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-rose-200 dark:border-rose-950/40 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">Danger Zone</h3>
        </div>

        <div className="space-y-4">
          {/* Wipe data */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-rose-500/5 dark:bg-dark-950 border border-rose-200 dark:border-rose-950/50">
            <div>
              <h4 className="font-display font-bold text-sm text-rose-700 dark:text-rose-300">Wipe All Local Data</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Permanently deletes all games, goals, and history from browser storage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600/15 hover:bg-rose-600/25 text-rose-700 dark:text-rose-400 border border-rose-500/30 text-xs font-semibold shrink-0 transition-colors active:scale-95 shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Everything</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmDialog
        isOpen={Boolean(pendingImportPayload)}
        onClose={() => setPendingImportPayload(null)}
        onConfirm={handleConfirmImport}
        title="Confirm Backup Import"
        message={`This backup contains ${pendingImportPayload?.games?.length || 0} games and ${
          pendingImportPayload?.goals?.length || 0
        } goals. Importing will replace your current library data. Would you like to proceed?`}
        confirmLabel="Import Backup"
        isDestructive={false}
      />

      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          clearAllGames();
          showNotify('success', 'All library data has been wiped.');
        }}
        title="Wipe Entire Library"
        message="This will permanently delete all stored games and goals from your browser. Are you absolutely certain?"
        confirmLabel="Permanently Wipe"
        isDestructive={true}
      />
    </div>
  );
};
