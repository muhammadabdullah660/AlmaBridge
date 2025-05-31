from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.profileRoutes import profile_routes
from routes.resumeRoutes import resume_routes
from routes.matchmakingRoutes import recommendation_routes

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "x-user-role", "x-user-id"],
        "supports_credentials": True
    }
})

CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
app.register_blueprint(profile_routes, url_prefix="/api")
app.register_blueprint(resume_routes, url_prefix="/api")
app.register_blueprint(recommendation_routes, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True, port=5001)