const fs = require('fs');
const path = require('path');

const scssDir = path.join(__dirname, 'scss');

function addUse(filePath, useStatement) {
    let content = fs.readFileSync(filePath, 'utf-8');
    if (!content.includes(useStatement)) {
        content = `${useStatement}\n\n` + content;
        fs.writeFileSync(filePath, content);
    }
}

function processDir(dir) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            processDir(filePath);
        } else if (filePath.endsWith('.scss')) {
            if (filePath.endsWith('_variables.scss') || filePath.endsWith('main.scss')) continue;
            
            let useStatement;
            if (filePath.includes('base')) {
                useStatement = `@use 'variables' as *;`;
            } else {
                useStatement = `@use '../base/variables' as *;`;
            }
            addUse(filePath, useStatement);
        }
    }
}

processDir(scssDir);
console.log('Fixed SCSS files!');
