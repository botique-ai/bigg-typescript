const defaultCompilePaths = [
  './src/**/*.ts',
  '!./src/**/*.d.ts',
  './src/**/*.tsx',
  './typings/**/*.d.ts'
];

export function getCompilePaths(paths?) {
  return paths || defaultCompilePaths;
}