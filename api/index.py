import sys
import os

# Resolve path to backend directory
current_dir = os.path.dirname(os.path.abspath(__file__))
candidate_paths = [
    os.path.abspath(os.path.join(current_dir, "..", "backend")),
    os.path.abspath(os.path.join(current_dir, "backend")),
    os.path.abspath(os.path.join(current_dir, "..")),
]

for path in candidate_paths:
    if os.path.exists(os.path.join(path, "app", "main.py")):
        if path not in sys.path:
            sys.path.insert(0, path)
        break

from app.main import app
