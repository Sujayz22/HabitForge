/**
 * HabitForge Service Worker
 * Handles scheduled end-of-day reminder notifications AND task deadline reminders.
 *
 * Messages accepted:
 *   { type: 'SCHEDULE_REMINDER', pendingHabits, pendingTasks, pendingChallenges, fireAtMs }
 *   { type: 'CANCEL_REMINDER' }
 *   { type: 'SCHEDULE_TASK_REMINDER', taskId, taskTitle, fireAtMs }
 *   { type: 'CANCEL_TASK_REMINDER', taskId }
 */

let reminderTimer = null;
const taskTimers = {};   // taskId → timer id

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('message', (event) => {
    const { type } = event.data || {};

    // ── End-of-day reminder ────────────────────────────────────────
    if (type === 'SCHEDULE_REMINDER') {
        const { pendingHabits = 0, pendingTasks = 0, pendingChallenges = 0, fireAtMs } = event.data;

        if (reminderTimer !== null) { clearTimeout(reminderTimer); reminderTimer = null; }

        const delay = fireAtMs - Date.now();
        if (delay <= 0) return;

        const parts = [];
        if (pendingHabits > 0) parts.push(`${pendingHabits} habit${pendingHabits > 1 ? 's' : ''}`);
        if (pendingChallenges > 0) parts.push(`${pendingChallenges} club challenge${pendingChallenges > 1 ? 's' : ''}`);
        if (pendingTasks > 0) parts.push(`${pendingTasks} task${pendingTasks > 1 ? 's' : ''}`);
        if (parts.length === 0) return;

        const body = `You still have ${parts.join(', ')} to complete today. Don't break your streak! 🔥`;
        reminderTimer = setTimeout(() => {
            self.registration.showNotification('HabitForge — Day ending soon ⏰', {
                body, icon: '/favicon.ico', badge: '/favicon.ico',
                tag: 'habitforge-daily-reminder', renotify: true,
            });
            reminderTimer = null;
        }, delay);

    } else if (type === 'CANCEL_REMINDER') {
        if (reminderTimer !== null) { clearTimeout(reminderTimer); reminderTimer = null; }

        // ── Task deadline reminder ────────────────────────────────────
    } else if (type === 'SCHEDULE_TASK_REMINDER') {
        const { taskId, taskTitle, fireAtMs } = event.data;
        if (!taskId || !fireAtMs) return;

        // Cancel any existing timer for this task
        if (taskTimers[taskId]) { clearTimeout(taskTimers[taskId]); delete taskTimers[taskId]; }

        const delay = fireAtMs - Date.now();
        if (delay <= 0) return;

        taskTimers[taskId] = setTimeout(() => {
            self.registration.showNotification('Task due now ⚡ — HabitForge', {
                body: `"${taskTitle}" is due right now. Get it done!`,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: `habitforge-task-${taskId}`,
                renotify: true,
            });
            delete taskTimers[taskId];
        }, delay);

    } else if (type === 'CANCEL_TASK_REMINDER') {
        const { taskId } = event.data;
        if (taskId && taskTimers[taskId]) { clearTimeout(taskTimers[taskId]); delete taskTimers[taskId]; }
    }
});

// When user clicks the notification, focus or open the app
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url && 'focus' in client) return client.focus();
            }
            if (self.clients.openWindow) return self.clients.openWindow('/tasks');
        })
    );
});

