const Koa = require('koa');
const fs = require('fs');
const serve = require('koa-static');

const html = fs.readFileSync(__dirname + '/../../dist/static/index.html', 'utf-8');

const app = new Koa();

const PORT = process.env.NODE_PORT || 3000;

app.use(serve(__dirname + '/../../dist/static'));

app.use(async ctx => {
  ctx.body = html;
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})