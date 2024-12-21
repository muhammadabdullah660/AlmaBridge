from flask import Blueprint
from controllers.profileController import ProfileController


profile_routes = Blueprint("profile_routes", __name__)

# Define routes and map them to controller methods
profile_routes.add_url_rule(
    "/profiles", methods=["POST"], view_func=ProfileController.add_profile
)

profile_routes.add_url_rule(
    "/profiles", methods=["GET"], view_func=ProfileController.list_profiles
)

profile_routes.add_url_rule(
    "/profiles/<string:profile_id>", methods=["GET"], view_func=ProfileController.get_profile
)

profile_routes.add_url_rule(
    "/profiles/<string:profile_id>", methods=["PUT"], view_func=ProfileController.update_profile
)

profile_routes.add_url_rule(
    "/profiles/<string:profile_id>", methods=["DELETE"], view_func=ProfileController.delete_profile
)
