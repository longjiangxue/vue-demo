# vue-demo1

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## READ ME

本项目使用的**vue-cli**脚手架生成，增加了axios发起网络请求。

使用饿了么的 Elements组件。

 ### 目录结构
      - build  脚手架生成  构建脚本
      - config  
         -  dev.env.js  开发环境脚本 
         - idnex.js    一些配置选项 可配置 启动端口
         - prod.env.js 生产环境构建脚本
      - node_modules  依赖的包
      - dist 编译后发布的代码
         - api
            - api.js   接口请求路径存放地
            - index.js 使用axios封装http post
         - assets 资源
         - components   组件（页面） 你的大多数工作在这里
         - lib  工具类
         - router
            - index.js 路由器（控制器） 
         - store   工具类 这里的一般被用在 计算属性那里
         - views 基本视图层  
         - App.vue  
         - main.js  初始化vue  见代码
      - .eslinttrc.js eslint代码静态检查，可以在开发过程中提前提示错误
      -package.json 依赖管理 


### vue文件结构
  *VUE*支持数据双向绑定，数据驱动视图。
   

      - html /模版代码
        
      - <script>脚本
        - import相关的模块
        - data ：驱动的数据
        - watch :侦听器 可以监听data里的某个数据的变化，做相应的交互
        - computed 计算属性 对于任何复杂逻辑，你都应当使用计算属性
        - mounted:  vue的生命周期的一个环节 这里一般发起请求获取页面的初始数据
        - method : 可以被watch,computed,mounted调用的方法，你的工作重心在这里
        - components: 组件  可以把常用的一些元素封装为组件，如elements 提供form-item 
            利用组件的概念可以，极大的提高效率。
      - css


### updadte 

-- 2018/8/8 增加  请求验证码输入组件
  
     - src
       - components
        - common
          - verfilyCode
          
    使用 引入组件，之后在 html 部分使用组件

```    
  <verfilyCode v-model="edition.code" :parentObejct="edition" codeUrl="phoneCode" ></verfilyCode>
    
  v-model : 绑定的验证码的属性值，
  :parentObejct: form的整个对象  必须要phone字段，否则需要修改组件
  codeUrl: 请求验证码的url（ api.js 中的值）

```
效果图:  
        
![2018-08-0812121212121](http://pawutdr2l.bkt.clouddn.com/2018-08-0812121212121.png) 
          
          
-- 2018/8/9  增加axios post 请求下载文件

```
 axios.interceptors.response.use方法增加对  content-type为文件类型不
 解析为json，直接返回原始response
 
 增加：postDownLoad 方法处理post下载文件
  

```
使用:使用postDownLoad方法
```javascript
 
    exportExcel() {
            let params = {
              pram1: this.param1s,
            };
            API.postDownLoad('yourul', params).then((res) => {
              // console.log(res);
              // 这里不做任何事情
            });
          }
```


--- 2018/8/14
   
   - 修复 axios post 下载大文件chrome下失败
   - 增加axios get 方法下载文件 

  原理： 通过增加a 标签，进行下载
