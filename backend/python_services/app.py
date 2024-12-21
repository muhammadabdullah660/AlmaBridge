from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.profileRoutes import profile_routes
from routes.resumeRoutes import resume_routes

app = Flask(__name__)
CORS(app)


app.register_blueprint(profile_routes, url_prefix="/api")
app.register_blueprint(resume_routes, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)