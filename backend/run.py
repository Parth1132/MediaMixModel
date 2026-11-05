"""
Run script for MediaMixModel FastAPI Backend Server
"""

import os
import sys
import uvicorn

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "127.0.0.1")
    print(f"🚀 Starting MediaMixModel FastAPI Server on http://{host}:{port}")
    print(f"📖 Swagger Documentation: http://{host}:{port}/docs")
    uvicorn.run("app.main:app", host=host, port=port, reload=False)
