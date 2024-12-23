from flask import Blueprint
from controllers.resumeController import ResumeController


resume_routes = Blueprint("resume_routes", __name__)

# Define routes and map them to controller methods
resume_routes.add_url_rule(
    "/resumeExtract", methods=["POST"], view_func=ResumeController.upload_resume
)
