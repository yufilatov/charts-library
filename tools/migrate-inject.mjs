import fs from 'fs';
import path from 'path';

function walk(dir, out = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full, out);
        else if (entry.name.endsWith('.ts')) out.push(full);
    }
    return out;
}

function scanTo(src, start, open, close) {
    let depth = 0;
    let started = false;
    for (let i = start; i < src.length; i++) {
        const c = src[i];
        if (c === open) {
            depth++;
            started = true;
        } else if (c === close) {
            depth--;
            if (started && depth === 0) return i;
        }
    }
    return -1;
}

function splitParams(paramSrc) {
    const parts = [];
    let current = '';
    let angle = 0;
    let paren = 0;
    let brace = 0;
    let bracket = 0;
    for (const c of paramSrc) {
        if (c === '<') angle++;
        else if (c === '>') angle--;
        else if (c === '(') paren++;
        else if (c === ')') paren--;
        else if (c === '{') brace++;
        else if (c === '}') brace--;
        else if (c === '[') bracket++;
        else if (c === ']') bracket--;
        if (c === ',' && !angle && !paren && !brace && !bracket) {
            parts.push(current);
            current = '';
            continue;
        }
        current += c;
    }
    if (current.trim()) parts.push(current);
    return parts;
}

function parseParam(raw) {
    const text = raw.trim().replace(/\/\*[\s\S]*?\*\//g, '').trim();
    if (!text || text.startsWith('@')) return null;
    const match = text.match(/^(?:(public|private|protected)\s+)?(?:readonly\s+)?([A-Za-z_]\w*)\s*:\s*([\s\S]+)$/);
    if (!match) return null;
    const type = match[3].trim().replace(/=[\s\S]*$/, '').trim();
    if (!/^[A-Z]/.test(type)) return null;
    return { access: match[1] || 'private', name: match[2], type };
}

function rewriteBareNames(body, names) {
    let next = body;
    for (const name of names) {
        const re = new RegExp(`(?<![\\w.])${name}(?![\\w])`, 'g');
        next = next.replace(re, `this.${name}`);
    }
    return next;
}

function ensureInjectImport(src) {
    const core = src.match(/import\s*\{([^}]+)\}\s*from\s*['"]@angular\/core['"];/);
    if (!core) {
        const eol = src.includes('\r\n') ? '\r\n' : '\n';
        return `import { inject } from '@angular/core';${eol}` + src;
    }
    const parts = core[1].split(',').map(s => s.trim()).filter(Boolean);
    if (parts.includes('inject')) return src;
    parts.push('inject');
    const quote = core[0].includes('"') ? '"' : "'";
    return src.replace(core[0], `import { ${parts.join(', ')} } from ${quote}@angular/core${quote};`);
}

function transform(src) {
    const ctor = /constructor\s*\(/g;
    let match;
    let result = src;
    let changed = false;
    while ((match = ctor.exec(result))) {
        const openParen = match.index + match[0].length - 1;
        const closeParen = scanTo(result, openParen, '(', ')');
        if (closeParen < 0) break;
        let i = closeParen + 1;
        while (/\s/.test(result[i])) i++;
        if (result[i] !== '{') {
            ctor.lastIndex = closeParen + 1;
            continue;
        }
        const closeBrace = scanTo(result, i, '{', '}');
        if (closeBrace < 0) break;

        const params = splitParams(result.slice(openParen + 1, closeParen)).map(parseParam);
        if (!params.length || params.some(param => !param)) {
            ctor.lastIndex = closeBrace + 1;
            continue;
        }

        const before = result.slice(0, match.index);
        if (!/@(Component|Directive|Injectable|Pipe)\s*\(/.test(before)) {
            ctor.lastIndex = closeBrace + 1;
            continue;
        }

        const body = result.slice(i + 1, closeBrace);
        const rewritten = rewriteBareNames(body, params.map(param => param.name));
        const indent = (result.slice(result.lastIndexOf('\n', match.index) + 1, match.index).match(/^\s*/) || [''])[0];
        const fieldIndent = indent;
        const eol = result.includes('\r\n') ? '\r\n' : '\n';
        const fields = params.map(param => `${fieldIndent}${param.access} readonly ${param.name} = inject(${param.type});`).join(eol);
        const hasBody = rewritten.trim().length > 0;
        const replacement = hasBody
            ? `${fields}${eol}${eol}${indent}constructor() {${rewritten}}`
            : fields;

        result = result.slice(0, match.index) + replacement + result.slice(closeBrace + 1);
        changed = true;
        ctor.lastIndex = match.index + replacement.length;
    }
    if (!changed) return null;
    return ensureInjectImport(result);
}

for (const file of walk('src')) {
    const src = fs.readFileSync(file, 'utf8');
    const next = transform(src);
    if (!next || next === src) continue;
    fs.writeFileSync(file, next);
    console.log(path.relative('src', file));
}
