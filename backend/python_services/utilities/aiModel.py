import google.generativeai as genai
import json

def resume_parser(resume_data, api_key):
    # Configure API key
    genai.configure(api_key=api_key)
    # Define the prompt for the model
    prompt = '''
    You are an AI bot designed to act as a professional for parsing resumes. You are given a resume, and your job is to extract the following information:
    - Name
    - Email
    - Phone Number
    - Address
    - Work Experience
    - Skills
    - Education
    - Certifications
    - Projects
    - Languages
    - Hobbies
    - References
    
    Provide the extracted information in JSON format.
    '''
    
    # Generate content using the model
    model = genai.GenerativeModel('gemini-1.5-flash')
    full_prompt = prompt + "\n\n" + resume_data
    response = model.generate_content(full_prompt)
    
    # Get the raw string from the response
    parsed_data = response.candidates[0].content.parts[0].text

    # Print the raw response for debugging (optional)
    print(f"Raw response: {parsed_data}")
    
    # Try to clean and parse the response string
    try:
        # Remove any unwanted characters or wrapping that may prevent valid JSON parsing
        cleaned_response = parsed_data.strip()

        # Ensure there are no extra characters or issues around the string (such as misplaced quotes)
        if cleaned_response.startswith("```json"):
            cleaned_response = cleaned_response[len("```json"):].strip()
        if cleaned_response.endswith("```"):
            cleaned_response = cleaned_response[:-3].strip()

        # Now attempt to parse it as JSON
        return json.loads(cleaned_response)
    except json.JSONDecodeError as e:
        # If parsing fails, log the error and return a structured error response
        print(f"Error parsing JSON: {e}")
        return {'error': 'Failed to parse resume data'}
