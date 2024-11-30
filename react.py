from flask import Flask, send_from_directory, abort
import os

app = Flask(__name__, static_folder='./')

# Serve the signin.html for the root route
@app.route('/')
def index():
    return send_from_directory(os.path.join(app.static_folder, 'templates'), 'signin.html')

# Serve other HTML files from the templates directory
@app.route('/<path:filename>')
def serve_html(filename):
    # Check if the request is for a file without an extension
    if '.' not in filename:
        filename_html = filename + '.html'
        file_path_html = os.path.join(app.static_folder, 'templates', filename_html)
        if os.path.exists(file_path_html):
            return send_from_directory(os.path.join(app.static_folder, 'templates'), filename_html)
        else:
            return send_from_directory(app.static_folder, 'index.html')
    
    # Serve the file if it exists
    file_path = os.path.join(app.static_folder, filename)
    if os.path.exists(file_path):
        return send_from_directory(app.static_folder, filename)
    else:
        abort(404)

@app.errorhandler(404)
def not_found(e):
    return "404 Not Found", 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)