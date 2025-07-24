import React from 'react';
import { motion } from 'framer-motion';
import { Notification } from '../types';
import { Bell, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

interface NotificationsPanelProps {
  notifications: Notification[];
  onSelect: (bookingId: string) => void;
  onClose: () => void;
}

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  switch (type) {
    case 'booking_request': return <Bell className="text-blue-500" />;
    case 'booking_approved': return <CheckCircle className="text-green-500" />;
    case 'booking_declined': return <XCircle className="text-red-500" />;
    case 'new_message': return <MessageSquare className="text-purple-500" />;
    default: return <Bell className="text-slate-500" />;
  }
};

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onSelect, onClose }) => {

  const sortedNotifications = [...notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="absolute top-16 right-6 w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 z-30"
    >
      <div className="p-4 border-b border-slate-200">
        <h3 className="font-bold text-slate-800">Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {sortedNotifications.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {sortedNotifications.map(notification => (
              <li key={notification.id}>
                <button
                  onClick={() => onSelect(notification.bookingId)}
                  className={`w-full text-left p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors ${!notification.isRead ? 'bg-rose-50' : 'bg-white'}`}
                >
                  <div className="w-8 h-8 flex-shrink-0 mt-1 flex items-center justify-center bg-slate-100 rounded-full">
                    <NotificationIcon type={notification.type} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-slate-700">{notification.message}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(notification.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                   {!notification.isRead && <div className="w-2.5 h-2.5 bg-rose-500 rounded-full mt-1 flex-shrink-0"></div>}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <Bell size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="font-semibold">No notifications</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationsPanel;