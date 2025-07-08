/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, '../src/i18n');
const outputFile = path.join(__dirname, '../src/i18n/resources.generated.ts');

function getJsonFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter(file => file.endsWith('.json'));
}

function generateResourcesObject() {
  const langs = fs.readdirSync(i18nDir).filter(entry => {
    const fullPath = path.join(i18nDir, entry);
    return fs.statSync(fullPath).isDirectory();
  });

  const imports = [];
  const resources = [];

  langs.forEach(lang => {
    const langDir = path.join(i18nDir, lang);
    const files = getJsonFiles(langDir);
    const entries = [];

    files.forEach(file => {
      const ns = path.basename(file, '.json');
      const importName = `${lang}_${ns}`.replace(/-/g, '_');
      const importPath = `./${lang}/${file}`;
      imports.push(`import ${importName} from '${importPath}';`);
      entries.push(`    ${JSON.stringify(ns)}: ${importName}`);
    });

    if (entries.length) {
      resources.push(`  ${JSON.stringify(lang)}: {\n${entries.join(',\n')}\n  }`);
    }
  });

  return `${imports.join('\n')}

import type { Resource } from 'i18next';

export const resources = {
${resources.join(',\n')}
} satisfies Resource;

export const supportedLngs = Object.keys(resources);
export const fallbackLng = 'en';
`;
}

fs.writeFileSync(outputFile, generateResourcesObject(), 'utf-8');
console.log(`✅ Fichier généré : ${outputFile}`);