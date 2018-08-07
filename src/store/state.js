import axois from 'axios';

export default {

  clone(obj) {
    const ret = {};
    const keysArr = Object.keys(obj);
    for (let i = 0; i < keysArr.length; i += 1) {
      if (Object.prototype.hasOwnProperty.call(obj, keysArr[i])) {
        ret[keysArr[i]] = obj[keysArr[i]];
      }
    }
    return ret;
  },
};
