const http = require('http');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const zlib = require('zlib');
const util = require('util');

const gzipAsync = util.promisify(zlib.gzip);
const deflateAsync = util.promisify(zlib.deflate);

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const BUILD_DIR = path.join(__dirname, 'build');
const LOGOS_DIR = path.join(__dirname, 'logos');
const DATA_DIR = path.join(__dirname, 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const PROJECTS_TMP_FILE = path.join(DATA_DIR, 'projects.json.tmp');

// Ensure data directory exists on bootstrap
(async () => {
    try {
        await fsp.mkdir(DATA_DIR, { recursive: true });
        try {
            await fsp.access(PROJECTS_FILE);
        } catch {
            await fsp.writeFile(PROJECTS_FILE, JSON.stringify([], null, 2), 'utf8');
        }
    } catch (err) {
        console.error('Error inicializando directorio de datos:', err);
    }
})();

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp'
};

// Async non-blocking project storage with atomic writes
async function readProjectsAsync() {
    try {
        const raw = await fsp.readFile(PROJECTS_FILE, 'utf8');
        return JSON.parse(raw) || [];
    } catch (e) {
        return [];
    }
}

async function writeProjectsAtomicAsync(projects) {
    const data = JSON.stringify(projects, null, 2);
    await fsp.writeFile(PROJECTS_TMP_FILE, data, 'utf8');
    await fsp.rename(PROJECTS_TMP_FILE, PROJECTS_FILE);
}

// Send compressed response helper
async function sendCompressedResponse(req, res, statusCode, contentType, data, extraHeaders = {}) {
    const acceptEncoding = req.headers['accept-encoding'] || '';
    const shouldCompress = contentType.includes('text') || contentType.includes('json') || contentType.includes('javascript') || contentType.includes('svg');

    let payload = data;
    const headers = {
        'Content-Type': contentType,
        'Vary': 'Accept-Encoding',
        ...extraHeaders
    };

    if (shouldCompress && typeof data === 'string') {
        payload = Buffer.from(data, 'utf8');
    }

    if (shouldCompress && payload.length > 512) {
        if (acceptEncoding.includes('gzip')) {
            headers['Content-Encoding'] = 'gzip';
            payload = await gzipAsync(payload);
        } else if (acceptEncoding.includes('deflate')) {
            headers['Content-Encoding'] = 'deflate';
            payload = await deflateAsync(payload);
        }
    }

    headers['Content-Length'] = payload.length;
    res.writeHead(statusCode, headers);
    res.end(payload);
}

const server = http.createServer(async (req, res) => {
    // Security & CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const [urlPath] = req.url.split('?');

    // -------------------------------------------------------------
    // REST API ROUTES: /api/projects
    // -------------------------------------------------------------
    if (urlPath.startsWith('/api/projects')) {
        // GET /api/projects
        if (req.method === 'GET' && urlPath === '/api/projects') {
            try {
                const projects = await readProjectsAsync();
                await sendCompressedResponse(req, res, 200, 'application/json; charset=UTF-8', JSON.stringify(projects), {
                    'Cache-Control': 'no-cache, must-revalidate'
                });
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to load projects' }));
            }
            return;
        }

        // POST /api/projects (Create / Update)
        if (req.method === 'POST' && urlPath === '/api/projects') {
            let body = '';
            const maxPayload = 10 * 1024 * 1024; // 10MB limit

            req.on('data', chunk => {
                body += chunk.toString();
                if (body.length > maxPayload) {
                    res.writeHead(413, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Payload too large' }));
                    req.destroy();
                }
            });

            req.on('end', async () => {
                try {
                    const newProj = JSON.parse(body);
                    const projects = await readProjectsAsync();

                    if (!newProj.id) {
                        newProj.id = 'proj_' + Date.now();
                    }
                    newProj.updatedAt = new Date().toISOString();

                    const existingIdx = projects.findIndex(p => p.id === newProj.id);
                    if (existingIdx >= 0) {
                        projects[existingIdx] = newProj;
                    } else {
                        projects.unshift(newProj);
                    }

                    await writeProjectsAtomicAsync(projects);
                    await sendCompressedResponse(req, res, 200, 'application/json; charset=UTF-8', JSON.stringify({ success: true, project: newProj }));
                } catch (err) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
                }
            });
            return;
        }

        // DELETE /api/projects/:id
        if (req.method === 'DELETE' && urlPath.startsWith('/api/projects/')) {
            const projId = urlPath.replace('/api/projects/', '');
            try {
                let projects = await readProjectsAsync();
                projects = projects.filter(p => p.id !== projId);
                await writeProjectsAtomicAsync(projects);
                await sendCompressedResponse(req, res, 200, 'application/json; charset=UTF-8', JSON.stringify({ success: true, deletedId: projId }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to delete project' }));
            }
            return;
        }
    }

    // -------------------------------------------------------------
    // REST API ROUTES: /api/ai/generate (High-Performance AI Proxy)
    // -------------------------------------------------------------
    if (urlPath === '/api/ai/generate' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const payload = JSON.parse(body || '{}');
                const provider = payload.provider || 'opencode';
                const model = payload.model || 'deepseek-v4-flash';
                const prompt = payload.prompt || '';
                const apiKey = payload.apiKey || 'sk-v9lFQF3jnR0f5LSqPD7mKjdHUQSqv6Ndr9NLYjgHktWAud9bPtDFzjZyxVw8TmcL';

                if (!prompt) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Prompt is required' }));
                    return;
                }

                // 1. OpenCode Go (Default & Ultra-Fast)
                if (provider === 'opencode' || !payload.provider) {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 35000);

                    try {
                        const apiRes = await fetch('https://opencode.ai/zen/go/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${apiKey}`
                            },
                            body: JSON.stringify({
                                model: model,
                                messages: [
                                    { role: 'system', content: 'Eres un Principal Cloud & Observability Solutions Architect. Diseña la arquitectura solicitada y emite SIEMPRE al final el bloque JSON de topología con {"zones": [], "nodes": [{"id": "n1", "name": "...", "category": "...", "eco": "...", "x": 100, "y": 100}], "connections": [{"from": 0, "to": 1, "label": "HTTPS"}]} dentro de ```json ... ```.' },
                                    { role: 'user', content: prompt }
                                ],
                                temperature: 0.2,
                                max_tokens: 2200
                            }),
                            signal: controller.signal
                        });

                        clearTimeout(timeoutId);

                        if (apiRes.ok) {
                            const data = await apiRes.json();
                            let text = data.choices?.[0]?.message?.content || '';
                            text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

                            let topology = null;
                            const match = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/(\{[\s\S]*"nodes"[\s\S]*\})/);
                            if (match) {
                                try {
                                    topology = JSON.parse(match[1] || match[0]);
                                } catch (e) {}
                            }

                            await sendCompressedResponse(req, res, 200, 'application/json; charset=UTF-8', JSON.stringify({
                                success: true,
                                provider: 'opencode',
                                model: model,
                                rawText: text,
                                topology: topology
                            }));
                            return;
                        } else {
                            const errTxt = await apiRes.text();
                            res.writeHead(apiRes.status, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: errTxt }));
                            return;
                        }
                    } catch (fetchErr) {
                        clearTimeout(timeoutId);
                        res.writeHead(504, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'AI Gateway Timeout: ' + fetchErr.message }));
                        return;
                    }
                }

                // Fallback / Unsupported provider
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Unsupported provider: ' + provider }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }
    // -------------------------------------------------------------
    let reqUrl = urlPath;
    if (reqUrl === '/') reqUrl = '/index.html';

    let filePath;
    if (reqUrl.startsWith('/build/')) {
        filePath = path.join(BUILD_DIR, reqUrl.replace('/build/', ''));
    } else if (reqUrl.startsWith('/logos/')) {
        filePath = path.join(LOGOS_DIR, reqUrl.replace('/logos/', ''));
    } else {
        filePath = path.join(PUBLIC_DIR, reqUrl);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isImage = ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.svg' || ext === '.ico' || ext === '.webp';

    try {
        const content = await fsp.readFile(filePath);
        const cacheControl = isImage 
            ? 'public, max-age=86400, stale-while-revalidate=604800' 
            : 'public, max-age=3600, stale-while-revalidate=86400';

        await sendCompressedResponse(req, res, 200, contentType, content, {
            'Cache-Control': cacheControl
        });
    } catch (err) {
        if (err.code === 'ENOENT') {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
            res.end('404 Not Found: ' + reqUrl);
        } else {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
            res.end('500 Internal Server Error: ' + err.code);
        }
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Cloud & APM Architecture Studio Pro 2026 is LIVE!`);
    console.log(`🌐 Local URL:      http://localhost:${PORT}`);
    console.log(`💾 REST API:       http://localhost:${PORT}/api/projects`);
    console.log(`⚡ Performance:   Non-Blocking Async I/O & Atomic Storage`);
    console.log(`======================================================\n`);
});
