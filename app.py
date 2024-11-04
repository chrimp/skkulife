from flask import Flask, request, render_template, redirect, url_for, jsonify, send_from_directory, session
import os
from dataclasses import dataclass

app = Flask(__name__)
app.secret_key = 'supersecretkey'

@dataclass
class USER_CREDENTIAL:
    username: str
    password: str
    email: str
    groups: list[str]

demo_credential = USER_CREDENTIAL("홍길동", "1234", "example1@example.com", ["group1", "group2", "group3"])
long_credential = USER_CREDENTIAL("aVerySuperDuperLongUsername", "1234", "example2@example.com", ["group1", "group2", "group3", "group4", "group5", "group6", "group7"])

USER_CREDENTIALS = [demo_credential, long_credential]

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/info')
def info():
    if 'username' not in session:
        return redirect(url_for('login'))
    username = session['username']
    email = session['email']
    groups = session['groups']
    return render_template('info.html', username=username, email=email, groups=groups)

@app.route('/login', methods=['POST'])
def handle_login():
    email = request.form.get('email')
    password = request.form.get('password')
    for user in USER_CREDENTIALS:
        if user.email == email and user.password == password:
            session['username'] = user.username
            session['email'] = user.email
            session['groups'] = user.groups
            return redirect(url_for('info'))

    return jsonify({"msg": f"Bad username or password: {email, password}"}), 401

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        notification_agree = request.form.get('agree')

        if username in USER_CREDENTIALS:
            return jsonify({"msg": "User already exists"}), 400

        user_credential = USER_CREDENTIAL(username, password, email, [])
        USER_CREDENTIALS.append(user_credential)
        session['username'] = user_credential.username
        session['email'] = user_credential.email
        session['groups'] = user_credential.groups
        return redirect(url_for('info'))
    else:
        return render_template('signup.html')

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
    group_users = [
        "User 1",
        "User 2",
        "User 3",
        "User 4",
        "User 5"
    ]
    return render_template('group-info.html', group_users=group_users)

@app.route('/<path:path>')
def catch_all(path):
    if os.path.exists(os.path.join('templates', f'{path}.html')):
        if 'username' not in session:
            return redirect(url_for('login'))
        return render_template(f'{path}.html')
    else:
        return jsonify({"msg": "Not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)