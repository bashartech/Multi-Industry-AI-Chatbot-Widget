import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { defaultChatConfig, getIndustryQuickReplies } from '../config/chatConfig';

interface IndustrySelectorProps {
  onIndustryChange?: (industry: string) => void;
}

const IndustrySelector: React.FC<IndustrySelectorProps> = ({ onIndustryChange }) => {
  const { config, setConfig } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  
  // Use the selected industry from config, fallback to 'hotel' if not set
  const selectedIndustry = config.selectedIndustry || 'hotel';

  const handleSelect = (industry: string) => {
    setIsOpen(false);

    // Update chat config with industry-specific quick replies and selected industry
    const newConfig = {
      ...config, // Use current config to preserve other settings
      quickReplies: getIndustryQuickReplies(industry),
      selectedIndustry: industry, // Add the selected industry to config
    };

    setConfig(newConfig);

    if (onIndustryChange) {
      onIndustryChange(industry);
    }
  };

  // Map industry codes to display names
  const getIndustryDisplayName = (industry: string) => {
    const names: Record<string, string> = {
      'hotel': 'Hotel Booking',
      'real_estate': 'Real Estate',
      'healthcare': 'Healthcare',
    };
    return names[industry] || industry;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chat-primary"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className='text-gray-700'>Industry: {getIndustryDisplayName(selectedIndustry)}</span>
        <svg className="ml-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          <ul className="space-y-0">
            {defaultChatConfig.industries.map((industry) => (
              <li key={industry}>
                <button
                  onClick={() => handleSelect(industry)}
                  className={`w-full text-white text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    selectedIndustry === industry ? 'bg-chat-primary bg-opacity-10 text-chat-primary font-medium' : 'text-gray-100'
                  }`}
                >
                  {getIndustryDisplayName(industry)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default IndustrySelector;