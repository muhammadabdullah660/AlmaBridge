import spacy
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import numpy as np

# Load pre-trained GloVe model from spaCy
nlp = spacy.load("en_core_web_md")

# Sample data
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

# Create a DataFrame
df = pd.DataFrame(profiles)

# Function to compute weighted vectors for a profile
def compute_weighted_vector(row, weights):
    skill_vector = nlp(row["skills"]).vector * weights["skills"]
    bio_vector = nlp(row["bio"]).vector * weights["bio"]
    education_vector = nlp(row["education"]).vector * weights["education"]
    experience_vector = nlp(row["experiences"]).vector * weights["experiences"]
    return skill_vector + bio_vector + education_vector + experience_vector

# Define weights for different fields
weights = {
    "skills": 0.5,
    "bio": 0.3,
    "education": 0.1,
    "experiences": 0.1
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