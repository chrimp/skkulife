from flask import Flask, request, render_template, redirect, url_for, jsonify, send_from_directory, session
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
import os
from dataclasses import dataclass

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'SuPeRsEcReTkEy'
jwt = JWTManager(app)
CORS(app)

@dataclass
class USER_CREDENTIAL:
    username: str
    password: str
    email: str
    groups: list[str]
    isVerified: bool

@dataclass
class EMAIL_VERIFICATION:
    email: str
    code: str

demo_credential = USER_CREDENTIAL("홍길동", "1234", "example1@example.com", ["group1", "group2", "group3"], True)
long_credential = USER_CREDENTIAL("aVerySuperDuperLongUsername", "1234", "example2@example.com", ["group1", "group2", "group3", "group4", "group5", "group6", "group7"], True)
verification_test_credential_1 = USER_CREDENTIAL("이메일인증테스트1", "1234", "verify@1.com", ["group1", "group2", "group3"], False)
verification_test_credential_2 = USER_CREDENTIAL("이메일인증테스트2", "1234", "verify@2.com", ["group1", "group2", "group3"], False)

email_verification_tests = [EMAIL_VERIFICATION("verify@1.com", "123456"),
                            EMAIL_VERIFICATION("verify@2.com", "111111")]

USER_CREDENTIALS = [demo_credential, long_credential, verification_test_credential_1, verification_test_credential_2]

@app.route('/')
def login():
    return render_template('signin.html')

@app.route('/main')
def group_main():
    return redirect(url_for('group_info'))

@app.route('/user/info')
@jwt_required()
def user_info():
    return jsonify(get_jwt_identity()), 200

@app.route('/info')
def info():
    return render_template('info.html')

@app.route('/login', methods=['POST'])
def do_login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        for user in USER_CREDENTIALS:
            if user.email == email and user.password == password:
                session['username'] = user.username
                session['email'] = user.email
                session['groups'] = user.groups
                return redirect(url_for('info'))

        return jsonify({"msg": f"Bad username or password: {email, password}"}), 401

    else:
        print("Not found credentials")
        return jsonify({"msg": "Not found"}), 404

@app.route('/auth/signin', methods=['POST'])
def signin():
    email = request.form.get('email')
    password = request.form.get('pwd')
    for user in USER_CREDENTIALS:
        if user.email == email and user.password == password:
            access_token = create_access_token(identity={'username': user.username, 'email': user.email, 'groups': user.groups})
            return jsonify(token=access_token), 201

    print(f"Bad username or password: {email, password}")
    return jsonify({"msg": f"Bad username or password: {email, password}"}), 401

@app.route('/signup', methods=['GET'])
def signup_template():
    return render_template('signup.html')

@app.route('/auth/signup', methods=['POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        #notification_agree = request.form.get('agree')

        if username in USER_CREDENTIALS:
            return jsonify({"msg": "User already exists"}), 400

        user_credential = USER_CREDENTIAL(username, password, email, [], False)
        USER_CREDENTIALS.append(user_credential)
        session['username'] = user_credential.username
        session['email'] = user_credential.email
        session['groups'] = user_credential.groups
        session['isVerified'] = user_credential.isVerified
        return redirect(url_for('info'))
    
    else:
        return jsonify({"msg": "Invalid request"}), 400
    
@app.route('/email-verification', methods=['GET'])
def email_verification():
    return render_template('email-verification.html')

@app.route('/auth/verify-code', methods=['POST'])
def verify_code():
    if request.method == 'POST':
        code = request.form.get('code')
        email = session['email']

        for verification in email_verification_tests:
            if verification.email == email and verification.code == code:
                for user in USER_CREDENTIALS:
                    if user.email == email:
                        user.isVerified = True
                        session['username'] = user.username
                        session['email'] = user.email
                        session['groups'] = user.groups
                        return redirect(url_for('info'))
    
    print("Verification Failed!")
    print(f"Email: {email}, Code: {code}")
    return jsonify({"msg": "Invalid code"}), 400

@app.route('/logout', methods=['POST'])
def logout():
    for session_key in list(session.keys()):
        session.pop(session_key)

    return redirect(url_for('login'))

@app.route('/write')
def write():
    return render_template('write.html')

@app.route('/templates/<path:filename>')
def serve_template(filename):
    return send_from_directory('templates', filename)

@app.route('/render/<path:filename>')
def render_template_file(filename):
    return render_template(filename)

@app.route('/group-info')
def group_info():
    return render_template('group-info.html')

@app.route('/html/<path:filename>')
def resolve_html_path(filename):
    return redirect(f'/{filename}', code=301)

@app.route('/<path:path>')
def catch_all(path):
    if os.path.exists(os.path.join('templates', f'{path}.html')):
        return render_template(f'{path}.html')
    else:
        return jsonify({"msg": "Not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)