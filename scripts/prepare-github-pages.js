const fs = require('fs');
const path = require('path');

const output = path.join('dist', 'charts-library');
const index = path.join(output, 'index.html');

fs.copyFileSync(index, path.join(output, '404.html'));
fs.writeFileSync(path.join(output, '.nojekyll'), '');
