# Multi-Industry AI Chatbot Widget

## Overview
This is a comprehensive multi-industry AI chatbot solution that can be embedded on any website. It handles user interactions, lead capture, and basic automation workflows across multiple industries (Hotel, Real Estate, Healthcare).

## Features
- Responsive chat widget that can be embedded via a `<script>` tag on any website
- Industry-specific conversation flows (Hotel, Real Estate, Healthcare)
- Lead capture functionality with name, email, phone, and query
- Human escalation when AI cannot answer
- Quick reply buttons for common questions
- Support for multiple concurrent users
- Analytics and monitoring capabilities
- Customizable bot name and welcome messages
- Session management and persistence

## Architecture
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: FastAPI, Python
- **AI**: Google Gemini Pro
- **Database**: Firebase Firestore
- **State Management**: React Context API

## Installation

### Prerequisites
- Node.js (version 16 or higher)
- Python 3.9+
- npm or yarn package manager

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file in the backend directory with:
```
BACKEND_URL=https://your-backend-url.com/
FRONTEND_URL=https://your-frontend-url.com/
GEMINI_API_KEY=your_google_gemini_api_key
```

4. Set up Firebase:
   - Create a Firebase project at https://console.firebase.google.com/
   - Create a service account and download the JSON key file
   - Rename the file to `serviceAccountKey.json` and place it in the backend directory
   - Ensure your Firebase project has Firestore enabled

5. Run the backend server:
```bash
python main.py
```

The backend will be available at your configured URL.

### Frontend Setup
1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the project root with:
```
VITE_BACKEND_URL=https://your-backend-url.com/
VITE_FRONTEND_URL=https://your-frontend-url.com/
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Embedding on Your Website

To embed the chatbot on any website, add the following script to your HTML:

```html
<script>
  window.AIBotConfig = {
    backendUrl: 'https://your-backend-url.com/',
    embedUrl: 'https://your-frontend-url.com/chat-embed.html',
    botName: 'Your Company Assistant',
    welcomeMessage: 'Hi! How can we help you today?',
    defaultIndustry: 'hotel' // Options: 'hotel', 'real_estate', 'healthcare'
  };
</script>
<script src="https://your-frontend-url.com/embed-script.js"></script>
```

## Firebase Configuration

### Service Account Key
To use Firebase for lead storage, you need to:

1. Create a Firebase project at https://console.firebase.google.com/
2. Go to Project Settings > Service Accounts
3. Generate a new private key (JSON format)
4. Download the JSON file
5. Rename it to `serviceAccountKey.json`
6. Place it in your backend directory
7. Ensure the file is NOT committed to version control

### Firestore Rules
Make sure your Firestore database has appropriate rules to allow the chatbot to write lead data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leads/{document} {
      allow read, write: if true;  // Adjust security rules as needed
    }
  }
}
```

## Environment Variables

### Backend (.env)
- `BACKEND_URL`: URL where your backend is hosted
- `FRONTEND_URL`: URL where your frontend is hosted
- `GEMINI_API_KEY`: Your Google Gemini API key

### Frontend (.env)
- `VITE_BACKEND_URL`: URL of your backend API
- `VITE_FRONTEND_URL`: URL of your frontend

## How Companies Use This Solution

### 1. Initial Setup
- Company creates their own Firebase project
- Obtains Google Gemini API key
- Downloads service account key file
- Deploys backend to their preferred hosting platform
- Deploys frontend to their domain

### 2. Customization
- Configure bot name to match their brand
- Customize welcome message
- Select appropriate industry for their business
- Add company-specific quick replies

### 3. Deployment
- Add embed script to their website
- Monitor conversations and leads through analytics
- Respond to escalated inquiries

### 4. Lead Management
- All captured leads are stored in Firebase
- Company can access leads through Firebase Console
- Leads include conversation transcript for context

## Security Considerations

### API Keys
- Never commit API keys to version control
- Use environment variables for sensitive data
- Rotate API keys regularly

### Firebase Security
- Limit Firestore write permissions appropriately
- Consider using Firebase Authentication if needed
- Regularly audit access logs

### Service Account Key
- Keep `serviceAccountKey.json` secure and private
- Do not commit to public repositories
- Restrict access to authorized personnel only

## Deployment Options

### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Hugging Face Spaces (Backend)
1. Create a new Space on Hugging Face
2. Use Docker deployment option
3. Add your Dockerfile and requirements
4. Set environment variables in Space settings

### Custom Hosting
Both frontend and backend can be deployed to any hosting platform that supports the respective technologies.

## Troubleshooting

### Common Issues
- **Firebase not initialized**: Check that `serviceAccountKey.json` is in the correct location
- **API key errors**: Verify GEMINI_API_KEY is correctly set
- **Connection issues**: Ensure backend URL is accessible from frontend

### Debugging
- Check browser console for frontend errors
- Check backend logs for API errors
- Verify all environment variables are set correctly

## Evaluation Criteria
- Code structure and readability
- Proper use of React and API integrations
- Chatbot functionality completeness (responses, lead capture, escalation)
- UI/UX quality (clean, responsive, user-friendly)
- Git commit hygiene and documentation

## Support
For technical support, please contact the development team or refer to the documentation.