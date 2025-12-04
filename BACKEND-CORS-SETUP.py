# BACKEND CORS CONFIGURATION FOR FASTAPI
# Add this to your main.py or wherever you initialize your FastAPI app

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ============================================
# CORS CONFIGURATION - ADD THIS MIDDLEWARE
# ============================================

# List of allowed origins (frontend URLs)
origins = [
    "http://localhost:3000",      # React dev server (Vite default)
    "http://localhost:5173",      # Vite alternative port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    # Add your production domain when deploying
    # "https://yourdomain.com",
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,              # Allowed origins
    allow_credentials=True,             # Allow cookies
    allow_methods=["*"],                # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],                # Allow all headers
    expose_headers=["*"],               # Expose all headers
)

# ============================================
# ALTERNATIVE: Allow ALL origins (Development Only)
# ============================================
# Use this ONLY for development. For production, use specific origins above.

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],              # Allow ALL origins
#     allow_credentials=False,          # Must be False when using allow_origins=["*"]
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# ============================================
# YOUR EXISTING ROUTES
# ============================================

@app.post("/run")
async def run_compliance_check(file: UploadFile = File(...)):
    # Your existing code here
    pass

# ============================================
# EXAMPLE COMPLETE MAIN.PY
# ============================================
"""
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Media Compliance Checker API"}

@app.post("/run")
async def run_compliance_check(file: UploadFile = File(...)):
    # Your compliance checking logic here
    return {
        "summary": {
            "status": "pass",
            "issuesCount": 0,
            "recommendationsCount": 0,
            "score": 95
        },
        "issues": [],
        "metadata": {
            "fileName": file.filename,
            "fileSize": file.size,
            "checkedAt": datetime.now().isoformat()
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
"""

# ============================================
# TESTING CORS
# ============================================
"""
After adding CORS middleware:

1. Restart your FastAPI server
2. Go to your React frontend at http://localhost:3000
3. Try uploading a file
4. Check browser console - CORS errors should be gone
5. You should see successful API calls in Network tab
"""
