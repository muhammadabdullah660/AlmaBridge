import spacy
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import numpy as np
from pymongo import MongoClient

# Load the pre-trained GloVe model from spaCy
nlp = spacy.load("en_core_web_md")


class MatchmakingService:
    def __init__(self, mongo_uri, db_name, collection_name):
        self.mongo_uri = "mongodb://almabridge-mongodb:c6fANRO9ma2J5kqgbgm0bENUsd10z4Tczf2etQgvVS6UNJ5tQtLpiZtu2Ctmj3mFC9JVif45MRLrACDb515UQA==@almabridge-mongodb.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@almabridge-mongodb@" 
        self.db_name = "almabridge_mongodb"
        self.collection_name = "scraped_profiles"

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

    @staticmethod
    def compute_weighted_vector(row, weights):
        """
        Compute the weighted vector for a profile.
        """
        skill_vector = nlp(row["skills"]).vector * weights["skills"]
        bio_vector = nlp(row["bio"]).vector * weights["bio"]
        education_vector = nlp(row["education"]).vector * weights["education"]
        return skill_vector + bio_vector + education_vector

    def calculate_similarity_matrix(self, profiles, weights):
        """
        Compute similarity matrix for all profiles.
        """
        # Create a DataFrame from profiles
        df = pd.DataFrame(profiles)

        # Compute weighted vectors
        df["vector"] = df.apply(lambda row: self.compute_weighted_vector(row, weights), axis=1)

        # Compute similarity matrix
        vectors = np.stack(df["vector"].values)
        similarity_matrix = cosine_similarity(vectors)
        return df, similarity_matrix

    @staticmethod
    def recommend(user_index, df, similarity_matrix, threshold=0.85, top_n=3):
        """
        Generate recommendations for a given user.
        """
        scores = list(enumerate(similarity_matrix[user_index]))

        # Filter by threshold and exclude self
        filtered_scores = [
            (i, score) for i, score in scores if score > threshold and i != user_index
        ]

        # Sort by similarity
        filtered_scores = sorted(filtered_scores, key=lambda x: x[1], reverse=True)

        # Return top N recommendations
        return [(df.iloc[i]["name"], score) for i, score in filtered_scores[:top_n]]

    def get_recommendations(self, user_name, additional_profiles=None):
        """
        Main function to get recommendations for a user.
        """
        # Fetch profiles from MongoDB
        mongo_profiles = self.fetch_from_mongodb()

        # Separate and format data
        formatted_profiles = self.separate_profiles_data(mongo_profiles)

        # Combine MongoDB profiles with additional profiles if provided
        if additional_profiles:
            formatted_profiles += additional_profiles

        # Define weights for fields
        weights = {
            "skills": 0.6,
            "bio": 0.3,
            "education": 0.1,
        }

        # Compute similarity matrix
        df, similarity_matrix = self.calculate_similarity_matrix(formatted_profiles, weights)

        # Find the index of the target user
        try:
            user_index = df[df["name"] == user_name].index[0]
        except IndexError:
            return {"error": "User not found in the profiles."}

        # Get recommendations
        recommendations = self.recommend(user_index, df, similarity_matrix)
        return recommendations
