# 🚀 F1 Race Predictor Deployment Guide

This guide covers deploying the F1 Race Predictor with FastAPI backend to Vercel and other cloud platforms.

---

## 📋 Prerequisites

- Completed local development setup
- Git repository with your code
- Vercel account (primary deployment target)
- Domain name (optional)

---

## 🔧 Production Configuration

### Environment Variables

Create production environment files:

#### Backend (`.env`)
```bash
# Production FastAPI Configuration
ENVIRONMENT=production
DEBUG=False
HOST=0.0.0.0
PORT=8000

# Database (if using)
DATABASE_URL=postgresql://user:pass@host:port/db

# CORS Settings
CORS_ORIGINS=https://your-frontend-domain.com

# API Keys (if needed)
ERGAST_API_KEY=your_ergast_key
F1_API_KEY=your_f1_api_key

# Security
SECRET_KEY=your-super-secret-key-here
```

#### Frontend (`.env.production`)
```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.vercel.app
NEXT_PUBLIC_TITLE=F1 Race Predictor
PORT=3000
```

---

## 🚀 Primary Deployment: Vercel (Recommended)

Vercel is the primary and recommended deployment platform for this project, supporting both frontend and backend.

### Option 1: Full Stack Vercel Deployment

#### 1. Project Structure for Vercel
```
f1-race-predictor/
├── api/                    # FastAPI backend (Vercel Functions)
│   ├── main.py            # FastAPI app
│   ├── requirements.txt   # Python dependencies
│   └── vercel.json        # Vercel configuration
├── frontend/              # Next.js/React frontend
│   ├── package.json
│   ├── next.config.js
│   └── ...
└── vercel.json           # Root Vercel configuration
```

#### 2. Vercel Configuration

**Root vercel.json**
```json
{
  "name": "f1-race-predictor",
  "version": 2,
  "builds": [
    {
      "src": "api/main.py",
      "use": "@vercel/python",
      "config": {
        "maxLambdaSize": "50mb"
      }
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/main.py"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ],
  "env": {
    "ENVIRONMENT": "production",
    "DEBUG": "False"
  },
  "functions": {
    "api/main.py": {
      "maxDuration": 30
    }
  }
}
```

**api/vercel.json**
```json
{
  "functions": {
    "main.py": {
      "runtime": "python3.9",
      "maxDuration": 30
    }
  }
}
```

#### 3. FastAPI for Vercel Serverless

**api/main.py** (Vercel-optimized)
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Your existing FastAPI app code...
app = FastAPI(
    title="F1 Race Predictor API",
    description="Enhanced F1 race prediction system",
    version="2.0"
)

# CORS for Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if os.getenv("ENVIRONMENT") != "production" else [
        "https://your-frontend-domain.vercel.app",
        "https://f1-predictor.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your existing endpoints...

# Vercel handler
from mangum import Mangum
handler = Mangum(app)
```

#### 4. Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from root directory)
vercel --prod

# Set environment variables
vercel env add CORS_ORIGINS
vercel env add SECRET_KEY
```

### Option 2: Separate Frontend/Backend Deployment

#### Backend on Vercel

**api/requirements.txt**
```txt
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
mangum==0.17.0
pandas==2.1.0
numpy==1.24.3
scikit-learn==1.3.0
joblib==1.3.2
requests==2.31.0
python-dotenv==1.0.0
```

**api/vercel.json**
```json
{
  "builds": [
    {
      "src": "main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/main.py"
    }
  ]
}
```

#### Frontend on Vercel

**frontend/vercel.json**
```json
{
  "name": "f1-predictor-frontend",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://your-api-deployment.vercel.app"
  }
}
```

---

## 🐍 Alternative Backend Deployments

### Option 1: Railway (FastAPI-friendly)

#### 1. Railway Configuration

**railway.toml**
```toml
[build]
buildCommand = "pip install -r requirements.txt"

[deploy]
startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/api/health"
restartPolicyType = "on_failure"

[env]
ENVIRONMENT = "production"
DEBUG = "False"
```

#### 2. Deploy to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 2: Render

#### 1. Render Configuration

**render.yaml**
```yaml
services:
  - type: web
    name: f1-predictor-api
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "uvicorn main:app --host 0.0.0.0 --port $PORT"
    plan: free
    envVars:
      - key: ENVIRONMENT
        value: production
      - key: DEBUG
        value: "False"
```

### Option 3: Heroku

#### 1. Heroku Configuration

**Procfile**
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

**runtime.txt**
```
python-3.11.0
```

#### 2. Deploy to Heroku
```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create f1-predictor-fastapi

# Set environment variables
heroku config:set ENVIRONMENT=production
heroku config:set DEBUG=False

# Deploy
git push heroku main
```

---

## 🐳 Docker Deployment

### FastAPI Dockerfile

**Dockerfile**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p models data logs

# Expose port
EXPOSE 8000

# Set environment variables
ENV ENVIRONMENT=production
ENV DEBUG=False
ENV HOST=0.0.0.0
ENV PORT=8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/api/health || exit 1

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose

**docker-compose.yml**
```yaml
version: '3.8'

services:
  fastapi-backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
      - DEBUG=False
      - CORS_ORIGINS=http://localhost:3000
    volumes:
      - ./data:/app/data
      - ./models:/app/models
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - fastapi-backend

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - fastapi-backend
      - frontend
```

---

## 🔐 Security Considerations

### HTTPS/SSL Setup

#### Vercel (Automatic)
Vercel provides automatic HTTPS for all deployments with custom domains.

#### Custom SSL Setup
```bash
# For custom domains on other platforms
# Install certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d your-api-domain.com

# Update FastAPI for HTTPS
# main.py
import ssl
context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
context.load_cert_chain('/path/to/cert.pem', '/path/to/key.pem')
```

### Environment Security

1. **Environment Variables**: Use Vercel's environment variable management
2. **CORS Configuration**: Restrict origins in production
3. **Rate Limiting**: Implement with slowapi
4. **Input Validation**: FastAPI's automatic validation with Pydantic
5. **API Documentation**: Disable in production if needed

### Enhanced CORS Configuration

**main.py**
```python
import os
from fastapi.middleware.cors import CORSMiddleware

# Production CORS
if os.getenv("ENVIRONMENT") == "production":
    allowed_origins = [
        "https://f1-predictor.vercel.app",
        "https://your-custom-domain.com"
    ]
else:
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

### Rate Limiting

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/api/predict")
@limiter.limit("10/minute")
async def predict_race(request: Request, data: PredictionRequest):
    # Your prediction logic
    pass
```

---

## 📊 Monitoring and Logging

### FastAPI Built-in Monitoring

```python
from fastapi import FastAPI, Request
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    logger.info(f"{request.method} {request.url.path} - {response.status_code} - {process_time:.3f}s")
    response.headers["X-Process-Time"] = str(process_time)
    
    return response
```

### Health Checks

```python
@app.get("/api/health", tags=["monitoring"])
async def health_check():
    """Comprehensive health check endpoint"""
    return {
        "status": "healthy",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat(),
        "models_loaded": models is not None,
        "api_docs": "/docs" if os.getenv("ENVIRONMENT") != "production" else "disabled"
    }

@app.get("/api/metrics", tags=["monitoring"])
async def get_metrics():
    """Basic metrics endpoint"""
    return {
        "total_predictions": prediction_count,
        "uptime": time.time() - start_time,
        "memory_usage": psutil.Process().memory_info().rss / 1024 / 1024
    }
```

### Sentry Integration

```python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

if os.getenv("ENVIRONMENT") == "production":
    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
        integrations=[FastApiIntegration(auto_enable=True)],
        traces_sample_rate=0.1,
        environment="production"
    )
```

---

## 🚀 CI/CD Pipeline

### GitHub Actions for Vercel

**.github/workflows/deploy.yml**
```yaml
name: Deploy F1 Race Predictor to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install pytest httpx
    
    - name: Run tests
      run: |
        pytest tests/ -v
    
    - name: Test FastAPI startup
      run: |
        python -c "from main import app; print('FastAPI app loads successfully')"

  deploy-preview:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Deploy to Vercel Preview
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Deploy to Vercel Production
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
        working-directory: ./
```

---

## 📈 Performance Optimization

### FastAPI Performance

```python
from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

# Add compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Force HTTPS in production
if os.getenv("ENVIRONMENT") == "production":
    app.add_middleware(HTTPSRedirectMiddleware)

# Disable docs in production
if os.getenv("ENVIRONMENT") == "production":
    app = FastAPI(docs_url=None, redoc_url=None)
```

### Caching with Redis

```python
import redis
from functools import wraps

# Redis setup for caching
redis_client = redis.Redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))

def cache_result(expiration: int = 300):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cache_key = f"{func.__name__}:{hash(str(args) + str(kwargs))}"
            
            # Try to get from cache
            cached_result = redis_client.get(cache_key)
            if cached_result:
                return json.loads(cached_result)
            
            # Compute and cache result
            result = await func(*args, **kwargs)
            redis_client.setex(cache_key, expiration, json.dumps(result))
            
            return result
        return wrapper
    return decorator

@app.post("/api/predict")
@cache_result(expiration=600)  # Cache for 10 minutes
async def predict_race(data: PredictionRequest):
    # Your prediction logic
    pass
```

---

## 🔧 Troubleshooting

### Common Vercel Issues

#### Build Issues
```bash
# Check Vercel build logs
vercel logs

# Test locally with Vercel CLI
vercel dev

# Check function timeout (max 30s on free tier)
# Optimize model loading and prediction time
```

#### Memory Issues
```bash
# Vercel serverless functions have memory limits
# Optimize model size and loading
# Consider model quantization or compression

# Check memory usage
import psutil
print(f"Memory usage: {psutil.Process().memory_info().rss / 1024 / 1024:.2f} MB")
```

### Debug Commands

```bash
# Test FastAPI locally
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Test API endpoints
curl https://your-vercel-deployment.vercel.app/api/health

# Check CORS
curl -H "Origin: https://your-frontend-domain.com" \
     -H "Access-Control-Request-Method: POST" \
     https://your-api-domain.vercel.app/api/predict

# Vercel CLI debugging
vercel dev --debug
```

### Performance Debugging

```python
# Add timing middleware for debugging
@app.middleware("http")
async def add_timing_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(f"{process_time:.3f}")
    return response
```

---

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] FastAPI app tested locally
- [ ] All tests passing
- [ ] Requirements.txt updated with FastAPI dependencies
- [ ] Environment variables configured in Vercel
- [ ] CORS settings updated for production domains
- [ ] API documentation reviewed (disabled in production if needed)

### Vercel Deployment
- [ ] vercel.json configured correctly
- [ ] Build and function settings optimized
- [ ] Environment variables set in Vercel dashboard
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate automatically provisioned

### Post-Deployment
- [ ] Health checks passing at `/api/health`
- [ ] API endpoints responding correctly
- [ ] Frontend successfully connecting to API
- [ ] CORS working for frontend domain
- [ ] Performance monitoring active
- [ ] Error tracking configured (Sentry)

---

## 🎯 Production URLs

Current Vercel deployment:

- **Frontend**: https://f1-predictor.vercel.app
- **Backend API**: https://f1-predictor-api.vercel.app
- **Health Check**: https://f1-predictor-api.vercel.app/api/health
- **API Documentation**: https://f1-predictor-api.vercel.app/docs (dev only)

---

## 📞 Support

For deployment issues:
1. Check Vercel deployment logs in dashboard
2. Review FastAPI error messages in function logs
3. Test locally with `vercel dev`
4. Check environment variables configuration
5. Contact Vercel support for platform-specific issues

### Useful Resources
- [Vercel Python Runtime](https://vercel.com/docs/functions/serverless-functions/runtimes/python)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)