import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const version = JSON.parse(readFileSync('package.json')).version;
const lock = JSON.parse(readFileSync('package-lock.json'));
const commit = process.env.RELEASE_COMMIT;
if (version !== '1.0.0-beta.1' || lock.version !== version || lock.packages[''].version !== version)
  throw new Error('Versão inesperada');
if (
  !/^[0-9a-f]{40}$/.test(commit ?? '') ||
  execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim() !== commit
)
  throw new Error('Commit não fixado');
const names = [`meu-dinheiro-${version}-linux-x64.deb`];
if (readdirSync('release-assets').sort().join('\n') !== [...names].sort().join('\n'))
  throw new Error('Conjunto de instaladores inesperado');
const checksums = names
  .map(
    (name) =>
      `${createHash('sha256')
        .update(readFileSync(`release-assets/${name}`))
        .digest('hex')}  ${name}\n`,
  )
  .join('');
writeFileSync('release-assets/SHA256SUMS', checksums);
writeFileSync(
  'release-assets/RELEASE-NOTES.md',
  `${readFileSync('CHANGELOG.md', 'utf8')}\nCommit: \`${commit}\`\nTag prevista: \`v${version}\`\n\n## SHA-256\n\n\`\`\`text\n${checksums}\`\`\`\n`,
);
