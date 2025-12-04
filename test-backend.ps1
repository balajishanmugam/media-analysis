# Test Backend API - Debug 422 Error
# Run this script to test your backend

Write-Host "🔍 Testing Backend API..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if backend is running
Write-Host "Test 1: Checking if backend is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/" -Method GET
    Write-Host "✅ Backend is running!" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend is NOT running!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Start your backend with: uvicorn main:app --reload --port 8000" -ForegroundColor Yellow
    exit
}

Write-Host ""

# Test 2: Check API documentation
Write-Host "Test 2: Opening API documentation in browser..." -ForegroundColor Yellow
Start-Process "http://localhost:8000/docs"
Write-Host "✅ Check the /run endpoint in Swagger UI" -ForegroundColor Green
Write-Host "   Look for which fields are Required (red asterisk *)" -ForegroundColor Gray

Write-Host ""

# Test 3: Send test request with file
Write-Host "Test 3: Testing file upload to /run endpoint..." -ForegroundColor Yellow

# Create a small test file
$testContent = "This is a test PDF file for debugging"
$testFile = "$env:TEMP\test-upload.txt"
Set-Content -Path $testFile -Value $testContent

Write-Host "Created test file: $testFile" -ForegroundColor Gray

try {
    $boundary = [System.Guid]::NewGuid().ToString()
    $fileBytes = [System.IO.File]::ReadAllBytes($testFile)
    $fileName = [System.IO.Path]::GetFileName($testFile)
    
    $bodyLines = @(
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
        "Content-Type: application/octet-stream",
        "",
        [System.Text.Encoding]::UTF8.GetString($fileBytes),
        "--$boundary--"
    )
    
    $body = $bodyLines -join "`r`n"
    
    $response = Invoke-WebRequest `
        -Uri "http://localhost:8000/run" `
        -Method POST `
        -ContentType "multipart/form-data; boundary=$boundary" `
        -Body $body
    
    Write-Host "✅ File upload successful!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Gray
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.Value__
    Write-Host "❌ File upload failed!" -ForegroundColor Red
    Write-Host "Status Code: $statusCode" -ForegroundColor Red
    
    if ($statusCode -eq 422) {
        Write-Host ""
        Write-Host "🔍 422 Unprocessable Entity Details:" -ForegroundColor Yellow
        Write-Host "   This means the backend rejected your request format" -ForegroundColor Gray
        
        # Try to get error details
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errorDetails = $reader.ReadToEnd()
            Write-Host "   Error details: $errorDetails" -ForegroundColor Red
        } catch {
            Write-Host "   Could not read error details" -ForegroundColor Gray
        }
        
        Write-Host ""
        Write-Host "📋 Common Fixes:" -ForegroundColor Cyan
        Write-Host "   1. Make file parameter Optional in backend:" -ForegroundColor White
        Write-Host "      file: Optional[UploadFile] = File(None)" -ForegroundColor Gray
        Write-Host ""
        Write-Host "   2. Check if backend expects different field name" -ForegroundColor White
        Write-Host "      (e.g., 'video' instead of 'file')" -ForegroundColor Gray
        Write-Host ""
        Write-Host "   3. Go to http://localhost:8000/docs and check required fields" -ForegroundColor White
        Write-Host ""
        Write-Host "   4. Use BACKEND-FINAL-FIX.py as reference" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "🔍 Next Steps:" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "1. Check http://localhost:8000/docs for /run endpoint details" -ForegroundColor White
Write-Host "2. Look at your backend terminal for error messages" -ForegroundColor White
Write-Host "3. Read DEBUG-422-STEP-BY-STEP.md for detailed help" -ForegroundColor White
Write-Host "4. Use BACKEND-FINAL-FIX.py as working example" -ForegroundColor White
Write-Host ""

# Cleanup
Remove-Item $testFile -ErrorAction SilentlyContinue
