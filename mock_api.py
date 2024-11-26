import json
from http.server import BaseHTTPRequestHandler, HTTPServer
import socket
import subprocess
import winreg

def process_received_headers(inst: BaseHTTPRequestHandler):
    content_length = int(inst.headers['Content-Length'])
    data = inst.rfile.read(content_length)
    data = json.loads(data.decode('utf-8'))
    return data

def raiseIfNotJSON(inst: BaseHTTPRequestHandler):
    if inst.headers['Content-Type'] != 'application/json':
        inst.send_response(415)
        inst.end_headers()
        return True
    return False

def raiseIfNotMultipart(inst: BaseHTTPRequestHandler):
    if inst.headers['Content-Type'] != 'multipart/form-data':
        inst.send_response(415)
        inst.end_headers()
        return True
    return False

class MockAPI(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/auth/signin':
            if raiseIfNotJSON(self): return
            post_data = process_received_headers(self)

            if not (post_data['email'] and post_data['pwd']):
                self.send_response(400)

            response = {"token": "placeholder"} # Mock JWT token here
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))

        if self.path == '/auth/signup':
            if raiseIfNotMultipart(self): return
            post_data = process_received_headers(self)

            if not (post_data['email'] and post_data['pwd'] and post_data['nickname'] and post_data['profile']):
                self.send_response(400)
            
            response = {"email": post_data['email'],
                        "role": "placeholder",
                        "isVerified": True}
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))

        if self.path == '/auth/verify-code':
            if raiseIfNotJSON(self): return
            post_data = process_received_headers(self)

            if not (post_data['email'] and post_data['code']):
                self.send_response(400)
            
            self.send_response(201)
            self.end_headers()

        if self.path == '/auth/change-pwd':
            if raiseIfNotJSON(self): return
            post_data = process_received_headers(self)

            if not (post_data['pwd']):
                self.send_response(400)
            
            self.send_response(201)
            self.end_headers()

        if self.path == '/class/create-class':
            if raiseIfNotJSON(self): return
            post_data = process_received_headers(self)

            if not(post_data['className'] and
                   post_data['classDescription'] and
                   post_data['classCode'] and
                   post_data['classDate'] and
                   post_data['classStartTime'] and
                   post_data['classEndTime'] and
                   post_data['voteEnd'] and
                   post_data['votePercent'] and
                   post_data['penaltyType']):
                self.send_response(400)
            
            response = {"className": post_data['className'],
                        "classDescription": post_data['classDescription'],
                        "classCode": post_data['classCode'],
                        "classDate": ["placeholder"],
                        "classStartTime": post_data['classStartTime'],
                        "classEndTime": post_data['classEndTime'],
                        "voteEnd": 0,
                        "votePercent": 0,
                        "penaltyType": 0,
                        "classMember": ["placeholder"]}
            
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))

        if self.path == '/class/update-class':
            if raiseIfNotJSON(self): return
            post_data = process_received_headers(self)

            if not(post_data['className'] and
                   post_data['classDescription'] and
                   post_data['classCode'] and
                   post_data['classDate'] and
                   post_data['classStartTime'] and
                   post_data['classEndTime'] and
                   post_data['voteEnd'] and
                   post_data['votePercent'] and
                   post_data['penaltyType']):
                self.send_response(400)

            response = {"className": post_data['className'],
                        "classDescription": post_data['classDescription'],
                        "classCode": post_data['classCode'],
                        "classDate": ["placeholder"],
                        "classStartTime": post_data['classStartTime'],
                        "classEndTime": post_data['classEndTime'],
                        "voteEnd": 0,
                        "votePercent": 0,
                        "penaltyType": 0,
                        "classMember": ["placeholder"]}
            
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))

        if self.path == '/class/delete-class':
            if raiseIfNotJSON(self): return
            post_data = process_received_headers(self)

            if not(post_data['classId']):
                self.send_response(400)
            
            self.send_response(201)
            self.end_headers()
        
        if self.path == '/class/join-class':
            if raiseIfNotJSON(self): return
            post_data = process_received_headers(self)

            if not(post_data['classCode']):
                self.send_response(400)
            
            response = {"className": "placeholder",
                        "classDescription": "placeholder",
                        "classCode": "placeholder",
                        "classDate": ["placeholder"],
                        "classStartTime": "placeholder",
                        "classEndTime": "placeholder",
                        "voteEnd": 0,
                        "votePercent": 0,
                        "penaltyType": 0,
                        "classMember": ["placeholder"]}
            
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))

        if self.path == '/class/leave-class':
            if raiseIfNotJSON(self): return
            post_data = process_received_headers(self)

            if not(post_data['classId']):
                self.send_response(400)
            
            self.send_response(201)
            self.end_headers()

        if self.path == '/verification/vote':
            if raiseIfNotJSON(self): return
            post_data = process_received_headers(self)

            if not post_data['verificationId']:
                self.send_response(400)

            response = {"verifications": ["placeholder"]}
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))

        if self.path == '/verification/upload':
            if raiseIfNotMultipart(self): return
            post_data = process_received_headers(self)

            if not post_data['verification']:
                self.send_response(400)
            
            response = {"verifications": ["placeholder"]}
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
    def do_GET(self):
        if self.path == '/user/info':
            response = {"userName": "placeholder",
                        "userImage": "placeholder",
                        "email": "placeholder",
                        "userClass": ["placeholder"]}
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))

        if self.path.startswith('/class/'):
            if self.path.find('statistics'):
                response = {"date": "placeholder"}
                self.send_response(201)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode('utf-8'))
            else:
                response = {"className": "placeholder",
                            "classDescription": "placeholder",
                            "classCode": "placeholder",
                            "classDate": ["placeholder"],
                            "classStartTime": "placeholder",
                            "classEndTime": "placeholder",
                            "voteEnd": 0,
                            "votePercent": 0,
                            "penaltyType": 0,
                            "classMember": ["placeholder"]}
                self.send_response(201)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode('utf-8'))

        if self.path.startswith('verification'):
            response = {"verifications": ["placeholder"]}
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))

        if self.path.startswith('penalty'):
            response = {"penaltyLogs": ["placeholder"]}
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))

def findPort():
    for port in range(5000, 5100):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('0.0.0.0', port))
                s.listen(1)
                s.close()
            return port
        except OSError:
            continue

    return None

def get_ipv4_addresses():
    ip_addresses = [i[4][0] for i in socket.getaddrinfo(socket.gethostname(), None) if i[0] == socket.AF_INET]
    interfaces = subprocess.check_output("ipconfig", shell=True).decode('cp949').split('\n')
    
    filtered_ips = []
    for ip in ip_addresses:
        for line in interfaces:
            if ip in line and not any(virtual in line for virtual in ["Virtual", "VMware", "Hyper-V", "vEthernet"]):
                filtered_ips.append(ip)
                break
        else:
            print(f"Filtering out {ip}")
    
    return filtered_ips

def run():
    port = findPort()
    if port is None:
        print("No available ports in range")
        return
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, MockAPI)

    ip = get_ipv4_addresses()
    
    print("Server is running on all addresses")
    for i in ip:
        print(f"Server started on http://{i}:{port}")
    print("\033[0;93mHit CTRL+C to stop\033[0m")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt: pass

if __name__ == '__main__':
    run()
