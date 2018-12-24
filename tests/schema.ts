/*
 * @Author: gzq
 * @Date: 2018-12-17 11:02:09
 * @Last Modified by: gzq
 * @Last Modified time: 2018-12-19 10:32:00
 */

import { Context } from 'koa';
import { api, cls, koaSend } from '../src/index';

@cls({
  name: '测试schema',
  prefix: '/schema',
})
export class Schema {
  @api({
    desc: 'schema测试接口',
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
    return: 'hello world {"p": "1", "q": 2}',
    schema: {
      properties: {
        p: { type: 'string' },
        q: { type: 'number' },
      },
      required: ['p', 'q'],
      type: 'object',
    },
  })
  public static hello(ctx: Context) {
    return `hello world ${JSON.stringify(ctx.data)}`;
  }

  @api({
    schema: {
      properties: {
        name: { type: 'string' },
      },
      required: ['name'],
      type: 'object',
    },
  })
  public static async download(ctx) {
    const path = ctx.query.name;
    ctx.attachment(path);
    await koaSend(ctx, path);
  }
}
