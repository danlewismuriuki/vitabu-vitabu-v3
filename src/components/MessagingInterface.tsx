import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, MapPin, Calendar, CheckCircle, Clock, Image, Camera, ArrowLeft } from 'lucide-react';
import { Book, User } from '../types';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'system';
  imageUrl?: string;
}

interface MessagingInterfaceProps {
  book: Book;
  seller: User;
  currentUser: User;
  onBack: () => void;
  onExchangeConfirmed?: () => void;
}

export const MessagingInterface: React.FC<MessagingInterfaceProps> = ({
  book,
  seller,
  currentUser,
  onBack,
  onExchangeConfirmed
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'system',
      content: `You're now connected with ${seller.name} about "${book.title}"`,
      timestamp: new Date().toISOString(),
      type: 'system'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showMeetupPlanner, setShowMeetupPlanner] = useState(false);
  const [meetupDetails, setMeetupDetails] = useState({
    location: '',
    date: '',
    time: ''
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickMessages = [
    "Hi! Is this book still available?",
    "When would be a good time to meet?",
    "Can you send more photos of the book condition?",
    "I'm interested in exchanging. What books are you looking for?"
  ];

  const suggestedMeetupLocations = [
    "Westgate Mall Food Court",
    "Sarit Centre Ground Floor",
    "Village Market Entrance",
    "Junction Mall Coffee Shop",
    "Local Primary School Gate"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate seller response
    setTimeout(() => {
      const responses = [
        "Yes, it's still available! When would you like to meet?",
        "Sure! I can meet this weekend. Where works for you?",
        "The book is in great condition. I can send more photos.",
        "I'm looking for Grade 6 Science books. Do you have any?"
      ];
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: seller.id,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In real app, would upload to cloud storage
      const imageMessage: Message = {
        id: Date.now().toString(),
        senderId: currentUser.id,
        content: 'Sent an image',
        timestamp: new Date().toISOString(),
        type: 'image',
        imageUrl: 'https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg'
      };
      
      setMessages(prev => [...prev, imageMessage]);
    }
  };

  const handleScheduleMeetup = () => {
    if (!meetupDetails.location || !meetupDetails.date || !meetupDetails.time) {
      alert('Please fill in all meetup details');
      return;
    }

    const meetupMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      content: `Meetup scheduled: ${meetupDetails.location} on ${meetupDetails.date} at ${meetupDetails.time}`,
      timestamp: new Date().toISOString(),
      type: 'system'
    };

    setMessages(prev => [...prev, meetupMessage]);
    setShowMeetupPlanner(false);
    setMeetupDetails({ location: '', date: '', time: '' });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-neutral-100"
            >
              <ArrowLeft className="h-5 w-5 text-neutral-600" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-accent-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold text-accent-700">
                  {seller.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h2 className="font-poppins font-semibold text-primary-800">{seller.name}</h2>
                <div className="flex items-center space-x-2 text-sm text-neutral-600">
                  <span className="w-2 h-2 bg-secondary-500 rounded-full"></span>
                  <span>Active 2 hours ago</span>
                  <span>•</span>
                  <span>⭐ {seller.rating}/5.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Book Preview */}
          <div className="hidden md:flex items-center space-x-3 bg-neutral-50 p-3 rounded-lg">
            <img
              src={book.images[0]}
              alt={book.title}
              className="w-12 h-12 object-cover rounded"
            />
            <div>
              <p className="font-medium text-primary-800 text-sm">{book.title}</p>
              <p className="text-xs text-neutral-600">KES {book.price.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === 'system' 
                  ? 'justify-center' 
                  : message.senderId === currentUser.id 
                    ? 'justify-end' 
                    : 'justify-start'
              }`}
            >
              {message.type === 'system' ? (
                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm">
                  {message.content}
                </div>
              ) : (
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.senderId === currentUser.id
                      ? 'bg-accent-500 text-white'
                      : 'bg-white text-neutral-800 shadow-sm'
                  }`}
                >
                  {message.type === 'image' && message.imageUrl ? (
                    <div className="space-y-2">
                      <img
                        src={message.imageUrl}
                        alt="Shared image"
                        className="w-full rounded-lg"
                      />
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                  <p className={`text-xs mt-1 ${
                    message.senderId === currentUser.id ? 'text-accent-100' : 'text-neutral-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Message Suggestions */}
      {messages.length <= 2 && (
        <div className="bg-white border-t border-neutral-200 p-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-neutral-600 mb-3">Quick messages:</p>
            <div className="flex flex-wrap gap-2">
              {quickMessages.map((msg, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(msg)}
                  className="text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-2 rounded-full transition-colors"
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white border-t border-neutral-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            {/* Image Upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-full hover:bg-neutral-100 text-neutral-600"
            >
              <Camera className="h-5 w-5" />
            </button>

            {/* Message Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(newMessage)}
                placeholder="Type your message..."
                className="w-full px-4 py-3 border border-neutral-300 rounded-full focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={() => handleSendMessage(newMessage)}
              disabled={!newMessage.trim()}
              className="p-3 bg-accent-500 hover:bg-accent-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>

            {/* Meetup Planner */}
            <button
              onClick={() => setShowMeetupPlanner(true)}
              className="p-3 rounded-full hover:bg-neutral-100 text-neutral-600"
            >
              <Calendar className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Meetup Planner Modal */}
      {showMeetupPlanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-poppins font-bold text-primary-800">
                  Plan Your Meetup
                </h3>
                <button
                  onClick={() => setShowMeetupPlanner(false)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Meeting Location
                  </label>
                  <select
                    value={meetupDetails.location}
                    onChange={(e) => setMeetupDetails(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="">Choose a safe location</option>
                    {suggestedMeetupLocations.map((location, index) => (
                      <option key={index} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={meetupDetails.date}
                      onChange={(e) => setMeetupDetails(prev => ({ ...prev, date: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={meetupDetails.time}
                      onChange={(e) => setMeetupDetails(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500"
                    />
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">🛡️ Safety Reminders</h4>
                  <div className="space-y-1 text-sm text-green-700">
                    <p>✓ Meet during daytime hours</p>
                    <p>✓ Choose busy, public locations</p>
                    <p>✓ Bring a friend if possible</p>
                    <p>✓ Inspect the book before payment</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowMeetupPlanner(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleScheduleMeetup}
                    className="flex-1 btn-primary"
                  >
                    Schedule Meetup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};