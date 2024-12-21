import os
from dotenv import load_dotenv
from flask import request, jsonify
from werkzeug.utils import secure_filename
from utilities.aiModel import resume_parser
from utilities.resumePreprocessor import allowed_file, extract_text_from_doc, extract_text_from_pdf

API_KEY = os.getenv("API_KEY")

class ResumeController:

    @staticmethod
    def upload_resume():
        try:
            if 'file' not in request.files:
                return jsonify({'error': 'No file attached'}), 400
            
            file = request.files['file']

            if file.filename == '':
                return jsonify({'error': 'No selected file'}), 400
            
            if file and allowed_file(file.filename):
                fileName = secure_filename(file.filename)
                file_extension = os.path.splitext(fileName)[1].lower()
                extracted_text = None
                if file_extension == ".pdf":
                    extracted_text = extract_text_from_pdf(file)
                elif file_extension == ".docx":
                    extracted_text = extract_text_from_doc(file)
                else:
                    return jsonify({'error': 'Unsupported file format'}), 400

                if extracted_text is None:
                    return jsonify({'error': 'Failed to extract text from file'}), 500
                
                resume_data = resume_parser(extracted_text, API_KEY)
                return jsonify({'resume_data': resume_data}), 200
            
            return jsonify({'error': 'File type not allowed'}), 400
        except Exception as e:
            return jsonify({'error': 'Server error', 'details': str(e)}), 500
