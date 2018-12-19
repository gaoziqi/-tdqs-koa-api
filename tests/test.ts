/*
 * @Author: gzq
 * @Date: 2018-12-15 13:57:14
 * @Last Modified by: gzq
 * @Last Modified time: 2018-12-19 09:30:53
 */

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
}
