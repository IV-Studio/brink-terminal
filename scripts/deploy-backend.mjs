import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const app = 'pacific-wildwood-12937';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
if (git('status', '--porcelain', '--', 'backend', 'scripts/deploy-backend.mjs')) {
  throw new Error('Commit backend and deployment script changes before deploying.');
}
const revision = git('rev-parse', 'HEAD');
const archive = execFileSync('git', ['archive', 'HEAD:backend']);
const directory = mkdtempSync(join(tmpdir(), 'brink-backend-deploy-'));
try {
  execFileSync('git', ['clone', '--quiet', `https://git.heroku.com/${app}.git`, directory], { stdio: 'inherit' });
  for (const name of readdirSync(directory)) {
    if (name !== '.git') rmSync(join(directory, name), { recursive: true, force: true });
  }
  execFileSync('tar', ['-x', '-C', directory], { input: archive });
  writeFileSync(join(directory, '.brink-source-revision'), revision + '\n');
  execFileSync('git', ['-C', directory, 'add', '-A'], { stdio: 'inherit' });
  execFileSync('git', ['-C', directory, 'commit', '-qm', `Deploy backend from IV-Studio/brink-terminal ${revision}`], { stdio: 'inherit' });
  execFileSync('git', ['-C', directory, 'push', 'origin', 'HEAD:main'], { stdio: 'inherit' });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
