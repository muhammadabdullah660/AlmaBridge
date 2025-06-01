from flask import Blueprint
from controllers.recommendationController import RecommendationController

# Create a Blueprint for recommendation routes
recommendation_routes = Blueprint("recommendation_routes", __name__)

# Define route for fetching recommendations
recommendation_routes.add_url_rule(
    "/recommend", methods=["POST"], view_func=RecommendationController.recommend_profiles
)

recommendation_routes.add_url_rule(
    "/people", methods=["POST"], view_func=RecommendationController.people_profiles
)
