# ==============================================================================
# AICTE KOSH-RAKSHAK: ENTERPRISE AUTOMATION MAKEFILE
# Problem Statement ID: 26265 • Ministry of Education & AICTE
# ==============================================================================

SHELL := /bin/bash
.DEFAULT_GOAL := help

.PHONY: help install start-frontend start-backend start-ai docker-up docker-down build test lint clean setup

help: ## Display available management commands
	@echo "========================================================================"
	@echo "   AICTE KOSH-RAKSHAK ENTERPRISE BUILD & RUNBOOK"
	@echo "========================================================================"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-22s\033[0m %s\n", $$1, $$2}'

setup: ## Execute one-click automated setup and verification script
	@./setup.sh

install: ## Install all Node.js and microservice dependencies
	@echo "Installing frontend and build dependencies..."
	npm install
	@if [ -d "backend" ] && [ -f "backend/package.json" ]; then \
		echo "Installing backend dependencies..."; \
		(cd backend && npm install); \
	fi

start-frontend: ## Launch React/Vite UI development server on port 5173
	@echo "Launching AICTE KOSH-Rakshak Portal on http://localhost:5173/..."
	npx vite --host 0.0.0.0 --port 5173

start-backend: ## Launch Node.js Express REST API microservice on port 8080
	@echo "Launching AICTE KOSH-Rakshak Backend Service on http://localhost:8080/..."
	@if [ -f "backend/src/server.js" ]; then \
		node backend/src/server.js; \
	else \
		node -e "console.log('Backend mock active in full-stack dev mode.');"; \
	fi

start-ai: ## Launch Python FastAPI ELA Forensics microservice on port 8000
	@echo "Launching AI Forensics ELA & OCR Engine on http://localhost:8000/..."
	@if command -v uvicorn >/dev/null 2>&1; then \
		uvicorn ai-forensics.ela_analyzer:app --host 0.0.0.0 --port 8000 --reload; \
	else \
		echo "uvicorn not found. Ensure python virtualenv is active."; \
	fi

build: ## Compile TypeScript & bundle production assets with Vite
	@echo "Building production bundles..."
	npm run build

test: ## Execute test suites (Unit, E2E, and Cryptographic validation)
	@echo "Executing unit, E2E, and cryptographic ledger validation tests..."
	@node tests/unit/fdr_math.test.js
	@node tests/e2e/login_rbac.spec.js
	@node blockchain-ledger/ledger_engine.js
	@echo "✓ All test suites successfully verified!"

docker-up: ## Start full enterprise multi-container stack with Docker Compose
	@echo "Spinning up full microservices stack (PostgreSQL, Redis, Backend, AI, UI)..."
	docker-compose up -d --build
	@echo "Stack live! Access portal at http://localhost:5173/"

docker-down: ## Stop all containerized microservices and remove volumes
	@echo "Tearing down Docker containers..."
	docker-compose down -v

lint: ## Execute code style and linting checks
	@echo "Checking codebase formatting..."
	@npx tsc --noEmit
	@echo "✓ Zero TypeScript type errors detected."

clean: ## Clean build artifacts and temporary cache directories
	@echo "Cleaning temporary files and build artifacts..."
	rm -rf dist node_modules/.vite .cache
	@echo "Clean completed."
