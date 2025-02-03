from bson.objectid import ObjectId
from schemas.profileSchema import ProfileSchema
from config.db import db

class ProfileModel:
    def __init__(self):
        self.collection = db["scraped_profiles"]
    

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