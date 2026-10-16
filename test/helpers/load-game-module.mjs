import { readFileSync } from 'node:fs';
import ts from 'typescript';

// Exercise real game code without loading the DOM, Rive, or the entire startup graph.
// Only explicitly supplied boundary dependencies may be substituted.
export function loadGameModule(path, dependencies = {}) {
  const filename = new URL('../../' + path, import.meta.url);
  const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename.pathname,
  });
  const module = { exports: {} };
  const require = name => {
    if (!Object.hasOwn(dependencies, name)) throw new Error('Unconfigured game dependency: ' + name);
    return dependencies[name];
  };
  new Function('require', 'module', 'exports', outputText)(require, module, module.exports);
  return module.exports;
}
