/*
 * @Author: gzq
 * @Date: 2018-12-17 16:23:54
 * @Last Modified by:   gzq
 * @Last Modified time: 2018-12-17 16:23:54
 */

import * as Koa from 'koa';
import * as logger from 'koa-logger';
import { koaApi } from '../src/index';
import { Schema } from './schema';
import { Test } from './test';

const app = new Koa();

app.onerror = e => {
  console.log('%j', e);
  console.log(e.name);
};

app
  .use(logger())
  .use(koaApi({ koaBody: { multipart: true } }, Test, Schema))
  .listen(8080);
