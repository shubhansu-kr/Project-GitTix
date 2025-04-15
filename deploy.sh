#!/bin/bash

set -e

echo "⏳ Starting Kubernetes deployment..."

# NATS (event bus) should be started first
echo "🚀 Deploying NATS..."
kubectl apply -f infra/k8s/nats-depl.yaml

# Mongo & Redis instances for individual services
echo "📦 Deploying Mongo/Redis dependencies..."
kubectl apply -f infra/k8s/auth-mongo-depl.yaml
kubectl apply -f infra/k8s/orders-mongo-depl.yaml
kubectl apply -f infra/k8s/payments-mongo-depl.yaml
kubectl apply -f infra/k8s/tickets-mongo-depl.yaml
kubectl apply -f infra/k8s/expiration-redis-depl.yaml

# Core services (order matters slightly less here, but auth first is sensible)
echo "🔧 Deploying core services..."
kubectl apply -f infra/k8s/auth-depl.yaml
kubectl apply -f infra/k8s/tickets-depl.yaml
kubectl apply -f infra/k8s/orders-depl.yaml
kubectl apply -f infra/k8s/payments-depl.yaml
kubectl apply -f infra/k8s/expiration-depl.yaml

# Ingress (must be deployed before client)
echo "🌐 Deploying Ingress..."
kubectl apply -f infra/k8s-dev/ingress-srv.yaml

# Client last so it routes correctly through Ingress
echo "🎨 Deploying Client..."
kubectl apply -f infra/k8s/client-depl.yaml

echo "✅ All services deployed successfully!"
