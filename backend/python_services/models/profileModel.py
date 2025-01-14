from pymongo import MongoClient
from bson.objectid import ObjectId
from schemas.profileSchema import ProfileSchema
import os
from dotenv import load_dotenv


base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # Go two levels up
dotenv_path = os.path.join(base_dir, '.env')

load_dotenv()


CLOUD_DB_URI = os.getenv('MONGO_DB_URI')
CLOUD_DB_NAME = os.getenv('MONGO_DB_NAME')

if not CLOUD_DB_NAME and CLOUD_DB_URI:
    raise ValueError(f"Environment variables not properly loaded from {dotenv_path}. Check your .env file.")

class ProfileModel:
    def __init__(self, db_url=CLOUD_DB_URI, db_name=CLOUD_DB_NAME):
        self.client = MongoClient(db_url)
        self.db = self.client[db_name]
        self.collection = self.db["profiles"]
    

    def insert_profiles(self, profile_data: dict) -> str:
        profile = ProfileSchema(**profile_data)
        result = self.collection.insert_one(profile.dict())
        return str(result.inserted_id)
    

    def find_profile(self, query) -> list:
        return list(self.collection.find(query))

    def update_profile(self, profile_id, updated_data):
        updated_data = ProfileSchema(**updated_data)
        return self.collection.update_one({"_id": ObjectId(profile_id)}, {"$set": updated_data.dict()})


    def delete_profile(self, profile_id):
        return self.collection.delete_one({"_id": ObjectId(profile_id)})
    
    def list_all_profiles(self) -> list:
        return list(self.collection.find())