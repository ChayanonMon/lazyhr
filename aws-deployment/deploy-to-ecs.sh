#!/bin/bash

# AWS ECS Fargate Deployment Script
# Prerequisites: AWS CLI, Docker, and proper IAM permissions

set -e

echo "🚀 Deploying LazyHR to AWS ECS Fargate..."

# Configuration - UPDATE THESE VALUES
AWS_ACCOUNT_ID="YOUR_ACCOUNT_ID"
AWS_REGION="us-east-1"
ECR_REPO_NAME="lazyhr"
CLUSTER_NAME="lazyhr-cluster"
SERVICE_NAME="lazyhr-service"
TASK_FAMILY="lazyhr-task"

echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

echo "📦 Creating ECR repository (if not exists)..."
aws ecr create-repository --repository-name $ECR_REPO_NAME --region $AWS_REGION 2>/dev/null || echo "Repository already exists"

echo "🏗️ Building Docker image..."
docker build -f Dockerfile.aws -t $ECR_REPO_NAME:latest .

echo "🏷️ Tagging image..."
docker tag $ECR_REPO_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:latest

echo "📤 Pushing image to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:latest

echo "🏗️ Creating ECS cluster (if not exists)..."
aws ecs create-cluster --cluster-name $CLUSTER_NAME --region $AWS_REGION 2>/dev/null || echo "Cluster already exists"

echo "📝 Updating task definition..."
# Update the task definition with actual values
sed -i.bak "s/YOUR_ACCOUNT_ID/$AWS_ACCOUNT_ID/g; s/YOUR_REGION/$AWS_REGION/g" aws-deployment/ecs-task-definition.json

echo "📋 Registering task definition..."
aws ecs register-task-definition --cli-input-json file://aws-deployment/ecs-task-definition.json --region $AWS_REGION

echo "🔍 Getting latest task definition revision..."
TASK_REVISION=$(aws ecs describe-task-definition --task-definition $TASK_FAMILY --region $AWS_REGION --query 'taskDefinition.revision' --output text)

echo "🌐 Creating/Updating ECS service..."
aws ecs create-service \
    --cluster $CLUSTER_NAME \
    --service-name $SERVICE_NAME \
    --task-definition $TASK_FAMILY:$TASK_REVISION \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[subnet-12345,subnet-67890],securityGroups=[sg-12345],assignPublicIp=ENABLED}" \
    --region $AWS_REGION 2>/dev/null || \
aws ecs update-service \
    --cluster $CLUSTER_NAME \
    --service $SERVICE_NAME \
    --task-definition $TASK_FAMILY:$TASK_REVISION \
    --region $AWS_REGION

echo "⏳ Waiting for service to stabilize..."
aws ecs wait services-stable --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $AWS_REGION

echo "✅ Deployment completed!"
echo "📊 Service status:"
aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $AWS_REGION --query 'services[0].[serviceName,status,runningCount,desiredCount]' --output table

# Restore original task definition
mv aws-deployment/ecs-task-definition.json.bak aws-deployment/ecs-task-definition.json
