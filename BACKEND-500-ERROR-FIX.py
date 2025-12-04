# ========================================
# FIX 500 INTERNAL SERVER ERROR
# ========================================
"""
ERROR: 500 Internal Server Error on POST /run
CAUSE: Backend code has an issue processing the request
SOLUTION: Use the correct FastAPI code below
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Optional
import logging

# Setup logging to see errors
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Media Compliance Checker API")

# ========================================
# CORS CONFIGURATION (You already have this)
# ========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========================================
# PYDANTIC MODELS FOR RESPONSE
# ========================================
from pydantic import BaseModel

class Summary(BaseModel):
    status: str  # "pass", "partial_fail", or "fail"
    issuesCount: int
    recommendationsCount: int
    score: int

class Issue(BaseModel):
    id: str
    severity: str  # "low", "medium", or "high"
    title: str
    description: str
    timestamp: Optional[str] = None
    recommendation: str

class Metadata(BaseModel):
    fileName: str
    fileSize: int
    durationSec: Optional[int] = None
    checkedAt: str

class ComplianceReport(BaseModel):
    summary: Summary
    issues: list[Issue]
    metadata: Metadata

# ========================================
# ROOT ENDPOINT (Test if backend is running)
# ========================================
@app.get("/")
async def root():
    return {
        "message": "Media Compliance Checker API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "upload": "POST /run",
            "docs": "/docs"
        }
    }

# ========================================
# HEALTH CHECK
# ========================================
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# ========================================
# MAIN ENDPOINT - /run
# ========================================
@app.post("/run", response_model=ComplianceReport)
async def run_compliance_check(
    file: Optional[UploadFile] = File(None),
    url: Optional[str] = None,
    text: Optional[str] = None
):
    """
    Main endpoint for compliance checking
    Handles: Video files, PDF documents, YouTube URLs, and text
    """
    try:
        logger.info(f"Received request - File: {file.filename if file else None}, URL: {url}, Text: {bool(text)}")
        
        # ========================================
        # HANDLE FILE UPLOAD (Video or PDF)
        # ========================================
        if file:
            # Read file content
            contents = await file.read()
            file_size = len(contents)
            
            logger.info(f"File received: {file.filename}, Size: {file_size}, Type: {file.content_type}")
            
            # Determine if it's a video or document
            is_video = file.content_type and file.content_type.startswith('video/')
            is_document = file.content_type in [
                'application/pdf',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/msword'
            ]
            
            # HERE: Add your actual compliance checking logic
            # For now, returning a mock response
            
            return ComplianceReport(
                summary=Summary(
                    status="pass",
                    issuesCount=0,
                    recommendationsCount=0,
                    score=95
                ),
                issues=[],
                metadata=Metadata(
                    fileName=file.filename,
                    fileSize=file_size,
                    durationSec=120 if is_video else None,
                    checkedAt=datetime.now().isoformat()
                )
            )
        
        # ========================================
        # HANDLE URL (YouTube or Article)
        # ========================================
        elif url:
            logger.info(f"URL received: {url}")
            
            is_youtube = 'youtube.com' in url or 'youtu.be' in url
            
            # HERE: Add your URL checking logic
            
            return ComplianceReport(
                summary=Summary(
                    status="pass",
                    issuesCount=0,
                    recommendationsCount=0,
                    score=92
                ),
                issues=[],
                metadata=Metadata(
                    fileName="YouTube Video" if is_youtube else "URL Check",
                    fileSize=0,
                    durationSec=180 if is_youtube else None,
                    checkedAt=datetime.now().isoformat()
                )
            )
        
        # ========================================
        # HANDLE TEXT
        # ========================================
        elif text:
            logger.info(f"Text received: {len(text)} characters")
            
            # HERE: Add your text checking logic
            
            return ComplianceReport(
                summary=Summary(
                    status="pass",
                    issuesCount=0,
                    recommendationsCount=0,
                    score=88
                ),
                issues=[],
                metadata=Metadata(
                    fileName="Text Check",
                    fileSize=len(text),
                    durationSec=None,
                    checkedAt=datetime.now().isoformat()
                )
            )
        
        # ========================================
        # NO INPUT PROVIDED
        # ========================================
        else:
            raise HTTPException(
                status_code=400,
                detail="No file, URL, or text provided. Please upload a file or provide a URL/text."
            )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

# ========================================
# RUN THE SERVER
# ========================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )

# ========================================
# TESTING COMMANDS
# ========================================
"""
# Install dependencies
pip install fastapi uvicorn python-multipart pydantic

# Run the server
python main.py

# Or with uvicorn
uvicorn main:app --reload --port 8000

# Test endpoints
# 1. Test root: http://localhost:8000/
# 2. Test docs: http://localhost:8000/docs
# 3. Test health: http://localhost:8000/health
# 4. Upload file via frontend

# View logs
# The server will print INFO logs showing:
# - File received details
# - File size and type
# - Any errors
"""

# ========================================
# COMMON ERRORS AND FIXES
# ========================================
"""
ERROR: "detail": "There is no current event loop in thread"
FIX: Use async/await correctly, don't use sync code in async functions

ERROR: "file" is required
FIX: Make file Optional: file: Optional[UploadFile] = File(None)

ERROR: "'NoneType' object has no attribute 'filename'"
FIX: Check if file exists before accessing: if file and file.filename

ERROR: Can't JSON serialize datetime
FIX: Use .isoformat() on datetime objects

ERROR: Response doesn't match frontend types
FIX: Make sure your response has: summary, issues, metadata keys
"""
