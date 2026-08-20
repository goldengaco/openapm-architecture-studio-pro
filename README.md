# 🏛️ Cloud & APM Architecture Studio Pro 2026 Q4
> **Interactive Multi-Cloud Architecture Designer, Zero-Cost & On-Premise FinOps Optimizer, Universal IaC Exporter & Agentic AI Copilot.**

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Node: >=18.0.0](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![Status: Production Ready](https://img.shields.io/badge/Status-Production_Ready_2026_Q4-brightgreen.svg)]()
[![Hardware: 60/120 FPS GPU rAF](https://img.shields.io/badge/Performance-60%2F120_FPS_GPU_Accelerated-blueviolet.svg)]()

---

## 🌟 Características Principales

### 1. 🎨 Lienzo Interactivo Acelerado por GPU (60/120 FPS)
- **Transformación de Paneo & Zoom Fluida**: Render loop gobernado por `requestAnimationFrame` que elimina el *layout thrashing*.
- **Tarjetas de 230px de Alta Densidad**: Visualización clara de nombres, categorías, cuotas de Free Tier y puertos interactivos (Data In / Data Out).
- **Zonas y Subredes Inteligentes**: Contenedores arrastrables para VPCs, Subnets Públicas/Privadas y entornos On-Premise que mueven sus nodos de forma agrupada.
- **Conectores SVG Dinámicos**: Curvas Bézier cúbicas con etiquetas editables de protocolo (HTTPS, gRPC, SQL, AMQP, OTLP).

### 2. 💰 Simulador FinOps & Unit Economics en Tiempo Real
- **Cálculo de Quiebre de Free Tier**: Monitorea MAU, RPS, Almacenamiento (GB) y Egress (GB) comparando **Zero-Cost ($0.00)** vs **AWS**, **GCP** y **Azure**.
- **Métricas de Negocio de Nivel CTO**: MRR ($), Costo por Usuario ($/MAU), Margen Bruto de Hosting (%), Punto de Equilibrio y Huella de Carbono estimada (kg CO2e).
- **Botón "💸 Convertir a $0 / On-Prem" (1-Clic)**: Transforma instantáneamente servicios costosos de nube a alternativas de código abierto y Zero-Cost.

### 3. 🏢 Catálogo On-Premise, Bare-Metal & Self-Hosted
- Soporte nativo para:
  - **MinIO**: Almacenamiento de objetos S3 compatible 100% On-Premise sobre NVMe.
  - **Traefik**: Ingress proxy con gestión automática de certificados Let's Encrypt.
  - **PostgreSQL 16 Dedicated**: Con extensiones `pgvector` y `TimescaleDB`.
  - **Qdrant**: Base de datos vectorial ultra-rápida en Rust para RAG local.
  - **Ollama**: Servidor de inferencia local ($0 costo de tokens) para modelos Llama 3.3 y DeepSeek R1.
  - **RabbitMQ**: Broker de mensajería AMQP de alto rendimiento.
  - **K3s**: Distribución ligera de Kubernetes para microservidores.

### 4. 🤖 Copiloto de IA Multi-Proveedor (Gemini, Ollama & Heurístico)
- **Master Mega-Prompt 2026 Q4**: Motor de auditoría de arquitectura y resiliencia basado en 6 pilares de diseño de nivel CTO.
- **Soporte Google AI Studio (Gemini Flash)** + **Ollama Local ($0 Offline)** + **Motor Heurístico Local**.
- **Generación Visual Automática**: Botón para dibujar en el lienzo directamente a partir de respuestas JSON emitidas por la IA.

### 5. 🏗️ Exportador Universal de Código, IaC & DevOps
- **OpenTofu / Terraform Multi-Cloud (HCL)**.
- **Docker Compose v2 Producción** (con redes bridge aisladas, volúmenes persistentes y credenciales).
- **Kubernetes (K3s / Talos)** (`Deployment`, `Service`, `Ingress`).
- **TanStack Start + Hono.js + Supabase TypeScript Boilerplate**.
- **Python + FastAPI + DuckDB Agentic RAG Pipeline**.
- **AWS Serverless TypeScript Handler**.
- **GitHub Actions CI/CD Pipeline**.
- **Mermaid C4 Architecture Diagrams**.
- **Esquema de intercambio `.arch.json`**.

---

## 🚀 Inicio Rápido Local (100% Sin Docker / Con Docker)

### Requisitos
- Node.js >= 18.0.0
- Git

### Instalación y Ejecución
```bash
# 1. Clonar el repositorio
git clone https://github.com/goldengaco/openapm-architecture-studio-pro.git
cd openapm-architecture-studio-pro

# 2. Instalar dependencias
npm install

# 3. Compilar el modelo del catálogo y levantar el servidor
npm run dev
```

El estudio estará disponible de inmediato en: **`http://localhost:3000`**.

---

## 📖 Manual Maestro de Ingeniería
Consulta el manual completo y exhaustivo de arquitectura en:
👉 **[MASTER_ARCHITECTURE_PROMPT_2026.md](./MASTER_ARCHITECTURE_PROMPT_2026.md)**.

---

## 📄 Licencia
Distribuido bajo la Licencia **Apache-2.0**.