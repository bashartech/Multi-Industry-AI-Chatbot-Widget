# Frontend Setup Instructions

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

The frontend connects to the backend running on `http://localhost:8000`. Make sure the backend is running before starting the frontend.

### 3. Run the Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## Features

- Real-time chat interface with AI-powered responses
- Industry-specific conversation flows (Hotel, Real Estate, Healthcare)
- Lead capture functionality
- Session persistence using localStorage
- Responsive design for desktop and mobile

## Components

- `ChatWidget`: Main chat interface component
- `MessageInput`: Handles user message input
- `MessageBubble`: Displays individual messages
- `IndustrySelector`: Allows switching between industries
- `LeadCaptureForm`: Captures user information when needed

## Integration

The frontend communicates with the backend through the `/chat` endpoint at `http://localhost:8000/chat`. Messages are sent with the following parameters:
- `message`: The user's message text
- `industry`: Selected industry (hotel, real_estate, healthcare)
- `sessionId`: Unique session identifier