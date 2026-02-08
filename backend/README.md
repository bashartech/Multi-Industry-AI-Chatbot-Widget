# Backend Setup Instructions

## Prerequisites

1. **Google Cloud Account**: You need a Google Cloud account with billing enabled
2. **Firebase Project**: Create a Firebase project in the Google Cloud Console
3. **Gemini API Key**: Obtain an API key from Google AI Studio for the Gemini model

## Setup Steps

### 1. Create Service Account Key

1. Go to the Google Cloud Console
2. Select your project
3. Navigate to "IAM & Admin" > "Service Accounts"
4. Create a new service account or select an existing one
5. Click on the service account and go to "Keys" tab
6. Click "Add Key" > "Create New Key"
7. Select "JSON" and click "Create"
8. Save the downloaded file as `serviceAccountKey.json` in the backend folder

### 2. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an API key for the Gemini Pro model
3. Add it to your `.env` file

### 3. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 4. Environment Variables

Create/update the `.env` file in the backend directory:

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 5. Run the Backend

```bash
cd backend
uvicorn main:app --reload
```

The backend will be available at `http://localhost:8000`

## API Endpoints

- `GET /` - Health check
- `POST /chat` - Main chat endpoint

## Firebase Collections

The application will create a `leads` collection in Firestore to store captured leads.

## Troubleshooting

- Make sure your service account has the necessary permissions for Firestore
- Verify that the Gemini API key is valid and has sufficient quota
- Check that the `serviceAccountKey.json` file is in the correct location