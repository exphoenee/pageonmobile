import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

// NOTE: type-aware linting of .ts files is paused because typescript-eslint
// does not yet support TypeScript 7. `tsc --noEmit` (npm run typecheck) is the
// type/correctness gate meanwhile; re-add @typescript-eslint once it ships
// TS 7 support. ESLint here lints the JS tooling files only.
export default [
  { ignores: ['dist/**', 'node_modules/**', '**/*.ts'] },
  js.configs.recommended,
  prettier,
];
