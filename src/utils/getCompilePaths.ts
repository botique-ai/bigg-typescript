const defaultCompilePaths = [
  './src/**/*.ts',
  './src/**/*.tsx',
  './typings/**/*.d.ts'
];

export function getCompilePaths(paths?) {
  return paths || defaultCompilePaths;
}