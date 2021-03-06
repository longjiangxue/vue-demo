/* eslint-disable no-param-reassign */
/* eslint-disable dot-notation */

import axios from 'axios';
import { Notification } from 'element-ui';
import api from './api';
import store from '../store';
import { htmlEncodeByRegExp } from '../lib/mUtils';

const dataPackage = (data) => {
  const params = {
    data,
  };
  return params;
};

// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = api.test ? api.baseURLTest : api.baseURL;

// http request 拦截器
axios.interceptors.request.use(
  config => config,
  (err) => {
    console.log(`axios request err: ${JSON.stringify(err)}`);
    Notification({
      title: '错误',
      message: '网络请求错误',
      type: 'error',
      duration: 5 * 1000,
    });
  });

// http response 拦截器
axios.interceptors.response.use(
  (response) => {
    // 如果是下载文件 则直接返回response 在postDownLoad 进行下载
    if (response.headers && (response.headers['content-type'] === 'text/csv')) {
      return response;
    }
    response.data = JSON.parse(htmlEncodeByRegExp(JSON.stringify(response.data)));
    if (response.data.success === false) {
      return Promise.reject(response.data.msg);
    }
    return response;
  },
  (err) => {
    console.log(`axios response err: ${JSON.stringify(err)}`);
    Notification({
      title: '错误',
      message: '网络响应错误',
      type: 'error',
      duration: 5 * 1000,
    });
  });

// 创建axios实例
const servie = axios.create({
  baseURL: api.test ? api.baseURLTest : api.baseURL,
  timeout: 5000,
});

// request 拦截器
servie.interceptors.request.use((config) => {
  config.data = dataPackage(config.data);
  return config;
}, (error) => {
  console.log(error);
  Notification({
    title: '错误',
    message: '网络请求错误',
    type: 'error',
    duration: 5 * 1000,
  });
});

// response 拦截器
servie.interceptors.response.use((response) => {
  response.data = JSON.parse(htmlEncodeByRegExp(JSON.stringify(response.data)));
  const res = response.data;

  if (response.data.success === false) {
    if (res.code === 1) {
      // token 失效登出
      store.dispatch('/common/loginOut');
      Notification({
        title: '错误',
        message: `token失效,请刷新界面重新登陆，msg ${res.msg}`,
        type: 'error',
        dutation: 5 * 1000,
      });
    }
    return Promise.reject(response);
  } else if (!(res && res.data)) {
    Notification({
      title: '警告',
      message: '返回空数据',
      type: 'warning',
      dutation: 5 * 1000,
    });
  } else {
    return response;
  }
  return '';
}, (error) => {
  console.log('err:', error);
  Notification({
    title: '错误',
    message: '网络响应错误',
    type: 'error',
    duration: 5 * 1000,
  });
});

// 创建不使用token验证的，访问接口的axios实例
const serviceNotoken = axios.create({
  baseURL: api.test ? api.baseURLTest : api.baseURL,
  timeout: 10000,
});

export default {
  login(data) {
    return new Promise((resolve, reject) => {
      serviceNotoken.post(api.login, data).then((res) => {
        resolve(res.data);
      }).catch((res) => {
        reject(res);
      });
    });
  },
  post(cgi, data) {
    return new Promise((resolve, reject) => {
      serviceNotoken.defaults.headers.command['id'] = `${localStorage.getItem('id')}`;
      serviceNotoken.defaults.headers.command['token'] = `${localStorage.getItem('token')}`;
      serviceNotoken.post(api[cgi], data).then((res) => {
        console.log(api[cgi]);
        console.log(res);
        if (res.data.code === 401) {
          localStorage.removeItem('id');
          localStorage.removeItem('token');
          this.$router.push('/login');
          return;
        }
        resolve(res.data);
      }).catch((res) => {
        reject(res);
      });
    });
  },
  // 下载文件 使用的此方法 直接调用不处理业务，下载文件
  postDownLoad(cgi, data) {
    return new Promise((resolve, reject) => {
      let param = {
        uid: localStorage.getItem('uid'),
        token: localStorage.getItem('token'),
        data,
      };
      serviceNotoken.post(api[cgi], param, { responseType: 'blob' }).then((res) => {
        console.log(api[cgi]);
        console.log(res);
        let blob = res.data;
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = (e) => {
          let a = document.createElement('a');
          a.download = 'fileName'; // 下载的文件名
          let href = window.URL.createObjectURL(blob); // fix
          a.href = href;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };
        // resolve(res);
      }).catch((res) => {
        reject(res);
      });
    });
  },
  getDownLoad(cgi, data) {
    return new Promise((resolve, reject) => {
      serviceNotoken.get(api[cgi] + data, { responseType: 'blob' }).then((res) => {
        let blob = res.data;
        let downloadElement = document.createElement('a');
        let href = window.URL.createObjectURL(blob); // 建立下载连接
        downloadElement.href = href;
        downloadElement.download = 'name.csv'; // 文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob
        resolve(res.data);
      }).catch((res) => {
        reject(res);
      });
    });
  },
};
