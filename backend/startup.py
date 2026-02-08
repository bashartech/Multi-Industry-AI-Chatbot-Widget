import subprocess
import sys
import os

def install_dependencies():
    """Install required packages from requirements.txt"""
    if os.path.exists("requirements.txt"):
        print("Installing dependencies...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    else:
        print("No requirements.txt found")

def start_server():
    """Start the FastAPI server"""
    print("Starting Chatbot Backend Server...")

    # Install dependencies first
    install_dependencies()

    # Start the server using uvicorn
    try:
        subprocess.run(["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"])
    except FileNotFoundError:
        print("Error: uvicorn not found. Please install it using 'pip install uvicorn'")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nServer stopped.")

if __name__ == "__main__":
    start_server()