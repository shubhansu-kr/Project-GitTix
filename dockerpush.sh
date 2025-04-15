#!/bin/bash

# Your AWS account-specific ECR base
ECR_BASE="600790316142.dkr.ecr.us-east-1.amazonaws.com"

# List of services (must match folder names and ECR repo names)
SERVICES=("auth" "client" "expiration" "orders" "payments" "tickets")

# Authenticate Docker with ECR
echo "Logging in to AWS ECR..."
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_BASE

# Build and push for each service
for SERVICE in "${SERVICES[@]}"
do
  IMAGE="$ECR_BASE/$SERVICE"
  echo "Building and pushing $SERVICE to $IMAGE..."

  docker build -t $IMAGE ./$SERVICE
  docker push $IMAGE

  echo "✅ Finished $SERVICE"
done

echo "🎉 All services built and pushed successfully!"
