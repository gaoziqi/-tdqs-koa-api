/*
 * @Author: gzq
 * @Date: 2018-12-15 13:57:14
 * @Last Modified by: gzq
 * @Last Modified time: 2018-12-17 13:37:59
 */

import * as send from 'koa-send';
import { api, cls } from '../src/index';

@cls()
export class Test {
  @api()
  public static hello(ctx) {
    return 'hello world';
  }
  @api({
    method: 'GET',
    // path: '/hello',
  })
  public static error(ctx) {
    return 'hello world1';
  }
  @api()
  public static async download(ctx) {
    const path = ctx.query.name;
    ctx.attachment(path);
    await send(ctx, path);
  }
}
