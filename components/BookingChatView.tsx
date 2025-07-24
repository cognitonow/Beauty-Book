import React, { useState, useEffect, useRef } from 'react';
import { Booking, ProfessionalProfile, Client } from '../types';
import { Send, X, Check, XCircle, ChevronLeft, Calendar } from 'lucide-react';

interface BookingChatViewProps {
  booking: Booking;
  currentUser: ProfessionalProfile | Client;
  onSendMessage: (bookingId: string, text: string) => void;
  onUpdateStatus?: (bookingId: string, status: 'approved' | 'declined') => void;
  onClose: () => void;
}

const BookingChatView: React.FC<BookingChatViewProps> = ({ booking, currentUser, onSendMessage, onUpdateStatus, onClose }) => {
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<null | HTMLDivElement>(null);
  
  const isProfessional = 'specialty' in currentUser;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [booking.messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(booking.id, newMessage.trim());
      setNewMessage('');
    }
  };

  const getStatusInfo = () => {
    switch (booking.status) {
        case 'pending': return { text: 'Pending Approval', color: 'bg-yellow-100 text-yellow-800' };
        case 'approved': return { text: 'Approved', color: 'bg-green-100 text-green-800' };
        case 'declined': return { text: 'Declined', color: 'bg-red-100 text-red-800' };
        case 'completed': return { text: 'Completed', color: 'bg-blue-100 text-blue-800' };
        case 'cancelled': return { text: 'Cancelled', color: 'bg-slate-100 text-slate-800' };
    }
  }

  const otherParty = isProfessional 
    ? { name: booking.clientName, image: booking.clientImage }
    : { name: booking.professionalName, image: booking.professionalImage };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-full max-h-full">
      {/* Header */}
      <header className="p-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="lg:hidden text-slate-500 hover:text-slate-800"><ChevronLeft size={24} /></button>
          <img src={otherParty.image} alt={otherParty.name} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <h3 className="font-bold text-slate-800">{otherParty.name}</h3>
            <p className="text-sm text-slate-500">RE: "{booking.service.name}"</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
             <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${getStatusInfo().color}`}>
                {getStatusInfo().text}
            </span>
             <button onClick={onClose} className="hidden lg:block text-slate-400 hover:text-slate-700"><X size={20}/></button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-grow p-4 overflow-y-auto bg-slate-50/50">
        {booking.requestedDateTime && (
            <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-900 p-3 rounded-lg text-sm mb-4">
                <Calendar className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                    <span className="font-bold block">Client's requested time</span>
                    <p className="text-rose-800">{booking.requestedDateTime}</p>
                </div>
            </div>
        )}
        <div className="space-y-4">
          {booking.messages.map(msg => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
              {msg.senderId !== currentUser.id && (
                  <img src={otherParty.image} alt={otherParty.name} className="w-6 h-6 rounded-full flex-shrink-0"/>
              )}
              <div className={`max-w-xs md:max-w-md p-3 rounded-lg text-sm ${msg.senderId === currentUser.id ? 'chat-bubble-sent' : 'chat-bubble-received'}`}>
                {msg.text}
              </div>
            </div>
          ))}
           <div ref={chatEndRef} />
        </div>
      </div>

      {/* Action/Input Footer */}
      <footer className="p-4 border-t border-slate-200 flex-shrink-0">
        {isProfessional && booking.status === 'pending' && onUpdateStatus && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button onClick={() => onUpdateStatus(booking.id, 'approved')} className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors">
              <Check size={18} /> Approve
            </button>
            <button onClick={() => onUpdateStatus(booking.id, 'declined')} className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors">
              <XCircle size={18} /> Decline
            </button>
          </div>
        )}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-500 transition-shadow"
            disabled={booking.status !== 'pending' && booking.status !== 'approved'}
          />
          <button onClick={handleSend} disabled={!newMessage.trim() || (booking.status !== 'pending' && booking.status !== 'approved')} className="w-11 h-11 flex-shrink-0 bg-rose-500 text-white rounded-lg flex items-center justify-center hover:bg-rose-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed">
            <Send size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default BookingChatView;