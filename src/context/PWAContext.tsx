import React, { createContext, useContext, useState, useEffect } from 'react';

interface PWAContextType {
  isInstalled: boolean;
  canInstall: boolean;
  showPopup: boolean;
  setShowPopup: (show: boolean) => void;
  promptInstall: () => Promise<boolean>;
  dismissPopup: () => void;
  markAsInstalled: () => void;
  resetInstallStatus: () => void;
  isIos: boolean;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);

  const isIos =
    typeof window !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as any).MSStream;

  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');
    const stored = localStorage.getItem('gamevault_pwa_installed') === 'true';
    return isStandalone || stored;
  });

  useEffect(() => {
    const checkInstalledStatus = async () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      const stored = localStorage.getItem('gamevault_pwa_installed') === 'true';

      if (isStandalone || stored) {
        setIsInstalled(true);
        return;
      }

      if ('getInstalledRelatedApps' in navigator) {
        try {
          const relatedApps = await (navigator as any).getInstalledRelatedApps();
          if (Array.isArray(relatedApps) && relatedApps.length > 0) {
            setIsInstalled(true);
            localStorage.setItem('gamevault_pwa_installed', 'true');
            return;
          }
        } catch {
          // ignore
        }
      }
    };

    checkInstalledStatus();

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // If not installed and not dismissed in this session, show popup after 2s delay
      const dismissed = sessionStorage.getItem('gamevault_install_popup_dismissed') === 'true';
      const storedInstalled = localStorage.getItem('gamevault_pwa_installed') === 'true';
      if (!dismissed && !storedInstalled) {
        setTimeout(() => {
          setShowPopup(true);
        }, 2000);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowPopup(false);
      localStorage.setItem('gamevault_pwa_installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Fallback timer: for browsers where beforeinstallprompt doesn't fire (Safari iOS, macOS, Firefox, or when already prompted)
    const timer = setTimeout(() => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      const storedInstalled = localStorage.getItem('gamevault_pwa_installed') === 'true';
      const dismissed = sessionStorage.getItem('gamevault_install_popup_dismissed') === 'true';

      if (!isStandalone && !storedInstalled && !dismissed) {
        setShowPopup(true);
      }
    }, 2500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        localStorage.setItem('gamevault_pwa_installed', 'true');
        setShowPopup(false);
        setDeferredPrompt(null);
        return true;
      }
    } catch {
      // ignore
    }
    setDeferredPrompt(null);
    return false;
  };

  const dismissPopup = () => {
    setShowPopup(false);
    sessionStorage.setItem('gamevault_install_popup_dismissed', 'true');
  };

  const markAsInstalled = () => {
    setIsInstalled(true);
    localStorage.setItem('gamevault_pwa_installed', 'true');
    setShowPopup(false);
  };

  const resetInstallStatus = () => {
    localStorage.removeItem('gamevault_pwa_installed');
    sessionStorage.removeItem('gamevault_install_popup_dismissed');
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);
    if (!isStandalone) {
      setShowPopup(true);
    }
  };

  return (
    <PWAContext.Provider
      value={{
        isInstalled,
        canInstall: !!deferredPrompt || isIos,
        showPopup: showPopup && !isInstalled,
        setShowPopup,
        promptInstall,
        dismissPopup,
        markAsInstalled,
        resetInstallStatus,
        isIos,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
};

export const usePWA = (): PWAContextType => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};
