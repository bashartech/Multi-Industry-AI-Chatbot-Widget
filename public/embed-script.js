(function() {
  // Configuration - can be overridden by passing options when initializing
  const defaultConfig = {
    backendUrl: 'http://localhost:8000', // Change this to your deployed backend URL
    embedUrl: 'https://your-vercel-project.vercel.app/chat-embed.html', // Update this to your deployed embed page
    widgetPosition: 'bottom-right', // Options: 'bottom-left', 'bottom-right', 'top-left', 'top-right'
    industries: ['hotel', 'real_estate', 'healthcare'],
    defaultIndustry: 'hotel',
    botName: 'AI Assistant',
    welcomeMessage: "Hi, I'm your AI assistant. How can I help you today?",
    triggerWords: ["book", "appointment", "buy", "rent", "reserve", "schedule"]
  };

  // Merge default config with any user-provided config
  const config = Object.assign({}, defaultConfig, (window.AIBotConfig || {}));

  // Create the chat widget container
  function createChatWidget() {
    // Check if widget already exists
    if (document.getElementById('ai-chatbot-container')) {
      return;
    }

    // Create main container
    const container = document.createElement('div');
    container.id = 'ai-chatbot-container';
    container.style.cssText = `
      position: fixed;
      z-index: 10000;
      ${getPositionStyles()};
      transition: all 0.3s ease;
    `;

    // Create the iframe for the chat widget
    const iframe = document.createElement('iframe');
    iframe.id = 'ai-chatbot-iframe';
    // Use the deployed URL for the embed page
    iframe.src = getEmbedUrl();
    iframe.style.cssText = `
      width: 400px;
      height: 500px;
      border: none;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      background: white;
    `;

    container.appendChild(iframe);
    document.body.appendChild(container);

    // Create the launcher button
    const launcher = document.createElement('button');
    launcher.id = 'ai-chatbot-launcher';
    launcher.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `;
    launcher.style.cssText = `
      position: fixed;
      z-index: 10001;
      ${getLauncherPositionStyles()};
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #107C10;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    `;

    launcher.addEventListener('click', () => {
      toggleChatWidget();
    });

    document.body.appendChild(launcher);
  }

  function getPositionStyles() {
    switch(config.widgetPosition) {
      case 'bottom-left':
        return 'bottom: 20px; left: 20px;';
      case 'top-left':
        return 'top: 20px; left: 20px;';
      case 'top-right':
        return 'top: 20px; right: 20px;';
      case 'bottom-right':
      default:
        return 'bottom: 20px; right: 20px;';
    }
  }

  function getLauncherPositionStyles() {
    switch(config.widgetPosition) {
      case 'bottom-left':
        return 'bottom: 20px; left: 20px;';
      case 'top-left':
        return 'top: 20px; left: 20px;';
      case 'top-right':
        return 'top: 20px; right: 20px;';
      case 'bottom-right':
      default:
        return 'bottom: 20px; right: 20px;';
    }
  }

  function getEmbedUrl() {
    // Construct the embed URL with parameters
    // This should point to your deployed embed page
    // For Vercel deployment, use the full URL to the embed page
    const baseUrl = config.embedUrl || window.location.origin + '/chat-embed.html';
    const params = new URLSearchParams({
      industry: config.defaultIndustry,
      botName: encodeURIComponent(config.botName),
      welcome: encodeURIComponent(config.welcomeMessage)
    });
    return `${baseUrl}?${params}`;
  }

  function toggleChatWidget() {
    const container = document.getElementById('ai-chatbot-container');
    const launcher = document.getElementById('ai-chatbot-launcher');
    
    if (container && launcher) {
      if (container.style.display === 'none' || container.style.display === '') {
        // Show the widget
        container.style.display = 'block';
        launcher.style.display = 'none';
      } else {
        // Hide the widget
        container.style.display = 'none';
        launcher.style.display = 'block';
      }
    }
  }

  // Close widget when clicking outside
  document.addEventListener('click', function(event) {
    const container = document.getElementById('ai-chatbot-container');
    const launcher = document.getElementById('ai-chatbot-launcher');
    
    if (container && launcher) {
      const isClickInsideWidget = container.contains(event.target) || launcher.contains(event.target);
      
      if (!isClickInsideWidget && container.style.display !== 'none') {
        container.style.display = 'none';
        launcher.style.display = 'block';
      }
    }
  });

  // Listen for messages from the iframe
  window.addEventListener('message', function(event) {
    // Verify the origin if needed for security
    // if (event.origin !== window.location.origin) return;
    
    if (event.data.type === 'CLOSE_CHAT_WIDGET') {
      const container = document.getElementById('ai-chatbot-container');
      const launcher = document.getElementById('ai-chatbot-launcher');
      
      if (container && launcher) {
        container.style.display = 'none';
        launcher.style.display = 'block';
      }
    }
  });

  // Initialize the chat widget when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatWidget);
  } else {
    createChatWidget();
  }

  // Expose config to window for customization
  window.AIBotConfig = window.AIBotConfig || config;
})();