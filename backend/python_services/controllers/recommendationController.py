from flask import request, jsonify
from utilities.matchmaking import MatchmakingService

class RecommendationController:
    @staticmethod
    def recommend_profiles():
        try:
            # Get user data from the request
            user_data = request.get_json()
            print("Received user data:", user_data)  # Debugging line
            if not user_data:
                return jsonify({"error": "Invalid input. User data is required."}), 400

            # Extract profile data safely
            profile = user_data.get("data", {}).get("profile", {})
            if not profile:
                return jsonify({"error": "Profile data missing."}), 400

            # Extract and process education
            educations_list = profile.get("educations", [])
            education_string = ", ".join(
                [f"{edu.get('degree', '')} at {edu.get('institute', '')}" for edu in educations_list]
            )
            print("Education String:", education_string)  # Debugging line

            # Extract and process skills
            skills_list = profile.get("skills", [])
            skills_string = ", ".join([skill.get("skillName", "") for skill in skills_list])
            print("Skills String:", skills_string)  # Debugging line

            # Extract bio directly
            bio_string = profile.get("bio", "")
            print("Bio String:", bio_string)  # Debugging line

            # For additional fields like email/lastName if needed
            email = user_data.get("data", {}).get("email", "")
            last_name = user_data.get("data", {}).get("lastName", "")

            print("Email:", email)  # Debugging line
            print("Last Name:", last_name)  # Debugging line
            
            # Get recommendations
            
            # print("User experience:", experience)  # Debugging line
            # print("User education:", education)  # Debugging line
            # print("User skills:", skills)  # Debugging line
            # print("User bio:", bio)  # Debugging line
            s = MatchmakingService()
            recommendations = s.get_recommendations(education_string, skills_string, bio_string)
            # recommendations = s.fetch_from_mongodb()
            return jsonify({"recommendations": recommendations}), 200
        except Exception as e:
            print("Error processing request:", str(e))  # Debugging line
            return jsonify({"error": str(e)}), 500
    @staticmethod
    def people_profiles():
        try:
            s = MatchmakingService()
            # recommendations = s.get_recommendations(education, skills, bio)
            recommendations = s.fetch_from_mongodb()
            return jsonify({"recommendations": recommendations}), 200
        except Exception as e:
            print("Error processing request:", str(e))  # Debugging line
            return jsonify({"error": str(e)}), 500
