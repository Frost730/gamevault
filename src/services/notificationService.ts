import { Goal } from '../types';

class NotificationService {
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  async sendNotification(title: string, options?: NotificationOptions): Promise<boolean> {
    if (!this.isSupported()) return false;

    if (Notification.permission !== 'granted') {
      const permission = await this.requestPermission();
      if (permission !== 'granted') return false;
    }

    try {
      const defaultOptions: NotificationOptions = {
        icon: './icon.svg',
        badge: './icon.svg',
        ...options,
      };

      // Try service worker registration first for mobile PWA support
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg && reg.showNotification) {
          await reg.showNotification(title, defaultOptions);
          return true;
        }
      }

      // Fallback to desktop window Notification
      new Notification(title, defaultOptions);
      return true;
    } catch (error) {
      console.error('Failed to display notification:', error);
      return false;
    }
  }

  /**
   * Check for goals that are due soon (within 3 days) or overdue and send a friendly notification
   */
  async checkDueGoalsAndNotify(goals: Goal[]): Promise<void> {
    if (!this.isSupported() || Notification.permission !== 'granted') return;

    const notifiedKey = 'gamingDashboard_notified_goals_v1';
    let notifiedMap: Record<string, string> = {};
    try {
      const stored = localStorage.getItem(notifiedKey);
      if (stored) notifiedMap = JSON.parse(stored);
    } catch {}

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    for (const goal of goals) {
      // Ignore already completed goals
      if (goal.current >= goal.target) continue;
      if (!goal.deadline) continue;

      const deadlineDate = new Date(goal.deadline);
      const diffTime = deadlineDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Remind if due in 3 days or less
      if (diffDays >= 0 && diffDays <= 3) {
        const notificationId = `${goal.id}-${todayStr}`;
        if (!notifiedMap[notificationId]) {
          const daysText = diffDays === 0 ? 'due TODAY!' : `due in ${diffDays} day${diffDays > 1 ? 's' : ''}!`;
          this.sendNotification(`🎯 Goal Reminder: ${goal.title}`, {
            body: `Your milestone is ${daysText} Currently at ${goal.current}/${goal.target}. Keep pushing!`,
            tag: `goal-reminder-${goal.id}`,
          });
          notifiedMap[notificationId] = todayStr;
        }
      }
    }

    try {
      localStorage.setItem(notifiedKey, JSON.stringify(notifiedMap));
    } catch {}
  }

  /**
   * Download a .ics iCalendar file that includes native calendar & email reminders
   */
  downloadIcsReminder(goal: Goal): void {
    if (!goal.deadline) return;

    const cleanDate = goal.deadline.replace(/-/g, '');
    const title = `GameVault Goal: ${goal.title}`;
    const desc = `Gaming Goal: ${goal.title}\\nProgress: ${goal.current}/${goal.target}\\nNotes: ${goal.description || 'No notes'}`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//GameVault//Gaming Dashboard//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:goal-${goal.id}@gamevault.app`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;VALUE=DATE:${cleanDate}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${desc}`,
      'STATUS:CONFIRMED',
      // Trigger alarm reminder 1 day before
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${title} is due tomorrow!`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `goal-${goal.id}-reminder.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Open Google Calendar web with pre-filled goal info and reminder
   */
  openGoogleCalendar(goal: Goal): void {
    if (!goal.deadline) return;
    const cleanDate = goal.deadline.replace(/-/g, '');
    const title = encodeURIComponent(`GameVault Goal: ${goal.title}`);
    const details = encodeURIComponent(
      `Gaming Milestone: ${goal.title}\nProgress: ${goal.current} / ${goal.target}\n${goal.description || ''}`
    );
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${cleanDate}/${cleanDate}&details=${details}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export const notificationService = new NotificationService();
