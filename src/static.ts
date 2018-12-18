import * as fs from 'fs';
import * as send from 'koa-send';

export function staticMiddleware(path: string) {
  return async (ctx, next) => {
    const fileExist = await fs.existsSync(path + ctx.path);
    if (fileExist) {
      // typeof fileExist  :boolean  ..不是promise
      await send(ctx, path + ctx.path);
    } else {
      await send(ctx, path + '/index.html');
    }
    await next();
  };
}
