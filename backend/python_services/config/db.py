from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # Go two levels up
dotenv_path = os.path.join(base_dir, '.env')

load_dotenv()


CLOUD_DB_URI = os.getenv('MONGO_DB_URI')
CLOUD_DB_NAME = os.getenv('MONGO_DB_NAME')

if not CLOUD_DB_NAME and CLOUD_DB_URI:
    raise ValueError(f"Environment variables not properly loaded from {dotenv_path}. Check your .env file.")

# Initialize MongoDB client
client = MongoClient(CLOUD_DB_URI)
db = client[CLOUD_DB_NAME]