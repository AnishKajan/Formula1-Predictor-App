# 🚀 F1 Race Predictor Deployment Guide

This guide covers deploying the F1 Race Predictor to various cloud platforms and production environments.

---

## 📋 Prerequisites

- Completed local development setup
- Git repository with your code
- Cloud platform account (Heroku, Railway, Vercel, etc.)
- Domain name (optional)

---

## 🔧 Production Configuration

### Environment Variables

Create production environment files:

#### Backend (`.env`)
```bash
# Production Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=False
FLASK_HOST=0.0.0.0
FLASK_PORT=5000

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
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_TITLE=F1 Race Predictor
GENERATE_SOURCEMAP=false
PORT=3009
```

---

## 🐍 Backend Deployment

### Option 1: Heroku

#### 1. Prepare for Heroku
```bash
# Install Heroku CLI
# Create Procfile
echo "web: python app.py" > backend/Procfile

# Create requirements.txt if not exists
cd backend
pip freeze > requirements.txt

# Create runtime.txt (optional)
echo "python-3.11.0" > runtime.txt
```

#### 2. Deploy to Heroku
```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create f1-predictor-api

# Set environment variables
heroku config:set FLASK_ENV=production
heroku config:set FLASK_DEBUG=False

# Deploy backend
git subtree push --prefix backend heroku main

# Scale the app
heroku ps:scale web=1
```

#### 3. Heroku Configuration Files

**backend/Procfile**
```
web: python app.py
```

**backend/runtime.txt**
```
python-3.11.0
```

**backend/app.py** (update for Heroku)
```python
import os
from flask import Flask

app = Flask(__name__)

# ... your existing code ...

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
```

### Option 2: Railway

#### 1. Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

#### 2. Railway Configuration

**railway.json**
```json
{
  "deploy": {
    "startCommand": "python app.py",
    "healthcheckPath": "/api/teams"
  }
}
```

### Option 3: DigitalOcean App Platform

#### 1. App Specification

**backend/.do/app.yaml**
```yaml
name: f1-predictor-backend
services:
- name: api
  source_dir: /backend
  github:
    repo: yourusername/f1-race-predictor
    branch: main
  run_command: python app.py
  environment_slug: python
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: FLASK_ENV
    value: production
  - key: FLASK_DEBUG
    value: "False"
  http_port: 5000
```

### Option 4: AWS EC2

#### 1. EC2 Setup Script
```bash
#!/bin/bash
# setup_ec2.sh

# Update system
sudo yum update -y

# Install Python 3.9
sudo yum install python3 python3-pip -y

# Install git
sudo yum install git -y

# Clone repository
git clone https://github.com/yourusername/f1-race-predictor.git
cd f1-race-predictor/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install nginx
sudo yum install nginx -y

# Start services
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 2. Nginx Configuration
```nginx
# /etc/nginx/sites-available/f1-predictor
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 3. Systemd Service
```ini
# /etc/systemd/system/f1-predictor.service
[Unit]
Description=F1 Race Predictor API
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/home/ec2-user/f1-race-predictor/backend
Environment=PATH=/home/ec2-user/f1-race-predictor/backend/venv/bin
ExecStart=/home/ec2-user/f1-race-predictor/backend/venv/bin/python app.py
Restart=always

[Install]
WantedBy=multi-user.target
```

---

## ⚛️ Frontend Deployment

### Option 1: Netlify

#### 1. Build Configuration

**frontend/netlify.toml**
```toml
[build]
  base = "frontend/"
  publish = "build/"
  command = "npm run build"

[build.environment]
  REACT_APP_API_URL = "https://your-backend-domain.com"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the app
cd frontend
npm run build

# Deploy
netlify deploy --prod --dir=build
```

### Option 2: Vercel

#### 1. Vercel Configuration

**vercel.json**
```json
{
  "name": "f1-race-predictor",
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://your-backend-domain.com"
  }
}
```

#### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

### Option 3: AWS S3 + CloudFront

#### 1. Build and Upload
```bash
# Build the app
cd frontend
npm run build

# Install AWS CLI
# Configure AWS credentials
aws configure

# Create S3 bucket
aws s3 mb s3://f1-predictor-frontend

# Upload build files
aws s3 sync build/ s3://f1-predictor-frontend --delete

# Configure bucket for website hosting
aws s3 website s3://f1-predictor-frontend --index-document index.html --error-document index.html
```

#### 2. CloudFront Distribution
```json
{
  "DistributionConfig": {
    "Origins": [
      {
        "Id": "S3-f1-predictor-frontend",
        "DomainName": "f1-predictor-frontend.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ],
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3-f1-predictor-frontend",
      "ViewerProtocolPolicy": "redirect-to-https",
      "Compress": true
    },
    "Comment": "F1 Race Predictor Frontend",
    "Enabled": true
  }
}
```

---

## 🐳 Docker Deployment

### Backend Dockerfile

**backend/Dockerfile**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create models directory
RUN mkdir -p models data logs

# Expose port
EXPOSE 5000

# Set environment variables
ENV FLASK_ENV=production
ENV FLASK_DEBUG=False

# Run the application
CMD ["python", "app.py"]
```

### Frontend Dockerfile

**frontend/Dockerfile**
```dockerfile
# Build stage
FROM node:16-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build files
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

**docker-compose.yml**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - FLASK_DEBUG=False
    volumes:
      - ./backend/data:/app/data
      - ./backend/models:/app/models
    
  frontend:
    build: ./frontend
    ports:
      - "3009:80"
    environment:
      - REACT_APP_API_URL=http://localhost:5061
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend
      - frontend
```

---

## 🔐 Security Considerations

### HTTPS/SSL Setup

#### Let's Encrypt (Free SSL)
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Environment Security

1. **Never commit secrets** to version control
2. **Use environment variables** for all sensitive data
3. **Enable CORS properly** for production domains
4. **Use HTTPS** for all production traffic
5. **Validate all inputs** on the backend
6. **Rate limit** API endpoints

### CORS Configuration

**backend/app.py**
```python
from flask_cors import CORS

app = Flask(__name__)

# Production CORS
if os.environ.get('FLASK_ENV') == 'production':
    CORS(app, origins=['https://your-frontend-domain.com'])
else:
    CORS(app)  # Allow all origins in development
```

---

## 📊 Monitoring and Logging

### Application Monitoring

#### Using Sentry
```python
# backend/app.py
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="your-sentry-dsn",
    integrations=[FlaskIntegration()],
    traces_sample_rate=1.0
)
```

### Health Checks

**backend/app.py**
```python
@app.route('/health')
def health_check():
    return {
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    }
```

### Logging Configuration

```python
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(name)s %(message)s'
)

logger = logging.getLogger(__name__)
```

---

## 🚀 CI/CD Pipeline

### GitHub Actions

**.github/workflows/deploy.yml**
```yaml
name: Deploy F1 Race Predictor

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install dependencies
      run: |
        cd backend
        pip install -r requirements.txt
    
    - name: Run tests
      run: |
        cd backend
        python -m pytest tests/

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "f1-predictor-api"
        heroku_email: "your-email@example.com"
        appdir: "backend"

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
    
    - name: Install and build
      run: |
        cd frontend
        npm ci
        npm run build
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: './frontend/build'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 📈 Performance Optimization

### Backend Optimization

1. **Caching**: Implement Redis for model caching
2. **Database**: Use PostgreSQL for persistent data
3. **Load Balancing**: Use multiple backend instances
4. **CDN**: Serve static assets via CDN

### Frontend Optimization

1. **Code Splitting**: Implement React lazy loading
2. **Bundle Analysis**: Use webpack-bundle-analyzer
3. **Service Workers**: Implement PWA features
4. **Image Optimization**: Compress and optimize images

---

## 🔧 Troubleshooting

### Common Issues

#### Backend Issues
```bash
# Check logs
heroku logs --tail -a f1-predictor-api

# Check environment variables
heroku config -a f1-predictor-api

# Restart app
heroku restart -a f1-predictor-api
```

#### Frontend Issues
```bash
# Check build logs
netlify logs

# Test local build
npm run build
npx serve -s build
```

### Debug Commands

```bash
# Test API endpoints
curl https://your-api-domain.com/api/teams

# Check SSL certificate
openssl s_client -connect your-domain.com:443

# Test CORS
curl -H "Origin: https://your-frontend-domain.com" \
     -H "Access-Control-Request-Method: POST" \
     https://your-api-domain.com/api/predict
```

---

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] SSL certificates ready
- [ ] Domain DNS configured

### Post-Deployment
- [ ] Health checks passing
- [ ] API endpoints responding
- [ ] Frontend loading correctly
- [ ] HTTPS redirects working
- [ ] Monitoring configured
- [ ] Backups scheduled

---

## 🎯 Production URLs

After deployment, update these in your documentation:

- **Frontend**: https://f1-predictor.netlify.app
- **Backend API**: https://f1-predictor-api.herokuapp.com
- **Health Check**: https://f1-predictor-api.herokuapp.com/health
- **API Docs**: https://f1-predictor-api.herokuapp.com/api/teams

---

## 📞 Support

For deployment issues:
1. Check platform-specific documentation
2. Review logs for error messages
3. Verify environment variables
4. Test locally first
5. Contact platform support if needed