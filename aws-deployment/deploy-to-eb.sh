#!/bin/bash

# AWS Elastic Beanstalk Deployment Script
# Make sure you have AWS CLI configured: aws configure

set -e

echo "🚀 Deploying LazyHR to AWS Elastic Beanstalk..."

# Configuration
APP_NAME="lazyhr-app"
ENV_NAME="lazyhr-prod"
REGION="us-east-1"  # Change to your preferred region
VERSION_LABEL="v$(date +%Y%m%d-%H%M%S)"

echo "📦 Building application..."
./gradlew clean build -x test

echo "📁 Creating deployment package..."
mkdir -p deploy
cp build/libs/*.jar deploy/
cp -r .ebextensions deploy/ 2>/dev/null || true

cd deploy
zip -r "../${VERSION_LABEL}.zip" .
cd ..
rm -rf deploy

echo "☁️ Creating Elastic Beanstalk application (if not exists)..."
aws elasticbeanstalk create-application \
    --application-name $APP_NAME \
    --description "LazyHR Employee Management System" \
    --region $REGION 2>/dev/null || echo "Application already exists"

echo "📤 Uploading application version..."
aws elasticbeanstalk create-application-version \
    --application-name $APP_NAME \
    --version-label $VERSION_LABEL \
    --source-bundle S3Bucket="elasticbeanstalk-${REGION}-$(aws sts get-caller-identity --query Account --output text)",S3Key="${VERSION_LABEL}.zip" \
    --region $REGION

# Upload to S3
aws s3 cp "${VERSION_LABEL}.zip" "s3://elasticbeanstalk-${REGION}-$(aws sts get-caller-identity --query Account --output text)/"

echo "🌍 Creating/Updating environment..."
aws elasticbeanstalk create-environment \
    --application-name $APP_NAME \
    --environment-name $ENV_NAME \
    --solution-stack-name "64bit Amazon Linux 2 v3.2.0 running Corretto 17" \
    --version-label $VERSION_LABEL \
    --option-settings Namespace=aws:autoscaling:launchconfiguration,OptionName=InstanceType,Value=t3.small \
    --region $REGION 2>/dev/null || \
aws elasticbeanstalk update-environment \
    --environment-name $ENV_NAME \
    --version-label $VERSION_LABEL \
    --region $REGION

echo "⏳ Waiting for deployment to complete..."
aws elasticbeanstalk wait environment-updated \
    --environment-name $ENV_NAME \
    --region $REGION

echo "✅ Deployment completed!"
echo "🌐 Application URL: http://$(aws elasticbeanstalk describe-environments --environment-names $ENV_NAME --region $REGION --query 'Environments[0].CNAME' --output text)"

# Cleanup
rm "${VERSION_LABEL}.zip"

echo "📊 Environment status:"
aws elasticbeanstalk describe-environments \
    --environment-names $ENV_NAME \
    --region $REGION \
    --query 'Environments[0].[EnvironmentName,Status,Health]' \
    --output table
