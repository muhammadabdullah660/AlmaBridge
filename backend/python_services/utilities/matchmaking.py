import spacy
import pandas as pd
import numpy as np
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

class MatchmakingService:
    def __init__(self, mongo_uri, db_name, collection_name):
        self.mongo_uri = "mongodb://almabridge-mongodb:c6fANRO9ma2J5kqgbgm0bENUsd10z4Tczf2etQgvVS6UNJ5tQtLpiZtu2Ctmj3mFC9JVif45MRLrACDb515UQA==@almabridge-mongodb.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@almabridge-mongodb@"
        self.db_name = "almabridge_mongodb"
        self.collection_name = "scraped_profiles"
        
        # Load the sentence transformer model for AI-based embeddings
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

    def fetch_from_mongodb(self, query={}):
        """
        Fetch profiles from MongoDB.
        """
        try:
            client = MongoClient(self.mongo_uri)
            db = client[self.db_name]
            collection = db[self.collection_name]
            documents = list(collection.find(query))
            return documents
        except Exception as e:
            print(f"Error fetching data from MongoDB: {e}")
            return []

    @staticmethod
    def format_education(education_list):
        """
        Format the education field for profiles.
        """
        if not education_list or not isinstance(education_list, list):
            return "N/A"
        return "; ".join(
            f"{entry.get('Degree', 'N/A')} from {entry.get('School', 'N/A')} ({entry.get('Duration', 'N/A')})"
            for entry in education_list
        )

    def separate_profiles_data(self, profiles):
        """
        Format profile data for processing.
        """
        formatted_profiles = [
            {
                "name": profile.get("name", "N/A"),
                "skills": ", ".join(profile.get("skills", [])),
                "bio": profile.get("about", "N/A"),
                "education": self.format_education(profile.get("education", [])),
            }
            for profile in profiles
        ]
        return formatted_profiles

    def compute_profile_embeddings(self, profiles):
        """
        Compute sentence embeddings for profiles using a language model.
        """
        profile_texts = [
            f"{profile['bio']} {profile['skills']} {profile['education']}"
            for profile in profiles
        ]
        embeddings = self.embedding_model.encode(profile_texts, convert_to_tensor=True)
        return embeddings

    def recommend(self, user_embedding, all_embeddings, profiles, top_n=3):
        """
        AI-based recommendation based on learned embeddings.
        """
        # Compute cosine similarity between user and all profile embeddings
        similarity_scores = cosine_similarity([user_embedding], all_embeddings)[0]

        # Sort by similarity, excluding the user from the results
        sorted_indices = np.argsort(similarity_scores)[::-1]
        
        # Get top N recommendations (excluding self-recommendation)
        recommendations = []
        for idx in sorted_indices:
            if profiles[idx]["name"] != "N/A":  # Make sure it's not the user's own profile
                recommendations.append((profiles[idx]["name"], similarity_scores[idx]))
            if len(recommendations) >= top_n:
                break
        
        return recommendations

    def get_recommendations(self, education, skills, bio, user_name):
        """
        Main function to get recommendations for a user.
        """
        # Fetch profiles from MongoDB
        mongo_profiles = self.fetch_from_mongodb()

        # Separate and format data
        formatted_profiles = self.separate_profiles_data(mongo_profiles)

        if not formatted_profiles:
            return {"error": "No profiles found in the database."}

        # Compute profile embeddings
        embeddings = self.compute_profile_embeddings(formatted_profiles)

        # Compute the user embedding
        user_input_text = f"{bio} {skills} {education}"
        user_embedding = self.embedding_model.encode(user_input_text, convert_to_tensor=True)

        # Get AI-based recommendations
        recommendations = self.recommend(user_embedding, embeddings, formatted_profiles)

        return recommendations