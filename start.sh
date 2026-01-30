#!/bin/bash

# Real-time Collaborative Document Editor - Quick Start Script
# This script automates the setup and launch process

echo "================================================"
echo "  Real-time Collaborative Document Editor"
echo "  CODTECH Internship Project"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version) found${NC}"

# Check if npm is installed
echo "Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm --version) found${NC}"

# Check if MongoDB is installed
echo "Checking MongoDB installation..."
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}⚠ MongoDB is not installed or not in PATH${NC}"
    echo "You can either:"
    echo "  1. Install MongoDB locally (recommended for development)"
    echo "  2. Use MongoDB Atlas (cloud database)"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✓ MongoDB found${NC}"
    
    # Check if MongoDB is running
    if pgrep -x "mongod" > /dev/null; then
        echo -e "${GREEN}✓ MongoDB is running${NC}"
    else
        echo -e "${YELLOW}⚠ MongoDB is not running${NC}"
        echo "Starting MongoDB..."
        
        # Try to start MongoDB (different commands for different systems)
        if command -v systemctl &> /dev/null; then
            sudo systemctl start mongod
        elif command -v brew &> /dev/null; then
            brew services start mongodb-community
        else
            echo -e "${YELLOW}Please start MongoDB manually${NC}"
        fi
    fi
fi

echo ""
echo "================================================"
echo "  Installing Dependencies"
echo "================================================"
echo ""

# Install server dependencies
echo "Installing server dependencies..."
cd server
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Server dependencies installed${NC}"
    else
        echo -e "${RED}❌ Failed to install server dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Server dependencies already installed${NC}"
fi
cd ..

# Install client dependencies
echo "Installing client dependencies..."
cd client
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Client dependencies installed${NC}"
    else
        echo -e "${RED}❌ Failed to install client dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Client dependencies already installed${NC}"
fi
cd ..

echo ""
echo "================================================"
echo "  Starting Application"
echo "================================================"
echo ""

# Create .env file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "Creating .env file..."
    cat > server/.env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/collab-editor
EOF
    echo -e "${GREEN}✓ .env file created${NC}"
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $SERVER_PID $CLIENT_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start the server in background
echo "Starting backend server..."
cd server
npm start &
SERVER_PID=$!
cd ..

# Wait for server to start
echo "Waiting for server to start..."
sleep 3

# Start the client in background
echo "Starting React client..."
cd client
npm start &
CLIENT_PID=$!
cd ..

echo ""
echo "================================================"
echo -e "${GREEN}  Application Started Successfully! ${NC}"
echo "================================================"
echo ""
echo "Backend Server: http://localhost:5000"
echo "Frontend Client: http://localhost:3000"
echo ""
echo "The browser should open automatically."
echo "If not, navigate to http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $SERVER_PID $CLIENT_PID
