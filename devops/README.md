# AICTE KOSH-Rakshak DevOps & Deployment Runbook

This directory contains containerization, reverse proxy configs, and production runbooks for **AICTE KOSH-Rakshak**.

---

## 1. Multi-Container Orchestration
The stack is fully orchestrated via `docker-compose.yml`:
- **Nginx Alpine (Frontend)**: Port `5173` (mapped to container port 80).
- **Node.js Express (Backend)**: Port `8080`.
- **FastAPI / PyTorch (AI Forensics)**: Port `8000`.
- **PostgreSQL 16**: Port `5432`.
- **Redis 7**: Port `6379`.
- **MinIO Vault**: Port `9000` (API) / `9001` (Web Console).

### Quick Commands:
```bash
# Build and run entire stack in background
docker-compose up -d --build

# View real-time aggregated logs
docker-compose logs -f

# Check container health status
docker-compose ps
```
