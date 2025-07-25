#!/bin/bash

# Quick AWS Deployment Script for LazyHR
# This script provides an interactive menu for different deployment options

set -e

echo "🚀 LazyHR AWS Deployment Helper"
echo "================================"
echo ""
echo "Please select your deployment method:"
echo "1) AWS Elastic Beanstalk (Easiest - Recommended for beginners)"
echo "2) AWS ECS Fargate (Advanced - Recommended for production)"
echo "3) Build for manual deployment"
echo "4) Setup AWS prerequisites"
echo "5) Exit"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
  1)
    echo "🌱 Deploying to AWS Elastic Beanstalk..."
    if [ ! -f "aws-deployment/deploy-to-eb.sh" ]; then
      echo "❌ Deployment script not found. Please run this from the project root directory."
      exit 1
    fi
    
    read -p "Enter AWS region (default: us-east-1): " region
    region=${region:-us-east-1}
    
    read -p "Enter application name (default: lazyhr-app): " app_name
    app_name=${app_name:-lazyhr-app}
    
    # Update region in script
    sed -i.bak "s/REGION=\"us-east-1\"/REGION=\"$region\"/g" aws-deployment/deploy-to-eb.sh
    sed -i.bak "s/APP_NAME=\"lazyhr-app\"/APP_NAME=\"$app_name\"/g" aws-deployment/deploy-to-eb.sh
    
    ./aws-deployment/deploy-to-eb.sh
    
    # Restore original script
    mv aws-deployment/deploy-to-eb.sh.bak aws-deployment/deploy-to-eb.sh
    ;;
    
  2)
    echo "🐳 Deploying to AWS ECS Fargate..."
    if [ ! -f "aws-deployment/deploy-to-ecs.sh" ]; then
      echo "❌ Deployment script not found. Please run this from the project root directory."
      exit 1
    fi
    
    read -p "Enter your AWS Account ID: " aws_account_id
    if [ -z "$aws_account_id" ]; then
      echo "❌ AWS Account ID is required for ECS deployment"
      exit 1
    fi
    
    read -p "Enter AWS region (default: us-east-1): " region
    region=${region:-us-east-1}
    
    # Update configuration in script
    sed -i.bak "s/AWS_ACCOUNT_ID=\"YOUR_ACCOUNT_ID\"/AWS_ACCOUNT_ID=\"$aws_account_id\"/g" aws-deployment/deploy-to-ecs.sh
    sed -i.bak "s/AWS_REGION=\"us-east-1\"/AWS_REGION=\"$region\"/g" aws-deployment/deploy-to-ecs.sh
    
    echo "⚠️  Note: Make sure you have configured VPC, subnets, and security groups"
    echo "📖 Refer to AWS_DEPLOYMENT_GUIDE.md for detailed setup instructions"
    
    read -p "Do you want to continue? (y/N): " continue_deploy
    if [[ $continue_deploy =~ ^[Yy]$ ]]; then
      ./aws-deployment/deploy-to-ecs.sh
    else
      echo "Deployment cancelled"
    fi
    
    # Restore original script
    mv aws-deployment/deploy-to-ecs.sh.bak aws-deployment/deploy-to-ecs.sh
    ;;
    
  3)
    echo "🏗️ Building application for manual deployment..."
    echo "Building production JAR..."
    ./gradlew clean build -x test
    
    echo "✅ Build completed!"
    echo "📦 JAR file location: build/libs/lazyhr-0.0.1-SNAPSHOT.jar"
    echo ""
    echo "Manual deployment options:"
    echo "1. Upload to EC2 instance and run with: java -jar lazyhr-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod"
    echo "2. Use the JAR with AWS Elastic Beanstalk console"
    echo "3. Build Docker image: docker build -f Dockerfile.aws -t lazyhr ."
    ;;
    
  4)
    echo "⚙️ Setting up AWS prerequisites..."
    echo ""
    echo "Checking AWS CLI..."
    if command -v aws &> /dev/null; then
      echo "✅ AWS CLI is installed"
      aws --version
    else
      echo "❌ AWS CLI is not installed"
      echo "Please install AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html"
      exit 1
    fi
    
    echo ""
    echo "Checking AWS configuration..."
    if aws sts get-caller-identity &> /dev/null; then
      echo "✅ AWS CLI is configured"
      aws sts get-caller-identity
    else
      echo "❌ AWS CLI is not configured"
      echo "Please run: aws configure"
      exit 1
    fi
    
    echo ""
    echo "Checking Docker (for ECS deployment)..."
    if command -v docker &> /dev/null; then
      echo "✅ Docker is installed"
      docker --version
    else
      echo "⚠️  Docker is not installed (needed for ECS deployment)"
      echo "Please install Docker: https://docs.docker.com/get-docker/"
    fi
    
    echo ""
    echo "✅ Prerequisites check completed!"
    echo "📖 For detailed setup instructions, see AWS_DEPLOYMENT_GUIDE.md"
    ;;
    
  5)
    echo "👋 Goodbye!"
    exit 0
    ;;
    
  *)
    echo "❌ Invalid choice. Please run the script again."
    exit 1
    ;;
esac

echo ""
echo "✅ Deployment process completed!"
echo "📖 For detailed information, see AWS_DEPLOYMENT_GUIDE.md"
