import os
from dotenv import load_dotenv
from io import BytesIO
from flask import Flask, request, jsonify
import PyPDF2
import docx
from werkzeug.utils import secure_filename
from aiModel import resume_parser

app = Flask(__name__)
ALLOWED_EXTENSIONS = {'pdf', 'docx'}
API_KEY = os.getenv("API_KEY")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(file):
    try:
        text = ""
        reader = PyPDF2.PdfReader(file)
        for page_no in range(len(reader.pages)):
            text += reader.pages[page_no].extract_text()
        return text
    except Exception as e:
        app.logger.error(f"Error extracting text from PDF: {e}")
        return None

def extract_text_from_doc(file):
    try:
        file_stream = BytesIO(file.read())
        doc = docx.Document(file_stream)
        text = '\n'.join([para.text for para in doc.paragraphs])
        return text
    except Exception as e:
        app.logger.error(f"Error extracting text from DOC: {e}")
        return None

@app.route('/api/resume_processor', methods=['POST'])
def resume_processor():
    if 'file' not in request.files:
        return jsonify({'error': 'No file attached'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)

        file_extension = os.path.splitext(filename)[1].lower()
        if file_extension == ".pdf":
            extracted_text = extract_text_from_pdf(file)
        elif file_extension == ".docx":
            extracted_text = extract_text_from_doc(file)
        else:
            return jsonify({'error': 'Unsupported file format'}), 400

        if extracted_text is None:
            return jsonify({'error': 'Failed to extract text from file'}), 500

        resume_data = resume_parser(extracted_text, API_KEY)
        return jsonify({'resume_data': resume_data})

    return jsonify({'error': 'File type not allowed'}), 400

if __name__ == "__main__":
    app.run(debug=True)