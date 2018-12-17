/*
 * @Author: gzq
 * @Date: 2018-12-15 13:57:14
 * @Last Modified by: gzq
 * @Last Modified time: 2018-12-17 13:37:59
 */

import * as send from 'koa-send';
import { api, IApiGroup } from '../src/index';

export class Test implements IApiGroup {
  /*public static group = {
    name: '测试',
    prefix: '/test',
  };*/
  public static group;
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
