import google.generativeai as genai

def resume_parser(resume_data, api_key):
    genai.configure(api_key=api_key)
    
    prompt = '''
    You are an AI bot designed to act as a professional for parsing resumes. You are given a resume, and your job is to extract the following information:
    1. Full Name
    2. Email
    3. Github Portfolio
    4. LinkedIn Profile
    5. Employment Details
    6. Technical Skills
    7. Soft Skills
    8. Education Details
    Provide the extracted information in JSON format.
    '''


    model = genai.GenerativeModel('gemini-1.5-flash')
    full_prompt = prompt + "\n\n" + resume_data
    response = model.generate_content(full_prompt)
    return response.candidates[0].content.parts[0].text