#!/bin/bash
# Example deployment script for UltimateSportsBettingApp
set -e

echo "Building frontend..."
cd frontend && npm run build && cd ..

echo "Building backend Docker image..."
docker build -t ultimate-sports-betting-backend -f Dockerfile .

echo "Building frontend Docker image..."
docker build -t ultimate-sports-betting-frontend -f Dockerfile ./frontend

echo "Deploying with docker-compose.prod.yml..."
docker-compose -f docker-compose.prod.yml up -d

echo "Deployment complete."
