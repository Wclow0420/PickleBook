import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from "react-toastify";

const TimePicker = ({ value, onChange }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('AM');

  const hours = Array.from({ length: 12 }, (_, i) => 
    (i + 1).toString().padStart(2, '0')
  );
  const minutes = ['00', '30'];

  useEffect(() => {
    setInitialDateTime(false); // Pass false to prevent validation on initial load
  }, []);

  const setInitialDateTime = (shouldValidate = true) => {
    const now = new Date();
    const nextHour = new Date(now.setHours(now.getHours() + 1, 0, 0, 0));
    
    const newHour = nextHour.getHours() > 12 
      ? (nextHour.getHours() - 12).toString().padStart(2, '0')
      : nextHour.getHours().toString().padStart(2, '0');
    const newPeriod = nextHour.getHours() >= 12 ? 'PM' : 'AM';
    
    setHour(newHour);
    setPeriod(newPeriod);
    setSelectedDate(now);
    
    handleChange(newHour, '00', newPeriod, shouldValidate);
  };

  const isTimeValid = (newHour, newMinute, newPeriod, shouldShowToast = true) => {
    const now = new Date();
    const selectedDateTime = new Date(selectedDate);
    
    let hour24 = parseInt(newHour);
    if (newPeriod === 'PM' && hour24 !== 12) hour24 += 12;
    if (newPeriod === 'AM' && hour24 === 12) hour24 = 0;
    
    selectedDateTime.setHours(hour24, parseInt(newMinute));
    
    if (selectedDateTime <= now) {
      if (shouldShowToast) {
        toast.error("Invalid Time Selection. Please select a future time");
      }
      return false;
    }
    return true;
  };

  const incrementHour = () => {
    const currentIndex = hours.indexOf(hour);
    const nextIndex = (currentIndex + 1) % hours.length;
    const newHour = hours[nextIndex];
    
    if (isTimeValid(newHour, minute, period)) {
      setHour(newHour);
      handleChange(newHour, minute, period);
    }
  };

  const decrementHour = () => {
    const currentIndex = hours.indexOf(hour);
    const prevIndex = (currentIndex - 1 + hours.length) % hours.length;
    const newHour = hours[prevIndex];
    
    if (isTimeValid(newHour, minute, period)) {
      setHour(newHour);
      handleChange(newHour, minute, period);
    }
  };

  const toggleMinute = () => {
    const newMinute = minute === '00' ? '30' : '00';
    if (isTimeValid(hour, newMinute, period)) {
      setMinute(newMinute);
      handleChange(hour, newMinute, period);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (date.toDateString() === new Date().toDateString()) {
      setInitialDateTime();
    }
  };

  const handleChange = (newHour, newMinute, newPeriod, shouldValidate = true) => {
    if (!shouldValidate || isTimeValid(newHour, newMinute, newPeriod)) {
      onChange(`${newHour}:${newMinute} ${newPeriod}`);
    }
  };

  const getDayName = (date) => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date).toUpperCase();
  };

  const getDateNumber = (date) => {
    return date.getDate();
  };

  const isDateSelectable = (date) => {
    const now = new Date();
    return date >= new Date(now.setHours(0, 0, 0, 0));
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {Array.from({length: 7}, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i);
          return date;
        }).map((date) => (
          <button
            key={date.toISOString()}
            onClick={() => handleDateSelect(date)}
            disabled={!isDateSelectable(date)}
            className={`flex flex-col items-center min-w-[80px] py-3 px-4 rounded-full transition-colors ${
              selectedDate?.toDateString() === date.toDateString()
                ? 'bg-blue-600 text-white'
                : isDateSelectable(date)
                  ? 'hover:bg-gray-100'
                  : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <span className="text-sm font-medium">{getDayName(date)}</span>
            <span className="text-lg">{getDateNumber(date)}</span>
          </button>
        ))}
      </div>

      <h3 className="text-lg font-medium mb-4">Select Start Time</h3>
      
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <div className="bg-blue-100 rounded-xl p-4 flex flex-col items-center relative">
            <button 
              onClick={incrementHour}
              className="text-gray-600 hover:text-gray-800 p-1"
            >
              <ChevronUp size={20} />
            </button>
            <span className="text-3xl font-medium my-1">{hour}</span>
            <button 
              onClick={decrementHour}
              className="text-gray-600 hover:text-gray-800 p-1"
            >
              <ChevronDown size={20} />
            </button>
          </div>
          <span className="text-sm text-gray-600 mt-1">Hour</span>
        </div>

        <span className="text-3xl font-bold mb-6">:</span>

        <div className="flex flex-col items-center">
          <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center relative">
            <button 
              onClick={toggleMinute}
              className="text-gray-600 hover:text-gray-800 p-1"
            >
              <ChevronUp size={20} />
            </button>
            <span className="text-3xl font-medium my-1">{minute}</span>
            <button 
              onClick={toggleMinute}
              className="text-gray-600 hover:text-gray-800 p-1"
            >
              <ChevronDown size={20} />
            </button>
          </div>
          <span className="text-sm text-gray-600 mt-1">Minute</span>
        </div>

        <div className="flex flex-col bg-gray-100 rounded-xl overflow-hidden mb-6">
          {['AM', 'PM'].map((p) => (
            <button
              key={p}
              onClick={() => {
                if (isTimeValid(hour, minute, p)) {
                  setPeriod(p);
                  handleChange(hour, minute, p);
                }
              }}
              className={`px-6 py-2 transition-colors ${
                period === p 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimePicker;