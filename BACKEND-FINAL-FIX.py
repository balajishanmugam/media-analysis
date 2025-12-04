"""
COMPLETE BACKEND CODE - FIXES 422 ERROR
Copy this entire file and use it as your main.py
"""

from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Union
from datetime import datetime
from pydantic import BaseModel
import logging
import json

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ========================================
# CREATE FASTAPI APP
# ========================================
app = FastAPI(
    title="Media Compliance Checker API",
    description="API for checking compliance of videos, documents, and text",
    version="1.0.0"
)

# ========================================
# CORS MIDDLEWARE
# ========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# ========================================
# RESPONSE MODELS
# ========================================
class Summary(BaseModel):
    status: str
    issuesCount: int
    recommendationsCount: int
    score: int

class Issue(BaseModel):
    id: str
    severity: str
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
# ROOT ENDPOINT
# ========================================
@app.get("/")
async def root():
    return {
        "message": "Media Compliance Checker API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "upload": "POST /run",
            "health": "GET /health",
            "docs": "GET /docs"
        }
    }

# ========================================
# HEALTH CHECK
# ========================================
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

# ========================================
# MAIN /run ENDPOINT - HANDLES ALL REQUESTS
# ========================================
@app.post("/run", response_model=ComplianceReport)
async def run_compliance_check(
    request: Request,
    file: Optional[UploadFile] = File(None)
):
    """
    Main compliance checking endpoint
    
    Accepts:
    - Multipart/form-data with file upload (video or PDF)
    - JSON with url or text fields
    
    This fixes the 422 error by:
    1. Making file Optional
    2. Manually parsing JSON body for URL/text requests
    3. Logging everything for debugging
    """
    try:
        logger.info(f"=== New Request ===")
        logger.info(f"Content-Type: {request.headers.get('content-type')}")
        logger.info(f"File: {file.filename if file else None}")
        
        # ========================================
        # HANDLE FILE UPLOAD
        # ========================================
        if file:
            # Read file contents
            contents = await file.read()
            file_size = len(contents)
            
            logger.info(f"📁 File Upload Detected")
            logger.info(f"   Filename: {file.filename}")
            logger.info(f"   Size: {file_size} bytes")
            logger.info(f"   Type: {file.content_type}")
            
            # Determine file type
            is_video = file.content_type and file.content_type.startswith('video/')
            is_pdf = file.content_type == 'application/pdf'
            is_doc = file.content_type in [
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/msword'
            ]
            
            # Generate mock response (replace with your actual logic)
            response = ComplianceReport(
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
            
            logger.info(f"✅ Returning response: {response.summary.status}")
            return response
        
        # ========================================
        # HANDLE JSON REQUESTS (URL or Text)
        # ========================================
        else:
            # Manually parse JSON body
            try:
                body = await request.json()
                logger.info(f"📝 JSON Request Detected")
                logger.info(f"   Body: {body}")
            except:
                body = {}
            
            # Handle URL
            if "url" in body and body["url"]:
                url = body["url"]
                logger.info(f"🔗 URL Request: {url}")
                
                is_youtube = 'youtube.com' in url or 'youtu.be' in url
                
                response = ComplianceReport(
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
                
                logger.info(f"✅ Returning URL response")
                return response
            
            # Handle Text
            elif "text" in body and body["text"]:
                text = body["text"]
                logger.info(f"📄 Text Request: {len(text)} characters")
                
                response = ComplianceReport(
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
                
                logger.info(f"✅ Returning text response")
                return response
            
            # No valid input
            else:
                logger.error("❌ No valid input provided")
                raise HTTPException(
                    status_code=400,
                    detail="No file, URL, or text provided"
                )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

# ========================================
# ALTERNATIVE: SEPARATE ENDPOINTS
# ========================================
# If you prefer separate endpoints for different types:

@app.post("/run/file")
async def run_file_check(file: UploadFile = File(...)):
    """Separate endpoint for file uploads"""
    contents = await file.read()
    return {
        "summary": {"status": "pass", "issuesCount": 0, "recommendationsCount": 0, "score": 95},
        "issues": [],
        "metadata": {
            "fileName": file.filename,
            "fileSize": len(contents),
            "checkedAt": datetime.now().isoformat()
        }
    }

@app.post("/run/url")
async def run_url_check(url: str):
    """Separate endpoint for URL checks"""
    return {
        "summary": {"status": "pass", "issuesCount": 0, "recommendationsCount": 0, "score": 92},
        "issues": [],
        "metadata": {
            "fileName": "URL Check",
            "fileSize": 0,
            "checkedAt": datetime.now().isoformat()
        }
    }

# ========================================
# RUN SERVER
# ========================================
if __name__ == "__main__":
    import uvicorn
    logger.info("🚀 Starting Media Compliance Checker API...")
    logger.info("📍 API will be available at: http://localhost:8000")
    logger.info("📖 Documentation at: http://localhost:8000/docs")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )

# ========================================
# TESTING INSTRUCTIONS
# ========================================
"""
1. Save this file as main.py

2. Install dependencies:
   pip install fastapi uvicorn python-multipart pydantic

3. Run the server:
   python main.py
   
   OR
   
   uvicorn main:app --reload --port 8000

4. Test in browser:
   - Root: http://localhost:8000/
   - Docs: http://localhost:8000/docs
   - Health: http://localhost:8000/health

5. Test file upload:
   - Go to your frontend
   - Upload a PDF or video
   - Check backend logs

6. Expected logs:
   === New Request ===
   Content-Type: multipart/form-data
   📁 File Upload Detected
      Filename: test.pdf
      Size: 12345 bytes
      Type: application/pdf
   ✅ Returning response: pass
   INFO: 127.0.0.1:xxxxx - "POST /run HTTP/1.1" 200 OK

7. If you see 422 error:
   - Check the logs above
   - Go to http://localhost:8000/docs
   - Try uploading via Swagger UI
   - Check what parameter name is expected
"""
