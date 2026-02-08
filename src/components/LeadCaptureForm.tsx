import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { validateUserInfo } from '../utils/validation';
import { saveLead } from '../utils/api';
import { createBotMessage } from '../utils/messages';

interface LeadCaptureFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ onClose, onSuccess }) => {
  const { setUserInfo, addMessage, setLoading } = useChat();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    query: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateUserInfo(formData);

    if (!validation.isValid) {
      const newErrors: Record<string, string> = {};
      validation.errors.forEach(error => {
        if (error.includes('Name')) newErrors.name = error;
        if (error.includes('email')) newErrors.email = error;
        if (error.includes('phone')) newErrors.phone = error;
      });
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Save to context
      setUserInfo(formData);

      // Simulate API call to save lead
      const result = await saveLead(formData);

      if (result.success) {
        setSubmitSuccess(true);

        // Add success message
        addMessage(createBotMessage(`Thank you, ${formData.name || 'there'}! We've received your information and will contact you soon.`));

        if (onSuccess) {
          onSuccess();
        }

        // Close form after delay
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setErrors({ submit: result.error || 'Failed to save your information. Please try again.' });
      }
    } catch (error) {
      console.error('Error saving lead:', error);
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-md">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-700">Information submitted successfully!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border border-chat-border rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-800">Contact Information</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close form"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-chat-primary text-chat-text ${
              errors.name ? 'border-red-500' : 'border-chat-border'
            }`}
            placeholder="Enter your name"
            required
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-chat-primary text-chat-text ${
              errors.email ? 'border-red-500' : 'border-chat-border'
            }`}
            placeholder="Enter your email"
            required
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-chat-text mb-1">Phone (Optional)</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-chat-primary text-chat-text ${
              errors.phone ? 'border-red-500' : 'border-chat-border'
            }`}
            placeholder="Enter your phone number"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="query" className="block text-sm font-medium text-chat-text mb-1">Query</label>
          <textarea
            id="query"
            name="query"
            value={formData.query}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-chat-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-chat-primary text-chat-text"
            placeholder="Describe your query or interest"
          ></textarea>
        </div>

        {errors.submit && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {errors.submit}
          </div>
        )}

        <div className="flex space-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-chat-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-chat-primary hover:bg-opacity-90 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-chat-primary"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadCaptureForm;