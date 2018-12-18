/*
 * @Author: gzq
 * @Date: 2018-12-17 11:02:09
 * @Last Modified by: gzq
 * @Last Modified time: 2018-12-17 16:22:33
 */

import { api, cls, IApiContext } from '../src/index';

@cls({
  name: '测试schema',
  prefix: '/schema',
})
export class Schema {
  @api({
    method: 'POST',
    middlewares: [
      async (ctx, next) => {
        const start = new Date().getTime();
        await next();
        const ms = new Date().getTime() - start;
        ctx.body = {
          ms,
          text: ctx.body,
        };
      },
    ],
    schema: {
      properties: {
        p: { type: 'string' },
        q: { type: 'number' },
      },
      required: ['p', 'q'],
      type: 'object',
    },
  })
  public static hello(ctx: IApiContext) {
    return `hello world ${JSON.stringify(ctx.data)}`;
  }
}
