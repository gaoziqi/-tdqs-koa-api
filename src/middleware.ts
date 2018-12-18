/*
 * @Author: gzq
 * @Date: 2018-12-17 09:29:18
 * @Last Modified by: gzq
 * @Last Modified time: 2018-12-17 16:20:05
 */

import * as Ajv from 'ajv';
import * as koaBody from 'koa-body';
import * as compose from 'koa-compose';
import { apiUrls, IApiContext } from './api';
import { getDocs } from './docs';

class ValidationError extends Error {
  constructor(
    public errors: Ajv.ErrorObject[],
    public name = 'ValidationError',
  ) {
    super('validation failed');
  }
}

interface IKoaApiOptions {
  docsUrl?: string;
  koaBody?: koaBody.IKoaBodyOptions;
}

const ajv = new Ajv();

/**
 * koaApi 中间件
 * @param opt 配置
 * @param groups 添加需要编译的IApiGroup
 */
export function koaApi(opt: IKoaApiOptions, ...groups: any[]) {
  /** IApiOption默认值 */
  const option = Object.assign({ docsUrl: '/docs' }, opt);
  const mwKoaBody = koaBody(option.koaBody);
  const middleware = async (ctx: IApiContext, next: () => Promise<void>) => {
    const urls = apiUrls[ctx.method][ctx.path];
    /** 参数解析 */
    switch (ctx.method) {
      case 'GET':
        ctx.data = ctx.query;
        break;
      default:
        ctx.data = ctx.request.body;
    }
    /** 校验参数 */
    if (urls.option.schema) {
      if (!ajv.validate(urls.option.schema, ctx.data)) {
        throw new ValidationError(ajv.errors);
      }
    }
    const res = await urls.func(ctx);
    if (res !== undefined) {
      ctx.body = res;
    }
    await next();
  };
  return async (ctx: IApiContext, next: () => Promise<void>) => {
    if (ctx.path in apiUrls[ctx.method]) {
      const urls = apiUrls[ctx.method][ctx.path];
      const middlewares = [mwKoaBody];
      for (const mw in urls.option.middlewares) {
        middlewares.push(urls.option.middlewares[mw]);
      }
      middlewares.push(middleware);
      return compose(middlewares)(ctx, next);
    } else if (ctx.path === option.docsUrl) {
      ctx.body = getDocs();
    } else {
      await next();
    }
  };
}
