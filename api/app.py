from flask import Flask, request, jsonify
from flask_cors import CORS
from pdfminer.high_level import extract_text
from werkzeug.utils import secure_filename
from extract_text_with_layout import extract_text_with_layout
import os

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/extract-text', methods=['POST'])
def extract_text_from_pdf():
    if 'file' not in request.files:
        return jsonify(error="Aucun fichier fourni."), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify(error="Aucun fichier sélectionné."), 400
    
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    try:
        extracted_text = extract_text_with_layout(filepath)
        return jsonify({"text": extracted_text})
    except Exception as e:
        return jsonify(error=str(e)), 500
    finally:
        os.remove(filepath)  # Supprimer le fichier après extraction

if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True)

