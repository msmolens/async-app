import { ErrorRequestHandler } from 'express';
import createApp, {
  Req,
  SchemaValidationError,
} from './async-app';
import { removeTodos } from './db';

// Error handler for schema validation errors. Passes unrecognized errors along
// to the next error handler.
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (!(err instanceof SchemaValidationError)) {
    next(err);
  }

  const includeAll = !!req.headers['x-include-all-schema-errors'];
  const { errors, source } = err;

  return res.status(400).send({
    all: includeAll ? errors : undefined,
    error: 'INVALID_PAYLOAD',
    expected: errors[0].expected,
    path: errors[0].key,
    source,
  });
};

const app = createApp(
  undefined /* errorHandlerFn */,
  true /* forwardSchemaErrors */,
);

app.post(
  '/',
  'Delete TODOs',
  {
    ids: ['number'],
  },
  (req: Req) => removeTodos(req.body.ids),
  204,
);

app.use(errorHandler);

export default app;
