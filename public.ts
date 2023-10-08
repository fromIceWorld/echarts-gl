// 用于将组件发布到数据库系统中。

/**
 * view 节点的范围 [1:只在视图区, 2:只在关系区, 3:即在视图区也在关系区]
 */
const components = [
    {
      id: 'echarts-gl',
      type: 'node',
      icon: 'global',
      title: `echartsGL:
                    Angular@16.1+echarts+echarts-gl`,
      view: 4,
      family: 'chart',
      color: '#e167d1',
      des: '基础的echarts-gl',
      component: 'EchartsGLComponent',
    },
  ],
  file = 'dist/my-echarts-gl/';
const http = require('http'),
  request = require('request');
const filesName = [
  { name: 'main.js', decorator: { defer: true } },
  //   { name: 'polyfills.js', decorator: { defer: true } },
  { name: 'runtime.js', decorator: { defer: true } },
  //   { name: 'vendor.js', decorator: { defer: true } },
  'styles.css',
];
let options = {
  url: 'http://127.0.0.1:3000/upload',
  method: 'POST',
  json: true,
  headers: {
    'content-type': 'application/json',
  },
  body: {},
};
let files = [],
  area = 'echarts-gl';
filesName.forEach((fileName) => {
  let name = typeof fileName == 'string' ? fileName : fileName.name;
  let content = require('fs').readFileSync(file + name);
  let buffer = Buffer.from(content);
  files.push({
    name,
    content: buffer.toString(),
  });
});

let componentsConfig = components.map((item) => {
  return {
    ...item,
    filesName: [...filesName, { name: 'iconfont.js', decorator: {} }],
    area,
  };
});
request(
  {
    ...options,
    body: {
      code: 200,
      data: {
        components: componentsConfig,
        content: files,
        area,
      },
    },
  },
  (err, res, body) => {
    if (res.statusCode === 200) {
      console.log(filesName, res.statusCode, '上传完成');
    } else {
      console.log(body);
    }
  }
);
