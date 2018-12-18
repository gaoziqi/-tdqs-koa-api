import * as fs from 'fs';
import { Context } from 'koa';
import * as send from 'koa-send';

export async function staticUrl(
  ctx: Context,
  docsUrl: string,
  staticPath: string,
) {
  const url = ctx.path.slice(docsUrl.length);
  if (!url || url[0] !== '/' || url === '/') {
    ctx.redirect(docsUrl + '/index.html');
  } else {
    const fileExist = fs.existsSync(staticPath + url);
    if (fileExist) {
      // typeof fileExist  :boolean  ..不是promise
      await send(ctx, url, { root: staticPath });
    } else {
      ctx.redirect(docsUrl + '/index.html');
    }
  }
}
