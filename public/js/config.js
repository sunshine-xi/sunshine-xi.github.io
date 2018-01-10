
//管理配置 jsp里面配置好了
// var RSUrl=location.origin+"/project";//配置Content目录 项目特殊配置
// var ImgUrl=location.origin+"/Content/images";//配置js目录 项目特殊配置
seajs.config({
  // 路径配置
  paths: {
    'common':  RSUrl+'/js/common',
    'local':RSUrl+'/js'
  },
  // 别名配置 common指的就是paths里面定义的
  alias: {
    'jquery': 'common/jquery.min'
  },
  // 变量配置
  vars: {
    // 'apiUrl': 'localhost:54359'
  },
  map: [
    [".js", ".js"]//映射规则  开发环境用 .js?v=版本号  生产环境用.min.js?v=版本号
  ],

  // 调试模式
  debug: false,

  // Sea.js 的基础路径
  base: RSUrl+'/js',

  // 文件编码
  charset: 'utf-8'
});
