import './App.css';
import { ChatProvider } from './context/ChatContext';
import ChatWidget from './components/ChatWidget';
import AnalyticsPanel from './components/AnalyticsPanel';
import SettingsPanel from './components/SettingsPanel';
import IndustrySelector from './components/IndustrySelector';

function App() {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Your main app content goes here */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">AI Chatbot Demo</h1>
              <IndustrySelector />
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                <p className="text-gray-500">Main content area</p>
              </div>
            </div>
          </div>
        </main>

        {/* Chat Widget - This will be positioned fixed at the bottom right */}
        <ChatWidget />

        {/* Settings Panel - For configuring the chatbot */}
        <SettingsPanel />

        {/* Analytics Panel - Optional component for monitoring */}
        <AnalyticsPanel />
      </div>
    </ChatProvider>
    
  );
}

export default App
