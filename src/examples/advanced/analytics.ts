import { Type } from 'mural-schema';
import analyze, { Route } from '../../analyze';

const printRoute = (route: Route<Type>) => [
  `${route.method.toUpperCase()} ${route.path} ${
    route.deprecated ? '(deprecated)' : ''}`,
  route.schema ? JSON.stringify(route.schema, undefined, 2) : '',
  `${route.summary || '(no summary)'}`,
  route.permissions.length
    ? `Permissions required: ${route.permissions.join(', ')}`
    : '',
].filter(s => !!s).join('\n');

async function main() {
  const routes = await analyze<any, Type>(() => require('./app').default);
  console.log(routes.map(printRoute).join('\n\n'));
}

main();
