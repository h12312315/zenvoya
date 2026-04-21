#!/usr/bin/env python3
import http.server
import os
import sys

os.chdir(os.path.dirname(os.path.abspath(__file__)))

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
print(f"Serving {os.getcwd()} on port {port} with no-cache headers")
http.server.HTTPServer(('', port), NoCacheHandler).serve_forever()
