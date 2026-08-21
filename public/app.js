// Cloud & APM Architecture Studio Pro 2026 Q4
// Ultra-High Performance Engine: Multi-Theme Engine (6 Palettes), Sticky Notes & Annotations, DNS & Domain Registrar Hub, 60/120 FPS rAF Rendering, Hardware-Accelerated Canvas, Multi-Provider AI (Gemini/Ollama/$0), FinOps Unit Economics, 1-Click Zero-Cost Optimizer & Universal IaC / Docker / K3s Exporter
(function () {
    'use strict';

    // -------------------------------------------------------------
    // MASTER MEGA-PROMPT 2026 (CTO & PRINCIPAL ARCHITECT)
    // -------------------------------------------------------------
    const MASTER_MEGA_PROMPT = `# MASTER MEGA-PROMPT: PRINCIPAL CLOUD ARCHITECT & CTO (2026 Q4)
Eres un Principal Solutions Architect, Chief Technology Officer (CTO) y FinOps Lead de clase mundial.
Tu objetivo es diseñar, auditar y optimizar arquitecturas de software modernas con el más alto rigor de ingeniería, maximizando el valor de negocio, la velocidad de entrega y minimizando el costo operativo y el Total Cost of Ownership (TCO).

Piensas con primeros principios (First Principles) al estilo de Elon Musk, Jeff Bezos, Martin Kleppmann y Paul Graham:
- Desafías la complejidad accidental; la mejor arquitectura es la que requiere menos piezas móviles para lograr el objetivo.
- Prefieres soluciones Zero-Cost ($0.00), Serverless u On-Premise / Self-Hosted de alta eficiencia antes de incurrir en costos fijos de infraestructura no justificados por el tráfico.
- Dominas el estado del arte de 2026 Q4: TanStack Start/Query, Hono.js, Supabase (pgvector/Postgres), DuckDB (OLAP embebido), Cloudflare R2 ($0 Egress) & DNS Registrar At-Cost, MinIO (S3 On-Prem), Traefik, Qdrant Vector DB, Ollama Local, OpenTofu / Terraform, y arquitecturas agénticas de IA con herramientas (Tool Use / RAG híbrido).

ESTRUCTURA DE EVALUACIÓN (6 PILARES):
1. 💼 VIABILIDAD DE NEGOCIO & UNIT ECONOMICS: $/MAU, Margen Bruto de Hosting, Punto de Equilibrio y TTM.
2. 💰 ESTRATEGIA FINOPS & ZERO-COST ($0 STACK): Explotación exhaustiva de Free Tiers y alertas de quiebre de cuota.
3. 🛡️ RESILIENCIA, SPOF & SEGURIDAD: Eliminación de puntos únicos de fallo, WAF (Cloud Armor / Traefik), VPC privada y Row-Level Security.
4. ⚡ MODERN STACK, ON-PREM & AGENTIC AI: Type-Safety extremo a extremo (TanStack/Hono), DuckDB Parquet, MinIO, Qdrant y RAG local con Ollama.
5. 🏗️ INFRAESTRUCTURA COMO CÓDIGO (IaC & DOCKER): OpenTofu / Terraform, Docker Compose v2 y Kubernetes K3s listos para producción.
6. 📐 ESQUEMA JSON DE TOPOLOGÍA: Emisión de JSON con { zones: [...], nodes: [...], connections: [...] } para renderizado visual directo.`;

    // -------------------------------------------------------------
    // UTILITIES: TOASTS, SAFE STORAGE, DEBOUNCE & ESCAPING
    // -------------------------------------------------------------
    const safeStorage = {
        get(key, fallback = null) {
            try { return localStorage.getItem(key) || fallback; } catch (e) { return fallback; }
        },
        set(key, val) {
            try { localStorage.setItem(key, val); } catch (e) {}
        },
        remove(key) {
            try { localStorage.removeItem(key); } catch (e) {}
        }
    };

    function showToast(msg, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const item = document.createElement('div');
        item.className = `toast-item toast-${type}`;
        const icons = { success: '✅', warning: '⚠️', error: '❌', info: 'ℹ️' };
        item.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${escapeHtml(msg)}</span>`;
        container.appendChild(item);
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px) scale(0.95)';
            setTimeout(() => item.remove(), 250);
        }, duration);
    }

    function debounce(fn, wait = 100) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), wait);
        };
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // -------------------------------------------------------------
    // STATE & HISTORY (UNDO / REDO / AUTO-SAVE ENGINE)
    // -------------------------------------------------------------
    let modelData = { components: [], categories: [], licenses: {} };
    let placedCanvasNodes = []; // { instanceId, componentId, name, category, eco, icon, cost, quota, x, y }
    let placedCanvasZones = []; // { id, title, type, x, y, width, height }
    let activeConnections = []; // { id, fromInstanceId, toInstanceId, label }
    let placedCanvasNotes = []; // { id, text, color, x, y, width, height }
    let placedCanvasMarkers = []; // { id, num, text, x, y }
    
    let nextInstanceId = 1;
    let nextZoneId = 1;
    let nextConnId = 1;
    let nextNoteId = 1;
    let nextMarkerId = 1;

    let activeEcoFilter = 'all';
    let currentExportTab = 'mermaid';
    let currentAIProvider = safeStorage.get('active_ai_provider', 'opencode'); // 'opencode' | 'gemini' | 'groq' | 'openrouter' | 'ollama' | 'heuristic'
    let lastGeneratedAITopology = null;
    let currentTheme = 'default';

    // ─── GEMINI MULTI-MODEL CASCADE ENGINE (Free Tier Maximizer) ───
    // Ordered by capability: most powerful first → lite models as high-volume fallback
    const GEMINI_MODEL_CASCADE = [
        { id: 'gemini-3.6-flash',      name: 'Gemini 3.6 Flash',      tier: 'pro',  rpdLimit: 20,  rpmLimit: 5  },
        { id: 'gemini-3.5-flash',      name: 'Gemini 3.5 Flash',      tier: 'pro',  rpdLimit: 20,  rpmLimit: 5  },
        { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash',       tier: 'pro',  rpdLimit: 20,  rpmLimit: 5  },
        { id: 'gemini-3.7-flash',      name: 'Gemini 3.7 Flash',      tier: 'pro',  rpdLimit: 20,  rpmLimit: 5  },
        { id: 'gemini-3.5-flash-lite', name: 'Gemini 3.5 Flash Lite', tier: 'lite', rpdLimit: 500, rpmLimit: 15 },
        { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', tier: 'lite', rpdLimit: 500, rpmLimit: 15 },
    ];

    // Track exhausted models per session (reset on page reload)
    const exhaustedModels = new Set();
    let lastUsedModelIndex = 0;

    /**
     * Gemini Cascade: Try models in order, skip exhausted ones.
     * On 429 (rate limit), marks model as exhausted and tries next.
     * Returns { text, modelName } on success, null on total failure.
     */
    async function geminiCascadeCall(apiKey, promptText, statusCallback) {
        for (let i = 0; i < GEMINI_MODEL_CASCADE.length; i++) {
            const model = GEMINI_MODEL_CASCADE[i];
            if (exhaustedModels.has(model.id)) continue;

            if (statusCallback) statusCallback(`🔄 Intentando ${model.name}...`);

            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);

                const res = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${model.id}:generateContent?key=${apiKey}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: promptText }] }],
                            generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
                        }),
                        signal: controller.signal
                    }
                );
                clearTimeout(timeoutId);

                if (res.status === 429) {
                    // Rate limited → mark exhausted and try next model
                    exhaustedModels.add(model.id);
                    console.warn(`⚠️ ${model.name} rate limited (429). Trying next model...`);
                    if (statusCallback) statusCallback(`⚠️ ${model.name} agotado, probando siguiente...`);
                    continue;
                }

                if (res.status === 404) {
                    // Model not available → skip permanently
                    exhaustedModels.add(model.id);
                    console.warn(`⚠️ ${model.name} not found (404). Skipping...`);
                    continue;
                }

                if (!res.ok) {
                    const errBody = await res.json().catch(() => ({}));
                    console.warn(`⚠️ ${model.name} error ${res.status}:`, errBody);
                    // On server errors, try next model
                    if (res.status >= 500) continue;
                    // On other client errors (400, 403), try next model too
                    continue;
                }

                const json = await res.json();
                if (json.candidates && json.candidates[0]?.content?.parts?.[0]?.text) {
                    lastUsedModelIndex = i;
                    const modelName = model.name;
                    const text = json.candidates[0].content.parts[0].text;
                    console.log(`✅ ${modelName} responded successfully`);
                    return { text, modelName, modelId: model.id, tier: model.tier };
                }

                // Empty response → try next
                console.warn(`⚠️ ${model.name} returned empty response. Trying next...`);
            } catch (err) {
                console.warn(`⚠️ ${model.name} network error:`, err);
                // Network error → try next model
            }
        }

        // All models exhausted
        return null;
    }

    /**
     * Get cascade status summary for display
     */
    function getCascadeStatus() {
        const available = GEMINI_MODEL_CASCADE.filter(m => !exhaustedModels.has(m.id));
        const totalRPD = available.reduce((s, m) => s + m.rpdLimit, 0);
        return {
            available: available.length,
            total: GEMINI_MODEL_CASCADE.length,
            exhausted: exhaustedModels.size,
            totalRPD,
            models: available.map(m => m.name)
        };
    }

    // Undo / Redo Stack State
    let historyStack = [];
    let redoStack = [];
    const MAX_HISTORY = 35;
    let isRestoringHistory = false;

    // Canvas Pan & Zoom State (GPU rAF Scheduled)
    let zoomLevel = 1.0;
    let panX = 0;
    let panY = 0;
    let isPanning = false;
    let panStartX = 0;
    let panStartY = 0;
    let isSpacePressed = false;
    let transformRafId = null;

    // Interactive Port Dragging State
    let isConnecting = false;
    let connectSourceNode = null;
    let connectStartPos = { x: 0, y: 0 };
    let tempPathRafId = null;
    let connectionsRafId = null;

    function snapshotCanvasState() {
        return JSON.stringify({
            nodes: placedCanvasNodes,
            zones: placedCanvasZones,
            connections: activeConnections,
            notes: placedCanvasNotes,
            markers: placedCanvasMarkers,
            estimatedCost: document.getElementById('cost-estimate-val') ? document.getElementById('cost-estimate-val').textContent : '$0.00 / mes'
        });
    }

    const triggerAutoSave = debounce(() => {
        const snap = snapshotCanvasState();
        safeStorage.set('current_canvas_session', snap);
        const indicator = document.getElementById('autosave-text');
        if (indicator) {
            indicator.textContent = 'Guardado ✓';
            setTimeout(() => {
                if (indicator) indicator.textContent = 'Auto-Guardado';
            }, 1500);
        }
    }, 250);

    function recordCanvasState(saveToSession = true) {
        if (isRestoringHistory) return;
        const snap = snapshotCanvasState();
        if (historyStack.length > 0 && historyStack[historyStack.length - 1] === snap) return;
        historyStack.push(snap);
        if (historyStack.length > MAX_HISTORY) historyStack.shift();
        redoStack = [];
        updateUndoRedoUI();
        if (saveToSession) triggerAutoSave();
    }

    function undo() {
        if (historyStack.length <= 1) return;
        const current = historyStack.pop();
        redoStack.push(current);
        const prev = historyStack[historyStack.length - 1];
        if (prev) {
            isRestoringHistory = true;
            try {
                const data = JSON.parse(prev);
                applyTopologyToCanvas(data, false);
                showToast('Acción deshecha (Ctrl+Z)', 'info', 1500);
            } catch (e) {}
            isRestoringHistory = false;
        }
        updateUndoRedoUI();
        triggerAutoSave();
    }

    function redo() {
        if (redoStack.length === 0) return;
        const next = redoStack.pop();
        historyStack.push(next);
        isRestoringHistory = true;
        try {
            const data = JSON.parse(next);
            applyTopologyToCanvas(data, false);
            showToast('Acción rehecha (Ctrl+Y)', 'info', 1500);
        } catch (e) {}
        isRestoringHistory = false;
        updateUndoRedoUI();
        triggerAutoSave();
    }

    function updateUndoRedoUI() {
        const btnUndo = document.getElementById('btn-undo');
        const btnRedo = document.getElementById('btn-redo');
        if (btnUndo) btnUndo.disabled = (historyStack.length <= 1);
        if (btnRedo) btnRedo.disabled = (redoStack.length === 0);
    }

    // -------------------------------------------------------------
    // MULTI-CLOUD, ZERO-COST & ON-PREMISE SERVICE CATALOG 2026
    // -------------------------------------------------------------
    const CLOUD_SERVICES = [
        // NETWORKING & DOMAINS / DNS
        { id: 'cloudflare-dns', name: 'Cloudflare DNS & Registrar', category: 'Networking / DNS', eco: 'serverless', cost: '$0.00 / At-Cost', quota: 'Free Anycast + $0 Markup Domains', icon: '☁️', desc: 'El DNS Anycast más rápido y seguro del mundo con registro de dominios a precio de costo mayorista de ICANN sin sobreprecio.' },
        { id: 'porkbun-domains', name: 'Porkbun Domains & DNS', category: 'Networking / DNS', eco: 'serverless', cost: 'At-Cost / Low', quota: 'Free WHOIS Privacy & API', icon: '🐷', desc: 'Registrador independiente con los precios de dominios más bajos del mercado, DNSSEC gratis y API para certbot.' },
        { id: 'duckdns', name: 'DuckDNS (DDNS $0 On-Prem)', category: 'Networking / DDNS', eco: 'apm', cost: 'OSS $0', quota: '5 Free Subdomains / API', icon: '🦆', desc: 'Servicio Dynamic DNS gratuito para apuntar dominios a servidores locales y homelabs con IP dinámica.' },
        { id: 'aws-route53', name: 'AWS Route 53 DNS', category: 'Networking / DNS', eco: 'aws', cost: '$0.50/zone', quota: 'Latency & Failover Routing', icon: '🅰️', desc: 'Servicio DNS escalable con enrutamiento por latencia, geo-proximidad, health checks y failover.' },
        { id: 'gcp-clouddns', name: 'Google Cloud DNS', category: 'Networking / DNS', eco: 'gcp', cost: '$0.20/zone', quota: '100% SLA Anycast', icon: '🇬', desc: 'DNS Anycast global de alta disponibilidad en la red de fibra óptica privada de Google.' },

        // ZERO-COST / MODERN FULLSTACK PAAS
        { id: 'tanstack-start', name: 'TanStack Start / Query', category: 'Frontend / Fullstack', eco: 'serverless', cost: '$0.00', quota: 'Open Source / Type-Safe', icon: '⚡', desc: 'Framework fullstack React con SSR, TanStack Router y TanStack Query para fetching ultra-rápido.' },
        { id: 'hono', name: 'Hono.js (Edge API)', category: 'Compute / API', eco: 'serverless', cost: '$0.00', quota: 'Ultra-Fast Web Standards', icon: '🔥', desc: 'Framework web moderno basado en Web Standards que corre a máxima velocidad en Cloudflare Workers, Bun o Node.js.' },
        { id: 'vercel', name: 'Vercel Edge', category: 'Frontend / Edge', eco: 'serverless', cost: '$0.00', quota: 'Free: 100GB ancho de banda', icon: '▲', desc: 'Despliegue frontend Next.js, Edge Middleware y funciones serverless con 100GB ancho de banda gratis.' },
        { id: 'supabase', name: 'Supabase (DB & Auth)', category: 'Backend / BaaS', eco: 'serverless', cost: '$0.00', quota: 'Free: 500MB / 50k MAU', icon: '⚡', desc: 'Postgres dedicado de 500MB, autenticación de 50k usuarios activos/mes, pgvector y realtime.' },
        { id: 'cloudflare-r2', name: 'Cloudflare R2', category: 'Object Storage', eco: 'serverless', cost: '$0.00', quota: 'Free: 10GB / $0 Egress', icon: '☁️', desc: 'Almacenamiento S3-compatible con 10GB gratis y $0.00 en costo de salida de datos (Zero Egress).' },
        { id: 'cloudflare-workers', name: 'Cloudflare Workers', category: 'Compute / Edge', eco: 'serverless', cost: '$0.00', quota: 'Free: 100k req/día', icon: '⚡', desc: 'Funciones en el Edge ultrarrápidas con 100,000 peticiones gratuitas al día.' },
        { id: 'duckdb', name: 'DuckDB (OLAP Engine)', category: 'Analytics / Database', eco: 'serverless', cost: '$0.00', quota: 'Free: $0 Cómputo Embebido', icon: '🦆', desc: 'Motor SQL analítico columnar embebido. Consulta Parquet en S3/R2 a costo cero.' },
        { id: 'sqlite-turso', name: 'Turso (SQLite / LibSQL)', category: 'Database / Relational', eco: 'serverless', cost: '$0.00', quota: 'Free: 9GB / 1B lecturas/mes', icon: '🗄️', desc: 'Base de datos SQLite distribuida globalmente en el edge con 9GB y 1B lecturas/mes gratis.' },
        { id: 'neon-postgres', name: 'Neon Serverless Postgres', category: 'Database / SQL', eco: 'serverless', cost: '$0.00', quota: 'Free: 0.5GB Autoscaling', icon: '🐘', desc: 'Postgres serverless con autoscaling a cero, branching instantáneo y 0.5GB gratis.' },
        { id: 'upstash-redis', name: 'Upstash Redis', category: 'Cache / Serverless', eco: 'serverless', cost: '$0.00', quota: 'Free: 10k comandos/día', icon: '⚡', desc: 'Redis serverless con REST API para caching, rate limiting y sesiones.' },

        // ON-PREMISE, BARE-METAL & SELF-HOSTED OPEN SOURCE
        { id: 'traefik', name: 'Traefik SSL Proxy', category: 'Security / Ingress', eco: 'apm', cost: 'OSS $0', quota: 'Self-Hosted / Auto Let\'s Encrypt', icon: '🚦', desc: 'Edge router y reverse proxy dinámico con SSL automático para arquitecturas locales o Kubernetes.' },
        { id: 'postgresql-onprem', name: 'PostgreSQL Dedicated', category: 'Database / SQL', eco: 'apm', cost: 'OSS $0', quota: 'Self-Hosted NVMe Storage', icon: '🐘', desc: 'Base de datos PostgreSQL 16 con TimescaleDB o pgvector instalada en hardware local propio.' },
        { id: 'minio', name: 'MinIO (S3 On-Prem)', category: 'Object Storage', eco: 'apm', cost: 'OSS $0', quota: 'Self-Hosted S3 Storage', icon: '🗄️', desc: 'Almacenamiento de objetos S3 compatible de altísimo rendimiento para servidores propios sin pagar a AWS/GCP.' },
        { id: 'qdrant', name: 'Qdrant Vector DB', category: 'AI / Vector Search', eco: 'apm', cost: 'OSS $0', quota: 'Ultra-Fast Rust Vector Engine', icon: '🧠', desc: 'Base de datos vectorial ultra-rápida escrita en Rust para RAG agéntico y búsqueda semántica local.' },
        { id: 'ollama-engine', name: 'Ollama Local LLM', category: 'AI / Inference Server', eco: 'apm', cost: 'OSS $0', quota: '100% Offline / $0 Inferencia', icon: '🦙', desc: 'Servidor de inferencia local de modelos abiertos (Llama 3.3, DeepSeek R1, Qwen) sin costo de tokens.' },
        { id: 'rabbitmq', name: 'RabbitMQ (Message Broker)', category: 'Messaging / Queue', eco: 'apm', cost: 'OSS $0', quota: 'Self-Hosted AMQP Broker', icon: '🐇', desc: 'Broker de mensajería AMQP de alto rendimiento para enrutamiento asíncrono y colas de tareas.' },
        { id: 'k3s-cluster', name: 'K3s Lightweight K8s', eco: 'apm', category: 'Compute / Kubernetes', cost: 'OSS $0', quota: 'Minimal 512MB RAM Control Plane', icon: '☸️', desc: 'Distribución ligera y certificada de Kubernetes diseñada para homelabs, edge y servidores locales.' },

        // GOOGLE CLOUD PLATFORM (GCP)
        { id: 'gcp-cloudarmor', name: 'Cloud Armor WAF', category: 'Security / Ingress', eco: 'gcp', cost: '$5/política', quota: 'DDoS & WAF Enterprise', icon: '🇬', desc: 'Protección contra ataques DDoS y reglas WAF de nivel empresarial en GCP.' },
        { id: 'gcp-cloudrun', name: 'Cloud Run', category: 'Compute / Containers', eco: 'gcp', cost: '$0.00*', quota: 'Free: 2M req/mes + 360k vCPU-s', icon: '🇬', desc: 'Contenedores serverless que escalan de 0 a miles de instancias en segundos (2M peticiones gratis/mes).' },
        { id: 'gcp-cloudsql', name: 'Cloud SQL Postgres', category: 'Database / SQL', eco: 'gcp', cost: '$9.50/mo+', quota: 'Dedicated Managed RDBMS', icon: '🇬', desc: 'Base de datos relacional PostgreSQL totalmente gestionada con alta disponibilidad y backups.' },
        { id: 'gcp-memorystore', name: 'Cloud Memorystore (Redis)', category: 'Cache / In-Memory', eco: 'gcp', cost: '$15.00/mo+', quota: 'Sub-ms In-Memory Cache', icon: '🇬', desc: 'Servicio Redis en memoria ultra-rápido para caching y sesiones en GCP.' },
        { id: 'gcp-bigquery', name: 'BigQuery', category: 'Analytics / DWH', eco: 'gcp', cost: '$0.00*', quota: 'Free: 10GB Storage + 1TB query', icon: '🇬', desc: 'Data warehouse analítico masivo de petabytes (10GB almacenamiento y 1TB consultas gratis al mes).' },
        { id: 'gcp-firestore', name: 'Cloud Firestore', category: 'Database / NoSQL', eco: 'gcp', cost: '$0.00*', quota: 'Free: 1GB Storage + 50k reads', icon: '🇬', desc: 'Base de datos de documentos NoSQL global con sincronización en tiempo real y 1GB gratis.' },
        { id: 'gcp-gcs', name: 'Cloud Storage (GCS)', category: 'Object Storage', eco: 'gcp', cost: '$0.02/GB', quota: 'Free: 5GB Standard Storage', icon: '🇬', desc: 'Almacenamiento de objetos seguro y escalable a nivel mundial.' },
        { id: 'gcp-pubsub', name: 'Cloud Pub/Sub', category: 'Messaging / Queue', eco: 'gcp', cost: '$0.00*', quota: 'Free: 10GB Ingestión/mes', icon: '🇬', desc: 'Mensajería distribuida global asíncrona de alta disponibilidad (10GB gratis al mes).' },
        { id: 'gcp-cloudtasks', name: 'Cloud Tasks', category: 'Task Queue', eco: 'gcp', cost: '$0.00', quota: 'Free: 1M tareas/mes', icon: '🇬', desc: 'Gestor de colas de ejecución asíncrona y rate limiting para microservicios.' },
        { id: 'gcp-cloudcdn', name: 'Cloud CDN', category: 'CDN / Edge', eco: 'gcp', cost: '$0.05/GB', quota: 'Google Global Fiber Network', icon: '🇬', desc: 'Red de distribución de contenido global conectada a la red de fibra privada de Google.' },

        // AMAZON WEB SERVICES (AWS)
        { id: 'aws-cloudfront', name: 'CloudFront & Route53', category: 'CDN / DNS', eco: 'aws', cost: '$0.00*', quota: 'Free: 1TB Egress mensual', icon: '🅰️', desc: 'CDN de baja latencia con 1TB de transferencia gratuita de datos al mes.' },
        { id: 'aws-apigateway', name: 'API Gateway', category: 'Networking / Gateway', eco: 'aws', cost: '$0.00*', quota: 'Free: 1M llamadas/mes', icon: '🅰️', desc: 'Puerta de enlace REST/HTTP serverless con 1M llamadas gratis al mes.' },
        { id: 'aws-lambda', name: 'AWS Lambda (FaaS)', category: 'Compute / Serverless', eco: 'aws', cost: '$0.00*', quota: 'Free: 1M invocaciones + 3.2M s', icon: '🅰️', desc: 'Ejecución de código serverless sin servidores ni Docker (1M invocaciones gratis/mes).' },
        { id: 'aws-alb', name: 'Application Load Balancer', category: 'Networking / Ingress', eco: 'aws', cost: '$18.00/mo', quota: 'Layer 7 Path/Host Routing', icon: '🅰️', desc: 'Balanceador de carga capa 7 con enrutamiento avanzado por path y host.' },
        { id: 'aws-fargate', name: 'ECS Fargate', category: 'Compute / Containers', eco: 'aws', cost: '$0.00*', quota: 'Serverless Container Scaling', icon: '🅰️', desc: 'Ejecución de contenedores bajo demanda.' },
        { id: 'aws-dynamodb', name: 'DynamoDB', category: 'Database / NoSQL', eco: 'aws', cost: '$0.00*', quota: 'Free: 25GB + 25 WCU/RCU', icon: '🅰️', desc: 'Base de datos NoSQL Key-Value con latencia de milisegundos de un solo dígito (25GB gratis).' },
        { id: 'aws-kinesis', name: 'Kinesis Data Streams', category: 'Streaming / Ingest', eco: 'aws', cost: '$0.015/h', quota: 'Realtime Sharded Streams', icon: '🅰️', desc: 'Ingesta de streams masivos de datos en tiempo real.' },
        { id: 'aws-firehose', name: 'Kinesis Firehose', category: 'ETL / Streaming', eco: 'aws', cost: '$0.029/GB', quota: 'Auto-Batching to S3/Redshift', icon: '🅰️', desc: 'Carga automática de streams de datos hacia S3, Redshift y OpenSearch.' },
        { id: 'aws-athena', name: 'Amazon Athena', category: 'Analytics / Serverless SQL', eco: 'aws', cost: '$5.00/TB', quota: 'Pay-per-Query ($5/TB scan)', icon: '🅰️', desc: 'Motor de consultas SQL serverless interactivo sobre archivos en S3.' },
        { id: 'aws-redshift', name: 'Amazon Redshift', category: 'Analytics / DWH', eco: 'aws', cost: '$0.25/h', quota: 'Petabyte DWH MPP Engine', icon: '🅰️', desc: 'Data warehouse analítico a escala de petabytes.' },
        { id: 'aws-eks', name: 'Amazon EKS', category: 'Compute / Kubernetes', eco: 'aws', cost: '$73.00/mo', quota: 'Managed K8s Control Plane', icon: '🅰️', desc: 'Clúster de Kubernetes gestionado.' },
        { id: 'aws-aurora', name: 'RDS Aurora PostgreSQL', category: 'Database / SQL', eco: 'aws', cost: '$45.00/mo', quota: '3-AZ Multi-Zone Replication', icon: '🅰️', desc: 'Base de datos relacional de alto rendimiento con replicación automática en 3 zonas.' },
        { id: 'aws-s3', name: 'Amazon S3', category: 'Object Storage', eco: 'aws', cost: '$0.023/GB', quota: '11 9s Durability Standard', icon: '🅰️', desc: 'Almacenamiento de objetos con durabilidad del 99.999999999% (11 9s).' },
        { id: 'aws-sqs', name: 'Amazon SQS / SNS', category: 'Messaging / Queue', eco: 'aws', cost: '$0.00*', quota: 'Free: 1M peticiones/mes', icon: '🅰️', desc: 'Colas de mensajes gestionadas con 1 millón de operaciones gratis al mes.' },

        // MICROSOFT AZURE
        { id: 'azure-frontdoor', name: 'Azure Front Door', category: 'CDN / Gateway', eco: 'azure', cost: '$35.00/mo', quota: 'Global Anycast WAF Gateway', icon: '🔷', desc: 'Puerta de enlace global segura y acelerador de aplicaciones con WAF integrado.' },
        { id: 'azure-functions', name: 'Azure Functions', category: 'Compute / Serverless', eco: 'azure', cost: '$0.00*', quota: 'Free: 1M ejecuciones/mes', icon: '🔷', desc: 'Computación sin servidor basada en eventos (1M ejecuciones gratis/mes).' },
        { id: 'azure-cosmos', name: 'Azure Cosmos DB', category: 'Database / Multi-Model', eco: 'azure', cost: '$0.00*', quota: 'Free: 1000 RU/s + 25GB Storage', icon: '🔷', desc: 'Base de datos NoSQL multimodelo con 1000 RU/s y 25GB de almacenamiento gratis.' },
        { id: 'azure-blob', name: 'Azure Blob Storage', category: 'Object Storage', eco: 'azure', cost: '$0.018/GB', quota: 'Geo-Redundant (GRS) Tier', icon: '🔷', desc: 'Almacenamiento de objetos con replicación geográfica (GRS) y niveles Hot/Cool/Archive.' },

        // ON-PREMISE IAC & OBSERVABILITY
        { id: 'opentofu', name: 'OpenTofu / Terraform', category: 'DevOps / IaC', eco: 'apm', cost: 'OSS $0', quota: 'Declarative Multi-Cloud IaC', icon: '🏗️', desc: 'Infraestructura como código (IaC) para aprovisionar GCP, AWS, Azure y Kubernetes.' },
        { id: 'clickhouse', name: 'ClickHouse Columnar', category: 'Analytics / OLAP', eco: 'apm', cost: 'OSS $0', quota: 'Sub-ms Columnar OLAP Engine', icon: 'questdb', desc: 'Base de datos columnar ultra-rápida para analítica, logs y trazas de observabilidad.' },
        { id: 'opentelemetry-collector', name: 'OTel Collector', category: 'Pipeline / Ingestion', eco: 'apm', cost: 'OSS $0', quota: 'Universal CNCF Telemetry Agent', icon: 'opentelemetry', desc: 'Proxy universal agnóstico para recibir, procesar y enrutar telemetría.' },
        { id: 'grafana', name: 'Grafana Dashboards', category: 'Visualization / UI', eco: 'apm', cost: 'OSS $0', quota: 'Open Unified Dashboards', icon: 'grafana', desc: 'La plataforma estándar de visualización de métricas, trazas y logs.' },
        { id: 'tempo', name: 'Grafana Tempo', category: 'Tracing / Storage', eco: 'apm', cost: 'OSS $0', quota: 'High-Volume Object Traces', icon: 'tempo', desc: 'Almacenamiento masivo de trazas distribuidas con costo cercano a cero.' },
        { id: 'loki', name: 'Grafana Loki', category: 'Logs / Storage', eco: 'apm', cost: 'OSS $0', quota: 'Label-Indexed Log Grep', icon: 'loki', desc: 'Indexador de logs estilo grep/Prometheus altamente eficiente en RAM y disco.' },
        { id: 'signoz', name: 'SigNoz APM', category: 'All-in-One APM', eco: 'apm', cost: 'OSS $0', quota: 'OTel + ClickHouse Native APM', icon: 'inspectit', desc: 'Plataforma APM completa nativa en OpenTelemetry y ClickHouse.' },
        { id: 'kafka', name: 'Apache Kafka', category: 'Event Streaming', eco: 'apm', cost: 'OSS $0', quota: 'Distributed Event Log Broker', icon: 'kafka', desc: 'Bus de eventos distribuido de altísimo rendimiento para mensajería y telemetría.' }
    ];

    // -------------------------------------------------------------
    // DNS & DOMAIN REGISTRARS DATASET 2026 Q4
    // -------------------------------------------------------------
    const DNS_REGISTRARS_DATA = [
        {
            id: 'dns-cloudflare',
            name: 'Cloudflare Registrar & DNS',
            badge: '🏆 #1 Recomendado (Wholesale)',
            type: 'Registrador a Precio de Costo',
            cost: '~$9.77 / año (.com)',
            desc: 'Vende dominios al precio exacto de costo mayorista de ICANN (0% de margen de ganancia). Incluye DNS Anycast global ultra-rápido, protección DDoS ilimitada, DNSSEC en 1 clic y privacidad WHOIS gratuita de por vida.',
            features: ['0% Markup (Solo costo ICANN)', 'WHOIS Privacy gratis de por vida', 'DNS Anycast más rápido del mundo', 'SSL/TLS Universal automático', 'Soporte API & Terraform'],
            link: 'https://www.cloudflare.com/products/registrar/',
            btnText: 'Ir a Cloudflare Registrar'
        },
        {
            id: 'dns-porkbun',
            name: 'Porkbun Domains',
            badge: '🐷 Mejor para Devs & Startups',
            type: 'Registrador Independiente Low-Cost',
            cost: '~$10.30 / año (.com)',
            desc: 'Registrador independiente reconocido por tener los precios de renovación más bajos de toda la industria para cientos de TLDs (.dev, .io, .ai, .app, .xyz), interfaz limpia sin publicidad engañosa y API completa para Certbot/Let\'s Encrypt.',
            features: ['Precios ultra-bajos sin trucos', 'WHOIS Privacy gratis', 'Certificados SSL Let\'s Encrypt gratis', 'API DNS para automatización', 'Soporte de +500 extensiones TLD'],
            link: 'https://porkbun.com/',
            btnText: 'Ir a Porkbun'
        },
        {
            id: 'dns-duckdns',
            name: 'DuckDNS (Dynamic DNS $0)',
            badge: '🦆 #1 para On-Premise & Homelab',
            type: 'Dynamic DNS 100% Gratuito',
            cost: '$0.00 / De por vida',
            desc: 'Servicio de Dynamic DNS (DDNS) gratuito para conectar servidores locales, Raspberry Pi, homelabs y contenedores Docker con IPs residenciales dinámicas. Permite crear hasta 5 subdominios *.duckdns.org.',
            features: ['100% Gratuito ($0.00)', 'Hasta 5 subdominios *.duckdns.org', 'Script cron / curl de 1 línea', 'Compatible con Traefik y Nginx', 'Cero costo de renovación'],
            link: 'https://www.duckdns.org/',
            btnText: 'Ir a DuckDNS'
        },
        {
            id: 'dns-aws-route53',
            name: 'Amazon Route 53',
            badge: '🅰️ Enterprise Multi-Cloud DNS',
            type: 'Cloud DNS & Enrutamiento Global',
            cost: '$0.50 / zona alojada / mes',
            desc: 'Servicio DNS de alta disponibilidad y baja latencia de AWS. Destaca por sus políticas avanzadas de enrutamiento por latencia geográfica, geo-proximidad, health checks automatizados y failover activo-pasivo.',
            features: ['Enrutamiento por latencia & Geo', 'Health Checks & Auto-Failover', 'Alias Records directos a ALB/S3', 'Integración nativa con IAM/Terraform', '100% SLA de disponibilidad'],
            link: 'https://aws.amazon.com/route53/',
            btnText: 'Ver AWS Route 53'
        },
        {
            id: 'dns-spaceship',
            name: 'Spaceship (Next-Gen Registrar)',
            badge: '🚀 Nueva Plataforma Moderna',
            type: 'Registrador Moderno Integrado',
            cost: '~$8.98 primer año / ~$10.50 renov.',
            desc: 'Plataforma de dominios de última generación desarrollada por Namecheap con panel reactivo ultra-rápido, gestión modular de registros DNS, buzones de correo y certificados SSL con configuración en 1 clic.',
            features: ['Panel moderno ultra-rápido', 'WHOIS Privacy gratis', 'DNS Anycast básico incluido', 'Gestión rápida de registros TXT/CNAME', 'Descuentos en primer año'],
            link: 'https://www.spaceship.com/',
            btnText: 'Ir a Spaceship'
        },
        {
            id: 'dns-gcp',
            name: 'Google Cloud DNS',
            badge: '🇬 100% SLA Anycast Global',
            type: 'Enterprise Managed Cloud DNS',
            cost: '$0.20 / zona / mes',
            desc: 'Servicio DNS autoritativo escalable que opera sobre la red de fibra óptica mundial de Google, ofreciendo un SLA del 100% de disponibilidad, soporte de DNSSEC y zonas privadas integradas con Google Cloud VPC.',
            features: ['100% SLA de disponibilidad', 'Zonas privadas para VPC interna', 'Anycast en la red de Google', 'Soporte gcloud CLI y Terraform', 'Costo ultra-bajo ($0.20/zona)'],
            link: 'https://cloud.google.com/dns',
            btnText: 'Ver Google Cloud DNS'
        }
    ];

    const DNS_PRICING_TABLE_DATA = [
        { name: 'Cloudflare Registrar', model: 'Wholesale At-Cost (0% Markup)', com: '~$9.77 / ~$9.77', other: '.dev $12 • .io $38 • .ai $70', privacy: '✅ Gratis de por vida', dnssec: '✅ Anycast Global + DNSSEC 1-Clic', use: '🏆 Producción, SaaS, APIs y $0 Markup' },
        { name: 'Porkbun', model: 'Low-Margin Independent', com: '~$10.30 / ~$10.30', other: '.dev $12.50 • .io $36 • .ai $68', privacy: '✅ Gratis de por vida', dnssec: '✅ Anycast + DNSSEC + API abierta', use: '🐷 Startups, desarrolladores y TLDs variados' },
        { name: 'Spaceship', model: 'Next-Gen Modern Registrar', com: '~$8.98 (año 1) / ~$10.50', other: '.dev $13 • .io $37 • .ai $69', privacy: '✅ Gratis de por vida', dnssec: '✅ Anycast + DNSSEC incluido', use: '🚀 Proyectos nuevos y gestión unificada' },
        { name: 'DuckDNS', model: 'Dynamic DNS 100% Gratuito', com: '$0.00 (*.duckdns.org)', other: '5 Subdominios Gratis', privacy: '✅ 100% Privado', dnssec: '✅ Script curl / Token API', use: '🦆 Homelabs, On-Premise y Raspberry Pi' },
        { name: 'AWS Route 53', model: 'Cloud DNS & Domain Registrar', com: '~$14.00 / ~$14.00', other: '.dev $14 • .io $43 • .ai $80', privacy: '✅ Gratis', dnssec: '✅ Enrutamiento Latencia / Failover ($0.50/m)', use: '🅰️ Infraestructuras empresariales en AWS' },
        { name: 'Google Cloud DNS', model: 'Managed Enterprise Cloud DNS', com: '~$14.00 (vía Squarespace)', other: '.dev $12 • .io $40 • .ai $75', privacy: '✅ Gratis', dnssec: '✅ 100% SLA Anycast ($0.20/zona/m)', use: '🇬 Infraestructuras y VPC privadas en GCP' },
        { name: 'Namecheap', model: 'Tradicional Promocional', com: '~$10.28 (año 1) / ~$14.98', other: '.dev $14 • .io $42 • .ai $75', privacy: '✅ Gratis (Privacy Guardian)', dnssec: '⚠️ Anycast Premium de pago', use: '🏷️ TLDs exóticos y ofertas iniciales' },
        { name: 'GoDaddy (⚠️ Alerta FinOps)', model: 'Trampa de Renovación Cara', com: '~$1.00 (año 1) ➔ ~$22.99+ renov.', other: '.dev $24 • .io $60 • .ai $95', privacy: '❌ Se cobra aparte (~$9.99/año)', dnssec: '❌ DNS básico lento / DNSSEC de pago', use: '⛔ NO RECOMENDADO por sobreprecios ocultos' }
    ];

    // -------------------------------------------------------------
    // ARCHITECTURE PATTERNS DATASET 2026 Q4
    // -------------------------------------------------------------
    const ARCHITECTURE_PATTERNS_2026 = [
        {
            id: 'pattern-ecommerce-pci',
            title: '🛒 E-Commerce & Pagos de Alta Concurrencia (PCI-DSS & Stripe)',
            badge: 'E-Commerce / PCI',
            category: 'High-Throughput Commerce',
            cost: '$0.00 Base / Pay-per-Sale',
            desc: 'Topología para tiendas y pagos globales: Cloudflare Edge con WAF ➔ API Gateway Hono.js ➔ Kafka Queue para órdenes ➔ PostgreSQL Ledger con Redis Lock para inventario en tiempo real.',
            stack: ['Cloudflare Edge', 'Hono.js', 'Kafka', 'PostgreSQL', 'Redis Lock', 'Stripe Webhooks'],
            presetKey: 'e-commerce-pci'
        },
        {
            id: 'pattern-mobile-sync',
            title: '📱 Mobile Backend con Offline-Sync & Realtime',
            badge: 'Mobile & Realtime',
            category: 'Mobile Applications',
            cost: '$0.00 / mes (Free Tier)',
            desc: 'Backend reactivo para apps móviles (React Native / Flutter) con autenticación OAuth, suscripciones Realtime vía WebSockets en Supabase y base de datos local SQLite con réplicas Turso.',
            stack: ['React Native', 'Supabase Realtime', 'Supabase Auth', 'Turso SQLite', 'Cloudflare R2'],
            presetKey: 'mobile-sync-realtime'
        },
        {
            id: 'pattern-gaming-ws',
            title: '🎮 Gaming & Streaming WebSockets de Baja Latencia',
            badge: 'Ultra-Low Latency',
            category: 'Gaming & Media',
            cost: '$0.00 Base / Edge Scaling',
            desc: 'Servidores de juego multijugador y streaming interactivo con Cloudflare Durable Objects para estado en memoria en el Edge, Redis Pub/Sub para salas y ClickHouse para telemetría de juego.',
            stack: ['Cloudflare Workers', 'Durable Objects', 'Redis Pub/Sub', 'Go Game Server', 'ClickHouse'],
            presetKey: 'gaming-streaming-ws'
        },
        {
            id: 'pattern-fintech-acid',
            title: '🏦 Fintech & Banking Core ACID Transaccional',
            badge: 'Fintech / ACID',
            category: 'Financial Core',
            cost: '$0.00 Cloud (Self-Hosted mTLS)',
            desc: 'Núcleo bancario con Traefik mTLS de autenticación mutua, API de alto rendimiento en Rust/Go, orquestación de transacciones distribuidas con Temporal y PostgreSQL con aislamiento Serializable.',
            stack: ['Traefik mTLS', 'Rust API', 'Temporal.io', 'PostgreSQL Serializable', 'MinIO WORM'],
            presetKey: 'fintech-acid-core'
        },
        {
            id: 'pattern-onprem-enterprise',
            title: '🏢 Stack Empresarial On-Premise (Self-Hosted $0 Cloud Bill)',
            badge: 'Self-Hosted / $0 Cloud',
            category: 'On-Premise Infrastructure',
            cost: '$0.00 Cloud / Hardware Propio',
            desc: 'Topología corporativa autónoma: Traefik con SSL automático Let\'s Encrypt ➔ Microservicios en Go/Node ➔ PostgreSQL dedicado con Redis Cache ➔ MinIO (S3 local) ➔ Grafana LGTM Stack.',
            stack: ['Traefik SSL', 'Node/Go API', 'PostgreSQL', 'Redis', 'MinIO (S3)', 'Grafana Loki/Tempo'],
            presetKey: 'onprem-enterprise-stack'
        },
        {
            id: 'pattern-private-ai',
            title: '🤖 Private Local AI Stack (100% Offline / Air-Gapped)',
            badge: 'Air-Gapped AI',
            category: 'AI & Data Engineering',
            cost: '$0.00 / Inferencia Local Ilimitada',
            desc: 'Pipeline agéntico privado en servidores propios: Ollama corriendo Llama 3.3 / DeepSeek R1 ➔ Qdrant Vector DB para embeddings ➔ DuckDB para consultas OLAP sobre Parquet ➔ Open-WebUI.',
            stack: ['Ollama Local', 'Qdrant (Rust)', 'DuckDB', 'MinIO', 'Open-WebUI'],
            presetKey: 'onprem-private-ai'
        }
    ];

    // -------------------------------------------------------------
    // PRESET BLUEPRINTS
    // -------------------------------------------------------------
    const PRESETS = {
        'e-commerce-pci': {
            cost: '$0.00 Base (Pay-per-Sale)',
            zones: [
                { id: 'z_ecom_edge', title: 'Edge Ingress & WAF (Cloudflare / Traefik)', type: 'zerocost', x: 40, y: 70, width: 280, height: 420 },
                { id: 'z_ecom_app', title: 'Checkout & Inventory Tier (ACID Locks)', type: 'zerocost', x: 370, y: 70, width: 300, height: 420 },
                { id: 'z_ecom_data', title: 'Transactional Ledger & Event Queue', type: 'onprem', x: 720, y: 70, width: 300, height: 420 }
            ],
            nodes: [
                { componentId: 'cloudflare-dns', x: 65, y: 110 },
                { componentId: 'cloudflare-workers', x: 65, y: 230 },
                { componentId: 'traefik', x: 65, y: 350 },
                { componentId: 'hono', x: 400, y: 120 },
                { componentId: 'upstash-redis', x: 400, y: 260 },
                { componentId: 'postgresql-onprem', x: 750, y: 120 },
                { componentId: 'rabbitmq', x: 750, y: 260 }
            ],
            connections: [
                { from: 0, to: 1, label: 'DNS Anycast' },
                { from: 1, to: 3, label: 'Checkout HTTPS' },
                { from: 3, to: 4, label: 'Distributed Lock' },
                { from: 3, to: 5, label: 'SQL Ledger Write' },
                { from: 3, to: 6, label: 'Publish Order Evt' }
            ],
            notes: [
                { id: 'note_ecom_1', text: '🔒 **PCI-DSS Compliance**: Cero almacenamiento de números de tarjeta en la base de datos local. Usar tokens efímeros de Stripe / Adyen.', color: 'yellow', x: 370, y: 510, width: 300, height: 110 }
            ],
            markers: [
                { id: 'mark_ecom_1', num: '1', text: 'Ingreso Seguro', x: 140, y: 40 },
                { id: 'mark_ecom_2', num: '2', text: 'Lock & Deduplicación', x: 440, y: 40 },
                { id: 'mark_ecom_3', num: '3', text: 'Asentamiento Contable', x: 780, y: 40 }
            ]
        },
        'mobile-sync-realtime': {
            cost: '$0.00 / mes (Free Tier 2026)',
            zones: [
                { id: 'z_mob_client', title: 'Mobile Clients (React Native / Flutter)', type: 'zerocost', x: 40, y: 80, width: 280, height: 380 },
                { id: 'z_mob_realtime', title: 'Realtime Gateway & Auth Tier', type: 'zerocost', x: 370, y: 80, width: 300, height: 380 },
                { id: 'z_mob_db', title: 'Distributed SQLite & Media Storage', type: 'zerocost', x: 720, y: 80, width: 300, height: 380 }
            ],
            nodes: [
                { componentId: 'vercel', x: 65, y: 140 },
                { componentId: 'sqlite-turso', x: 65, y: 270 },
                { componentId: 'supabase', x: 400, y: 140 },
                { componentId: 'cloudflare-workers', x: 400, y: 270 },
                { componentId: 'cloudflare-r2', x: 750, y: 200 }
            ],
            connections: [
                { from: 0, to: 2, label: 'WebSocket Sync' },
                { from: 1, to: 2, label: 'LibSQL Pull/Push' },
                { from: 2, to: 4, label: 'Media Chunks' }
            ],
            notes: [
                { id: 'note_mob_1', text: '⚡ **Offline-First Sync**: El cliente escribe en SQLite local (Turso Embedded) y sincroniza automáticamente vía WebSockets al reconectar.', color: 'green', x: 370, y: 480, width: 300, height: 110 }
            ]
        },
        'gaming-streaming-ws': {
            cost: '$0.00 Base (Edge Scaling)',
            zones: [
                { id: 'z_game_edge', title: 'Edge Anycast & WebSocket Gateway', type: 'zerocost', x: 40, y: 80, width: 280, height: 380 },
                { id: 'z_game_state', title: 'In-Memory Game State & PubSub', type: 'onprem', x: 370, y: 80, width: 300, height: 380 },
                { id: 'z_game_telemetry', title: 'High-Volume OLAP Telemetry', type: 'onprem', x: 720, y: 80, width: 300, height: 380 }
            ],
            nodes: [
                { componentId: 'cloudflare-dns', x: 65, y: 110 },
                { componentId: 'cloudflare-workers', x: 65, y: 230 },
                { componentId: 'upstash-redis', x: 400, y: 130 },
                { componentId: 'traefik', x: 400, y: 260 },
                { componentId: 'clickhouse', x: 750, y: 130 },
                { componentId: 'grafana', x: 750, y: 260 }
            ],
            connections: [
                { from: 0, to: 1, label: 'Fast Anycast' },
                { from: 1, to: 2, label: 'Room State WS' },
                { from: 1, to: 3, label: 'UDP/TCP Proxy' },
                { from: 2, to: 4, label: 'Batch Telemetry' },
                { from: 5, to: 4, label: 'Live Dashboards' }
            ]
        },
        'fintech-acid-core': {
            cost: '$0.00 Cloud (Self-Hosted mTLS)',
            zones: [
                { id: 'z_fin_ingress', title: 'mTLS Security Boundary (Strict Ingress)', type: 'onprem', x: 40, y: 80, width: 280, height: 380 },
                { id: 'z_fin_orch', title: 'Deterministic Transaction Orchestration', type: 'onprem', x: 370, y: 80, width: 300, height: 380 },
                { id: 'z_fin_vault', title: 'Immutable Ledger & WORM Storage', type: 'onprem', x: 720, y: 80, width: 300, height: 380 }
            ],
            nodes: [
                { componentId: 'traefik', x: 65, y: 180 },
                { componentId: 'hono', x: 400, y: 140 },
                { componentId: 'rabbitmq', x: 400, y: 270 },
                { componentId: 'postgresql-onprem', x: 750, y: 140 },
                { componentId: 'minio', x: 750, y: 270 }
            ],
            connections: [
                { from: 0, to: 1, label: 'mTLS HTTPS' },
                { from: 1, to: 3, label: 'Serializable SQL' },
                { from: 1, to: 2, label: 'AMQP Outbox' },
                { from: 3, to: 4, label: 'WAL Backup S3' }
            ]
        },
        'healthcare-hipaa': {
            cost: '$0.00 Cloud (Air-Gapped Vault)',
            zones: [
                { id: 'z_hipaa_dmz', title: 'Encrypted Perimeter (Zero-Trust)', type: 'onprem', x: 40, y: 80, width: 280, height: 380 },
                { id: 'z_hipaa_app', title: 'Isolated PHI Processing Tier', type: 'onprem', x: 370, y: 80, width: 300, height: 380 },
                { id: 'z_hipaa_vault', title: 'Encrypted at Rest PHI Vault & Audit', type: 'onprem', x: 720, y: 80, width: 300, height: 380 }
            ],
            nodes: [
                { componentId: 'traefik', x: 65, y: 180 },
                { componentId: 'hono', x: 400, y: 180 },
                { componentId: 'postgresql-onprem', x: 750, y: 130 },
                { componentId: 'minio', x: 750, y: 260 }
            ],
            connections: [
                { from: 0, to: 1, label: 'TLS 1.3 Strict' },
                { from: 1, to: 2, label: 'Column Encrypted' },
                { from: 1, to: 3, label: 'WORM DICOM/PDF' }
            ]
        },
        'onprem-enterprise-stack': {
            cost: '$0.00 Cloud (Self-Hosted On-Premise)',
            zones: [
                { id: 'z_onprem_ingress', title: 'Edge Ingress & Reverse Proxy (DMZ)', type: 'onprem', x: 40, y: 70, width: 280, height: 420 },
                { id: 'z_onprem_app', title: 'Application & Microservices Tier (Docker/K3s)', type: 'onprem', x: 370, y: 70, width: 300, height: 420 },
                { id: 'z_onprem_data', title: 'Persistence & Observability Tier', type: 'onprem', x: 720, y: 70, width: 300, height: 420 }
            ],
            nodes: [
                { componentId: 'duckdns', x: 65, y: 110 },
                { componentId: 'traefik', x: 65, y: 240 },
                { componentId: 'hono', x: 400, y: 120 },
                { componentId: 'rabbitmq', x: 400, y: 260 },
                { componentId: 'postgresql-onprem', x: 750, y: 110 },
                { componentId: 'upstash-redis', x: 750, y: 220 },
                { componentId: 'minio', x: 750, y: 330 }
            ],
            connections: [
                { from: 0, to: 1, label: 'DDNS Ingress' },
                { from: 1, to: 2, label: 'HTTP/2 SSL' },
                { from: 2, to: 5, label: 'Redis Session' },
                { from: 2, to: 4, label: 'Postgres SQL' },
                { from: 2, to: 3, label: 'AMQP Publish' },
                { from: 2, to: 6, label: 'S3 API (MinIO)' }
            ],
            notes: [
                { id: 'note_onprem_1', text: '🏢 **TCO Optimizado**: Servidor Ryzen 9 (64GB RAM) = $41.20 USD/mes de energía y amortización vs +$280 USD/mes en AWS.', color: 'blue', x: 370, y: 510, width: 300, height: 110 }
            ],
            markers: [
                { id: 'mark_onprem_1', num: '1', text: 'SSL Let\'s Encrypt', x: 130, y: 40 },
                { id: 'mark_onprem_2', num: '2', text: 'Microservicios Hono', x: 440, y: 40 },
                { id: 'mark_onprem_3', num: '3', text: 'NVMe Storage', x: 790, y: 40 }
            ]
        },
        'onprem-private-ai': {
            cost: '$0.00 Cloud (100% Offline Air-Gapped AI)',
            zones: [
                { id: 'z_ai_ingress', title: 'UI & Prompt Ingestion Gateway', type: 'onprem', x: 40, y: 80, width: 280, height: 380 },
                { id: 'z_ai_compute', title: 'Local AI Inference & Vector Tier', type: 'onprem', x: 370, y: 80, width: 300, height: 380 },
                { id: 'z_ai_storage', title: 'Document Store & Analytics', type: 'onprem', x: 720, y: 80, width: 300, height: 380 }
            ],
            nodes: [
                { componentId: 'traefik', x: 65, y: 150 },
                { componentId: 'ollama-engine', x: 400, y: 130 },
                { componentId: 'qdrant', x: 400, y: 260 },
                { componentId: 'duckdb', x: 750, y: 130 },
                { componentId: 'minio', x: 750, y: 260 }
            ],
            connections: [
                { from: 0, to: 1, label: 'OpenAI API' },
                { from: 1, to: 2, label: 'Vector Search' },
                { from: 1, to: 4, label: 'PDF Chunks (MinIO)' },
                { from: 3, to: 4, label: 'Parquet Scan' }
            ]
        },
        'hybrid-cloud-edge': {
            cost: '$0.00 / mes (Cloudflare Tunnel + On-Prem Core)',
            zones: [
                { id: 'z_hyb_edge', title: 'Global Edge Ingress (Cloudflare Pages)', type: 'zerocost', x: 40, y: 80, width: 280, height: 380 },
                { id: 'z_hyb_tunnel', title: 'Zero Trust Tunnel & Routing', type: 'zerocost', x: 370, y: 80, width: 300, height: 380 },
                { id: 'z_hyb_onprem', title: 'Private Homelab / Bare-Metal Core', type: 'onprem', x: 720, y: 80, width: 300, height: 380 }
            ],
            nodes: [
                { componentId: 'cloudflare-dns', x: 65, y: 110 },
                { componentId: 'vercel', x: 65, y: 220 },
                { componentId: 'cloudflare-workers', x: 65, y: 330 },
                { componentId: 'traefik', x: 400, y: 200 },
                { componentId: 'postgresql-onprem', x: 750, y: 140 },
                { componentId: 'minio', x: 750, y: 270 }
            ],
            connections: [
                { from: 0, to: 1, label: 'DNS Anycast' },
                { from: 1, to: 3, label: 'Tunnel RPC' },
                { from: 2, to: 3, label: 'Tunnel Proxy' },
                { from: 3, to: 4, label: 'Postgres SQL' },
                { from: 3, to: 5, label: 'S3 API' }
            ]
        },
        'gcp-enterprise-vpc': {
            cost: '$24.50 - $65.00 / mes (GCP Production VPC)',
            zones: [
                { id: 'z_gcp_sec', title: 'Security & Ingress Subnet (10.0.1.0/24)', type: 'gcp', x: 40, y: 70, width: 280, height: 420 },
                { id: 'z_gcp_app', title: 'Serverless App Tier (Serverless VPC Access)', type: 'gcp', x: 370, y: 70, width: 300, height: 420 },
                { id: 'z_gcp_db', title: 'Private Data & Cache Subnet (10.0.2.0/24)', type: 'gcp', x: 720, y: 70, width: 300, height: 420 }
            ],
            nodes: [
                { componentId: 'gcp-clouddns', x: 65, y: 90 },
                { componentId: 'gcp-cloudarmor', x: 65, y: 200 },
                { componentId: 'gcp-cloudcdn', x: 65, y: 310 },
                { componentId: 'gcp-cloudrun', x: 400, y: 120 },
                { componentId: 'gcp-cloudtasks', x: 400, y: 260 },
                { componentId: 'gcp-cloudsql', x: 750, y: 120 },
                { componentId: 'gcp-memorystore', x: 750, y: 240 },
                { componentId: 'gcp-bigquery', x: 750, y: 360 }
            ],
            connections: [
                { from: 0, to: 1, label: '100% SLA DNS' },
                { from: 1, to: 2, label: 'WAF Filter' },
                { from: 2, to: 3, label: 'HTTPS Proxy' },
                { from: 3, to: 4, label: 'Enqueue Task' },
                { from: 3, to: 6, label: 'Redis Cache' },
                { from: 3, to: 5, label: 'Postgres SQL' },
                { from: 4, to: 7, label: 'Batch Stream' }
            ]
        },
        'tanstack-hono-supabase': {
            cost: '$0.00 / mes (Ultra-Fast Modern $0 Stack)',
            zones: [
                { id: 'z_tan_edge', title: 'Edge Frontend & Routing (TanStack Start)', type: 'zerocost', x: 40, y: 80, width: 280, height: 380 },
                { id: 'z_tan_api', title: 'Hono.js Web Standards API (Workers)', type: 'zerocost', x: 370, y: 80, width: 300, height: 380 },
                { id: 'z_tan_db', title: 'Supabase Postgres & Cloudflare R2', type: 'zerocost', x: 720, y: 80, width: 300, height: 380 }
            ],
            nodes: [
                { componentId: 'tanstack-start', x: 65, y: 140 },
                { componentId: 'hono', x: 400, y: 140 },
                { componentId: 'duckdb', x: 400, y: 270 },
                { componentId: 'supabase', x: 750, y: 140 },
                { componentId: 'cloudflare-r2', x: 750, y: 270 }
            ],
            connections: [
                { from: 0, to: 1, label: 'Type-Safe RPC' },
                { from: 1, to: 3, label: 'Postgres SQL' },
                { from: 1, to: 4, label: 'S3 API ($0 Egress)' },
                { from: 2, to: 4, label: 'Parquet Queries' }
            ]
        },
        'zero-cost-fullstack': {
            cost: '$0.00 / mes (Free Tier 2026)',
            zones: [
                { id: 'z_edge', title: 'Edge & Frontend Tier (Vercel & Cloudflare)', type: 'zerocost', x: 40, y: 80, width: 280, height: 420 },
                { id: 'z_backend', title: 'Backend & Data Tier (Supabase & Turso)', type: 'zerocost', x: 380, y: 80, width: 320, height: 420 },
                { id: 'z_storage', title: 'Storage & Assets ($0 Egress)', type: 'zerocost', x: 760, y: 80, width: 280, height: 420 }
            ],
            nodes: [
                { componentId: 'cloudflare-dns', x: 70, y: 90 },
                { componentId: 'vercel', x: 70, y: 200 },
                { componentId: 'cloudflare-workers', x: 70, y: 310 },
                { componentId: 'supabase', x: 410, y: 130 },
                { componentId: 'sqlite-turso', x: 410, y: 280 },
                { componentId: 'cloudflare-r2', x: 790, y: 200 }
            ],
            connections: [
                { from: 0, to: 1, label: 'Fast DNS Anycast' },
                { from: 1, to: 3, label: 'HTTPS / Auth' },
                { from: 1, to: 4, label: 'SQL LibSQL' },
                { from: 2, to: 5, label: 'S3 API ($0 Egress)' },
                { from: 3, to: 5, label: 'Media Assets' }
            ]
        },
        'zero-cost-analytics': {
            cost: '$0.00 / mes (Serverless Analytics)',
            zones: [
                { id: 'z_ingest', title: 'Ingesta de Datos & APIs', type: 'zerocost', x: 40, y: 100, width: 260, height: 350 },
                { id: 'z_olap', title: 'Motor Analítico OLAP Embebido', type: 'zerocost', x: 360, y: 100, width: 320, height: 350 },
                { id: 'z_dash', title: 'Visualización & Dashboards', type: 'onprem', x: 740, y: 100, width: 280, height: 350 }
            ],
            nodes: [
                { componentId: 'cloudflare-workers', x: 70, y: 160 },
                { componentId: 'cloudflare-r2', x: 70, y: 290 },
                { componentId: 'duckdb', x: 400, y: 210 },
                { componentId: 'grafana', x: 770, y: 210 }
            ],
            connections: [
                { from: 0, to: 1, label: 'Dump Parquet' },
                { from: 2, to: 1, label: 'SQL over Parquet' },
                { from: 3, to: 2, label: 'DuckDB Driver' }
            ]
        },
        'aws-serverless-analytics': {
            cost: '$15.00 - $45.00 / mes (Serverless Pay-per-Use)',
            zones: [
                { id: 'z_edge', title: '1. Ingress & API Gateway Tier', type: 'aws', x: 40, y: 70, width: 310, height: 600 },
                { id: 'z_compute', title: '2. Serverless Lambda Compute Tier', type: 'aws', x: 390, y: 70, width: 310, height: 600 },
                { id: 'z_data', title: '3. Streaming, Queues & Fast DB Tier', type: 'aws', x: 740, y: 70, width: 310, height: 600 },
                { id: 'z_lakehouse', title: '4. S3 Data Lake & Redshift Analytics Tier', type: 'aws', x: 1090, y: 70, width: 310, height: 600 }
            ],
            nodes: [
                { componentId: 'aws-route53', x: 70, y: 150 },
                { componentId: 'aws-apigateway', x: 70, y: 310 },
                { componentId: 'aws-lambda', x: 420, y: 110 },
                { componentId: 'aws-lambda', x: 420, y: 240 },
                { componentId: 'aws-lambda', x: 420, y: 370 },
                { componentId: 'aws-lambda', x: 420, y: 500 },
                { componentId: 'aws-dynamodb', x: 770, y: 110 },
                { componentId: 'aws-kinesis', x: 770, y: 240 },
                { componentId: 'aws-firehose', x: 770, y: 370 },
                { componentId: 'aws-sqs', x: 770, y: 500 },
                { componentId: 'aws-s3', x: 1120, y: 110 },
                { componentId: 'aws-athena', x: 1120, y: 240 },
                { componentId: 'aws-eks', x: 1120, y: 370 },
                { componentId: 'aws-redshift', x: 1120, y: 500 }
            ],
            connections: [
                { from: 0, to: 1, label: 'Anycast DNS' },
                { from: 1, to: 2, label: 'CRUD API' },
                { from: 1, to: 3, label: 'Event Ingest' },
                { from: 2, to: 6, label: 'Dynamo SDK' },
                { from: 3, to: 7, label: 'PutRecord Stream' },
                { from: 7, to: 8, label: 'Auto Delivery' },
                { from: 8, to: 10, label: 'Batch Parquet' },
                { from: 11, to: 10, label: 'SQL over S3' },
                { from: 7, to: 4, label: 'Stream Consumer' },
                { from: 4, to: 9, label: 'Enqueue DLQ' },
                { from: 9, to: 5, label: 'Batch Worker' },
                { from: 5, to: 13, label: 'COPY Redshift' },
                { from: 12, to: 10, label: 'Spark Read S3' }
            ],
            notes: [
                { id: 'note_aws_1', text: '⚡ **Serverless Analytics**: Ingesta masiva en Kinesis ➔ Firehose hacia S3 en formato Parquet, con consultas instantáneas vía Athena ($5/TB scan) y Redshift Serverless para BI.', color: 'blue', x: 390, y: 690, width: 660, height: 95 }
            ],
            markers: [
                { id: 'mark_aws_1', num: '1', text: 'Ingress & Gateway', x: 110, y: 40 },
                { id: 'mark_aws_2', num: '2', text: 'Lambda FaaS', x: 460, y: 40 },
                { id: 'mark_aws_3', num: '3', text: 'Streaming & Queues', x: 810, y: 40 },
                { id: 'mark_aws_4', num: '4', text: 'Data Lake & DWH', x: 1160, y: 40 }
            ]
        },
        'gcp-cloudrun-bigquery': {
            cost: '$0.00 - $15.00 / mes',
            zones: [
                { id: 'z_gcp_edge', title: 'Google Cloud Ingress', type: 'gcp', x: 40, y: 90, width: 260, height: 380 },
                { id: 'z_gcp_app', title: 'Cloud Run Serverless Compute', type: 'gcp', x: 360, y: 90, width: 300, height: 380 },
                { id: 'z_gcp_data', title: 'Data Tier (Firestore & BigQuery)', type: 'gcp', x: 720, y: 90, width: 300, height: 380 }
            ],
            nodes: [
                { componentId: 'gcp-cloudcdn', x: 70, y: 140 },
                { componentId: 'gcp-pubsub', x: 70, y: 280 },
                { componentId: 'gcp-cloudrun', x: 390, y: 140 },
                { componentId: 'gcp-cloudtasks', x: 390, y: 280 },
                { componentId: 'gcp-firestore', x: 750, y: 140 },
                { componentId: 'gcp-bigquery', x: 750, y: 280 }
            ],
            connections: [
                { from: 0, to: 2, label: 'HTTPS Proxy' },
                { from: 2, to: 3, label: 'Enqueue Async' },
                { from: 2, to: 4, label: 'gRPC / NoSQL' },
                { from: 3, to: 2, label: 'Trigger Worker' },
                { from: 1, to: 5, label: 'BigQuery Stream' }
            ]
        },
        'aws-microservices-vpc': {
            cost: '$65.00 / mes (Base Prod)',
            zones: [
                { id: 'z_aws_pub', title: 'AWS Public Subnet (10.0.1.0/24)', type: 'aws', x: 40, y: 90, width: 280, height: 380 },
                { id: 'z_aws_app', title: 'Private App Subnet (10.0.2.0/24)', type: 'aws', x: 380, y: 90, width: 300, height: 380 },
                { id: 'z_aws_db', title: 'Private Data Subnet (10.0.3.0/24)', type: 'aws', x: 740, y: 90, width: 300, height: 380 }
            ],
            nodes: [
                { componentId: 'aws-cloudfront', x: 70, y: 140 },
                { componentId: 'aws-alb', x: 70, y: 280 },
                { componentId: 'aws-fargate', x: 410, y: 200 },
                { componentId: 'aws-dynamodb', x: 770, y: 140 },
                { componentId: 'aws-aurora', x: 770, y: 280 }
            ],
            connections: [
                { from: 0, to: 1, label: 'Forward' },
                { from: 1, to: 2, label: 'Target Group' },
                { from: 2, to: 3, label: 'Dynamo SDK' },
                { from: 2, to: 4, label: 'Postgres SQL' }
            ]
        },
        'azure-media-ha': {
            cost: '$45.00 - $85.00 / mes (Active-Passive HA)',
            zones: [
                { id: 'z_az_east', title: '1. Primary Region: East US (VNet 10.0.0.0/16)', type: 'azure', x: 40, y: 70, width: 730, height: 600 },
                { id: 'z_az_west', title: '2. Standby Region: West US (Failover)', type: 'azure', x: 810, y: 70, width: 330, height: 600 }
            ],
            nodes: [
                { componentId: 'azure-frontdoor', x: 70, y: 150 },
                { componentId: 'azure-functions', x: 430, y: 150 },
                { componentId: 'azure-blob', x: 70, y: 320 },
                { componentId: 'azure-cosmos', x: 430, y: 320 },
                { componentId: 'azure-blob', x: 430, y: 490 },
                { componentId: 'azure-blob', x: 840, y: 220 },
                { componentId: 'azure-cosmos', x: 840, y: 400 }
            ],
            connections: [
                { from: 0, to: 1, label: 'HTTPS API' },
                { from: 0, to: 2, label: 'Origin HLS/DASH' },
                { from: 1, to: 3, label: 'Write Metadata' },
                { from: 1, to: 4, label: 'Read Stream' },
                { from: 4, to: 5, label: 'Geo-Replication (GRS)' },
                { from: 3, to: 6, label: 'Global Replication' }
            ],
            notes: [
                { id: 'note_az_1', text: '🎬 **Azure High Availability Video Streaming**: Front Door distribuye tráfico global. La región Este procesa video y metadatos con replicación activa-pasiva automática hacia la región Oeste para RTO < 1 minuto.', color: 'blue', x: 40, y: 690, width: 1100, height: 95 }
            ],
            markers: [
                { id: 'mark_az_1', num: '1', text: 'Ingress & Front Door', x: 100, y: 40 },
                { id: 'mark_az_2', num: '2', text: 'Transcoding & App', x: 460, y: 40 },
                { id: 'mark_az_3', num: '3', text: 'Standby Failover', x: 870, y: 40 }
            ]
        },
        'enterprise-hybrid-vendor-pci': {
            cost: '$0.00 On-Prem / Cloud PayG',
            zones: [
                { id: 'z_ent_onprem', title: '1. On-Premise Enterprise & ERP (Local DC)', type: 'onprem', x: 40, y: 70, width: 340, height: 580 },
                { id: 'z_ent_cloud', title: '2. Cloud Account VPC (Core Application)', type: 'aws', x: 420, y: 70, width: 340, height: 580 },
                { id: 'z_ent_external', title: '3. External SaaS & Vendor Systems', type: 'zerocost', x: 800, y: 70, width: 340, height: 580 }
            ],
            nodes: [
                { componentId: 'traefik', x: 70, y: 140 },
                { componentId: 'kafka', x: 70, y: 290 },
                { componentId: 'postgresql-onprem', x: 70, y: 440 },
                { componentId: 'aws-alb', x: 450, y: 140 },
                { componentId: 'aws-fargate', x: 450, y: 290 },
                { componentId: 'aws-aurora', x: 450, y: 440 },
                { componentId: 'cloudflare-dns', x: 830, y: 140 },
                { componentId: 'cloudflare-workers', x: 830, y: 290 },
                { componentId: 'minio', x: 830, y: 440 }
            ],
            connections: [
                { from: 0, to: 1, label: 'Publish Event' },
                { from: 1, to: 4, label: 'MirrorMaker Sync' },
                { from: 3, to: 4, label: 'Target Group' },
                { from: 4, to: 5, label: 'Postgres SQL' },
                { from: 6, to: 7, label: 'Webhook Ingress' },
                { from: 7, to: 3, label: 'Stripe Webhook' },
                { from: 7, to: 8, label: 'Invoice Vault S3' }
            ],
            notes: [
                { id: 'note_ent_1', text: '🏢 **Enterprise Multi-Boundary Pattern**: Aislamiento estricto entre sistemas locales (ERP/SAP), Cómputo Cloud (Fargate) y Pasarelas de Pago Externas (Stripe) cumpliendo normativas PCI-DSS e ISO 27001.', color: 'green', x: 40, y: 670, width: 1100, height: 95 }
            ],
            markers: [
                { id: 'mark_ent_1', num: '1', text: 'On-Prem Core', x: 120, y: 40 },
                { id: 'mark_ent_2', num: '2', text: 'Cloud Compute', x: 500, y: 40 },
                { id: 'mark_ent_3', num: '3', text: 'External Vendors', x: 880, y: 40 }
            ]
        },
        'onprem-highperf': {
            cost: '$0.00 Cloud (Bare Metal)',
            zones: [
                { id: 'z_dmz', title: 'DMZ Ingress / Proxy', type: 'onprem', x: 40, y: 100, width: 260, height: 350 },
                { id: 'z_core', title: 'Internal App Cluster', type: 'onprem', x: 360, y: 100, width: 300, height: 350 },
                { id: 'z_storage', title: 'Storage & Analytics Cluster', type: 'onprem', x: 720, y: 100, width: 300, height: 350 }
            ],
            nodes: [
                { componentId: 'kafka', x: 70, y: 200 },
                { componentId: 'opentelemetry-collector', x: 390, y: 200 },
                { componentId: 'clickhouse', x: 750, y: 140 },
                { componentId: 'grafana', x: 750, y: 280 }
            ],
            connections: [
                { from: 0, to: 1, label: 'Kafka Ingest' },
                { from: 1, to: 2, label: 'Batch Write' },
                { from: 3, to: 2, label: 'SQL Query' }
            ]
        }
    };

    // -------------------------------------------------------------
    // EQUIVALENCY DATASET
    // -------------------------------------------------------------
    const EQUIVALENCY_DATA = [
        { category: 'DNS Autoritativo & Registro', aws: 'Route 53', gcp: 'Cloud DNS', azure: 'Azure DNS', zerocost: 'Cloudflare DNS (Free) / DuckDNS ($0)', oss: 'CoreDNS / BIND' },
        { category: 'NoSQL Key-Value / Document', aws: 'DynamoDB', gcp: 'Cloud Firestore / Bigtable', azure: 'Cosmos DB', zerocost: 'Upstash Redis / Cloudflare KV', oss: 'Redis / ScyllaDB' },
        { category: 'Base de Datos Relacional (SQL)', aws: 'RDS Aurora PostgreSQL', gcp: 'Cloud SQL / AlloyDB', azure: 'Azure SQL', zerocost: 'Supabase / Neon / Turso (SQLite)', oss: 'PostgreSQL / SQLite' },
        { category: 'Analítica / Data Warehouse (OLAP)', aws: 'Redshift / Athena', gcp: 'BigQuery', azure: 'Synapse Analytics', zerocost: 'DuckDB (Embedded) / ClickHouse Free', oss: 'ClickHouse / DuckDB' },
        { category: 'Almacenamiento de Objetos', aws: 'Amazon S3', gcp: 'Cloud Storage (GCS)', azure: 'Blob Storage', zerocost: 'Cloudflare R2 ($0 Egress)', oss: 'MinIO / Ceph' },
        { category: 'Cómputo Serverless (FaaS)', aws: 'AWS Lambda', gcp: 'Cloud Run / Functions', azure: 'Azure Functions', zerocost: 'Vercel / Cloudflare Workers', oss: 'Knative / Docker' },
        { category: 'Colas & Event Streaming', aws: 'Amazon SQS / Kinesis', gcp: 'Cloud Pub/Sub / Tasks', azure: 'Service Bus / Event Hubs', zerocost: 'Upstash QStash / Queues', oss: 'Apache Kafka / RabbitMQ' },
        { category: 'CDN & Edge Gateway', aws: 'Amazon CloudFront', gcp: 'Cloud CDN', azure: 'Azure Front Door', zerocost: 'Cloudflare CDN / Vercel Edge', oss: 'Nginx / Traefik' },
        { category: 'Autenticación de Usuarios', aws: 'Amazon Cognito', gcp: 'Firebase Auth', azure: 'Microsoft Entra ID', zerocost: 'Supabase Auth / Clerk Free', oss: 'Keycloak / Authentik' },
        { category: 'Observabilidad & APM', aws: 'CloudWatch / X-Ray', gcp: 'Cloud Trace / Logging', azure: 'Azure Monitor', zerocost: 'SigNoz Community / Grafana Cloud', oss: 'OTel + ClickHouse / Tempo' }
    ];

    // -------------------------------------------------------------
    // ZERO-COST & ON-PREMISE FREE TIERS 2026
    // -------------------------------------------------------------
    const ZERO_COST_TIERS_2026 = [
        {
            name: 'Supabase',
            badge: 'BaaS & Postgres',
            limits: ['PostgreSQL dedicado de 500 MB', '50,000 Usuarios Activos Mensuales (MAU)', '1 GB de Almacenamiento de Archivos', '500,000 Edge Functions/mes'],
            gotchas: 'Pausa proyectos inactivos tras 7 días (se reactiva con 1 clic).',
            useCase: 'El backend serverless definitivo para cualquier SaaS, MVP o app móvil sin pagar un solo dólar.'
        },
        {
            name: 'Cloudflare (Workers + R2 + DNS + Tunnels)',
            badge: 'Edge Cloud con $0 Egress',
            limits: ['DNS Anycast: Ilimitado & 100% Gratuito', 'Workers: 100,000 peticiones gratis al día', 'R2 Storage: 10 GB de archivos con $0.00 costo de salida', 'Zero Trust Tunnels: Conecta servidores On-Premise a Internet 100% gratis'],
            gotchas: 'Workers tiene límite de CPU de 10ms-50ms por request (perfecto para APIs y microservicios rápidos).',
            useCase: 'Almacenar terabytes de videos/imágenes sin pagar las exorbitantes tarifas de salida de AWS S3.'
        },
        {
            name: 'MinIO + Traefik (On-Premise / Self-Hosted)',
            badge: 'Infraestructura Propia $0 Cloud',
            limits: ['100% Gratuito y Open Source (Zero Cloud Bills)', 'MinIO soporta S3 API nativa en discos NVMe locales', 'Traefik gestiona SSL Let\'s Encrypt automático'],
            gotchas: 'Requiere hardware propio o homelab con conexión a internet estable.',
            useCase: 'Almacenamiento masivo de petabytes sin ninguna factura en la nube.'
        },
        {
            name: 'DuckDB + SQLite (Embebidos)',
            badge: 'Motor de $0 Cómputo',
            limits: ['100% Gratuito y de Código Abierto (Zero Cloud Bills)', 'DuckDB ejecuta consultas SQL sobre Parquet en S3/R2', 'SQLite almacena millones de registros en 1 archivo'],
            gotchas: 'Corren en la memoria/disco del proceso cliente. Para escrituras multi-usuario masivas concurrentes usar PostgreSQL.',
            useCase: 'Analítica de millones de datos sin pagar BigQuery o Snowflake.'
        }
    ];

    // -------------------------------------------------------------
    // INITIALIZATION
    // -------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', async () => {
        setupThemeEngine();
        setupNavigation();
        setupPalette();
        setupCanvasEngine();
        setupCanvasToolbar();
        setupAICopilot();
        setupCostSimulator();
        setupAdvisorEngine();
        setupPatternsCatalog();
        renderDNSRegistrarsCards();
        renderDNSTable();
        renderEquivalencyTable();
        renderZeroCostCards();
        setupProjectsManager();
        setupExportModal();
        setupKeyboardShortcuts();

        await loadModelData();

        const savedSession = safeStorage.get('current_canvas_session');
        if (savedSession) {
            try {
                const parsed = JSON.parse(savedSession);
                if (parsed && ((parsed.nodes && parsed.nodes.length > 0) || (parsed.zones && parsed.zones.length > 0))) {
                    applyTopologyToCanvas(parsed, false);
                    showToast('Sesión de trabajo restaurada automáticamente', 'info', 2500);
                } else {
                    loadPreset('onprem-enterprise-stack');
                }
            } catch (e) {
                loadPreset('onprem-enterprise-stack');
            }
        } else {
            loadPreset('onprem-enterprise-stack');
        }
        recordCanvasState();
    });

    // -------------------------------------------------------------
    // THEME ENGINE (6 CURATED PALETTES)
    // -------------------------------------------------------------
    function setupThemeEngine() {
        const themeBtn = document.getElementById('btn-theme-selector');
        const themeMenu = document.getElementById('theme-dropdown-menu');
        const themeDot = document.getElementById('current-theme-dot');
        const themeLabel = document.getElementById('current-theme-label');

        const themeMeta = {
            'default': { label: 'Studio Dark', color: '#38bdf8' },
            'oled': { label: 'Midnight OLED', color: '#ffffff' },
            'cyberpunk': { label: 'Cyberpunk Neon', color: '#e879f9' },
            'dracula': { label: 'Dracula Pro', color: '#cba6f7' },
            'ocean': { label: 'Deep Ocean', color: '#0284c7' },
            'emerald': { label: 'Emerald Matrix', color: '#10b981' },
            'light': { label: 'Clean Light', color: '#0284c7' }
        };

        function applyTheme(themeKey) {
            currentTheme = themeKey;
            if (themeKey === 'default') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', themeKey);
            }
            safeStorage.set('app_theme', themeKey);

            const meta = themeMeta[themeKey] || themeMeta['default'];
            if (themeLabel) themeLabel.textContent = meta.label + ' ▾';
            if (themeDot) themeDot.style.background = meta.color;

            document.querySelectorAll('.theme-option').forEach(opt => {
                opt.classList.toggle('active', opt.getAttribute('data-set-theme') === themeKey);
            });
        }

        const savedTheme = safeStorage.get('app_theme', 'default');
        applyTheme(savedTheme);

        if (themeBtn && themeMenu) {
            themeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                themeMenu.style.display = themeMenu.style.display === 'none' ? 'block' : 'none';
            });

            document.addEventListener('click', () => { themeMenu.style.display = 'none'; });

            document.querySelectorAll('.theme-option').forEach(opt => {
                opt.addEventListener('click', () => {
                    const t = opt.getAttribute('data-set-theme');
                    applyTheme(t);
                    themeMenu.style.display = 'none';
                });
            });
        }
    }

    async function loadModelData() {
        try {
            const res = await fetch('/build/model.json');
            if (res.ok) modelData = await res.json();
        } catch (e) {
            console.warn('Usando catálogo local');
        }
    }

    // -------------------------------------------------------------
    // NAVIGATION
    // -------------------------------------------------------------
    function setupNavigation() {
        const tabs = document.querySelectorAll('.view-tab');
        const views = {
            'canvas': document.getElementById('view-canvas-container'),
            'simulator': document.getElementById('view-simulator-container'),
            'patterns': document.getElementById('view-patterns-container'),
            'advisor': document.getElementById('view-advisor-container'),
            'dns': document.getElementById('view-dns-container'),
            'equivalency': document.getElementById('view-equivalency-container'),
            'zerocost': document.getElementById('view-zerocost-container'),
            'matrix': document.getElementById('view-matrix-container')
        };

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                Object.values(views).forEach(v => { if (v) v.style.display = 'none'; });

                tab.classList.add('active');
                const target = tab.getAttribute('data-view');
                if (views[target]) {
                    views[target].style.display = (target === 'canvas') ? 'flex' : 'block';
                }

                if (target === 'canvas') {
                    requestConnectionsUpdate();
                }
            });
        });
    }

    // -------------------------------------------------------------
    // DNS & DOMAIN REGISTRARS HUB 2026
    // -------------------------------------------------------------
    function renderDNSRegistrarsCards() {
        const grid = document.getElementById('dns-registrars-grid');
        if (!grid) return;
        grid.innerHTML = '';
        const frag = document.createDocumentFragment();

        DNS_REGISTRARS_DATA.forEach(reg => {
            const card = document.createElement('div');
            card.className = 'pattern-card';
            card.innerHTML = `
                <div>
                    <div class="pattern-card-header">
                        <h4 class="pattern-card-title">${escapeHtml(reg.name)}</h4>
                        <span class="pattern-badge ${reg.cost.includes('$0.00') || reg.cost.includes('~$9.77') ? 'badge-zerocost' : ''}">${escapeHtml(reg.badge)}</span>
                    </div>
                    <div style="font-size: 0.72rem; color: var(--accent-cyan); font-weight: 600; margin-bottom: 0.4rem;">${escapeHtml(reg.type)}</div>
                    <p class="pattern-card-desc">${escapeHtml(reg.desc)}</p>
                    <div class="pattern-stack-tags">
                        ${reg.features.map(f => `<span class="stack-tag">${escapeHtml(f)}</span>`).join('')}
                    </div>
                </div>
                <div class="pattern-footer-row" style="margin-top: 1rem;">
                    <span class="pattern-cost-pill">${escapeHtml(reg.cost)}</span>
                    <a href="${reg.link}" target="_blank" rel="noopener noreferrer" class="action-btn primary-btn" style="text-decoration: none; font-size: 0.72rem;">
                        ${escapeHtml(reg.btnText)} ↗
                    </a>
                </div>
            `;
            frag.appendChild(card);
        });
        grid.appendChild(frag);
    }

    function renderDNSTable() {
        const tbody = document.getElementById('dns-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        const frag = document.createDocumentFragment();

        DNS_PRICING_TABLE_DATA.forEach(row => {
            const tr = document.createElement('tr');
            const isWarning = row.name.includes('GoDaddy');
            tr.innerHTML = `
                <td><strong style="${isWarning ? 'color: var(--accent-rose);' : ''}">${escapeHtml(row.name)}</strong></td>
                <td><span style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(row.model)}</span></td>
                <td><strong style="color: ${isWarning ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">${escapeHtml(row.com)}</strong></td>
                <td><span style="font-size: 0.72rem; color: var(--text-dim);">${escapeHtml(row.other)}</span></td>
                <td><span style="font-size: 0.75rem;">${escapeHtml(row.privacy)}</span></td>
                <td><span style="font-size: 0.75rem;">${escapeHtml(row.dnssec)}</span></td>
                <td><span class="service-pill ${isWarning ? 'pill-aws' : 'pill-zerocost'}">${escapeHtml(row.use)}</span></td>
            `;
            frag.appendChild(tr);
        });
        tbody.appendChild(frag);
    }

    // -------------------------------------------------------------
    // PATTERNS CATALOG 2026
    // -------------------------------------------------------------
    function setupPatternsCatalog() {
        const grid = document.getElementById('patterns-cards-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const frag = document.createDocumentFragment();
        ARCHITECTURE_PATTERNS_2026.forEach(pattern => {
            const card = document.createElement('div');
            card.className = 'pattern-card';
            card.innerHTML = `
                <div>
                    <div class="pattern-card-header">
                        <h4 class="pattern-card-title">${escapeHtml(pattern.title)}</h4>
                        <span class="pattern-badge ${pattern.cost.includes('$0.00') ? 'badge-zerocost' : ''}">${escapeHtml(pattern.badge)}</span>
                    </div>
                    <p class="pattern-card-desc">${escapeHtml(pattern.desc)}</p>
                    <div class="pattern-stack-tags">
                        ${pattern.stack.map(s => `<span class="stack-tag">${escapeHtml(s)}</span>`).join('')}
                    </div>
                </div>
                <div class="pattern-footer-row">
                    <span class="pattern-cost-pill">${escapeHtml(pattern.cost)}</span>
                    <div class="pattern-actions">
                        <button class="action-btn primary-btn btn-apply-pattern" data-preset="${pattern.presetKey}">🎨 Cargar en Lienzo</button>
                    </div>
                </div>
            `;

            card.querySelector('.btn-apply-pattern').addEventListener('click', () => {
                document.getElementById('tab-canvas-view').click();
                loadPreset(pattern.presetKey);
            });

            frag.appendChild(card);
        });
        grid.appendChild(frag);
    }

    // -------------------------------------------------------------
    // PALETTE
    // -------------------------------------------------------------
    function setupPalette() {
        document.querySelectorAll('#palette-eco-tabs .eco-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#palette-eco-tabs .eco-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeEcoFilter = btn.getAttribute('data-eco');
                renderPalette();
            });
        });

        const debouncedPaletteSearch = debounce(renderPalette, 80);
        document.getElementById('palette-search').addEventListener('input', debouncedPaletteSearch);

        document.getElementById('btn-add-custom-service').addEventListener('click', () => {
            const name = prompt('Nombre del nuevo servicio:');
            if (!name) return;
            const category = prompt('Categoría (ej: Database, Compute, Cache, Queue):') || 'Custom Service';
            const eco = prompt('Ecosistema (aws, gcp, azure, serverless, apm):') || 'serverless';

            const customId = 'custom_' + Date.now();
            CLOUD_SERVICES.push({
                id: customId,
                name: escapeHtml(name.trim()),
                category: escapeHtml(category.trim()),
                eco: escapeHtml(eco.trim()),
                cost: '$0.00',
                quota: 'Custom Limit',
                icon: '📦',
                desc: 'Servicio personalizado agregado por el usuario.'
            });

            renderPalette();
            addServiceNodeToCanvas(customId, 250, 200);
        });

        renderPalette();
    }

    function renderPalette() {
        const list = document.getElementById('palette-categories-list');
        list.innerHTML = '';
        const search = (document.getElementById('palette-search').value || '').toLowerCase().trim();

        const filtered = CLOUD_SERVICES.filter(s => {
            if (activeEcoFilter !== 'all' && s.eco !== activeEcoFilter) return false;
            if (search) return s.name.toLowerCase().includes(search) || s.category.toLowerCase().includes(search);
            return true;
        });

        const groups = {};
        filtered.forEach(s => {
            if (!groups[s.category]) groups[s.category] = [];
            groups[s.category].push(s);
        });

        const frag = document.createDocumentFragment();
        Object.keys(groups).forEach(cat => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'palette-group';
            groupDiv.innerHTML = `
                <div class="palette-group-title">
                    <span>${escapeHtml(cat)}</span>
                    <span>${groups[cat].length}</span>
                </div>
                <div class="palette-group-cards"></div>
            `;

            const cardsBox = groupDiv.querySelector('.palette-group-cards');

            groups[cat].forEach(service => {
                const item = document.createElement('div');
                item.className = 'palette-item';
                item.setAttribute('draggable', 'true');

                const iconHtml = (service.icon && service.icon.length > 2)
                    ? `<img src="/logos/${service.icon}.png" alt="${escapeHtml(service.name)}" onerror="this.src='/logos/inspectit.png'">`
                    : `<span class="item-emoji-icon">${service.icon || '📦'}</span>`;

                item.innerHTML = `
                    ${iconHtml}
                    <span class="palette-item-name">${escapeHtml(service.name)}</span>
                    <span class="palette-item-tag">${escapeHtml(service.cost)}</span>
                `;

                item.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', JSON.stringify({ serviceId: service.id }));
                    e.dataTransfer.effectAllowed = 'copy';
                });

                item.addEventListener('click', () => openServiceModal(service));
                cardsBox.appendChild(item);
            });

            frag.appendChild(groupDiv);
        });
        list.appendChild(frag);
    }

    // -------------------------------------------------------------
    // CANVAS ENGINE: PAN, ZOOM & HIGH-PERFORMANCE rAF SCHEDULER
    // -------------------------------------------------------------
    function requestTransformUpdate() {
        if (transformRafId) return;
        transformRafId = requestAnimationFrame(() => {
            const transformWrapper = document.getElementById('canvas-transform-wrapper');
            transformWrapper.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${zoomLevel})`;
            document.getElementById('zoom-level-indicator').textContent = `${Math.round(zoomLevel * 100)}%`;
            transformRafId = null;
        });
    }

    function requestConnectionsUpdate() {
        if (connectionsRafId) return;
        connectionsRafId = requestAnimationFrame(() => {
            renderCanvasConnections();
            connectionsRafId = null;
        });
    }

    function setupCanvasEngine() {
        const dropzone = document.getElementById('diagram-dropzone');
        const tempPath = document.getElementById('svg-drawing-temp-path');

        // Panning with Mouse Drag
        dropzone.addEventListener('mousedown', (e) => {
            if (e.target.closest('.canvas-node') || e.target.closest('.canvas-zone-box') || e.target.closest('.canvas-sticky-note') || e.target.closest('.canvas-step-marker') || e.target.closest('.conn-label-tag')) return;
            if (e.button === 1 || isSpacePressed || e.button === 0) {
                isPanning = true;
                panStartX = e.clientX - panX;
                panStartY = e.clientY - panY;
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (isPanning) {
                panX = e.clientX - panStartX;
                panY = e.clientY - panStartY;
                requestTransformUpdate();
            }

            // Interactive connector drawing line preview via rAF
            if (isConnecting) {
                if (tempPathRafId) return;
                tempPathRafId = requestAnimationFrame(() => {
                    const rect = dropzone.getBoundingClientRect();
                    const mouseX = (e.clientX - rect.left - panX) / zoomLevel;
                    const mouseY = (e.clientY - rect.top - panY) / zoomLevel;

                    const x1 = connectStartPos.x;
                    const y1 = connectStartPos.y;
                    const dx = Math.abs(mouseX - x1);
                    const offset = Math.max(dx * 0.45, 40);

                    const d = `M ${x1} ${y1} C ${x1 + offset} ${y1}, ${mouseX - offset} ${mouseY}, ${mouseX} ${mouseY}`;
                    tempPath.setAttribute('d', d);
                    tempPath.style.display = 'block';
                    tempPathRafId = null;
                });
            }
        });

        window.addEventListener('mouseup', () => {
            isPanning = false;
            if (isConnecting) {
                isConnecting = false;
                tempPath.style.display = 'none';
            }
        });

        // Zoom with Wheel
        dropzone.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
            zoomLevel = Math.min(Math.max(0.4, zoomLevel * zoomFactor), 2.2);
            requestTransformUpdate();
        }, { passive: false });

        // Zoom buttons
        document.getElementById('btn-zoom-in').addEventListener('click', () => {
            zoomLevel = Math.min(2.2, zoomLevel * 1.15);
            requestTransformUpdate();
        });
        document.getElementById('btn-zoom-out').addEventListener('click', () => {
            zoomLevel = Math.max(0.4, zoomLevel * 0.85);
            requestTransformUpdate();
        });
        document.getElementById('btn-zoom-reset').addEventListener('click', resetZoomAndFitView);

        // Drop from palette
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            dropzone.classList.add('drag-over');
        });

        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('drag-over');

            try {
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                if (!data || !data.serviceId) return;

                const rect = dropzone.getBoundingClientRect();
                const x = Math.max(20, Math.round((e.clientX - rect.left - panX) / zoomLevel - 110));
                const y = Math.max(20, Math.round((e.clientY - rect.top - panY) / zoomLevel - 40));

                addServiceNodeToCanvas(data.serviceId, x, y);
            } catch (err) {}
        });

        // Space key listener for smooth Pan
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                isSpacePressed = true;
                dropzone.style.cursor = 'grab';
            }
        });
        window.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                isSpacePressed = false;
                dropzone.style.cursor = 'default';
            }
        });
    }

    function resetZoomAndFitView() {
        if (placedCanvasNodes.length === 0 && placedCanvasZones.length === 0) {
            zoomLevel = 1.0;
            panX = 0;
            panY = 0;
            requestTransformUpdate();
            showToast('Lienzo centrado', 'info', 1500);
            return;
        }

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        placedCanvasNodes.forEach(n => {
            if (n.x < minX) minX = n.x;
            if (n.y < minY) minY = n.y;
            if (n.x + 250 > maxX) maxX = n.x + 250;
            if (n.y + 110 > maxY) maxY = n.y + 110;
        });
        placedCanvasZones.forEach(z => {
            if (z.x < minX) minX = z.x;
            if (z.y < minY) minY = z.y;
            if (z.x + z.width > maxX) maxX = z.x + z.width;
            if (z.y + z.height > maxY) maxY = z.y + z.height;
        });

        const dropzone = document.getElementById('diagram-dropzone');
        const cw = dropzone ? dropzone.clientWidth : 1200;
        const ch = dropzone ? dropzone.clientHeight : 800;

        const bbW = Math.max(400, maxX - minX + 160);
        const bbH = Math.max(300, maxY - minY + 160);

        const scaleX = cw / bbW;
        const scaleY = ch / bbH;
        zoomLevel = Math.min(1.2, Math.max(0.4, Math.min(scaleX, scaleY)));

        const midX = (minX + maxX) / 2;
        const midY = (minY + maxY) / 2;

        panX = (cw / 2) - (midX * zoomLevel);
        panY = (ch / 2) - (midY * zoomLevel);

        requestTransformUpdate();
        showToast('Lienzo ajustado a pantalla (Fit View)', 'info', 1500);
    }

    function addServiceNodeToCanvas(serviceId, x, y) {
        const svc = CLOUD_SERVICES.find(s => s.id === serviceId) || { name: serviceId, category: 'Service', eco: 'serverless', cost: '$0.00', quota: 'Custom', icon: '📦' };

        const node = {
            instanceId: 'node_' + nextInstanceId++,
            componentId: svc.id,
            name: svc.name,
            category: svc.category,
            eco: svc.eco,
            icon: svc.icon,
            cost: svc.cost,
            quota: svc.quota || 'Free Tier',
            x: x,
            y: y
        };

        placedCanvasNodes.push(node);
        renderCanvasNodes();
        requestConnectionsUpdate();
        updateCostHUD();
        recordCanvasState();
    }

    function renderCanvasNodes() {
        const layer = document.getElementById('canvas-nodes-layer');
        const emptyState = document.getElementById('canvas-empty-state');

        emptyState.style.display = (placedCanvasNodes.length === 0) ? 'block' : 'none';

        Array.from(layer.children).forEach(child => {
            if (child.id !== 'canvas-empty-state') layer.removeChild(child);
        });

        const frag = document.createDocumentFragment();

        placedCanvasNodes.forEach((node) => {
            const card = document.createElement('div');
            card.className = `canvas-node node-eco-${node.eco}`;
            card.id = node.instanceId;
            card.style.left = node.x + 'px';
            card.style.top = node.y + 'px';

            const iconHtml = (node.icon && node.icon.length > 2)
                ? `<img src="/logos/${node.icon}.png" alt="${escapeHtml(node.name)}" onerror="this.src='/logos/inspectit.png'">`
                : `<span class="item-emoji-icon">${node.icon || '📦'}</span>`;

            card.innerHTML = `
                <div class="node-ports-in" title="Arrastra aquí para conectar entrada (Data In)"></div>
                <div class="node-header">
                    <div class="node-logo-wrap">${iconHtml}</div>
                    <div class="node-title-group">
                        <div class="node-title">${escapeHtml(node.name)}</div>
                        <div class="node-category">${escapeHtml(node.category)}</div>
                        <div class="node-quota-tag" title="Límite / Cuota">${escapeHtml(node.quota)}</div>
                    </div>
                    <button class="node-delete-btn" title="Eliminar nodo">✕</button>
                </div>
                <div class="node-footer">
                    <span style="font-size: 0.68rem; color: var(--accent-emerald); font-weight: 700; font-family: monospace;">${escapeHtml(node.cost)}</span>
                    <span style="font-size: 0.62rem; color: var(--text-dim);">${node.instanceId}</span>
                </div>
                <div class="node-ports-out" title="Arrastra hacia otro nodo para conectar (Data Out)"></div>
            `;

            // Delete node
            card.querySelector('.node-delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                placedCanvasNodes = placedCanvasNodes.filter(n => n.instanceId !== node.instanceId);
                activeConnections = activeConnections.filter(c => c.fromInstanceId !== node.instanceId && c.toInstanceId !== node.instanceId);
                renderCanvasNodes();
                requestConnectionsUpdate();
                updateCostHUD();
                recordCanvasState();
            });

            // Interactive Port Dragging
            const portOut = card.querySelector('.node-ports-out');
            portOut.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                isConnecting = true;
                connectSourceNode = node;
                connectStartPos = {
                    x: node.x + 245,
                    y: node.y + 46
                };
            });

            const portIn = card.querySelector('.node-ports-in');
            portIn.addEventListener('mouseup', (e) => {
                if (isConnecting && connectSourceNode && connectSourceNode.instanceId !== node.instanceId) {
                    e.stopPropagation();
                    const label = prompt('Protocolo de conexión (ej: HTTPS, gRPC, SQL, Stream, OTLP, DNS):', 'HTTPS') || 'HTTPS';
                    activeConnections.push({
                        id: 'conn_' + nextConnId++,
                        fromInstanceId: connectSourceNode.instanceId,
                        toInstanceId: node.instanceId,
                        label: escapeHtml(label.trim())
                    });
                    isConnecting = false;
                    document.getElementById('svg-drawing-temp-path').style.display = 'none';
                    requestConnectionsUpdate();
                    recordCanvasState();
                }
            });

            setupNodeDragging(card, node);
            frag.appendChild(card);
        });

        layer.appendChild(frag);
    }

    function setupNodeDragging(card, node) {
        let isDragging = false;
        let startX, startY, initialX, initialY;
        let nodeDragRaf = null;

        card.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('node-delete-btn') || e.target.classList.contains('node-ports-in') || e.target.classList.contains('node-ports-out')) return;
            isDragging = true;
            card.classList.add('dragging-node');

            startX = e.clientX;
            startY = e.clientY;
            initialX = node.x;
            initialY = node.y;

            const onMouseMove = (eMove) => {
                if (!isDragging) return;
                if (nodeDragRaf) return;

                nodeDragRaf = requestAnimationFrame(() => {
                    const dx = (eMove.clientX - startX) / zoomLevel;
                    const dy = (eMove.clientY - startY) / zoomLevel;

                    node.x = Math.max(10, initialX + dx);
                    node.y = Math.max(10, initialY + dy);

                    card.style.left = node.x + 'px';
                    card.style.top = node.y + 'px';

                    renderCanvasConnections();
                    nodeDragRaf = null;
                });
            };

            const onMouseUp = () => {
                if (isDragging) {
                    isDragging = false;
                    card.classList.remove('dragging-node');
                    window.removeEventListener('mousemove', onMouseMove);
                    window.removeEventListener('mouseup', onMouseUp);
                    recordCanvasState();
                }
            };

            window.addEventListener('mousemove', onMouseMove, { passive: true });
            window.addEventListener('mouseup', onMouseUp);
        });
    }

    // -------------------------------------------------------------
    // ZONES (VPC, SUBNETS)
    // -------------------------------------------------------------
    function renderCanvasZones() {
        const layer = document.getElementById('canvas-zones-layer');
        layer.innerHTML = '';
        const frag = document.createDocumentFragment();

        placedCanvasZones.forEach(zone => {
            const zDiv = document.createElement('div');
            zDiv.className = `canvas-zone-box zone-${zone.type}`;
            zDiv.id = zone.id;
            zDiv.style.left = zone.x + 'px';
            zDiv.style.top = zone.y + 'px';
            zDiv.style.width = zone.width + 'px';
            zDiv.style.height = zone.height + 'px';

            zDiv.innerHTML = `
                <div class="zone-header-tag zone-tag-${zone.type}">
                    <span class="zone-title-text" title="Doble clic para renombrar">${escapeHtml(zone.title)}</span>
                    <button class="zone-delete-btn" title="Eliminar zona">✕</button>
                </div>
                <div class="zone-resize-handle" title="Arrastra para redimensionar"></div>
            `;

            // Rename zone
            zDiv.querySelector('.zone-title-text').addEventListener('dblclick', () => {
                const newTitle = prompt('Nuevo nombre de la zona/subnet:', zone.title);
                if (newTitle) {
                    zone.title = escapeHtml(newTitle.trim());
                    renderCanvasZones();
                }
            });

            // Delete zone
            zDiv.querySelector('.zone-delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                placedCanvasZones = placedCanvasZones.filter(z => z.id !== zone.id);
                renderCanvasZones();
            });

            // Resize handle
            const resizeHandle = zDiv.querySelector('.zone-resize-handle');
            resizeHandle.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                let startW = zone.width;
                let startH = zone.height;
                let startX = e.clientX;
                let startY = e.clientY;
                let zoneResizeRaf = null;

                const onMove = (eM) => {
                    if (zoneResizeRaf) return;
                    zoneResizeRaf = requestAnimationFrame(() => {
                        zone.width = Math.max(180, startW + (eM.clientX - startX) / zoomLevel);
                        zone.height = Math.max(120, startH + (eM.clientY - startY) / zoomLevel);
                        zDiv.style.width = zone.width + 'px';
                        zDiv.style.height = zone.height + 'px';
                        zoneResizeRaf = null;
                    });
                };
                const onUp = () => {
                    window.removeEventListener('mousemove', onMove);
                    window.removeEventListener('mouseup', onUp);
                };
                window.addEventListener('mousemove', onMove, { passive: true });
                window.addEventListener('mouseup', onUp);
            });

            // Move zone (moves enclosed nodes together)
            zDiv.addEventListener('mousedown', (e) => {
                if (e.target.classList.contains('zone-resize-handle') || e.target.classList.contains('zone-delete-btn')) return;
                let startX = e.clientX;
                let startY = e.clientY;
                let initZX = zone.x;
                let initZY = zone.y;
                let zoneMoveRaf = null;

                // Find enclosed nodes
                const enclosedNodes = placedCanvasNodes.filter(n => 
                    n.x >= zone.x && n.x <= zone.x + zone.width &&
                    n.y >= zone.y && n.y <= zone.y + zone.height
                );
                const nodeOffsets = enclosedNodes.map(n => ({ node: n, offX: n.x - zone.x, offY: n.y - zone.y }));

                const onMove = (eM) => {
                    if (zoneMoveRaf) return;
                    zoneMoveRaf = requestAnimationFrame(() => {
                        const dx = (eM.clientX - startX) / zoomLevel;
                        const dy = (eM.clientY - startY) / zoomLevel;
                        zone.x = Math.max(10, initZX + dx);
                        zone.y = Math.max(10, initZY + dy);
                        zDiv.style.left = zone.x + 'px';
                        zDiv.style.top = zone.y + 'px';

                        nodeOffsets.forEach(item => {
                            item.node.x = zone.x + item.offX;
                            item.node.y = zone.y + item.offY;
                            const el = document.getElementById(item.node.instanceId);
                            if (el) {
                                el.style.left = item.node.x + 'px';
                                el.style.top = item.node.y + 'px';
                            }
                        });

                        renderCanvasConnections();
                        zoneMoveRaf = null;
                    });
                };

                const onUp = () => {
                    window.removeEventListener('mousemove', onMove);
                    window.removeEventListener('mouseup', onUp);
                };
                window.addEventListener('mousemove', onMove, { passive: true });
                window.addEventListener('mouseup', onUp);
            });

            frag.appendChild(zDiv);
        });

        layer.appendChild(frag);
    }

    // -------------------------------------------------------------
    // STICKY NOTES & FLOW STEP MARKERS SYSTEM
    // -------------------------------------------------------------
    function renderCanvasNotes() {
        const layer = document.getElementById('canvas-notes-layer');
        if (!layer) return;
        layer.innerHTML = '';
        const frag = document.createDocumentFragment();

        placedCanvasNotes.forEach(note => {
            const noteDiv = document.createElement('div');
            noteDiv.className = `canvas-sticky-note sticky-${note.color || 'yellow'}`;
            noteDiv.id = note.id;
            noteDiv.style.left = note.x + 'px';
            noteDiv.style.top = note.y + 'px';
            noteDiv.style.width = (note.width || 200) + 'px';
            noteDiv.style.pointerEvents = 'auto';

            noteDiv.innerHTML = `
                <div class="sticky-header">
                    <span class="btn-cycle-color" style="cursor:pointer;" title="Cambiar color">🎨 Color</span>
                    <button class="node-delete-btn btn-del-note" title="Eliminar nota">✕</button>
                </div>
                <textarea class="sticky-content" placeholder="Escribe notas de arquitectura, SLAs o consideraciones de seguridad...">${escapeHtml(note.text || '')}</textarea>
            `;

            const txtArea = noteDiv.querySelector('.sticky-content');
            txtArea.addEventListener('input', (e) => {
                note.text = e.target.value;
            });

            const colors = ['yellow', 'blue', 'green', 'purple', 'rose'];
            noteDiv.querySelector('.btn-cycle-color').addEventListener('click', (e) => {
                e.stopPropagation();
                const curIdx = colors.indexOf(note.color || 'yellow');
                note.color = colors[(curIdx + 1) % colors.length];
                renderCanvasNotes();
            });

            noteDiv.querySelector('.btn-del-note').addEventListener('click', (e) => {
                e.stopPropagation();
                placedCanvasNotes = placedCanvasNotes.filter(n => n.id !== note.id);
                renderCanvasNotes();
            });

            // Dragging sticky note
            let isDragging = false;
            let startX, startY, initX, initY;
            noteDiv.addEventListener('mousedown', (e) => {
                if (e.target.tagName === 'TEXTAREA' || e.target.classList.contains('node-delete-btn') || e.target.classList.contains('btn-cycle-color')) return;
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                initX = note.x;
                initY = note.y;

                const onMove = (eM) => {
                    if (!isDragging) return;
                    note.x = Math.max(10, initX + (eM.clientX - startX) / zoomLevel);
                    note.y = Math.max(10, initY + (eM.clientY - startY) / zoomLevel);
                    noteDiv.style.left = note.x + 'px';
                    noteDiv.style.top = note.y + 'px';
                };
                const onUp = () => {
                    isDragging = false;
                    window.removeEventListener('mousemove', onMove);
                    window.removeEventListener('mouseup', onUp);
                };
                window.addEventListener('mousemove', onMove, { passive: true });
                window.addEventListener('mouseup', onUp);
            });

            frag.appendChild(noteDiv);
        });

        // Markers
        placedCanvasMarkers.forEach(mark => {
            const mDiv = document.createElement('div');
            mDiv.className = 'canvas-step-marker';
            mDiv.id = mark.id;
            mDiv.style.left = mark.x + 'px';
            mDiv.style.top = mark.y + 'px';
            mDiv.style.pointerEvents = 'auto';

            mDiv.innerHTML = `
                <span class="step-num">${escapeHtml(mark.num || '1')}</span>
                <span class="step-text" title="Doble clic para editar">${escapeHtml(mark.text || 'Paso')}</span>
                <button class="node-delete-btn btn-del-mark" style="font-size:0.65rem; margin-left:2px;">✕</button>
            `;

            mDiv.querySelector('.step-text').addEventListener('dblclick', () => {
                const newT = prompt('Editar texto del marcador:', mark.text);
                if (newT) {
                    mark.text = escapeHtml(newT.trim());
                    renderCanvasNotes();
                }
            });

            mDiv.querySelector('.btn-del-mark').addEventListener('click', (e) => {
                e.stopPropagation();
                placedCanvasMarkers = placedCanvasMarkers.filter(m => m.id !== mark.id);
                renderCanvasNotes();
            });

            // Dragging marker
            let isDragging = false;
            let startX, startY, initX, initY;
            mDiv.addEventListener('mousedown', (e) => {
                if (e.target.classList.contains('node-delete-btn')) return;
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                initX = mark.x;
                initY = mark.y;

                const onMove = (eM) => {
                    if (!isDragging) return;
                    mark.x = Math.max(10, initX + (eM.clientX - startX) / zoomLevel);
                    mark.y = Math.max(10, initY + (eM.clientY - startY) / zoomLevel);
                    mDiv.style.left = mark.x + 'px';
                    mDiv.style.top = mark.y + 'px';
                };
                const onUp = () => {
                    isDragging = false;
                    window.removeEventListener('mousemove', onMove);
                    window.removeEventListener('mouseup', onUp);
                };
                window.addEventListener('mousemove', onMove, { passive: true });
                window.addEventListener('mouseup', onUp);
            });

            frag.appendChild(mDiv);
        });

        layer.appendChild(frag);
    }

    // -------------------------------------------------------------
    // SVG CONNECTION CURVES (Batched Updates & Animated Flow)
    // -------------------------------------------------------------
    function renderCanvasConnections() {
        const svgGroup = document.getElementById('svg-paths-group');
        if (!svgGroup) return;
        svgGroup.innerHTML = '';

        // Remove old DOM label tags
        document.querySelectorAll('.conn-label-tag').forEach(el => el.remove());

        const nodeW = 245;
        const nodeH = 92;
        const transformWrapper = document.getElementById('canvas-transform-wrapper');
        const frag = document.createDocumentFragment();

        activeConnections.forEach(conn => {
            const sNode = placedCanvasNodes.find(n => n.instanceId === conn.fromInstanceId);
            const tNode = placedCanvasNodes.find(n => n.instanceId === conn.toInstanceId);
            if (!sNode || !tNode) return;

            let x1, y1, x2, y2;
            const horizontalDist = tNode.x - sNode.x;

            if (horizontalDist >= 120) {
                // Target is to the right (Left-to-Right standard flow)
                x1 = sNode.x + nodeW;
                y1 = sNode.y + (nodeH / 2);
                x2 = tNode.x;
                y2 = tNode.y + (nodeH / 2);
            } else if (horizontalDist <= -120) {
                // Target is to the left
                x1 = sNode.x;
                y1 = sNode.y + (nodeH / 2);
                x2 = tNode.x + nodeW;
                y2 = tNode.y + (nodeH / 2);
            } else {
                // Same column or stacked vertically
                if (tNode.y >= sNode.y) {
                    x1 = sNode.x + (nodeW / 2);
                    y1 = sNode.y + nodeH;
                    x2 = tNode.x + (nodeW / 2);
                    y2 = tNode.y;
                } else {
                    x1 = sNode.x + (nodeW / 2);
                    y1 = sNode.y;
                    x2 = tNode.x + (nodeW / 2);
                    y2 = tNode.y + nodeH;
                }
            }

            const dx = Math.abs(x2 - x1);
            const dy = Math.abs(y2 - y1);
            const offset = Math.max(dx * 0.45, dy * 0.35, 45);

            let d;
            if (Math.abs(x2 - x1) >= 80) {
                const dirX = x2 >= x1 ? 1 : -1;
                d = `M ${x1} ${y1} C ${x1 + (offset * dirX)} ${y1}, ${x2 - (offset * dirX)} ${y2}, ${x2} ${y2}`;
            } else {
                const dirY = y2 >= y1 ? 1 : -1;
                d = `M ${x1} ${y1} C ${x1} ${y1 + (offset * dirY)}, ${x2} ${y2 - (offset * dirY)}, ${x2} ${y2}`;
            }

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', d);
            path.setAttribute('class', 'data-flow-pulse');
            path.setAttribute('marker-end', 'url(#arrowhead)');
            svgGroup.appendChild(path);

            // Clickable Label Tag (Positioned cleanly at the curve midpoint)
            if (conn.label) {
                const labelTag = document.createElement('div');
                labelTag.className = 'conn-label-tag';
                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;
                labelTag.style.left = midX + 'px';
                labelTag.style.top = (midY - 14) + 'px';
                labelTag.innerHTML = `<span>${escapeHtml(conn.label)}</span><span style="color:var(--accent-rose); margin-left:3px; font-weight:bold;">✕</span>`;

                labelTag.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = confirm(`¿Eliminar conexión "${conn.label}"? (Aceptar para borrar, Cancelar para editar protocolo)`);
                    if (action) {
                        activeConnections = activeConnections.filter(c => c.id !== conn.id);
                    } else {
                        const newL = prompt('Editar protocolo / etiqueta:', conn.label);
                        if (newL) conn.label = escapeHtml(newL.trim());
                    }
                    requestConnectionsUpdate();
                    recordCanvasState();
                });

                frag.appendChild(labelTag);
            }
        });

        transformWrapper.appendChild(frag);
    }

    function updateCostHUD() {
        const badgeVal = document.getElementById('cost-estimate-val');
        if (placedCanvasNodes.length === 0) {
            badgeVal.textContent = '$0.00 / mes';
            return;
        }

        const isCloudPaid = placedCanvasNodes.some(n => n.eco === 'aws' || n.eco === 'azure' || n.id === 'gcp-cloudsql' || n.id === 'gcp-memorystore');
        badgeVal.textContent = isCloudPaid ? '$25 - $95 / mes' : '$0.00 / mes (Free Tier)';
    }

    // -------------------------------------------------------------
    // 1-CLICK ZERO-COST / ON-PREMISE OPTIMIZER ENGINE
    // -------------------------------------------------------------
    function optimizeCanvasToLowCostOrOnPrem() {
        if (placedCanvasNodes.length === 0) {
            alert('El lienzo está vacío. Agrega una arquitectura para optimizarla.');
            return;
        }

        const replacements = {
            'aws-route53': { id: 'cloudflare-dns', name: 'Cloudflare DNS & Registrar', eco: 'serverless', cost: '$0.00 / At-Cost', quota: 'Free Anycast + $0 Markup' },
            'gcp-clouddns': { id: 'cloudflare-dns', name: 'Cloudflare DNS & Registrar', eco: 'serverless', cost: '$0.00 / At-Cost', quota: 'Free Anycast + $0 Markup' },
            'aws-alb': { id: 'traefik', name: 'Traefik SSL Proxy', eco: 'apm', cost: 'OSS $0', quota: 'Self-Hosted / Auto SSL' },
            'azure-frontdoor': { id: 'traefik', name: 'Traefik Edge Router', eco: 'apm', cost: 'OSS $0', quota: 'Self-Hosted / Auto SSL' },
            'gcp-cloudarmor': { id: 'traefik', name: 'Traefik WAF & SSL', eco: 'apm', cost: 'OSS $0', quota: 'Self-Hosted' },
            'aws-lambda': { id: 'hono', name: 'Hono.js (Edge / Container)', eco: 'serverless', cost: '$0.00', quota: 'Ultra-Fast Web Standards' },
            'azure-functions': { id: 'hono', name: 'Hono.js (Edge API)', eco: 'serverless', cost: '$0.00', quota: 'Ultra-Fast Web Standards' },
            'gcp-cloudrun': { id: 'hono', name: 'Hono.js (Edge / Container)', eco: 'serverless', cost: '$0.00', quota: 'Ultra-Fast Web Standards' },
            'aws-aurora': { id: 'supabase', name: 'Supabase (PostgreSQL)', eco: 'serverless', cost: '$0.00', quota: 'Free: 500MB / 50k MAU' },
            'gcp-cloudsql': { id: 'postgresql-onprem', name: 'PostgreSQL Dedicated', eco: 'apm', cost: 'OSS $0', quota: 'Self-Hosted NVMe' },
            'aws-s3': { id: 'cloudflare-r2', name: 'Cloudflare R2 ($0 Egress)', eco: 'serverless', cost: '$0.00', quota: 'Free: 10GB / $0 Egress' },
            'gcp-gcs': { id: 'minio', name: 'MinIO (S3 On-Prem)', eco: 'apm', cost: 'OSS $0', quota: 'Self-Hosted S3 Storage' },
            'azure-blob': { id: 'minio', name: 'MinIO (S3 On-Prem)', eco: 'apm', cost: 'OSS $0', quota: 'Self-Hosted S3 Storage' },
            'aws-dynamodb': { id: 'sqlite-turso', name: 'Turso (SQLite / LibSQL)', eco: 'serverless', cost: '$0.00', quota: 'Free: 9GB / 1B reads' },
            'azure-cosmos': { id: 'supabase', name: 'Supabase (Postgres)', eco: 'serverless', cost: '$0.00', quota: 'Free: 500MB / 50k MAU' },
            'gcp-firestore': { id: 'supabase', name: 'Supabase (Postgres)', eco: 'serverless', cost: '$0.00', quota: 'Free: 500MB / 50k MAU' },
            'aws-kinesis': { id: 'rabbitmq', name: 'RabbitMQ (Message Broker)', eco: 'apm', cost: 'OSS $0', quota: 'Self-Hosted AMQP' },
            'gcp-pubsub': { id: 'rabbitmq', name: 'RabbitMQ (Message Broker)', eco: 'apm', cost: 'OSS $0', quota: 'Self-Hosted AMQP' },
            'aws-firehose': { id: 'duckdb', name: 'DuckDB (OLAP Engine)', eco: 'serverless', cost: '$0.00', quota: 'Free: $0 Cómputo Embebido' },
            'aws-athena': { id: 'duckdb', name: 'DuckDB (OLAP Engine)', eco: 'serverless', cost: '$0.00', quota: 'Free: $0 Cómputo Embebido' },
            'aws-redshift': { id: 'clickhouse', name: 'ClickHouse Columnar', eco: 'apm', cost: 'OSS $0', quota: 'Self-Hosted OLAP' },
            'gcp-bigquery': { id: 'duckdb', name: 'DuckDB (OLAP Engine)', eco: 'serverless', cost: '$0.00', quota: 'Free: $0 Cómputo Embebido' },
            'gcp-memorystore': { id: 'upstash-redis', name: 'Upstash Redis', eco: 'serverless', cost: '$0.00', quota: 'Free: 10k cmd/día' },
            'aws-eks': { id: 'k3s-cluster', name: 'K3s Lightweight K8s', eco: 'apm', cost: 'OSS $0', quota: 'Self-Hosted Cluster' },
            'aws-sqs': { id: 'rabbitmq', name: 'RabbitMQ Broker', eco: 'apm', cost: 'OSS $0', quota: 'Self-Hosted AMQP' },
            'gcp-cloudtasks': { id: 'rabbitmq', name: 'RabbitMQ Broker', eco: 'apm', cost: 'OSS $0', quota: 'Self-Hosted AMQP' }
        };

        let replacedCount = 0;
        placedCanvasNodes.forEach(node => {
            if (replacements[node.componentId]) {
                const rep = replacements[node.componentId];
                node.componentId = rep.id;
                node.name = rep.name;
                node.eco = rep.eco;
                node.cost = rep.cost;
                node.quota = rep.quota;
                node.icon = (rep.id === 'minio') ? '🗄️' : (rep.id === 'traefik' ? '🚦' : (rep.id === 'rabbitmq' ? '🐇' : (rep.id === 'qdrant' ? '🧠' : (rep.id === 'ollama-engine' ? '🦙' : (rep.id === 'k3s-cluster' ? '☸️' : (rep.id === 'cloudflare-dns' ? '☁️' : node.icon))))));
                replacedCount++;
            }
        });

        placedCanvasZones.forEach(z => {
            if (z.type === 'aws' || z.type === 'gcp' || z.type === 'azure') {
                z.type = 'zerocost';
                z.title = z.title.replace('AWS', 'Zero-Cost').replace('Google Cloud', 'On-Premise').replace('Azure', 'Self-Hosted');
            }
        });

        renderCanvasZones();
        renderCanvasNodes();
        requestConnectionsUpdate();
        updateCostHUD();

        alert(`✅ ¡Optimización FinOps Realizada!\n\nSe han transformado ${replacedCount} servicios de pago a alternativas Zero-Cost / On-Premise ($0.00 / mes).\n\nFactura estimada: $0.00 / mes\nAhorro anual proyectado: +$1,850 USD.`);
    }

    // -------------------------------------------------------------
    // PRESETS LOADING, UNDO/REDO & TOOLBAR BUTTONS
    // -------------------------------------------------------------
    function setupCanvasToolbar() {
        const btnPresets = document.getElementById('btn-presets');
        const presetsMenu = document.getElementById('presets-menu');

        btnPresets.addEventListener('click', (e) => {
            e.stopPropagation();
            presetsMenu.style.display = presetsMenu.style.display === 'none' ? 'block' : 'none';
        });

        document.addEventListener('click', () => { presetsMenu.style.display = 'none'; });

        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                const key = item.getAttribute('data-preset');
                loadPreset(key);
                presetsMenu.style.display = 'none';
            });
        });

        // Undo & Redo Buttons
        const btnUndo = document.getElementById('btn-undo');
        const btnRedo = document.getElementById('btn-redo');
        if (btnUndo) btnUndo.addEventListener('click', undo);
        if (btnRedo) btnRedo.addEventListener('click', redo);

        // 1-Click Zero-Cost Optimizer Button
        const btnOptimize = document.getElementById('btn-optimize-to-zerocost');
        if (btnOptimize) {
            btnOptimize.addEventListener('click', () => {
                optimizeCanvasToLowCostOrOnPrem();
                recordCanvasState();
            });
        }

        // Add Sticky Note Button
        const btnAddNote = document.getElementById('btn-add-sticky-note');
        if (btnAddNote) {
            btnAddNote.addEventListener('click', () => {
                const note = {
                    id: 'note_' + nextNoteId++,
                    text: '📝 Nota de Arquitectura (SLA 99.99%, RPO < 1min)',
                    color: 'yellow',
                    x: 100 + Math.random() * 150,
                    y: 120 + Math.random() * 100,
                    width: 210
                };
                placedCanvasNotes.push(note);
                renderCanvasNotes();
                recordCanvasState();
                showToast('Nota adhesiva agregada', 'success', 2000);
            });
        }

        // Add Step Marker Button
        const btnAddMarker = document.getElementById('btn-add-step-marker');
        if (btnAddMarker) {
            btnAddMarker.addEventListener('click', () => {
                const text = prompt('Etiqueta del paso (ej: Ingress SSL, Rate Limit, Auth, SQL Write, DNS Anycast):', 'Paso de Flujo') || 'Paso';
                const marker = {
                    id: 'marker_' + nextMarkerId++,
                    num: String(placedCanvasMarkers.length + 1),
                    text: escapeHtml(text.trim()),
                    x: 120 + (placedCanvasMarkers.length * 80),
                    y: 40
                };
                placedCanvasMarkers.push(marker);
                renderCanvasNotes();
                recordCanvasState();
                showToast('Marcador de flujo agregado', 'success', 2000);
            });
        }

        document.getElementById('btn-clear-canvas').addEventListener('click', () => {
            if (placedCanvasNodes.length > 0 && !confirm('¿Deseas limpiar todo el lienzo?')) return;
            placedCanvasNodes = [];
            placedCanvasZones = [];
            activeConnections = [];
            placedCanvasNotes = [];
            placedCanvasMarkers = [];
            renderCanvasZones();
            renderCanvasNodes();
            renderCanvasNotes();
            requestConnectionsUpdate();
            updateCostHUD();
            recordCanvasState();
            showToast('Lienzo vaciado', 'info', 2000);
        });

        document.getElementById('btn-add-zone').addEventListener('click', () => {
            const title = prompt('Nombre de la zona/subnet:', 'On-Premise Local Subnet 192.168.1.0/24') || 'Nueva Subnet';
            const type = prompt('Tipo de zona (onprem, zerocost, aws, gcp, azure):', 'onprem') || 'onprem';
            placedCanvasZones.push({
                id: 'zone_' + nextZoneId++,
                title: escapeHtml(title.trim()),
                type: escapeHtml(type.trim()),
                x: 80,
                y: 80,
                width: 320,
                height: 380
            });
            renderCanvasZones();
            recordCanvasState();
            showToast('Zona/Subnet creada', 'success', 2000);
        });

        function autoLayoutArchitecture() {
            if (placedCanvasNodes.length === 0) {
                showToast('No hay nodos en el lienzo para organizar', 'info', 2000);
                return;
            }

            // 1. Map nodes and initialize layers based on component categories
            const nodeLayer = {};
            function getCategoryDefaultLayer(cat, eco, id) {
                const cLower = (cat || '').toLowerCase();
                const idLower = (id || '').toLowerCase();
                if (cLower.includes('dns') || cLower.includes('gateway') || cLower.includes('ingress') || cLower.includes('cdn') || cLower.includes('waf') || idLower.includes('route53') || idLower.includes('frontdoor') || idLower.includes('traefik') || idLower.includes('cloudflare-dns') || idLower.includes('duckdns') || idLower.includes('tanstack-start') || idLower.includes('vercel') || idLower.includes('apigateway')) {
                    return 0; // Layer 0: Ingress / Edge / Gateway / DNS
                }
                if (cLower.includes('compute') || cLower.includes('serverless') || cLower.includes('faas') || cLower.includes('api') || idLower.includes('lambda') || idLower.includes('cloudrun') || idLower.includes('fargate') || idLower.includes('functions') || idLower.includes('hono') || idLower.includes('ollama')) {
                    return 1; // Layer 1: Compute / APIs / Microservices
                }
                if (cLower.includes('queue') || cLower.includes('streaming') || cLower.includes('broker') || cLower.includes('ingest') || cLower.includes('pubsub') || idLower.includes('kinesis') || idLower.includes('firehose') || idLower.includes('sqs') || idLower.includes('rabbitmq') || idLower.includes('kafka') || idLower.includes('cloudtasks')) {
                    return 2; // Layer 2: Streaming / Queues / Messaging
                }
                if (cLower.includes('database') || cLower.includes('sql') || cLower.includes('nosql') || cLower.includes('cache') || cLower.includes('storage') || cLower.includes('object') || idLower.includes('dynamodb') || idLower.includes('postgres') || idLower.includes('supabase') || idLower.includes('turso') || idLower.includes('redis') || idLower.includes('s3') || idLower.includes('minio') || idLower.includes('r2') || idLower.includes('cosmos') || idLower.includes('qdrant')) {
                    return 3; // Layer 3: Databases / Cache / Storage
                }
                if (cLower.includes('analytics') || cLower.includes('warehouse') || cLower.includes('olap') || cLower.includes('monitoring') || cLower.includes('apm') || idLower.includes('athena') || idLower.includes('redshift') || idLower.includes('bigquery') || idLower.includes('duckdb') || idLower.includes('clickhouse') || idLower.includes('grafana') || idLower.includes('eks')) {
                    return 4; // Layer 4: Analytics / DWH / Observability
                }
                return 1;
            }

            placedCanvasNodes.forEach(n => {
                nodeLayer[n.instanceId] = getCategoryDefaultLayer(n.category, n.eco, n.componentId);
            });

            // 2. Refine layer ranks via topological sorting along activeConnections
            let changed = true;
            let iterations = 0;
            while (changed && iterations < 8) {
                changed = false;
                iterations++;
                activeConnections.forEach(c => {
                    const fromL = nodeLayer[c.fromInstanceId];
                    const toL = nodeLayer[c.toInstanceId];
                    if (fromL !== undefined && toL !== undefined && toL <= fromL) {
                        nodeLayer[c.toInstanceId] = fromL + 1;
                        changed = true;
                    }
                });
            }

            // Group nodes by layer
            const layers = {};
            placedCanvasNodes.forEach(n => {
                const l = nodeLayer[n.instanceId] || 0;
                if (!layers[l]) layers[l] = [];
                layers[l].push(n);
            });

            const sortedLayerKeys = Object.keys(layers).map(Number).sort((a, b) => a - b);

            // 3. Assign clean non-overlapping coordinates (360px col width, 140px row height)
            const startX = 70;
            const startY = 120;
            const colWidth = 360;
            const rowHeight = 140;

            let maxNodesInLayer = 0;
            sortedLayerKeys.forEach(k => {
                maxNodesInLayer = Math.max(maxNodesInLayer, layers[k].length);
            });

            const totalHeight = Math.max(540, maxNodesInLayer * rowHeight + 80);

            sortedLayerKeys.forEach((layerKey, colIndex) => {
                const colNodes = layers[layerKey];
                const colX = startX + (colIndex * colWidth);
                const colCount = colNodes.length;
                const colTotalHeight = colCount * rowHeight;
                const colOffsetY = startY + Math.max(0, (totalHeight - colTotalHeight) / 2);

                colNodes.forEach((node, rowIndex) => {
                    node.x = colX;
                    node.y = Math.round(colOffsetY + (rowIndex * rowHeight));
                });
            });

            // 4. Clean zone wrapping
            if (placedCanvasZones.length > 0) {
                const layerTitles = [
                    '1. Ingress & Gateway Tier',
                    '2. Cómputo & Microservicios Tier',
                    '3. Streaming, Colas & Eventos Tier',
                    '4. Persistencia, Cache & Storage Tier',
                    '5. Analítica, DWH & Observabilidad Tier'
                ];

                sortedLayerKeys.forEach((layerKey, colIndex) => {
                    const colNodes = layers[layerKey];
                    if (!colNodes || colNodes.length === 0) return;

                    let z = placedCanvasZones[colIndex];
                    if (z) {
                        z.x = startX + (colIndex * colWidth) - 30;
                        z.y = startY - 50;
                        z.width = colWidth - 40;
                        z.height = totalHeight + 40;
                        if (!z.title || z.title.includes('Tier') || z.title.includes('Subnet')) {
                            z.title = layerTitles[colIndex] || `Tier ${colIndex + 1}`;
                        }
                    }
                });
            }

            renderCanvasZones();
            renderCanvasNodes();
            renderCanvasNotes();
            requestConnectionsUpdate();
            recordCanvasState();
            resetZoomAndFitView();
            showToast('Arquitectura organizada en capas Left-to-Right con cero solapamiento', 'success', 2500);
        }

        document.getElementById('btn-auto-layout').addEventListener('click', autoLayoutArchitecture);

        // Quick Prompt generation
        const quickPrompt = document.getElementById('canvas-quick-prompt');
        const submitBtn = document.getElementById('btn-submit-quick-prompt');

        async function handleQuickPrompt() {
            const q = (quickPrompt.value || '').trim();
            if (!q) return;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spin">⚡</span> Generando...';
            showToast('🤖 Diseñando arquitectura con DeepSeek V4 Flash...', 'info', 2500);

            const opencodeKey = safeStorage.get('opencode_api_key', '');
            const opencodeModel = safeStorage.get('opencode_model', 'deepseek-v4-flash');
            const geminiKey = safeStorage.get('gemini_api_key', '');

            // 1. Primary Engine: Server-side High-Speed AI Proxy (/api/ai/generate)
            try {
                const res = await fetch('/api/ai/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        provider: currentAIProvider || 'opencode',
                        model: opencodeModel,
                        prompt: q,
                        apiKey: opencodeKey || undefined
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.topology && data.topology.nodes && data.topology.nodes.length > 0) {
                        applyTopologyToCanvas(data.topology);
                        autoLayoutArchitecture();
                        resetZoomAndFitView();
                        quickPrompt.value = '';
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<span>Generar</span>';
                        showToast(`⚡ ¡Arquitectura generada con éxito por ${data.model || 'DeepSeek V4'}!`, 'success', 3500);
                        return;
                    }
                }
            } catch (proxyErr) {
                console.warn('Proxy AI error, attempting fallback:', proxyErr);
            }

            // 2. Gemini Cascade Fallback (if configured)
            if (geminiKey) {
                try {
                    submitBtn.textContent = '🔄 Probando Gemini...';
                    const fullPrompt = `${MASTER_MEGA_PROMPT}\n\nREQUERIMIENTO:\n${q}\n\nEmite SIEMPRE el bloque JSON de topología al final.`;
                    
                    const result = await geminiCascadeCall(geminiKey, fullPrompt, (status) => {
                        submitBtn.textContent = status;
                    });

                    if (result) {
                        let txt = result.text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
                        const match = txt.match(/```json\s*([\s\S]*?)\s*```/) || txt.match(/(\{[\s\S]*"nodes"[\s\S]*\})/);
                        if (match) {
                            try {
                                const parsed = JSON.parse(match[1] || match[0]);
                                applyTopologyToCanvas(parsed);
                                autoLayoutArchitecture();
                                resetZoomAndFitView();
                                quickPrompt.value = '';
                                submitBtn.disabled = false;
                                submitBtn.innerHTML = '<span>Generar</span>';
                                showToast(`✅ Generado por ${result.modelName}`, 'success', 3500);
                                return;
                            } catch (e) {}
                        }
                    }
                } catch (err) {
                    console.warn('Gemini fallback error:', err);
                }
            }

            // 3. Heuristic Preset Fallback
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Generar</span>';

            // Fallback to Heuristic Match
            const qLower = q.toLowerCase();
            if (qLower.includes('ecommerce') || qLower.includes('pci') || qLower.includes('tienda') || qLower.includes('stripe')) {
                loadPreset('e-commerce-pci');
            } else if (qLower.includes('mobile') || qLower.includes('flutter') || qLower.includes('sync') || qLower.includes('offline')) {
                loadPreset('mobile-sync-realtime');
            } else if (qLower.includes('game') || qLower.includes('gaming') || qLower.includes('websocket')) {
                loadPreset('gaming-streaming-ws');
            } else if (qLower.includes('fintech') || qLower.includes('bank') || qLower.includes('acid') || qLower.includes('temporal')) {
                loadPreset('fintech-acid-core');
            } else if (qLower.includes('health') || qLower.includes('hipaa') || qLower.includes('salud')) {
                loadPreset('healthcare-hipaa');
            } else if (qLower.includes('on-prem') || qLower.includes('self-hosted') || qLower.includes('minio') || qLower.includes('traefik')) {
                loadPreset('onprem-enterprise-stack');
            } else if (qLower.includes('private ai') || qLower.includes('ollama') || qLower.includes('qdrant') || qLower.includes('local ai')) {
                loadPreset('onprem-private-ai');
            } else if (qLower.includes('tunnel') || qLower.includes('hybrid') || qLower.includes('híbrido')) {
                loadPreset('hybrid-cloud-edge');
            } else if (qLower.includes('gcp')) {
                loadPreset('gcp-enterprise-vpc');
            } else if (qLower.includes('tanstack') || qLower.includes('hono') || qLower.includes('start')) {
                loadPreset('tanstack-hono-supabase');
            } else if (qLower.includes('aws')) {
                loadPreset('aws-serverless-analytics');
            } else {
                loadPreset('zero-cost-fullstack');
            }
            quickPrompt.value = '';
            showToast('Plantilla aplicada en el lienzo', 'success', 2000);
        }

        if (submitBtn) submitBtn.addEventListener('click', handleQuickPrompt);
        if (quickPrompt) {
            quickPrompt.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleQuickPrompt();
                }
            });
        }

        // Image export
        document.getElementById('btn-export-image').addEventListener('click', exportDiagramImage);
    }

    function applyTopologyToCanvas(topology, record = true) {
        if (!topology) return;
        try {
            placedCanvasZones = topology.zones || [];
            placedCanvasNotes = topology.notes || [];
            placedCanvasMarkers = topology.markers || [];
            
            placedCanvasNodes = (topology.nodes || []).map((n, idx) => {
                const targetId = (n.componentId || n.id || '').toLowerCase();
                const svc = CLOUD_SERVICES.find(s => s.id === targetId || s.id === n.componentId || s.name.toLowerCase() === (n.name || '').toLowerCase()) || {
                    name: n.name || n.componentId || n.id || `Servicio ${idx + 1}`,
                    category: n.category || 'Compute',
                    eco: n.eco || 'serverless',
                    cost: n.cost || '$0.00',
                    quota: n.quota || 'Free Tier',
                    icon: n.icon || '⚡'
                };
                return {
                    instanceId: 'node_' + nextInstanceId++,
                    componentId: n.componentId || n.id || svc.id || 'custom-svc',
                    name: n.name || svc.name,
                    category: n.category || svc.category,
                    eco: n.eco || svc.eco,
                    icon: n.icon || svc.icon,
                    cost: n.cost || svc.cost,
                    quota: n.quota || svc.quota || 'Free Tier',
                    x: typeof n.x === 'number' ? n.x : 100 + (idx % 4) * 260,
                    y: typeof n.y === 'number' ? n.y : 120 + Math.floor(idx / 4) * 160
                };
            });

            activeConnections = [];
            if (topology.connections) {
                topology.connections.forEach(c => {
                    let sNode = null;
                    let tNode = null;
                    if (typeof c.from === 'number' && placedCanvasNodes[c.from]) {
                        sNode = placedCanvasNodes[c.from];
                    } else {
                        sNode = placedCanvasNodes.find(nd => nd.instanceId === c.from || nd.componentId === c.from || nd.name?.toLowerCase() === String(c.from).toLowerCase());
                    }
                    if (typeof c.to === 'number' && placedCanvasNodes[c.to]) {
                        tNode = placedCanvasNodes[c.to];
                    } else {
                        tNode = placedCanvasNodes.find(nd => nd.instanceId === c.to || nd.componentId === c.to || nd.name?.toLowerCase() === String(c.to).toLowerCase());
                    }
                    if (sNode && tNode) {
                        activeConnections.push({
                            id: 'conn_' + nextConnId++,
                            fromInstanceId: sNode.instanceId,
                            toInstanceId: tNode.instanceId,
                            label: c.label || c.protocol || 'HTTPS'
                        });
                    }
                });
            }

            renderCanvasZones();
            renderCanvasNodes();
            renderCanvasNotes();
            requestConnectionsUpdate();
            document.getElementById('cost-estimate-val').textContent = topology.estimatedCost || '$0.00 / mes';
            if (record) recordCanvasState();
        } catch (err) {
            console.error('Error aplicando topología:', err);
            showToast('Error al procesar la topología', 'error', 3000);
        }
    }

    function loadPreset(presetKey) {
        const preset = PRESETS[presetKey];
        if (!preset) return;
        applyTopologyToCanvas(preset, true);
        document.getElementById('tab-canvas-view').click();
        showToast(`Plantilla "${preset.title || presetKey}" cargada`, 'success', 2200);
    }

    // -------------------------------------------------------------
    // AI COPILOT ENGINE (OPENCODE GO, GEMINI, GROQ, OPENROUTER, OLLAMA & MASTER PROMPT)
    // -------------------------------------------------------------
    function setupAICopilot() {
        const aiModal = document.getElementById('ai-modal');
        const opencodeKeyInput = document.getElementById('opencode-api-key-input');
        const opencodeModelSelect = document.getElementById('opencode-model-select');
        const geminiKeyInput = document.getElementById('gemini-api-key-input');
        const groqKeyInput = document.getElementById('groq-api-key-input');
        const groqModelSelect = document.getElementById('groq-model-select');
        const openrouterKeyInput = document.getElementById('openrouter-api-key-input');
        const openrouterModelSelect = document.getElementById('openrouter-model-select');
        const ollamaEndpointInput = document.getElementById('ollama-endpoint-input');
        const ollamaModelInput = document.getElementById('ollama-model-input');

        if (opencodeKeyInput) opencodeKeyInput.value = safeStorage.get('opencode_api_key', '');
        if (opencodeModelSelect) opencodeModelSelect.value = safeStorage.get('opencode_model', 'deepseek-v4-flash');
        if (geminiKeyInput) geminiKeyInput.value = safeStorage.get('gemini_api_key', '');
        if (groqKeyInput) groqKeyInput.value = safeStorage.get('groq_api_key', '');
        if (groqModelSelect) groqModelSelect.value = safeStorage.get('groq_model', 'llama-3.3-70b-versatile');
        if (openrouterKeyInput) openrouterKeyInput.value = safeStorage.get('openrouter_api_key', '');
        if (openrouterModelSelect) openrouterModelSelect.value = safeStorage.get('openrouter_model', 'google/gemini-2.0-flash-exp:free');
        if (ollamaEndpointInput) ollamaEndpointInput.value = safeStorage.get('ollama_endpoint', 'http://localhost:11434');
        if (ollamaModelInput) ollamaModelInput.value = safeStorage.get('ollama_model', 'llama3.3');

        // Show cascade model status below key input
        const cascadeStatusEl = document.getElementById('gemini-cascade-status');
        if (cascadeStatusEl) {
            const status = getCascadeStatus();
            cascadeStatusEl.innerHTML = `<span style="color: var(--accent-emerald);">✅ ${status.available} modelos disponibles</span> · ~${status.totalRPD} req/día gratis`;
        }

        // Display Master Mega-Prompt in box
        const promptDisplay = document.getElementById('mega-prompt-text-display');
        if (promptDisplay) promptDisplay.textContent = MASTER_MEGA_PROMPT;

        document.getElementById('btn-copy-mega-prompt').addEventListener('click', () => {
            navigator.clipboard.writeText(MASTER_MEGA_PROMPT).then(() => {
                const btn = document.getElementById('btn-copy-mega-prompt');
                btn.textContent = '¡Copiado!';
                setTimeout(() => btn.textContent = 'Copiar Mega-Prompt', 2000);
            });
        });

        // Provider Selector Tabs
        document.querySelectorAll('#ai-provider-tabs .modal-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('#ai-provider-tabs .modal-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentAIProvider = tab.getAttribute('data-ai-provider');
                safeStorage.set('active_ai_provider', currentAIProvider);

                const opcBox = document.getElementById('ai-provider-opencode-box');
                const gBox = document.getElementById('ai-provider-gemini-box');
                const grqBox = document.getElementById('ai-provider-groq-box');
                const orBox = document.getElementById('ai-provider-openrouter-box');
                const oBox = document.getElementById('ai-provider-ollama-box');

                if (opcBox) opcBox.style.display = currentAIProvider === 'opencode' ? 'block' : 'none';
                if (gBox) gBox.style.display = currentAIProvider === 'gemini' ? 'block' : 'none';
                if (grqBox) grqBox.style.display = currentAIProvider === 'groq' ? 'block' : 'none';
                if (orBox) orBox.style.display = currentAIProvider === 'openrouter' ? 'block' : 'none';
                if (oBox) oBox.style.display = currentAIProvider === 'ollama' ? 'block' : 'none';
            });
        });

        document.getElementById('btn-open-ai-modal').addEventListener('click', () => {
            aiModal.style.display = 'flex';
        });

        document.getElementById('ai-modal-close-btn').addEventListener('click', () => {
            aiModal.style.display = 'none';
        });

        const btnSaveOpenCode = document.getElementById('btn-save-opencode-key');
        if (btnSaveOpenCode) {
            btnSaveOpenCode.addEventListener('click', () => {
                const k = opencodeKeyInput.value.trim();
                const m = opencodeModelSelect.value;
                if (k) {
                    safeStorage.set('opencode_api_key', k);
                    safeStorage.set('opencode_model', m);
                    safeStorage.set('active_ai_provider', 'opencode');
                    currentAIProvider = 'opencode';
                    showToast(`⚡ Clave OpenCode Go guardada (${m} activo · ~2.6s)`, 'success', 3500);
                } else {
                    safeStorage.remove('opencode_api_key');
                    showToast('Clave de OpenCode eliminada.', 'warning', 3000);
                }
            });
        }

        document.getElementById('btn-save-gemini-key').addEventListener('click', () => {
            const k = geminiKeyInput.value.trim();
            if (k) {
                safeStorage.set('gemini_api_key', k);
                safeStorage.set('active_ai_provider', 'gemini');
                currentAIProvider = 'gemini';
                // Reset exhausted models on new key
                exhaustedModels.clear();
                const status = getCascadeStatus();
                const cascadeEl = document.getElementById('gemini-cascade-status');
                if (cascadeEl) cascadeEl.innerHTML = `<span style="color: var(--accent-emerald);">✅ ${status.available} modelos disponibles</span> · ~${status.totalRPD} req/día gratis`;
                showToast(`🔑 Clave guardada. Cascade Engine: ${status.available} modelos Gemini listos (~${status.totalRPD} req/día)`, 'success', 3500);
            } else {
                safeStorage.remove('gemini_api_key');
                showToast('Clave eliminada. Se usará Motor Heurístico $0 Offline.', 'warning', 3000);
            }
        });

        const btnSaveGroq = document.getElementById('btn-save-groq-key');
        if (btnSaveGroq) {
            btnSaveGroq.addEventListener('click', () => {
                const k = groqKeyInput.value.trim();
                const m = groqModelSelect.value;
                if (k) {
                    safeStorage.set('groq_api_key', k);
                    safeStorage.set('groq_model', m);
                    safeStorage.set('active_ai_provider', 'groq');
                    currentAIProvider = 'groq';
                    showToast('¡Clave de Groq Cloud guardada localmente!', 'success', 3000);
                } else {
                    safeStorage.remove('groq_api_key');
                    showToast('Clave de Groq eliminada.', 'warning', 3000);
                }
            });
        }

        const btnSaveOpenRouter = document.getElementById('btn-save-openrouter-key');
        if (btnSaveOpenRouter) {
            btnSaveOpenRouter.addEventListener('click', () => {
                const k = openrouterKeyInput.value.trim();
                const m = openrouterModelSelect.value;
                if (k) {
                    safeStorage.set('openrouter_api_key', k);
                    safeStorage.set('openrouter_model', m);
                    safeStorage.set('active_ai_provider', 'openrouter');
                    currentAIProvider = 'openrouter';
                    showToast('¡Clave de OpenRouter guardada localmente!', 'success', 3000);
                } else {
                    safeStorage.remove('openrouter_api_key');
                    showToast('Clave de OpenRouter eliminada.', 'warning', 3000);
                }
            });
        }

        const btnSaveOllama = document.getElementById('btn-save-ollama-config');
        if (btnSaveOllama) {
            btnSaveOllama.addEventListener('click', () => {
                safeStorage.set('ollama_endpoint', ollamaEndpointInput.value.trim());
                safeStorage.set('ollama_model', ollamaModelInput.value.trim());
                safeStorage.set('active_ai_provider', 'ollama');
                currentAIProvider = 'ollama';
                showToast('¡Configuración de Ollama Local guardada!', 'success', 3000);
            });
        }

        document.getElementById('btn-ai-audit').addEventListener('click', async () => {
            await runAIAudit('audit');
        });

        document.getElementById('btn-ai-finops').addEventListener('click', async () => {
            await runAIAudit('finops');
        });

        const btnApplyTopology = document.getElementById('btn-ai-apply-topology');
        if (btnApplyTopology) {
            btnApplyTopology.addEventListener('click', () => {
                if (lastGeneratedAITopology) {
                    applyTopologyToCanvas(lastGeneratedAITopology);
                    autoLayoutArchitecture();
                    aiModal.style.display = 'none';
                }
            });
        }
    }

    async function runAIAudit(type) {
        const outBox = document.getElementById('ai-output-box');
        const outTitle = document.getElementById('ai-output-title');
        const outContent = document.getElementById('ai-output-content');
        const modelTag = document.getElementById('ai-model-used-tag');
        const btnApply = document.getElementById('btn-ai-apply-topology');

        outBox.style.display = 'block';
        if (btnApply) btnApply.style.display = 'none';
        outContent.textContent = 'Analizando arquitectura con el Master Framework 2026...';

        const opencodeKey = safeStorage.get('opencode_api_key');
        const opencodeModel = safeStorage.get('opencode_model', 'deepseek-v4-flash');
        const geminiKey = safeStorage.get('gemini_api_key');
        const groqKey = safeStorage.get('groq_api_key');
        const groqModel = safeStorage.get('groq_model', 'llama-3.3-70b-versatile');
        const openrouterKey = safeStorage.get('openrouter_api_key');
        const openrouterModel = safeStorage.get('openrouter_model', 'google/gemini-2.0-flash-exp:free');
        const ollamaEndpoint = safeStorage.get('ollama_endpoint', 'http://localhost:11434');
        const ollamaModel = safeStorage.get('ollama_model', 'llama3.3');

        const architectureSummary = {
            nodos: placedCanvasNodes.map(n => `${n.name} (${n.category}, ${n.eco}, Cuota: ${n.quota})`),
            zonas: placedCanvasZones.map(z => z.title),
            notas: placedCanvasNotes.map(n => n.text),
            conexiones: activeConnections.map(c => {
                const s = placedCanvasNodes.find(n => n.instanceId === c.fromInstanceId);
                const t = placedCanvasNodes.find(n => n.instanceId === c.toInstanceId);
                return `${s ? s.name : ''} ➔ [${c.label}] ➔ ${t ? t.name : ''}`;
            })
        };

        const promptText = type === 'audit' 
            ? `${MASTER_MEGA_PROMPT}\n\nAUDITA ESTA ARQUITECTURA ACTUAL:\n${JSON.stringify(architectureSummary, null, 2)}\n\nIdentifica: 1) SPOFs críticos, 2) Blast Radius, 3) Cuellos de botella, 4) Resiliencia On-Premise/Cloud y 5) Recomendaciones técnicas.`
            : `${MASTER_MEGA_PROMPT}\n\nANALIZA LOS COSTOS, FINOPS Y ON-PREMISE VIABILITY DE ESTA ARQUITECTURA:\n${JSON.stringify(architectureSummary, null, 2)}\n\nCalcula: 1) Unit Economics ($/MAU), 2) Alternativas Zero-Cost ($0.00) y On-Premise (MinIO, Traefik, PostgreSQL, Qdrant, Ollama), 3) TCO de Hardware propio vs Cloud y 4) Ahorro mensual proyectado.`;

        // 1. OpenCode Go Provider (Ultra-Fast ~2.6s)
        if (currentAIProvider === 'opencode' && opencodeKey) {
            modelTag.textContent = `OpenCode Go: ${opencodeModel} (Ultra-Fast)`;
            try {
                const res = await fetch('https://opencode.ai/zen/go/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${opencodeKey}`
                    },
                    body: JSON.stringify({
                        model: opencodeModel,
                        messages: [
                            { role: 'system', content: 'Eres un Principal Cloud & FinOps Lead Architect.' },
                            { role: 'user', content: promptText }
                        ],
                        temperature: 0.3,
                        max_tokens: 3000
                    })
                });

                if (res.ok) {
                    const json = await res.json();
                    let text = json.choices?.[0]?.message?.content || '';
                    text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
                    outTitle.textContent = type === 'audit' ? `🛡️ Auditoría de Resiliencia (${opencodeModel})` : `💡 Optimización FinOps & Zero-Cost (${opencodeModel})`;
                    outContent.textContent = text;

                    const match = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/(\{[\s\S]*"nodes"[\s\S]*\})/);
                    if (match) {
                        try {
                            lastGeneratedAITopology = JSON.parse(match[1] || match[0]);
                            if (btnApply) btnApply.style.display = 'inline-flex';
                        } catch (e) {}
                    }
                    return;
                }
            } catch (err) {
                console.warn('Error con OpenCode API:', err);
            }
        }

        // 2. Google Gemini Provider — CASCADE ENGINE (6 models, auto-fallback)
        if (currentAIProvider === 'gemini' && geminiKey) {
            modelTag.textContent = '🔄 Gemini Cascade — Seleccionando modelo...';
            
            const result = await geminiCascadeCall(geminiKey, promptText, (status) => {
                outContent.textContent = status;
                modelTag.textContent = status;
            });

            if (result) {
                const status = getCascadeStatus();
                modelTag.textContent = `✅ ${result.modelName} (${status.available}/${status.total} modelos libres)`;
                outTitle.textContent = type === 'audit' 
                    ? `🛡️ Auditoría de Resiliencia & SPOF (${result.modelName})` 
                    : `💡 Optimización FinOps, Zero-Cost & On-Premise (${result.modelName})`;
                outContent.textContent = result.text;

                const match = result.text.match(/```json\s*([\s\S]*?)\s*```/);
                if (match) {
                    try {
                        lastGeneratedAITopology = JSON.parse(match[1]);
                        if (btnApply) btnApply.style.display = 'inline-flex';
                    } catch (e) {}
                }
                return;
            } else {
                // All Gemini models exhausted — fall through to other providers or heuristic
                const status = getCascadeStatus();
                console.warn(`⚠️ All ${status.total} Gemini models exhausted. Falling back...`);
                outContent.textContent = `⚠️ Todos los ${status.total} modelos Gemini agotados. Intentando otros proveedores...`;
            }
        }

        // 2. Groq Cloud LPU Provider (Ultra-Fast 500+ t/s)
        if (currentAIProvider === 'groq' && groqKey) {
            modelTag.textContent = `Groq LPU: ${groqModel} (500+ t/s)`;
            try {
                const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${groqKey}`
                    },
                    body: JSON.stringify({
                        model: groqModel,
                        messages: [{ role: 'user', content: promptText }]
                    })
                });
                const json = await res.json();
                if (json.choices && json.choices[0].message.content) {
                    const text = json.choices[0].message.content;
                    outTitle.textContent = type === 'audit' ? '⚡ Auditoría Ultrarrápida (Groq LPU)' : '⚡ Optimización FinOps (Groq LPU)';
                    outContent.textContent = text;

                    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
                    if (match) {
                        try {
                            lastGeneratedAITopology = JSON.parse(match[1]);
                            if (btnApply) btnApply.style.display = 'inline-flex';
                        } catch (e) {}
                    }
                    return;
                }
            } catch (err) {
                console.warn('Error con Groq API:', err);
            }
        }

        // 3. OpenRouter Provider (:free Models)
        if (currentAIProvider === 'openrouter' && openrouterKey) {
            modelTag.textContent = `OpenRouter: ${openrouterModel}`;
            try {
                const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${openrouterKey}`
                    },
                    body: JSON.stringify({
                        model: openrouterModel,
                        messages: [{ role: 'user', content: promptText }]
                    })
                });
                const json = await res.json();
                if (json.choices && json.choices[0].message.content) {
                    const text = json.choices[0].message.content;
                    outTitle.textContent = type === 'audit' ? '🌐 Auditoría Multi-LLM (OpenRouter)' : '🌐 Optimización FinOps (OpenRouter)';
                    outContent.textContent = text;
                    return;
                }
            } catch (err) {
                console.warn('Error con OpenRouter API:', err);
            }
        }

        // 4. Ollama Local Provider ($0 Offline)
        if (currentAIProvider === 'ollama') {
            modelTag.textContent = `Ollama Local: ${ollamaModel} ($0 Offline)`;
            try {
                const res = await fetch(`${ollamaEndpoint}/api/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ model: ollamaModel, prompt: promptText, stream: false })
                });
                const json = await res.json();
                if (json.response) {
                    outTitle.textContent = type === 'audit' ? '🛡️ Auditoría de Resiliencia (Ollama)' : '💡 Optimización FinOps & On-Premise (Ollama)';
                    outContent.textContent = json.response;
                    return;
                }
            } catch (err) {
                console.warn('Error conectando con Ollama Local:', err);
            }
        }

        // 5. Offline Heuristic Rule Engine ($0 Fallback)
        modelTag.textContent = 'Motor Heurístico Local ($0 Offline)';
        outTitle.textContent = type === 'audit' ? '🛡️ Auditoría de Resiliencia (Heurística Experta)' : '💡 Optimización FinOps, Zero-Cost & On-Premise (Heurística)';

        let report = '';
        if (type === 'audit') {
            report += '🔍 RESULTADOS DE AUDITORÍA DE ARQUITECTURA & CORRECTITUD FORMAL (2026 Q4):\n\n';
            const hasAlb = placedCanvasNodes.some(n => n.componentId === 'aws-alb' || n.componentId === 'azure-frontdoor' || n.componentId === 'gcp-cloudcdn' || n.componentId === 'gcp-cloudarmor' || n.componentId === 'traefik' || n.componentId === 'cloudflare-dns' || n.componentId === 'aws-apigateway');
            const hasDB = placedCanvasNodes.some(n => n.category.includes('Database') || n.category.includes('SQL'));
            const hasQueue = placedCanvasNodes.some(n => n.category.includes('Queue') || n.category.includes('Streaming') || n.componentId === 'gcp-cloudtasks' || n.componentId === 'rabbitmq' || n.componentId === 'kafka' || n.componentId === 'aws-kinesis');
            const hasCache = placedCanvasNodes.some(n => n.componentId.includes('redis') || n.componentId === 'upstash-redis' || n.componentId === 'gcp-memorystore');

            if (!hasAlb && placedCanvasNodes.length > 2) {
                report += '⚠️ [SPOF CRÍTICO & PERÍMETRO]: Falta un Ingress Gateway / WAF frontal (Cloudflare DNS / Traefik / API Gateway). Las peticiones van directo al cómputo sin rate-limiting ni Anycast.\n';
            } else {
                report += '✅ [INGRESS & CIBERSEGURIDAD]: Punto de entrada con proxy Anycast, terminación SSL mTLS y aislamiento de perímetro validado.\n';
            }

            if (hasDB && !hasCache && placedCanvasNodes.length > 3) {
                report += '💡 [SIMPATÍA MECÁNICA & LEY DE LITTLE]: Agrega capa de caché (Redis / Upstash). Reducir la latencia de 150ms a 5ms disminuye en un 95% el número de conexiones concurrentes en memoria (L = λW).\n';
            }

            if (hasDB) {
                report += '🛡️ [CORRECTITUD FORMAL & IDEMPOTENCIA]: Implementa claves de idempotencia (Idempotency-Key / UUIDv7) en todas las escrituras y Outbox Pattern para evitar inconsistencias en fallos de red.\n';
            }

            if (!hasQueue && placedCanvasNodes.length > 4) {
                report += '💡 [DESACOPLAMIENTO & BACKPRESSURE]: Agrega brokers asíncronos (RabbitMQ / Kafka / Kinesis) para absorber picos de tráfico sin colapsar el pool de conexiones de la base de datos.\n';
            }

            report += '\n⚡ [REGLA DE MEMORIA L1/L2]: En microservicios de alto throughput, aplica buffers contiguos (Zero-Copy) y elimina el Pointer Chasing para procesar millones de ops/seg con 0ms TBT.';
        } else {
            report += '💰 RECOMENDACIONES FINOPS, ZERO-COST & ON-PREMISE 2026 Q4:\n\n';
            const isUsingAWS = placedCanvasNodes.some(n => n.eco === 'aws');
            const isUsingGCP = placedCanvasNodes.some(n => n.eco === 'gcp');
            if (isUsingAWS || isUsingGCP) {
                report += '1. [DOMINIOS AT-COST]: Adquiere tus dominios a precio de costo ICANN en Cloudflare Registrar (~$9.77/año .com) o Porkbun para evitar sobrecostos de $25+ en renovación.\n';
                report += '2. [INGRESS $0]: Reemplaza el Application Load Balancer ($18/mo) por Traefik en tu servidor local ($0.00) o Cloudflare Workers ($0.00).\n';
                report += '3. [EGRESS ZERO-COST]: Si usas Amazon S3 / GCS, transfiere tus assets a MinIO (S3 On-Prem) o Cloudflare R2 para eliminar el 100% de los costos de salida de datos ($0.00 Egress).\n';
                report += '4. [BASES DE DATOS DEDICADAS]: Despliega PostgreSQL dedicado en disco NVMe local o usa Supabase/Turso para mantener el costo mensual en $0.00.\n';
                report += '5. [OPTIMIZACIÓN 1-CLIC]: Usa el botón "💸 Convertir a $0 / On-Prem" en la barra superior para aplicar estos reemplazos al instante.\n';
            } else {
                report += '✅ Tu arquitectura actual se encuentra optimizada para operar en modo Zero-Cost / On-Premise ($0.00 / mes) con cero facturas en la nube y márgenes brutos superiores al 95%.\n';
            }
        }
        outContent.textContent = report;
    }

    // -------------------------------------------------------------
    // FINOPS & BUSINESS UNIT ECONOMICS SIMULATOR (Throttled rAF)
    // -------------------------------------------------------------
    function setupCostSimulator() {
        const sliderMau = document.getElementById('slider-mau');
        const sliderRps = document.getElementById('slider-rps');
        const sliderStorage = document.getElementById('slider-storage');
        const sliderEgress = document.getElementById('slider-egress');
        const sliderPrice = document.getElementById('slider-price');
        const sliderPaidPct = document.getElementById('slider-paid-pct');

        let calcRaf = null;

        function recalculate() {
            const mau = parseInt(sliderMau.value, 10);
            const rps = parseInt(sliderRps.value, 10);
            const storage = parseInt(sliderStorage.value, 10);
            const egress = parseInt(sliderEgress.value, 10);
            const price = sliderPrice ? parseFloat(sliderPrice.value) : 15.0;
            const paidPct = sliderPaidPct ? parseFloat(sliderPaidPct.value) : 4.0;

            document.getElementById('val-mau').textContent = `${mau.toLocaleString()} MAU`;
            document.getElementById('val-rps').textContent = `${rps} RPS`;
            document.getElementById('val-storage').textContent = `${storage} GB`;
            document.getElementById('val-egress').textContent = `${egress} GB`;
            if (sliderPrice) document.getElementById('val-price').textContent = `$${price.toFixed(2)} / mes`;
            if (sliderPaidPct) document.getElementById('val-paid-pct').textContent = `${paidPct.toFixed(1)}%`;

            if (calcRaf) return;
            calcRaf = requestAnimationFrame(() => {
                // Zero-Cost Calculation
                let zeroCost = 0;
                let zeroAlert = 'Estás 100% dentro del Free Tier de Supabase, Vercel y Cloudflare R2 / MinIO ($0.00 / mes).';
                if (mau > 50000) {
                    zeroCost += 25; // Supabase Pro
                    zeroAlert = '⚠️ Superaste los 50,000 MAU: Supabase requiere plan Pro ($25/mo), o migrar a PostgreSQL On-Premise ($0.00).';
                }
                if (egress > 100) {
                    zeroCost += 20; // Vercel Pro o cambio a Cloudflare
                    zeroAlert = '⚠️ Superaste 100GB ancho de banda: Vercel pasa a plan Pro ($20/mo), o migrar a Cloudflare Pages ($0.00).';
                }

                // AWS Calculation
                const awsAlb = 18.0;
                const awsCompute = (rps * 3600 * 24 * 30 * 0.0000002);
                const awsStorage = storage * 0.023;
                const awsEgress = Math.max(0, egress - 100) * 0.09;
                const awsTotal = (awsAlb + awsCompute + awsStorage + awsEgress).toFixed(2);

                // GCP Calculation
                const gcpCompute = Math.max(0, (rps * 3600 * 24 * 30 - 2000000) * 0.0000004);
                const gcpStorage = storage * 0.020;
                const gcpEgress = Math.max(0, egress - 10) * 0.08;
                const gcpTotal = (gcpCompute + gcpStorage + gcpEgress).toFixed(2);

                // Azure Calculation
                const azGateway = 25.0;
                const azStorage = storage * 0.018;
                const azEgress = Math.max(0, egress - 5) * 0.087;
                const azTotal = (azGateway + azStorage + azEgress).toFixed(2);

                document.getElementById('calc-cost-zerocost').innerHTML = `$${zeroCost.toFixed(2)} <span class="period">/ mes</span>`;
                document.getElementById('calc-cost-aws').innerHTML = `$${awsTotal} <span class="period">/ mes</span>`;
                document.getElementById('calc-cost-gcp').innerHTML = `$${gcpTotal} <span class="period">/ mes</span>`;
                document.getElementById('calc-cost-azure').innerHTML = `$${azTotal} <span class="period">/ mes</span>`;

                // Unit Economics Calculations
                const paidUsers = Math.round(mau * (paidPct / 100));
                const mrr = paidUsers * price;
                const selectedCost = zeroCost;
                const costPerUser = (selectedCost / mau);
                const grossMargin = mrr > 0 ? Math.max(0, ((mrr - selectedCost) / mrr) * 100) : 100;
                const breakeven = price > 0 ? Math.ceil(selectedCost / price) : 0;
                const carbonCo2 = (mau * 0.000004 + rps * 0.0001 + storage * 0.001).toFixed(2);

                const mrrEl = document.getElementById('ue-mrr');
                if (mrrEl) mrrEl.textContent = `$${mrr.toLocaleString()} / mes`;

                const cpuEl = document.getElementById('ue-cost-per-user');
                if (cpuEl) cpuEl.textContent = `$${costPerUser.toFixed(4)}`;

                const marginEl = document.getElementById('ue-margin');
                if (marginEl) marginEl.textContent = `${grossMargin.toFixed(1)}%`;

                const breakEl = document.getElementById('ue-breakeven');
                if (breakEl) breakEl.textContent = breakeven === 0 ? '1 usuario ($0 stack)' : `${breakeven} usuarios`;

                document.getElementById('sim-alert-text').innerHTML = `${zeroAlert} Huella de carbono estimada: <strong>${carbonCo2} kg CO2e/mes</strong>.`;
                calcRaf = null;
            });
        }

        [sliderMau, sliderRps, sliderStorage, sliderEgress, sliderPrice, sliderPaidPct].forEach(s => {
            if (s) s.addEventListener('input', recalculate);
        });
        recalculate();
    }

    // -------------------------------------------------------------
    // ADVISOR ENGINE
    // -------------------------------------------------------------
    function setupAdvisorEngine() {
        let currentEnv = 'zero-cost';
        let currentUsecase = 'web-app';

        document.querySelectorAll('#adv-environment .choice-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#adv-environment .choice-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentEnv = btn.getAttribute('data-val');
                runAdvisorRecommendation(currentEnv, currentUsecase);
            });
        });

        document.querySelectorAll('#adv-usecase .choice-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#adv-usecase .choice-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentUsecase = btn.getAttribute('data-val');
                runAdvisorRecommendation(currentEnv, currentUsecase);
            });
        });

        document.getElementById('btn-run-advisor').addEventListener('click', () => runAdvisorRecommendation(currentEnv, currentUsecase));
        runAdvisorRecommendation(currentEnv, currentUsecase);
    }

    function runAdvisorRecommendation(env, usecase) {
        let title = '';
        let cost = '$0.00 / mes';
        let scale = 'Hasta 50,000 MAU';
        let components = [];
        let justification = '';
        let targetPreset = 'zero-cost-fullstack';

        if (env === 'on-premise' || usecase === 'private-ai') {
            title = 'Stack On-Premise & Private Local AI (100% Self-Hosted)';
            cost = '$0.00 Cloud (Hardware Propio)';
            scale = 'Throughput nativo NVMe';
            components = ['DuckDNS (DDNS $0)', 'Traefik SSL Proxy', 'Ollama Local LLM', 'Qdrant Vector DB', 'PostgreSQL Dedicated', 'MinIO (S3 On-Prem)', 'Grafana LGTM'];
            justification = 'Máxima privacidad, cero costos recurrentes en la nube y total control de datos.';
            targetPreset = 'onprem-enterprise-stack';
        } else if (usecase === 'serverless-data' || (env === 'aws' && usecase === 'analytics-bi')) {
            title = 'Pipeline Serverless & Analítica AWS (100% Sin Docker)';
            cost = '$15.00 - $45.00 / mes';
            scale = 'Millones de eventos / Pay-per-Use';
            components = ['AWS Route 53 DNS', 'API Gateway + Lambda', 'DynamoDB + Kinesis Streams', 'Kinesis Firehose ➔ Amazon S3', 'Amazon Athena (SQL Serverless)', 'Amazon Redshift (DWH)'];
            justification = 'Arquitectura 100% libre de servidores y Docker. Paga únicamente por cada llamada y consulta ejecutada.';
            targetPreset = 'aws-serverless-analytics';
        } else if (env === 'zero-cost') {
            if (usecase === 'analytics-bi') {
                title = 'Stack Analítico Zero-Cost (DuckDB + Cloudflare R2 + Grafana)';
                cost = '$0.00 / mes';
                scale = 'Millones de filas en Parquet';
                components = ['Cloudflare DNS ($0)', 'Cloudflare Workers', 'Cloudflare R2 ($0 Egress)', 'DuckDB (Motor SQL Embebido)', 'Grafana / Evidence'];
                justification = 'DuckDB elimina la necesidad de pagar Data Warehouses costosos como BigQuery. Procesa Parquet directamente en S3/R2 a costo cero.';
                targetPreset = 'zero-cost-analytics';
            } else {
                title = 'Stack Fullstack Zero-Cost 2026 (TanStack Start + Hono.js + Supabase + Cloudflare R2)';
                cost = '$0.00 / mes (Free Tier)';
                scale = '50,000 usuarios activos / 100GB tráfico';
                components = ['Cloudflare DNS ($0)', 'TanStack Start / Query', 'Hono.js API (Workers)', 'Supabase (PostgreSQL + pgvector)', 'Cloudflare R2 ($0 Egress)'];
                justification = 'Combina el stack más rápido y con mayor Free Tier en 2026. Cubre Auth, DB relacional, Storage de archivos y Type-Safety sin gastar un solo dólar.';
                targetPreset = 'tanstack-hono-supabase';
            }
        } else if (env === 'gcp') {
            title = 'Arquitectura Google Cloud Enterprise Multi-Tier VPC (Prod Ready)';
            cost = '$24.50 - $65.00 / mes';
            scale = '0 a 10,000 req/sec';
            components = ['Google Cloud DNS', 'Cloud Armor WAF', 'Cloud CDN', 'Cloud Run (Contenedores Serverless)', 'Cloud SQL Postgres', 'Cloud Memorystore Redis', 'BigQuery'];
            justification = 'Cloud Run ofrece el mejor cómputo serverless con 2 millones de peticiones gratuitas al mes y acceso privado a Cloud SQL y Redis.';
            targetPreset = 'gcp-enterprise-vpc';
        } else if (env === 'aws') {
            title = 'Arquitectura Empresarial AWS (VPC Multi-Subnet)';
            cost = '$65.00 / mes';
            scale = 'Alta concurrencia empresarial';
            components = ['AWS Route 53', 'CloudFront', 'Application Load Balancer', 'ECS Fargate', 'RDS Aurora PostgreSQL', 'DynamoDB'];
            justification = 'Separa capas públicas y privadas siguiendo el Well-Architected Framework de AWS.';
            targetPreset = 'aws-microservices-vpc';
        } else {
            title = 'Arquitectura Azure High Availability con Failover';
            cost = '$55.00 / mes';
            scale = 'Región East US + Standby West US';
            components = ['Azure Front Door', 'Azure Functions', 'Azure Cosmos DB', 'Blob Storage Geo-Replicado'];
            justification = 'Garantiza continuidad operativa con replicación geográfica activa-pasiva.';
            targetPreset = 'azure-media-ha';
        }

        document.getElementById('res-title').textContent = title;
        document.getElementById('res-cost').textContent = cost;
        document.getElementById('res-scale').textContent = scale;
        document.getElementById('res-justification').textContent = justification;

        const compList = document.getElementById('res-components-list');
        compList.innerHTML = '';
        components.forEach(c => compList.innerHTML += `<li><strong>${escapeHtml(c)}</strong></li>`);

        document.getElementById('btn-apply-to-canvas').onclick = () => {
            document.getElementById('tab-canvas-view').click();
            loadPreset(targetPreset);
        };
    }

    // -------------------------------------------------------------
    // EQUIVALENCY TABLE & ZERO-COST CARDS
    // -------------------------------------------------------------
    function renderEquivalencyTable() {
        const tbody = document.getElementById('eq-table-body');
        const searchInput = document.getElementById('eq-search');

        function update() {
            tbody.innerHTML = '';
            const q = (searchInput.value || '').toLowerCase().trim();
            const frag = document.createDocumentFragment();

            EQUIVALENCY_DATA.forEach(row => {
                if (q && !row.category.toLowerCase().includes(q) && !row.aws.toLowerCase().includes(q) && !row.gcp.toLowerCase().includes(q)) return;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${escapeHtml(row.category)}</strong></td>
                    <td><span class="service-pill pill-aws">${escapeHtml(row.aws)}</span></td>
                    <td><span class="service-pill pill-gcp">${escapeHtml(row.gcp)}</span></td>
                    <td><span class="service-pill pill-azure">${escapeHtml(row.azure)}</span></td>
                    <td><span class="service-pill pill-zerocost">${escapeHtml(row.zerocost)}</span></td>
                    <td><span class="service-pill pill-oss">${escapeHtml(row.oss)}</span></td>
                `;
                frag.appendChild(tr);
            });
            tbody.appendChild(frag);
        }
        searchInput.addEventListener('input', debounce(update, 80));
        update();
    }

    function renderZeroCostCards() {
        const container = document.getElementById('free-tier-cards-container');
        container.innerHTML = '';
        const frag = document.createDocumentFragment();

        ZERO_COST_TIERS_2026.forEach(item => {
            const card = document.createElement('div');
            card.className = 'free-tier-card';
            card.innerHTML = `
                <div class="card-brand-row">
                    <h3>${escapeHtml(item.name)}</h3>
                    <span class="quota-pill">${escapeHtml(item.badge)}</span>
                </div>
                <div class="tier-quota-box">
                    <strong>Cuota Gratuita (Free Tier 2026):</strong>
                    <ul>${item.limits.map(l => `<li>${escapeHtml(l)}</li>`).join('')}</ul>
                </div>
                <div class="tier-gotchas-box">
                    <strong>⚠️ Gotcha a considerar:</strong>
                    <span>${escapeHtml(item.gotchas)}</span>
                </div>
                <p style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(item.useCase)}</p>
            `;
            frag.appendChild(card);
        });
        container.appendChild(frag);
    }

    // -------------------------------------------------------------
    // LOCAL PROJECTS MANAGER (REST API PERSISTENCE)
    // -------------------------------------------------------------
    function setupProjectsManager() {
        const projModal = document.getElementById('projects-modal');

        document.getElementById('btn-open-projects-modal').addEventListener('click', () => {
            projModal.style.display = 'flex';
            loadSavedProjectsList();
        });

        document.getElementById('projects-modal-close-btn').addEventListener('click', () => {
            projModal.style.display = 'none';
        });

        document.getElementById('btn-save-current-proj').addEventListener('click', async () => {
            const name = document.getElementById('save-proj-name').value.trim() || 'Mi Arquitectura';
            const projData = {
                id: 'proj_' + Date.now(),
                name: escapeHtml(name),
                nodes: placedCanvasNodes,
                zones: placedCanvasZones,
                connections: activeConnections,
                notes: placedCanvasNotes,
                markers: placedCanvasMarkers,
                updatedAt: new Date().toISOString()
            };

            try {
                await fetch('/api/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(projData)
                });
            } catch (e) {
                const list = JSON.parse(safeStorage.get('saved_projects', '[]'));
                list.unshift(projData);
                safeStorage.set('saved_projects', JSON.stringify(list));
            }

            document.getElementById('save-proj-name').value = '';
            alert('¡Proyecto guardado con éxito!');
            loadSavedProjectsList();
        });

        // Export .arch.json file
        document.getElementById('btn-export-arch-file').addEventListener('click', () => {
            const data = {
                title: 'OpenAPM Architecture Studio Blueprint',
                version: '2026.4',
                nodes: placedCanvasNodes,
                zones: placedCanvasZones,
                connections: activeConnections,
                notes: placedCanvasNotes,
                markers: placedCanvasMarkers,
                exportedAt: new Date().toISOString()
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `arquitectura_${Date.now()}.arch.json`;
            a.click();
            URL.revokeObjectURL(url);
        });

        // Import .arch.json file
        document.getElementById('input-import-arch-file').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    applyTopologyToCanvas(data);
                    projModal.style.display = 'none';
                    alert('¡Proyecto importado correctamente al lienzo!');
                } catch (err) {
                    alert('Error al leer archivo .arch.json');
                }
            };
            reader.readAsText(file);
        });
    }

    async function loadSavedProjectsList() {
        const listDiv = document.getElementById('saved-projects-list');
        listDiv.innerHTML = 'Cargando proyectos...';

        let projects = [];
        try {
            const res = await fetch('/api/projects');
            if (res.ok) projects = await res.json();
        } catch (e) {
            projects = JSON.parse(safeStorage.get('saved_projects', '[]'));
        }

        listDiv.innerHTML = '';
        if (projects.length === 0) {
            listDiv.innerHTML = '<div style="font-size:0.75rem; color:var(--text-dim); padding:0.5rem;">No hay proyectos guardados todavía.</div>';
            return;
        }

        const frag = document.createDocumentFragment();
        projects.forEach(p => {
            const item = document.createElement('div');
            item.className = 'saved-project-item';
            const dateStr = new Date(p.updatedAt).toLocaleDateString();

            item.innerHTML = `
                <div class="proj-info-col">
                    <h5>${escapeHtml(p.name)}</h5>
                    <span>${p.nodes ? p.nodes.length : 0} nodos • Actualizado: ${dateStr}</span>
                </div>
                <div class="proj-actions-col">
                    <button class="action-btn primary-btn btn-load-proj">Cargar</button>
                    <button class="action-btn danger-btn btn-del-proj">✕</button>
                </div>
            `;

            item.querySelector('.btn-load-proj').addEventListener('click', () => {
                applyTopologyToCanvas(p);
                document.getElementById('projects-modal').style.display = 'none';
                document.getElementById('tab-canvas-view').click();
            });

            item.querySelector('.btn-del-proj').addEventListener('click', async () => {
                if (confirm(`¿Eliminar proyecto "${p.name}"?`)) {
                    try {
                        await fetch(`/api/projects/${p.id}`, { method: 'DELETE' });
                    } catch (e) {
                        let list = JSON.parse(safeStorage.get('saved_projects', '[]'));
                        list = list.filter(x => x.id !== p.id);
                        safeStorage.set('saved_projects', JSON.stringify(list));
                    }
                    loadSavedProjectsList();
                }
            });

            frag.appendChild(item);
        });
        listDiv.appendChild(frag);
    }

    // -------------------------------------------------------------
    // UNIVERSAL CODE & IaC / DOCKER / K3S EXPORTER 2026 Q4
    // -------------------------------------------------------------
    function setupExportModal() {
        document.getElementById('btn-export-diagram').addEventListener('click', () => {
            document.getElementById('export-modal').style.display = 'flex';
            updateExportCode();
        });

        document.getElementById('export-modal-close-btn').addEventListener('click', () => {
            document.getElementById('export-modal').style.display = 'none';
        });

        document.querySelectorAll('#export-modal .modal-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('#export-modal .modal-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentExportTab = tab.getAttribute('data-export-tab');
                updateExportCode();
            });
        });

        document.getElementById('btn-copy-export').addEventListener('click', () => {
            const code = document.getElementById('export-code-content').textContent;
            navigator.clipboard.writeText(code).then(() => {
                const btn = document.getElementById('btn-copy-export');
                const orig = btn.textContent;
                btn.textContent = '¡Copiado al portapapeles!';
                setTimeout(() => btn.textContent = orig, 2000);
            });
        });
    }

    function updateExportCode() {
        const codeElement = document.getElementById('export-code-content');

        if (currentExportTab === 'mermaid') {
            let mermaid = '```mermaid\nC4Container\ntitle Arquitectura del Sistema (C4 Model 2026)\n\n';
            placedCanvasZones.forEach(z => {
                mermaid += `  Boundary(${z.id}, "${z.title}") {\n`;
                const enclosed = placedCanvasNodes.filter(n => 
                    n.x >= z.x && n.x <= z.x + z.width &&
                    n.y >= z.y && n.y <= z.y + z.height
                );
                enclosed.forEach(n => {
                    mermaid += `    Container(${n.instanceId}, "${n.name}", "${n.category}", "${n.quota}")\n`;
                });
                mermaid += `  }\n\n`;
            });

            activeConnections.forEach(c => {
                mermaid += `  Rel(${c.fromInstanceId}, ${c.toInstanceId}, "${c.label || 'Llama'}", "Protocol")\n`;
            });
            mermaid += '```';
            codeElement.textContent = mermaid;
        } else if (currentExportTab === 'opentofu') {
            let tf = `# ==========================================================================\n# OpenTofu / Terraform Multi-Cloud Infrastructure (Production Ready 2026 Q4)\n# ==========================================================================\n\nterraform {\n  required_version = ">= 1.8.0"\n  required_providers {\n    google     = { source = "hashicorp/google",     version = "~> 5.30" }\n    aws        = { source = "hashicorp/aws",        version = "~> 5.40" }\n    cloudflare = { source = "cloudflare/cloudflare", version = "~> 4.30" }\n  }\n}\n\n`;

            const hasGcp = placedCanvasNodes.some(n => n.eco === 'gcp');
            const hasAws = placedCanvasNodes.some(n => n.eco === 'aws');
            const hasCloudflare = placedCanvasNodes.some(n => n.componentId === 'cloudflare-dns' || n.componentId === 'cloudflare-workers' || n.componentId === 'cloudflare-r2');

            if (hasCloudflare) {
                tf += `# Cloudflare Provider (DNS & Zero-Trust)\nprovider "cloudflare" {\n  api_token = var.cloudflare_api_token\n}\n\n`;
            }
            if (hasGcp) {
                tf += `# Google Cloud Platform Provider\nprovider "google" {\n  project = var.gcp_project_id\n  region  = var.gcp_region\n}\n\n`;
            }
            if (hasAws) {
                tf += `# Amazon Web Services Provider\nprovider "aws" {\n  region = var.aws_region\n}\n\n`;
            }

            placedCanvasNodes.forEach(n => {
                if (n.componentId === 'cloudflare-dns') {
                    tf += `resource "cloudflare_record" "${n.instanceId}_root" {\n  zone_id = var.cloudflare_zone_id\n  name    = "@"\n  value   = "192.0.2.1"\n  type    = "A"\n  proxied = true\n  ttl     = 1\n}\n\n`;
                } else if (n.componentId === 'aws-route53') {
                    tf += `resource "aws_route53_zone" "${n.instanceId}_primary" {\n  name = "app.mydomain.com"\n}\n\n`;
                } else if (n.componentId === 'gcp-clouddns') {
                    tf += `resource "google_dns_managed_zone" "${n.instanceId}_zone" {\n  name     = "app-zone"\n  dns_name = "app.mydomain.com."\n  dnssec_config { state = "on" }\n}\n\n`;
                } else if (n.componentId === 'gcp-cloudrun') {
                    tf += `resource "google_cloud_run_v2_service" "${n.instanceId}" {\n  name     = "${n.instanceId}-service"\n  location = var.gcp_region\n  ingress  = "INGRESS_TRAFFIC_ALL"\n\n  template {\n    containers {\n      image = "us-docker.pkg.dev/\${var.gcp_project_id}/app/server:latest"\n      resources {\n        limits = { cpu = "1000m", memory = "512Mi" }\n      }\n    }\n  }\n}\n\n`;
                } else if (n.componentId === 'gcp-cloudsql') {
                    tf += `resource "google_sql_database_instance" "${n.instanceId}" {\n  name             = "${n.instanceId}-pg"\n  database_version = "POSTGRES_15"\n  region           = var.gcp_region\n  settings {\n    tier = "db-f1-micro"\n    backup_configuration { enabled = true }\n  }\n}\n\n`;
                } else if (n.componentId === 'gcp-cloudarmor') {
                    tf += `resource "google_compute_security_policy" "${n.instanceId}" {\n  name        = "cloud-armor-waf"\n  description = "WAF & DDoS Rule"\n  rule {\n    action   = "allow"\n    priority = "2147483647"\n    match { versioned_expr = "SRC_IPS_V1"; config { src_ip_ranges = ["*"] } }\n  }\n}\n\n`;
                } else if (n.componentId === 'aws-lambda') {
                    tf += `resource "aws_lambda_function" "${n.instanceId}" {\n  function_name = "${n.instanceId}_handler"\n  runtime       = "nodejs20.x"\n  handler       = "index.handler"\n  role          = aws_iam_role.lambda_exec.arn\n  filename      = "dist/bundle.zip"\n}\n\n`;
                } else if (n.componentId === 'aws-dynamodb') {
                    tf += `resource "aws_dynamodb_table" "${n.instanceId}" {\n  name         = "AppEvents"\n  billing_mode = "PAY_PER_REQUEST"\n  hash_key     = "id"\n  attribute { name = "id"; type = "S" }\n}\n\n`;
                } else {
                    const cleanName = n.componentId.replace(/[^a-zA-Z0-9_]/g, '_');
                    tf += `resource "null_resource" "${n.instanceId}_${cleanName}" {\n  triggers = {\n    service_name = "${n.name}"\n    category     = "${n.category}"\n    quota_limit  = "${n.quota || 'Free Tier'}"\n  }\n}\n\n`;
                }
            });

            codeElement.textContent = tf;
        } else if (currentExportTab === 'tanstack-hono') {
            codeElement.textContent = `// ==========================================================================\n// Fullstack Modern Stack: TanStack Start + Hono.js + Supabase + Cloudflare R2\n// ==========================================================================\n\nimport { Hono } from 'hono';\nimport { createClient } from '@supabase/supabase-js';\nimport { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';\n\n// 1. Hono Web Standards API App\nconst app = new Hono();\n\n// 2. Supabase PostgreSQL & Auth Client (500MB + 50k MAU Free)\nexport const supabase = createClient(\n  process.env.SUPABASE_URL!,\n  process.env.SUPABASE_ANON_KEY!\n);\n\n// 3. Cloudflare R2 Client (S3 API Compatible with $0.00 Egress Fees)\nexport const r2Client = new S3Client({\n  region: 'auto',\n  endpoint: \`https://\${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com\`,\n  credentials: {\n    accessKeyId: process.env.R2_ACCESS_KEY_ID!,\n    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,\n  },\n});\n\napp.get('/api/health', (c) => c.json({ status: 'ok', stack: 'TanStack + Hono + Supabase 2026' }));\n\nexport default app;`;
        } else if (currentExportTab === 'docker') {
            let compose = `# ==========================================================================\n# Docker Compose v2 Production Stack (Self-Hosted On-Premise & Low-Cost)\n# ==========================================================================\nversion: '3.8'\n\nservices:\n`;

            const hasPostgres = placedCanvasNodes.some(n => n.componentId.includes('postgres') || n.componentId === 'postgresql-onprem');
            const hasMinio = placedCanvasNodes.some(n => n.componentId === 'minio');
            const hasTraefik = placedCanvasNodes.some(n => n.componentId === 'traefik');
            const hasRedis = placedCanvasNodes.some(n => n.componentId.includes('redis') || n.componentId === 'upstash-redis');
            const hasRabbit = placedCanvasNodes.some(n => n.componentId === 'rabbitmq');
            const hasQdrant = placedCanvasNodes.some(n => n.componentId === 'qdrant');
            const hasOllama = placedCanvasNodes.some(n => n.componentId === 'ollama-engine');
            const hasClickhouse = placedCanvasNodes.some(n => n.componentId === 'clickhouse');
            const hasGrafana = placedCanvasNodes.some(n => n.componentId === 'grafana');

            if (hasTraefik) {
                compose += `  traefik:\n    image: traefik:v3.0\n    container_name: traefik\n    restart: always\n    command:\n      - "--api.insecure=true"\n      - "--providers.docker=true"\n      - "--entrypoints.web.address=:80"\n      - "--entrypoints.websecure.address=:443"\n    ports:\n      - "80:80"\n      - "443:443"\n      - "8080:8080"\n    volumes:\n      - "/var/run/docker.sock:/var/run/docker.sock:ro"\n    networks:\n      - app-net\n\n`;
            }

            if (hasPostgres) {
                compose += `  postgres:\n    image: postgres:16-alpine\n    container_name: postgres-db\n    restart: unless-stopped\n    environment:\n      POSTGRES_USER: \${DB_USER:-admin}\n      POSTGRES_PASSWORD: \${DB_PASS:-secret123}\n      POSTGRES_DB: \${DB_NAME:-appdb}\n    ports:\n      - "5432:5432"\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n    networks:\n      - app-net\n\n`;
            }

            if (hasMinio) {
                compose += `  minio:\n    image: minio/minio:latest\n    container_name: minio-s3\n    restart: unless-stopped\n    command: server /data --console-address ":9001"\n    environment:\n      MINIO_ROOT_USER: \${MINIO_ROOT_USER:-minioadmin}\n      MINIO_ROOT_PASSWORD: \${MINIO_ROOT_PASSWORD:-miniopassword123}\n    ports:\n      - "9000:9000"\n      - "9001:9001"\n    volumes:\n      - miniodata:/data\n    networks:\n      - app-net\n\n`;
            }

            if (hasRedis) {
                compose += `  redis:\n    image: redis:7-alpine\n    container_name: redis-cache\n    restart: unless-stopped\n    ports:\n      - "6379:6379"\n    networks:\n      - app-net\n\n`;
            }

            if (hasRabbit) {
                compose += `  rabbitmq:\n    image: rabbitmq:3-management-alpine\n    container_name: rabbitmq-broker\n    restart: unless-stopped\n    ports:\n      - "5672:5672"\n      - "15672:15672"\n    networks:\n      - app-net\n\n`;
            }

            if (hasQdrant) {
                compose += `  qdrant:\n    image: qdrant/qdrant:latest\n    container_name: qdrant-vector\n    restart: unless-stopped\n    ports:\n      - "6333:6333"\n      - "6334:6334"\n    volumes:\n      - qdrantdata:/qdrant/storage\n    networks:\n      - app-net\n\n`;
            }

            if (hasOllama) {
                compose += `  ollama:\n    image: ollama/ollama:latest\n    container_name: ollama-llm\n    restart: unless-stopped\n    ports:\n      - "11434:11434"\n    volumes:\n      - ollamadata:/root/.ollama\n    networks:\n      - app-net\n\n`;
            }

            if (hasClickhouse) {
                compose += `  clickhouse:\n    image: clickhouse/clickhouse-server:latest\n    container_name: clickhouse-olap\n    restart: unless-stopped\n    ports:\n      - "8123:8123"\n      - "9000:9000"\n    volumes:\n      - chdata:/var/lib/clickhouse\n    networks:\n      - app-net\n\n`;
            }

            if (hasGrafana) {
                compose += `  grafana:\n    image: grafana/grafana:latest\n    container_name: grafana-dash\n    restart: unless-stopped\n    ports:\n      - "3001:3000"\n    networks:\n      - app-net\n\n`;
            }

            compose += `networks:\n  app-net:\n    driver: bridge\n\nvolumes:\n  pgdata:\n  miniodata:\n  qdrantdata:\n  ollamadata:\n  chdata:\n`;
            codeElement.textContent = compose;
        } else if (currentExportTab === 'k8s') {
            codeElement.textContent = `# ==========================================================================\n# Kubernetes (K3s / Talos) Production Manifests (2026 Q4)\n# ==========================================================================\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: app-deployment\n  labels:\n    app: app-core\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: app-core\n  template:\n    metadata:\n      labels:\n        app: app-core\n    spec:\n      containers:\n        - name: app\n          image: myapp:latest\n          ports:\n            - containerPort: 3000\n          resources:\n            limits:\n              cpu: "500m"\n              memory: "256Mi"\n            requests:\n              cpu: "100m"\n              memory: "128Mi"\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: app-service\nspec:\n  selector:\n    app: app-core\n  ports:\n    - protocol: TCP\n      port: 80\n      targetPort: 3000\n  type: ClusterIP\n---\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: app-ingress\n  annotations:\n    traefik.ingress.kubernetes.io/router.entrypoints: websecure\n    cert-manager.io/cluster-issuer: letsencrypt-prod\nspec:\n  rules:\n    - host: app.local.lan\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: app-service\n                port:\n                  number: 80`;
        } else if (currentExportTab === 'python-rag') {
            codeElement.textContent = `# ==========================================================================\n# Python + FastAPI + DuckDB + LangChain Agentic RAG Pipeline ($0 Stack 2026)\n# ==========================================================================\n\nimport duckdb\nfrom fastapi import FastAPI\n\napp = FastAPI(title="Agentic AI RAG & Analytics Service")\n\n# Initialize embedded SQL OLAP Engine\ncon = duckdb.connect()\ncon.execute("INSTALL httpfs; LOAD httpfs;")\n\n@app.get("/api/query-parquet")\ndef query_analytics(category: str = "all"):\n    query = """\n        SELECT \n            event_name,\n            count(*) as total_count,\n            avg(duration_ms) as latency\n        FROM read_parquet('s3://analytics-bucket/events/*.parquet')\n        GROUP BY event_name\n        ORDER BY total_count DESC\n        LIMIT 25;\n    """\n    df = con.execute(query).df()\n    return df.to_dict(orient="records")`;
        } else if (currentExportTab === 'lambda-ts') {
            codeElement.textContent = `// AWS Lambda Serverless Handler in TypeScript (100% Sin Docker)\nimport { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';\nimport { DynamoDBClient } from '@aws-sdk/client-dynamodb';\nimport { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';\n\nconst client = new DynamoDBClient({});\nconst ddbDocClient = DynamoDBDocumentClient.from(client);\n\nexport const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {\n  const body = event.body ? JSON.parse(event.body) : {};\n  await ddbDocClient.send(new PutCommand({\n    TableName: process.env.TABLE_NAME || 'Events',\n    Item: { id: \`evt_\${Date.now()}\`, ...body, createdAt: new Date().toISOString() }\n  }));\n  return { statusCode: 200, body: JSON.stringify({ success: true }) };\n};`;
        } else if (currentExportTab === 'github-ci') {
            codeElement.textContent = `name: Production CI/CD Pipeline 2026\non:\n  push:\n    branches: [main]\n\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Checkout repository\n        uses: actions/checkout@v4\n\n      - name: Setup OpenTofu\n        uses: opentofu/setup-opentofu@v1\n\n      - name: OpenTofu Init & Apply\n        run: |\n          tofu init\n          tofu apply -auto-approve`;
        } else {
            codeElement.textContent = JSON.stringify({ title: "Architecture Blueprint", version: "2026.4", nodes: placedCanvasNodes, zones: placedCanvasZones, connections: activeConnections, notes: placedCanvasNotes, markers: placedCanvasMarkers }, null, 2);
        }
    }

    // -------------------------------------------------------------
    // EXPORT HIGH RES IMAGE (PNG & SVG)
    // -------------------------------------------------------------
    function exportDiagramImage() {
        const nodes = placedCanvasNodes;
        const zones = placedCanvasZones;

        if (nodes.length === 0 && zones.length === 0) {
            alert('El lienzo está vacío. Agrega componentes antes de exportar imagen.');
            return;
        }

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        nodes.forEach(n => {
            minX = Math.min(minX, n.x);
            minY = Math.min(minY, n.y);
            maxX = Math.max(maxX, n.x + 260);
            maxY = Math.max(maxY, n.y + 110);
        });
        zones.forEach(z => {
            minX = Math.min(minX, z.x);
            minY = Math.min(minY, z.y);
            maxX = Math.max(maxX, z.x + z.width);
            maxY = Math.max(maxY, z.y + z.height);
        });

        const padding = 50;
        const width = Math.max(850, maxX - minX + padding * 2);
        const height = Math.max(520, maxY - minY + padding * 2);

        const canvas = document.createElement('canvas');
        canvas.width = width * 2;
        canvas.height = height * 2;
        const ctx = canvas.getContext('2d');
        ctx.scale(2, 2);

        // Background based on current theme
        ctx.fillStyle = currentTheme === 'light' ? '#f8fafc' : (currentTheme === 'oled' ? '#000000' : '#060911');
        ctx.fillRect(0, 0, width, height);

        // Zones
        zones.forEach(z => {
            const zx = z.x - minX + padding;
            const zy = z.y - minY + padding;
            ctx.strokeStyle = currentTheme === 'light' ? 'rgba(15, 23, 42, 0.2)' : 'rgba(255, 255, 255, 0.2)';
            ctx.fillStyle = currentTheme === 'light' ? 'rgba(2, 132, 199, 0.03)' : 'rgba(255, 255, 255, 0.02)';
            ctx.fillRect(zx, zy, z.width, z.height);
            ctx.strokeRect(zx, zy, z.width, z.height);

            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText(z.title.toUpperCase(), zx + 12, zy - 4);
        });

        // Connections
        activeConnections.forEach(c => {
            const s = nodes.find(n => n.instanceId === c.fromInstanceId);
            const t = nodes.find(n => n.instanceId === c.toInstanceId);
            if (!s || !t) return;

            const x1 = s.x + 245 - minX + padding;
            const y1 = s.y + 46 - minY + padding;
            const x2 = t.x - minX + padding;
            const y2 = t.y + 46 - minY + padding;

            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            const dx = Math.abs(x2 - x1);
            const offset = Math.max(dx * 0.45, 40);
            ctx.bezierCurveTo(x1 + offset, y1, x2 - offset, y2, x2, y2);
            ctx.stroke();

            if (c.label) {
                ctx.fillStyle = '#7dd3fc';
                ctx.font = '10px monospace';
                ctx.fillText(c.label, (x1 + x2) / 2 - 15, (y1 + y2) / 2 - 10);
            }
        });

        // Nodes
        nodes.forEach(n => {
            const nx = n.x - minX + padding;
            const ny = n.y - minY + padding;

            ctx.fillStyle = currentTheme === 'light' ? 'rgba(255, 255, 255, 0.98)' : 'rgba(20, 28, 46, 0.96)';
            ctx.strokeStyle = currentTheme === 'light' ? 'rgba(15, 23, 42, 0.15)' : 'rgba(255, 255, 255, 0.12)';
            ctx.lineWidth = 1;
            ctx.fillRect(nx, ny, 245, 92);
            ctx.strokeRect(nx, ny, 245, 92);

            ctx.fillStyle = currentTheme === 'light' ? '#0f172a' : '#f1f5f9';
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText(n.name, nx + 38, ny + 26);

            ctx.fillStyle = '#38bdf8';
            ctx.font = '9px sans-serif';
            ctx.fillText(n.category.toUpperCase(), nx + 38, ny + 40);

            ctx.fillStyle = '#10b981';
            ctx.font = 'bold 10px monospace';
            ctx.fillText(`${n.cost} • ${n.quota || ''}`, nx + 12, ny + 76);
        });

        // Notes
        placedCanvasNotes.forEach(note => {
            const noteX = note.x - minX + padding;
            const noteY = note.y - minY + padding;
            ctx.fillStyle = '#fef08a';
            ctx.strokeStyle = '#fde047';
            ctx.fillRect(noteX, noteY, 200, 110);
            ctx.strokeRect(noteX, noteY, 200, 110);

            ctx.fillStyle = '#713f12';
            ctx.font = '10px sans-serif';
            ctx.fillText(note.text.substring(0, 50), noteX + 10, noteY + 25);
        });

        const a = document.createElement('a');
        a.download = `arquitectura_${Date.now()}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
    }

    // -------------------------------------------------------------
    // KEYBOARD SHORTCUTS & ACCESSIBILITY
    // -------------------------------------------------------------
    function setupKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-backdrop').forEach(m => m.style.display = 'none');
                const menu = document.getElementById('presets-menu');
                if (menu) menu.style.display = 'none';
                const tMenu = document.getElementById('theme-dropdown-menu');
                if (tMenu) tMenu.style.display = 'none';
                return;
            }

            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            // Undo (Ctrl+Z) and Redo (Ctrl+Y or Ctrl+Shift+Z)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    redo();
                } else {
                    undo();
                }
                return;
            }

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
                e.preventDefault();
                redo();
                return;
            }

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                document.getElementById('btn-open-projects-modal').click();
            }
        });
    }

    function openServiceModal(service) {
        const modal = document.getElementById('component-modal');
        document.getElementById('modal-title').textContent = service.name;
        document.getElementById('modal-category').textContent = service.category;
        document.getElementById('modal-description').textContent = service.desc;

        document.getElementById('modal-badges').innerHTML = `
            <span class="cap-tag" style="color: var(--accent-emerald); border-color: var(--accent-emerald);">${escapeHtml(service.cost)}</span>
            <span class="cap-tag" style="color: var(--accent-cyan); border-color: var(--accent-cyan);">${escapeHtml(service.eco.toUpperCase())}</span>
            <span class="cap-tag" style="color: #6ee7b7; border-color: rgba(16, 185, 129, 0.4);">${escapeHtml(service.quota || 'Free Tier')}</span>
        `;

        document.getElementById('modal-add-to-canvas-btn').onclick = () => {
            document.getElementById('tab-canvas-view').click();
            addServiceNodeToCanvas(service.id, 250 + Math.random() * 200, 180 + Math.random() * 120);
            modal.style.display = 'none';
        };

        modal.style.display = 'flex';
    }

    document.getElementById('modal-close-btn').addEventListener('click', () => {
        document.getElementById('component-modal').style.display = 'none';
    });
})();
