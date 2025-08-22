🚀 AI-Driven Performance Marketing SaaS
<p align="center">
<img width="1920" height="2991" alt="screencapture-localhost-3000-2025-08-22-16_34_03" src="https://github.com/user-attachments/assets/9453fdeb-5ff0-4bf1-aaca-6c623152e222" />
</p>

<p align="center">
An intelligent SaaS platform to analyze competitor strategies and generate high-performing ad campaigns using generative AI.
<br />
<em>This project was built for the GDGVITM Hackbuild 2.0 Hackathon.</em>
<br />
<br />
<a href="https://github.com/GDGVITM/hackbuild-Invictus/issues">Report Bug</a>
·
<a href="https://github.com/GDGVITM/hackbuild-Invictus/issues">Request Feature</a>
</p>

📜 About The Project
Marketers spend millions on digital ads but often struggle to create effective campaigns due to a lack of insight into competitor strategies and market trends. While ad transparency APIs exist, businesses lack a single, intelligent system to collect, analyze, and act on this competitive intelligence, leading to wasted ad spend and missed opportunities.

This platform leverages AI to provide deep competitor analytics and automates the creative process, helping businesses maximize their return on investment (ROI).

Built With
This project is powered by a modern, scalable tech stack:

📋 Table of Contents
✨ Core Features

🛠 Technology Stack

🏗 Project Architecture

⚙️ Getting Started

Prerequisites

Installation

🏆 Hackathon

✨ Core Features
Live Competitor Discovery: Describe your product to discover active competitors via the Meta Ad Library API.

Competitor Ad Feed: View a real-time feed of competitor ads to understand their current strategies.

AI-Powered Text Analysis: Automatically analyze ad copy for tone (e.g., Urgent, Inspirational) using Hugging Face NLP.

Interactive AI Strategy Simulator: Generate unique headlines, body copy, and image prompts with Groq's Llama 3 based on your creative direction.

Explainable AI (XAI): Understand the why behind the AI's strategic recommendations to build trust and marketing knowledge.

Simulated Real-Time Alerts: Get notified of new competitor ad campaigns as they launch.

🛠 Technology Stack
Here's a detailed breakdown of the technologies used in this project.

Category

Technology

Backend

Python, FastAPI, Uvicorn

Frontend

React.js, Plain CSS

AI/ML

Groq API (Llama 3), Hugging Face Transformers

Live Data

Meta (Facebook) Ad Library API

🏗 Project Architecture
The backend is built on a scalable, modular "Universal Adapter" pattern. Each ad platform (Meta, Google) has its own connector responsible for fetching data and translating it into a standardized internal format (StandardAd). This keeps the core logic clean and makes it easy to add new data sources without major refactoring.

⚙️ Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Ensure you have the following installed on your system:

Git

Python 3.10+

Node.js v18+ and npm

Installation
Clone the Repository

git clone https://github.com/GDGVITM/hackbuild-Invictus.git
cd hackbuild-Invictus

Backend Setup

# Navigate to the backend folder
cd backend

# Create and activate a Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate

# Install required packages
pip install -r requirements.txt

# Create a .env file from the example
cp .env.example .env

Now, open the .env file and add your API keys:

GROQ_API_KEY="your_groq_api_key"
META_ACCESS_TOKEN="your_meta_access_token"

Frontend Setup

# Navigate to the frontend folder
cd frontend-react

# Install npm packages
npm install

Running the Application
You will need two terminals open simultaneously.

Terminal 1 (Backend):

cd backend
source venv/bin/activate
uvicorn main:app --reload

Terminal 2 (Frontend):

cd frontend-react
npm start

Finally, open your browser to http://localhost:3000.

🏆 Hackathon
This project was developed for the GDGVITM Hackbuild 2.0 Hackathon.
