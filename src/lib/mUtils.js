
/**
 * 存储sessionStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  let contentTemp = content;
  if (typeof content !== 'string') {
    contentTemp = JSON.stringify(content);
  }
  window.sessionStorage.setItem(name, contentTemp);
};

/**
 * 获取sessionStorage
 */
export const getStore = (name) => {
  if (!name) return;
  window.sessionStorage.getItem(name);
};

/**
 * 删除sessionStorage
 */
export const removeStore = (name) => {
  if (!name) return;
  window.sessionStorage.removeItem(name);
};

/* login1.vue.用正则表达式实现html转码 */
export const htmlEncodeByRegExp = (str) => {
  let s = '';
  if (str.length === 0) return '';
  s = str.replace(/&/g, '&amp;');
  s = s.replace(/</g, '&lt;');
  s = s.replace(/>/g, '&gt;');
//        s = s.replace(/ /g, '&nbsp;')
//        s = s.replace(/\'/g, '&#39;')
//        s = s.replace(/\'/g, '&quot;')
  return s;
};

/* 2.用正则表达式实现html解码 */
export const htmlDecodeByRegExp = (str) => {
  let s = '';
  if (str.length === 0) return '';
  s = str.replace(/&amp;/g, '&');
  s = s.replace(/&lt;/g, '<');
  s = s.replace(/&gt;/g, '>');
  s = s.replace(/&nbsp;/g, ' ');
  s = s.replace(/&#39;/g, '\'');
  s = s.replace(/&quot;/g, '\'');
  return s;
};

export const dataPackage = function dataPackage(data) {
  return {
    uid: this.loginUser.uid,
    token: this.loginUser.token,
    data,
  };
};
