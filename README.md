# **@tdqs/koa-api**

The MIT License (MIT)

@tdqs/koa-api koa middleware.

### Table of Contents

**[Installation](#installation)**  
**[API documentation](#api-documentation)**  
**[Example](#example)**

## **Installation**

```
    $ npm install @tdqs/koa-api
```

## **API documentation**

#### Getting Started

```ts
import { api, cls, koaApi } from '@tdqs/koa-api';
import * as Koa from 'koa';

const app = new Koa();

@cls()
class Test {
  @api()
  public static hello(ctx) {
    return 'hello world';
  }
}

app.use(koaApi({}, Test)).listen(8080);

//GET localhost:8080/docs       Api document
//GET localhost:8080/hello      Response 'hello world'
```

#### jsonschema & middlewares simplification

```ts
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
```

## **Example**

Following example could be found inside `/tests` directory.
