import spacy
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import numpy as np
import requests  # To make HTTP requests
from pymongo import MongoClient
# Load pre-trained GloVe model from spaCy
nlp = spacy.load("en_core_web_md")

profiles = [
    {
        "name": "Student A",
        "skills": "Machine Learning, Artificial Intelligence",
        "bio": "Passionate about AI research and development.",
        "education": "BS Computer Science",
        "experiences": "Interned at ABC Tech, Research Assistant in AI lab"
    },
    {
        "name": "Alumnus B",
        "skills": "ML, Deep Learning, Data Science, Python",
        "bio": "Experienced Data Scientist with a strong ML focus.",
        "education": "MS Data Science",
        "experiences": "Data Scientist at XYZ Corp, Kaggle Competitor"
    },
    {
        "name": "Alumnus C",
        "skills": "Cloud Computing, DevOps",
        "bio": "Enthusiast in scalable cloud solutions and automation.",
        "education": "BS Software Engineering",
        "experiences": "DevOps Engineer at CloudTech"
    },
    {
        "name": "Alumnus D",
        "skills": "Deep Learning, Data Analysis",
        "bio": "Specialized in predictive analytics and DL.",
        "education": "PhD Computer Vision",
        "experiences": "Postdoc researcher, Consultant in analytics"
    },
]

# Node.js API URL
api_url = "http://127.0.0.1:3001/api/userProfiles"  # Update with your actual API endpoint

# MongoDB Connection Details
mongo_uri = "mongodb://almabridge-mongodb:c6fANRO9ma2J5kqgbgm0bENUsd10z4Tczf2etQgvVS6UNJ5tQtLpiZtu2Ctmj3mFC9JVif45MRLrACDb515UQA==@almabridge-mongodb.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@almabridge-mongodb@"  # Replace with your MongoDB URI
database_name = "almabridge_mongodb"  # Replace with your database name
collection_name = "scraped_profiles"  # Replace with your collection name

# Fetch data from Node.js API
def fetch_profiles(api_url):
    try:
        response = requests.get(api_url)
        response.raise_for_status()  # Raise an error for bad status codes
        return response.json()  # Assuming API returns JSON
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from API: {e}")
        return []


# Fetch profiles dynamically
# profiles = fetch_profiles(api_url)
# print("Fetched profiles:", profiles)

if not profiles:
    print("No profiles fetched. Ensure the API is running and accessible.")
    exit()

def fetch_from_mongodb(uri, db_name, collection_name, query={}):
    try:
        # Connect to MongoDB
        client = MongoClient(uri)
        db = client[db_name]
        collection = db[collection_name]
        
        # Fetch documents matching the query
        documents = list(collection.find(query))
        return documents
    except Exception as e:
        print(f"Error fetching data from MongoDB: {e}")
        return []

mongo_profiles = fetch_from_mongodb(mongo_uri, database_name, collection_name)
# print("Fetched profiles from MongoDB:", mongo_profiles)
def format_education(education_list):
    if not education_list or not isinstance(education_list, list):
        return "N/A"
    return "; ".join(
        f"{entry.get('Degree', 'N/A')} from {entry.get('School', 'N/A')} ({entry.get('Duration', 'N/A')})"
        for entry in education_list
    )
# separate the profiles data like Name, Skills, Bio, Education, Experiences
def separate_profiles_data(profiles):
    formatted_profiles = [
        {
            "name": profile.get("name", "N/A"),
            "skills": ", ".join(profile.get("skills", [])), 
            "bio": profile.get("about", "N/A"),
            "education": format_education(profile.get("education", [])),
            # "experiences": ", ".join(profile.get("experiences", [])), 
        }
        for profile in profiles
    ]
    return formatted_profiles
print("Mongo profiles:", mongo_profiles)
separated_data = separate_profiles_data(mongo_profiles)
# print("Separated data:", separated_data)
separated_data=separated_data+profiles
# Create a DataFrame
df = pd.DataFrame(separated_data)

# Function to compute weighted vectors for a profile
def compute_weighted_vector(row, weights):
    skill_vector = nlp(row["skills"]).vector * weights["skills"]
    bio_vector = nlp(row["bio"]).vector * weights["bio"]
    education_vector = nlp(row["education"]).vector * weights["education"]
    # experience_vector = nlp(row["experiences"]).vector * weights["experiences"]
    return skill_vector + bio_vector + education_vector 

# Define weights for different fields
weights = {
    "skills": 0.6,
    "bio": 0.3,
    "education": 0.1,
    # "experiences": 0.1
}

# Compute weighted vectors for all profiles
df['vector'] = df.apply(lambda row: compute_weighted_vector(row, weights), axis=1)

# Compute similarity matrix
def calculate_similarity_matrix(vectors):
    return cosine_similarity(vectors)

vectors = np.stack(df['vector'].values)
similarity_matrix = calculate_similarity_matrix(vectors)

# Function to recommend matches
def recommend(user_index, similarity_matrix, threshold=0.85, top_n=3):
    scores = list(enumerate(similarity_matrix[user_index]))
    
    # Debugging: Print similarity scores
    for i, score in scores:
        print(f"Similarity with {df.iloc[i]['name']}: {score}")

    # Filter scores by threshold and exclude self
    filtered_scores = [
        (i, score) for i, score in scores if score > threshold and i != user_index
    ]
    
    # Sort scores by similarity
    filtered_scores = sorted(filtered_scores, key=lambda x: x[1], reverse=True)
    
    # Return top N recommendations with names and scores
    return [(df.iloc[i]["name"], score) for i, score in filtered_scores[:top_n]]

# Example: Recommendations for Student A
student_index = df[df['name'] == "Student A"].index[0]
recommendations = recommend(user_index=student_index, similarity_matrix=similarity_matrix)
print("Recommendations:", recommendations)