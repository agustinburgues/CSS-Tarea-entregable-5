const fs = require('fs');
const path = require('path');

const newHead = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
`;

function getHeader(depth) {
    const prefix = depth === 1 ? '../' : '';
    return `<header class="header">
        <div class="header__container">
            <a href="${prefix}index.html" class="header__logo">
                <img src="${prefix}img/Conquer-Blocks-logo.avif" alt="Logotipo de Conquer Academy">
                <h1>Conquer Academy</h1>
            </a>
            <nav class="header__nav">
                <ul>
                    <li><a href="${prefix}index.html">Home</a></li>
                    <li><a href="${prefix}quienes-somos.html">Quiénes somos</a></li>
                    <li><a href="${prefix}cursos.html">Cursos</a></li>
                    <li><a href="${prefix}blog.html">Blog</a></li>
                    <li><a href="${prefix}registro.html" class="btn btn--secondary">Registro</a></li>
                    <li><a href="${prefix}login.html" class="btn btn--primary">Login</a></li>
                    <li><a href="${prefix}contacto.html">Contacto</a></li>
                </ul>
            </nav>
        </div>
    </header>`;
}

function getFooter(depth) {
    const prefix = depth === 1 ? '../' : '';
    return `<footer class="footer">
        <div class="footer__container">
            <h3>Conquer Academy</h3>
            <p>Conquistando tus metas paso a paso.</p>
            <div class="footer__links">
                <a href="${prefix}quienes-somos.html">Quiénes somos</a>
                <a href="${prefix}cursos.html">Cursos</a>
                <a href="${prefix}blog.html">Blog</a>
                <a href="${prefix}contacto.html">Contacto</a>
                <a href="${prefix}aviso-legal.html">Aviso legal</a>
            </div>
            <div class="footer__copy">
                <p>© 2026 Conquer Academy. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>`;
}

function processHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const isSubdir = filePath.includes('\\blog\\') || filePath.includes('\\cursos\\') || filePath.includes('/blog/') || filePath.includes('/cursos/');
    const depth = isSubdir ? 1 : 0;
    const prefix = depth === 1 ? '../' : '';

    // Fix head
    content = content.replace(/<meta charset="UTF-8">[\s\S]*?(?=<\/head>)/i, 
        `${newHead}    <link rel="stylesheet" href="${prefix}css/main.css">\n`);
        
    // Fix header
    content = content.replace(/<header>[\s\S]*?<\/header>/i, getHeader(depth));
    
    // Fix footer
    content = content.replace(/<footer>[\s\S]*?<\/footer>/i, getFooter(depth));

    // Fix <main> to have a generic container wrapper for non-index pages
    if (!filePath.endsWith('index.html')) {
        content = content.replace(/<main>/i, '<main class="section"><div class="section__container">');
        content = content.replace(/<\/main>/i, '</div></main>');
    }

    fs.writeFileSync(filePath, content);
}

function walk(dir) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        if (file === 'node_modules') continue;
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walk(filePath);
        } else if (filePath.endsWith('.html') && !filePath.endsWith('index.html')) { // skip index as it was manually done
            processHtmlFile(filePath);
        }
    }
}

walk(__dirname);
console.log('HTML files updated!');
