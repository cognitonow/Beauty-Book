import React, { useState } from 'react';
import { ProfessionalProfile, Service } from '../types';

interface BookingModalProps {
  profile: ProfessionalProfile;
  onClose: () => void;
  onBook: (service: Service, message: string, requestedDateTime?: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ profile, onClose, onBook }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [message, setMessage] = useState('');
  const [requestedDate, setRequestedDate] = useState('');
  const [requestedTime, setRequestedTime] = useState('');


  const handleBookClick = () => {
    if (selectedService) {
      const dateTimeString = requestedDate ? `${requestedDate}${requestedTime ? ` at ${requestedTime}` : ''}` : '';
      onBook(selectedService, message, dateTimeString);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl p-6 md:p-8" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Request Booking</h2>
            <p className="text-slate-500">with {profile.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">1. Select a service</label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {profile.services.map(service => (
                <button
                  key={service.name}
                  onClick={() => setSelectedService(service)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedService?.name === service.name ? 'border-rose-500 bg-rose-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800">{service.name}</span>
                    <span className="font-bold text-rose-600">€{service.price}</span>
                  </div>
                  {service.duration && <p className="text-sm text-slate-500">{service.duration} min</p>}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">2. Suggest a date & time (optional)</label>
            <div className="grid grid-cols-2 gap-3">
                <input
                    type="date"
                    value={requestedDate}
                    onChange={(e) => setRequestedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-500 transition-shadow"
                />
                <input
                    type="time"
                    value={requestedTime}
                    onChange={(e) => setRequestedTime(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-500 transition-shadow disabled:bg-slate-100"
                    disabled={!requestedDate}
                />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">3. Add a message (optional)</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-500 transition-shadow"
              placeholder="e.g., mention any specific requests or flexibility on time..."
            />
          </div>

          <button
            onClick={handleBookClick}
            disabled={!selectedService}
            className="w-full py-3 bg-rose-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-rose-300 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {selectedService ? 'Send Booking Request' : 'Select a service to continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
