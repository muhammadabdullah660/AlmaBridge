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

            # Validate required fields in user_data (add validation logic if necessary)
            
            # Get recommendations
            experience = user_data.get("experiences")
            education = user_data.get("educations")
            skills = user_data.get("skills")
            bio= user_data.get("bio")
            print("User experience:", experience)  # Debugging line
            print("User education:", education)  # Debugging line
            print("User skills:", skills)  # Debugging line
            print("User bio:", bio)  # Debugging line

            recommendations = MatchmakingService.get_recommendations(user_data.get("firstName"))
            return jsonify({"recommendations": recommendations}), 200
        except Exception as e:
            print("Error processing request:", str(e))  # Debugging line
            return jsonify({"error": str(e)}), 500
