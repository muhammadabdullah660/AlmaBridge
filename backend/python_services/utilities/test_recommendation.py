from matchmaking import MatchmakingService

def test_recommendation():
    # MongoDB connection parameters
    mongo_uri = "mongodb://almabridge-mongodb:c6fANRO9ma2J5kqgbgm0bENUsd10z4Tczf2etQgvVS6UNJ5tQtLpiZtu2Ctmj3mFC9JVif45MRLrACDb515UQA==@almabridge-mongodb.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@almabridge-mongodb@"

    db_name = "almabridge_mongodb"
    collection_name = "scraped_profiles"

    # Initialize the matchmaking service
    service = MatchmakingService(mongo_uri, db_name, collection_name)

    # Test data
    education = "BSc Computer Science from UET (2019-2023)"
    skills = "React, Python, Node, Mongo"
    bio = "A passionate computer scientist with interest in MERN"
    user_name = "Ali Hamza"  

    # Get recommendations
    recommendations = service.get_recommendations(education, skills, bio, user_name)

    # Display results
    if "error" in recommendations:
        print("Error:", recommendations["error"])
    else:
        print("Recommendations:")
        for name, score in recommendations:
            print(f"- {name} with a similarity score of {score:.4f}")

# Run the test
if __name__ == "__main__":
    test_recommendation()