from io import BytesIO
import PyPDF2
import docx
import logging

ALLOWED_EXTENSIONS = {'pdf', 'docx'}

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
        logging.error(f"Error extracting text from PDF: {e}")
        return None

def extract_text_from_doc(file):
    try:
        file_stream = BytesIO(file.read())
        doc = docx.Document(file_stream)
        text = '\n'.join([para.text for para in doc.paragraphs])
        return text
    except Exception as e:
        logging.error(f"Error extracting text from DOC: {e}")
        return None
