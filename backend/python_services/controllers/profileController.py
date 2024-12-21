from flask import request, jsonify
from bson.objectid import ObjectId
from schemas.profileSchema import ProfileSchema
from models.profileModel import ProfileModel
from utilities.scraper import scrape_profile

# Initialize the model
profile_model = ProfileModel()

class ProfileController:
    
    @staticmethod
    def add_profile():
        try:
            # Extract URL from the request
            data = request.get_json()
            profile_url = data.get("profile_url")
            
            if not profile_url:
                return jsonify({"message": "Profile URL is required"}), 400

            # Scrape and validate data
            scraped_data = scrape_profile(profile_url)
            if not scraped_data:
                return jsonify({"message": "Failed to scrape profile data"}), 400

            validated_profile = ProfileSchema(**scraped_data)
            
            # Insert into the database
            profile_id = profile_model.insert_profiles(validated_profile.dict())
            return jsonify({"message": "Profile added successfully", "profile_id": profile_id}), 201

        except Exception as e:
            return jsonify({"message": "Server error", "error": str(e)}), 500

    @staticmethod
    def list_profiles():
        try:
            # Fetch profiles from the database
            profiles = profile_model.list_all_profiles()

            # Convert ObjectId to string
            formatted_profiles = [
                {**profile, "_id": str(profile["_id"])} for profile in profiles
            ]
            return jsonify({"profiles": formatted_profiles}), 200

        except Exception as e:
            return jsonify({"message": "Server error", "error": str(e)}), 500

    @staticmethod
    def get_profile(profile_id):
        try:
            if not ObjectId.is_valid(profile_id):
                return jsonify({"message": "Invalid profile ID"}), 400
            
            profiles = profile_model.find_profile({"_id": ObjectId(profile_id)})
            if not profiles:
                return jsonify({"message": "Profile not found"}), 404

            profile = profiles[0]
            profile["_id"] = str(profile["_id"])
            return jsonify(profile), 200

        except Exception as e:
            return jsonify({"message": "Server error", "error": str(e)}), 500

    @staticmethod
    def update_profile(profile_id):
        try:
            if not ObjectId.is_valid(profile_id):
                return jsonify({"message": "Invalid profile ID"}), 400

            updated_data = request.get_json()
            validated_data = ProfileSchema(**updated_data)
            
            result = profile_model.update_profile(profile_id, validated_data.dict())
            if result.matched_count == 0:
                return jsonify({"message": "Profile not found"}), 404
            
            return jsonify({"message": "Profile updated successfully"}), 200

        except Exception as e:
            return jsonify({"message": "Server error", "error": str(e)}), 500

    @staticmethod
    def delete_profile(profile_id):
        try:
            if not ObjectId.is_valid(profile_id):
                return jsonify({"message": "Invalid profile ID"}), 400

            result = profile_model.delete_profile(profile_id)
            if result.deleted_count == 0:
                return jsonify({"message": "Profile not found"}), 404
            
            return jsonify({"message": "Profile deleted successfully"}), 200

        except Exception as e:
            return jsonify({"message": "Server error", "error": str(e)}), 500
