🚀 AI-Driven Performance Marketing SaaS
An intelligent SaaS platform that empowers marketers to analyze competitor strategies and generate high-performing ad campaigns using generative AI.

![WhatsApp Image 2025-08-22 at 01 28 31_75a061b9](https://github.com/user-attachments/assets/0821140c-b5b6-41e3-a747-e9d30ee2ec24)


🎯 Problem Statement
Marketers spend millions on digital ads but often struggle to create effective campaigns due to a lack of insight into competitor strategies and market trends. While ad transparency APIs exist, businesses lack a single, intelligent system to collect, analyze, and act on this competitive intelligence, leading to wasted ad spend and missed opportunities.

Our solution is a unified platform that leverages AI to provide deep competitor analytics and automates the creative process, helping businesses maximize their return on investment (ROI).

✨ Core Features
Live Competitor Discovery: Users can describe their product in natural language, and the application's AI will identify relevant search terms and discover active competitors using the live Meta Ad Library API.

Competitor Ad Feed: Displays a real-time feed of competitor ads, providing a direct view into their current marketing strategies.

AI-Powered Text Analysis: Each ad is automatically analyzed using a Hugging Face NLP model to determine its primary tone (e.g., Urgent, Inspirational, Informative), providing instant insights into their messaging.

Interactive AI Strategy Simulator: The centerpiece of the application. Users can set a creative direction (tone, visual style) for their campaign, and the Groq Llama 3 generative AI will produce:

Multiple unique ad headlines.

Compelling ad body copy.

A descriptive prompt for generating a visual with a text-to-image AI.

Explainable AI (XAI): The simulator doesn't just provide content; it explains why the generated campaign is a good strategy, building user trust and providing actionable marketing knowledge.

Simulated Real-Time Alerts: A feature that actively checks for and notifies the user of newly launched competitor ad campaigns, ensuring they never miss a strategic move.

🛠 Technology Stack
Backend: Python, FastAPI, Uvicorn

AI / Machine Learning:

Generative AI: Groq API (Llama 3)

NLP Analysis: Hugging Face Transformers (BART Large MNLI)

Frontend: React.js, Plain CSS

Live Data: Meta (Facebook) Ad Library API

🏗 Project Architecture
The backend is built on a scalable, modular "Universal Adapter" pattern. Each ad platform (Meta, Google) has its own connector responsible for fetching data and translating it into a standardized internal format (StandardAd). This allows the main application logic to remain clean and makes it trivial to add new data sources in the future without refactoring the core services.

⚙ Setup and Installation
To run this project locally, please follow these steps:

Prerequisites
Git

Python 3.10+

Node.js v18+ and npm

1. Clone the Repository
git clone https://github.com/GDGVITM/hackbuild-Invictus.git
cd hackbuild-Invictus

2. Backend Setup
# Navigate to the backend folder
cd backend

# Create and activate a Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate

# Install required packages
pip install -r requirements.txt

# Create a .env file and add your API keys
cp .env.example .env
# Now, edit the .env file with your actual keys

.env file structure:

GROQ_API_KEY="your_groq_api_key"
META_ACCESS_TOKEN="your_meta_access_token"

3. Frontend Setup
# Navigate to the frontend folder
cd frontend-react

# Install npm packages
npm install

4. Running the Application
You will need two terminals open simultaneously.

Terminal 1 (Backend):

cd backend
source venv/bin/activate
uvicorn main:app --reload

Terminal 2 (Frontend):

cd frontend-react
npm start

Open your browser to http://localhost:3000.

🏆 Hackathon
This project was developed for the GDGVITM Hackbuild 2.0 Hackathon.
