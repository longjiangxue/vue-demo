<template>
  <el-row>
  <el-col :span="12"><div class="grid-content bg-purple">
    <el-form-item label="验证码：" prop="code">
      <el-input v-model="currentValue" placeholder="请输入验证码" @input="handleInput"  ></el-input>
    </el-form-item>
  </div></el-col>
  <el-col :span="10"><div class="grid-content bg-purple-light">
    <el-button type="primary"  :disabled="disabled"  @click="getPhoneCode" >
      {{ btntxt}}
    </el-button>
  </div></el-col>
</el-row>
</template>

<script>

  import API from '@/api/index';
  import { Message } from 'element-ui';

  export default {
    name: 'verfilyCode',
    data() {
      return {
        btntxt: '获取验证码',
        disabled: false,
        time: 0,
        currentValue: this.value === undefined || this.value === null
          ? ''
          : this.value,
      };
    },
    props: {
      phone: {
        type: String,
        requied: true,
      },
      codeUrl: {
        type: String,
        requied: true,
      },
      parentObejct: {
        type: Object,
        requied: true,
      },
      value: [String, Number],
    },
    methods: {
      getPhoneCode() {
        console.log(this.parentObejct.phone);
        if (this.parentObejct.phone === undefined) {
          Message({
            type: 'error',
            message: '手机号不能为空',
          });
          return;
        }
        this.time = 3;
        this.disabled = true;
        this.timer();
        let params = {
          phone: this.parentObejct.phone,
        };
        if (this.parentObejct.userid == null) {
          params = {
            phone: `+86${this.parentObejct.phone}`,
          };
        } else {
          params = {
            phone: this.parentObejct.phone,
          };
        }
        console.log('codeUrl:', this.codeUrl);
        API.post(this.codeUrl, params).then((res) => {
          if (res.code === 0) {
            // do something
            let i = 0;
          } else {
            Message({
              type: 'error',
              message: res.msg,
            });
          }
        });
      },
      timer() {
        if (this.time > 0) {
          console.log('time当前值:', this.time);
          this.time = this.time - 1;
          this.btntxt = `${this.time}s,后重新获取验证码`;
          setTimeout(this.timer, 1000);
        } else {
          this.time = 0;
          this.btntxt = '获取验证码';
          this.disabled = false;
        }
      },
      handleInput(event) {
        console.log(event);
        this.$emit('input', event);
      },
    },
  };

</script>
