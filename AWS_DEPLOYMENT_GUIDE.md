# AWS Deployment Guide for LazyHR

This guide covers multiple deployment options for the LazyHR application on AWS.

## Prerequisites

1. **AWS CLI installed and configured**:
   ```bash
   aws configure
   # Enter your AWS Access Key ID, Secret Access Key, Region, and output format
   ```

2. **Docker installed** (for ECS deployment)

3. **Java 17 and Gradle** (for building the application)

4. **Required AWS Permissions**:
   - ElasticBeanstalk full access
   - ECS full access
   - ECR full access
   - RDS access
   - S3 access
   - IAM role creation/management

## Deployment Option 1: AWS Elastic Beanstalk (Recommended for beginners)

### Advantages:
- Easy deployment and management
- Auto-scaling and load balancing
- Built-in monitoring
- Zero-downtime deployments

### Steps:

1. **Configure your AWS region in the script**:
   ```bash
   # Edit aws-deployment/deploy-to-eb.sh
   REGION="us-east-1"  # Change to your preferred region
   ```

2. **Deploy**:
   ```bash
   ./aws-deployment/deploy-to-eb.sh
   ```

3. **Set up RDS database** (optional, for production):
   ```bash
   # Create RDS MySQL instance
   aws rds create-db-instance \
     --db-instance-identifier lazyhr-db \
     --db-instance-class db.t3.micro \
     --engine mysql \
     --master-username admin \
     --master-user-password YourSecurePassword123 \
     --allocated-storage 20 \
     --vpc-security-group-ids sg-your-security-group
   ```

4. **Update environment variables**:
   ```bash
   aws elasticbeanstalk update-environment \
     --environment-name lazyhr-prod \
     --option-settings \
     Namespace=aws:elasticbeanstalk:application:environment,OptionName=RDS_HOSTNAME,Value=your-rds-endpoint \
     Namespace=aws:elasticbeanstalk:application:environment,OptionName=RDS_USERNAME,Value=admin \
     Namespace=aws:elasticbeanstalk:application:environment,OptionName=RDS_PASSWORD,Value=YourSecurePassword123 \
     Namespace=aws:elasticbeanstalk:application:environment,OptionName=RDS_DB_NAME,Value=lazyhr_prod
   ```

### Access your application:
The script will output the application URL, typically: `http://your-env-name.region.elasticbeanstalk.com`

## Deployment Option 2: AWS ECS Fargate (Recommended for production)

### Advantages:
- Containerized deployment
- Better resource utilization
- Microservices ready
- More control over infrastructure

### Steps:

1. **Update configuration**:
   ```bash
   # Edit aws-deployment/deploy-to-ecs.sh
   AWS_ACCOUNT_ID="123456789012"  # Your AWS account ID
   AWS_REGION="us-east-1"         # Your preferred region
   ```

2. **Update ECS task definition**:
   ```bash
   # Edit aws-deployment/ecs-task-definition.json
   # Replace YOUR_ACCOUNT_ID, YOUR_REGION, YOUR_RDS_ENDPOINT with actual values
   ```

3. **Create VPC and subnets** (if not exists):
   ```bash
   # Create VPC
   aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=lazyhr-vpc}]'
   
   # Create subnets (replace vpc-id with your VPC ID)
   aws ec2 create-subnet --vpc-id vpc-12345 --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
   aws ec2 create-subnet --vpc-id vpc-12345 --cidr-block 10.0.2.0/24 --availability-zone us-east-1b
   ```

4. **Deploy**:
   ```bash
   ./aws-deployment/deploy-to-ecs.sh
   ```

## Deployment Option 3: AWS Lambda with Spring Boot

For serverless deployment, you can use AWS Lambda with Spring Boot:

### Create Lambda configuration:
```bash
# Add to build.gradle
implementation 'com.amazonaws.serverless:aws-serverless-java-container-springboot3:2.0.0'
```

### Lambda Handler:
```java
public class LambdaHandler implements RequestHandler<AwsProxyRequest, AwsProxyResponse> {
    private SpringBootLambdaContainerHandler<AwsProxyRequest, AwsProxyResponse> handler;

    public LambdaHandler() throws ContainerInitializationException {
        handler = SpringBootLambdaContainerHandler.getAwsProxyHandler(LazyhrApplication.class);
    }

    @Override
    public AwsProxyResponse handleRequest(AwsProxyRequest input, Context context) {
        return handler.proxy(input, context);
    }
}
```

## Database Setup

### Option 1: AWS RDS MySQL
```bash
# Create MySQL RDS instance
aws rds create-db-instance \
  --db-instance-identifier lazyhr-prod-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0.35 \
  --master-username lazyhr_admin \
  --master-user-password YourSecurePassword123! \
  --allocated-storage 20 \
  --storage-type gp2 \
  --vpc-security-group-ids sg-your-security-group \
  --db-subnet-group-name your-db-subnet-group \
  --backup-retention-period 7 \
  --multi-az false \
  --publicly-accessible false \
  --storage-encrypted true
```

### Option 2: AWS Aurora Serverless
```bash
# Create Aurora Serverless cluster
aws rds create-db-cluster \
  --db-cluster-identifier lazyhr-aurora-cluster \
  --engine aurora-mysql \
  --engine-version 8.0.mysql_aurora.3.02.0 \
  --master-username lazyhr_admin \
  --master-user-password YourSecurePassword123! \
  --database-name lazyhr_prod \
  --vpc-security-group-ids sg-your-security-group \
  --db-subnet-group-name your-db-subnet-group \
  --storage-encrypted true \
  --serverless-v2-scaling-configuration MinCapacity=0.5,MaxCapacity=2
```

## Security Configuration

### 1. Create IAM Roles

**ECS Task Execution Role**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

**ECS Task Role**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "rds:DescribeDBInstances"
      ],
      "Resource": "*"
    }
  ]
}
```

### 2. Security Groups

**Application Security Group**:
```bash
# Create security group for application
aws ec2 create-security-group \
  --group-name lazyhr-app-sg \
  --description "Security group for LazyHR application" \
  --vpc-id vpc-your-vpc-id

# Allow HTTP traffic
aws ec2 authorize-security-group-ingress \
  --group-id sg-your-app-sg-id \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Allow HTTPS traffic
aws ec2 authorize-security-group-ingress \
  --group-id sg-your-app-sg-id \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0
```

**Database Security Group**:
```bash
# Create security group for database
aws ec2 create-security-group \
  --group-name lazyhr-db-sg \
  --description "Security group for LazyHR database" \
  --vpc-id vpc-your-vpc-id

# Allow MySQL traffic from application security group
aws ec2 authorize-security-group-ingress \
  --group-id sg-your-db-sg-id \
  --protocol tcp \
  --port 3306 \
  --source-group sg-your-app-sg-id
```

## Environment Variables

Set these environment variables in your AWS deployment:

```bash
# Database
RDS_HOSTNAME=your-rds-endpoint.amazonaws.com
RDS_PORT=3306
RDS_DB_NAME=lazyhr_prod
RDS_USERNAME=lazyhr_admin
RDS_PASSWORD=YourSecurePassword123!

# Application
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=5000

# Security (optional)
JWT_SECRET=your-jwt-secret-key
ENCRYPTION_KEY=your-encryption-key
```

## Monitoring and Logging

### CloudWatch Logs
```bash
# Create log group
aws logs create-log-group --log-group-name /aws/ecs/lazyhr

# Create log group for Elastic Beanstalk
aws logs create-log-group --log-group-name /aws/elasticbeanstalk/lazyhr-prod
```

### CloudWatch Alarms
```bash
# Create CPU utilization alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "LazyHR-High-CPU" \
  --alarm-description "Alarm when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

## SSL Certificate (Optional)

### Using AWS Certificate Manager:
```bash
# Request SSL certificate
aws acm request-certificate \
  --domain-name lazyhr.yourdomain.com \
  --validation-method DNS \
  --subject-alternative-names "*.yourdomain.com"
```

## Custom Domain Setup

### Using Route 53:
```bash
# Create hosted zone
aws route53 create-hosted-zone \
  --name yourdomain.com \
  --caller-reference $(date +%s)

# Create A record pointing to your load balancer
aws route53 change-resource-record-sets \
  --hosted-zone-id Z123456789 \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "lazyhr.yourdomain.com",
        "Type": "A",
        "AliasTarget": {
          "DNSName": "your-load-balancer-dns-name",
          "EvaluateTargetHealth": false,
          "HostedZoneId": "Z35SXDOTRQ7X7K"
        }
      }
    }]
  }'
```

## Cost Optimization

### 1. Elastic Beanstalk Cost Optimization:
- Use t3.micro or t3.small for development
- Enable auto-scaling based on CPU/memory
- Use scheduled scaling for predictable traffic

### 2. ECS Cost Optimization:
- Use Fargate Spot for non-critical workloads
- Right-size your containers
- Use Application Load Balancer target group health checks

### 3. Database Cost Optimization:
- Use RDS t3.micro for development
- Enable automated backups with retention period
- Use read replicas for read-heavy workloads

## Troubleshooting

### Common Issues:

1. **Port Configuration**:
   - Ensure your application listens on port 5000 in production
   - Check security group configurations

2. **Database Connection**:
   - Verify RDS endpoint and credentials
   - Check security group rules for database access

3. **Memory Issues**:
   - Increase memory allocation in task definition
   - Monitor CloudWatch metrics

4. **Health Check Failures**:
   - Verify health check endpoint: `/actuator/health`
   - Check application logs in CloudWatch

### Useful Commands:

```bash
# Check Elastic Beanstalk environment health
aws elasticbeanstalk describe-environment-health --environment-name lazyhr-prod

# Check ECS service status
aws ecs describe-services --cluster lazyhr-cluster --services lazyhr-service

# View application logs
aws logs tail /aws/ecs/lazyhr --follow

# Check RDS instance status
aws rds describe-db-instances --db-instance-identifier lazyhr-prod-db
```

## Cleanup Resources

### To avoid charges, clean up resources when not needed:

```bash
# Terminate Elastic Beanstalk environment
aws elasticbeanstalk terminate-environment --environment-name lazyhr-prod

# Delete ECS service and cluster
aws ecs update-service --cluster lazyhr-cluster --service lazyhr-service --desired-count 0
aws ecs delete-service --cluster lazyhr-cluster --service lazyhr-service
aws ecs delete-cluster --cluster lazyhr-cluster

# Delete RDS instance
aws rds delete-db-instance --db-instance-identifier lazyhr-prod-db --skip-final-snapshot

# Delete ECR repository
aws ecr delete-repository --repository-name lazyhr --force
```

## Support

For issues with AWS deployment:
1. Check AWS CloudWatch logs
2. Review AWS documentation
3. Contact AWS Support if needed

For application-specific issues:
1. Check application logs
2. Verify database connectivity
3. Review application configuration
