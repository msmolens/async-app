// +========================================================================+ //
// | This file replaces `express`, that is, whenever you import or require  | //
// | express, you should import or require this file instead.               | //
// |                                                                        | //
// | Note: we are not exporting Express' static stuff so you might still    | //
// | need to import `express`, but not for creating routers.                | //
// |                                                                        | //
// | Note: we are also defining here some types and type aliases that will  | //
// | help us in specifing middlewares later.                                | //
// +========================================================================+ //

import { parseSchema, Type } from 'mural-schema';
import { ToDo, User } from './db';

// In your case this is `from 'async-app'`
import createApp, {
  Entities,
  internalServerError,
  Req as Request } from '../..';
import { ErrorHandlerFn } from '../../types';

// This type represents all the custom `req` keys that we could have, in this
// example those are `res.user` and `req.todo`.
export interface ExampleEntities extends Entities {
  user: User;
  todo: ToDo;
}

// This type helps us write middlewares that explicitly declare which custom
// keys from `req` they are going to use (e.g. `(req: Req<'user'>) => req.user`)
export type Req<T extends keyof ExampleEntities = '_'> = Request<
  ExampleEntities,
  T
>;

export { ErrorHandlerFn, SchemaValidationError } from '../..';

// This function replaces `express()` as in `const app = express()`;
export default (
  errorHandlerFn?: ErrorHandlerFn<ExampleEntities>,
  forwardSchemaErrors = false,
) =>
  createApp<ExampleEntities, Type>({
    // In here you specify additional `async-app` options...

    // The following line enables schema validation using `mural-schema`. Note
    // that you can easily change your schema validation module by specifing add
    // different `compileSchemaFn`.
    compileSchemaFn: schema => parseSchema(schema),
    errorHandlerFn,
    // The following line enables forwarding schema validation errors to next()
    // instead of calling generateSchemaErrorFn and sending a response directly.
    // Defaults to false.
    forwardSchemaErrors,
    mapAsyncResultFn: async (value, { req, ...opts }) => {
      if (value !== 'echo') return value;

      if (req.query.throw) {
        if (!opts.isLastMiddleware) throw internalServerError('NOT_LAST');

        if (!opts.isAsyncMiddleware) throw internalServerError('NOT_ASYNC');
      }

      return {
        ...opts,
        method: req.method,
        path: req.path,
      };
    },
  });
