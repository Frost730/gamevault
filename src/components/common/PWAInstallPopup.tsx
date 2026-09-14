import React, { useState } from 'react';
import { usePWA } from '../../context/PWAContext';
import { Download, X, Smartphone, Share, CheckCircle2, Monitor } from 'lucide-react';

export const PWAInstallPopup: React.FC = () => {
  const { showPopup, promptInstall, dismissPopup, markAsInstalled, isIos } = usePWA();
  const [showManualGuide, setShowManualGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!showPopup) return null;

  const handleInstallClick = async () => {
    if (isIos) {
      setShowManualGuide(true);
      return;
    }

    const installed = await promptInstall();
    if (installed) {
      setInstallSuccess(true);
      setTimeout(() => {
        markAsInstalled();
      }, 2000);
    } else {
      // Browser didn't trigger prompt (e.g. desktop Chrome menu only or already prompted)
      setShowManualGuide(true);
    }
  };

  return (
    <div
      role="dialog"
      aria-label="Download and Install GameVault App"
      className="fixed z-50 bottom-20 lg:bottom-6 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-auto"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/95 dark:bg-dark-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-brand-500/10 dark:shadow-black/60 p-4 sm:p-5">
        {/* Accent top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-indigo-500 to-accent-cyan" />

        {/* Close 'X' Button */}
        <button
          type="button"
          onClick={dismissPopup}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Dismiss download popup"
        >
          <X className="w-4 h-4" />
        </button>

        {installSuccess ? (
          <div className="flex flex-col items-center justify-center py-4 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Successfully Installed!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              GameVault is ready to launch from your home screen or apps menu.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {/* Header: Icon + Titles */}
            <div className="flex items-start gap-3.5 pr-6">
              <div className="relative shrink-0 w-12 h-12 rounded-xl overflow-hidden shadow-md shadow-brand-500/20 bg-slate-950 flex items-center justify-center border border-slate-800">
                <img
                  src="./pwa-icon-192.png"
                  alt="GameVault App Icon"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to SVG if PNG fails
                    (e.target as HTMLImageElement).src = './icon.svg';
                  }}
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/25">
                    Fast & Offline
                  </span>
                </div>
                <h4 className="font-display font-bold text-base text-slate-900 dark:text-white leading-tight mt-1">
                  Download GameVault
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                  Get the dedicated web app for full-screen gaming, offline library access, and zero address-bar clutter.
                </p>
              </div>
            </div>

            {/* Quick Benefits list */}
            <div className="grid grid-cols-2 gap-2 py-1 border-y border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                <span>Fullscreen Window</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-accent-cyan shrink-0" />
                <span>Home Screen Icon</span>
              </div>
            </div>

            {/* Manual Instructions (if iOS or browser prompt blocked) */}
            {showManualGuide && (
              <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-dark-800/80 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 animate-in fade-in duration-200">
                {isIos ? (
                  <div className="flex items-start gap-2">
                    <Share className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Tap the <span className="font-semibold text-brand-600 dark:text-brand-400">Share</span> button in Safari, then scroll down and tap <span className="font-semibold text-slate-900 dark:text-white">"Add to Home Screen"</span>.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <Smartphone className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Open your browser menu (tap <strong>⋮</strong> or the install icon in the URL bar) and select <span className="font-semibold text-slate-900 dark:text-white">"Install GameVault"</span> or <span className="font-semibold text-slate-900 dark:text-white">"Add to Home screen"</span>.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-cyan hover:opacity-95 text-white font-semibold text-xs shadow-lg shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{showManualGuide ? 'View Instructions' : 'Install / Download App'}</span>
              </button>

              <button
                type="button"
                onClick={dismissPopup}
                className="px-3 py-2.5 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                Later
              </button>
            </div>

            {/* Mark as already installed option */}
            <div className="text-center pt-0.5">
              <button
                type="button"
                onClick={markAsInstalled}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline underline-offset-2 transition-colors cursor-pointer"
              >
                Already installed on this device?
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
