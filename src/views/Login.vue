<template>
  <div id="login">
    <div class="login-wrapper">
      <div class="signin-heading">
        <h4 style="font-size: 16px;">管理系统</h4>
      </div>
      <template >
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginForm" label-position="left" label-width="0px" class="login-container">
        <el-form-item prop="username">
          <el-input type="text" size="large" v-model="loginForm.username" auto-complete="off" placeholder="用户账号"  ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" size="large" v-model="loginForm.password" auto-complete="off" placeholder="密码"  ></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 20px; margin-bottom: 0;">
          <el-button class="submit"   size="large" @click="handleSubmit('loginForm')"   :loading="loading">登 录</el-button>
        </el-form-item>
      </el-form>
      </template>
    </div>
  </div>
</template>


<script>
  import MD5 from 'md5';
  import { Message } from 'element-ui';
  import API from '../api/index';

  export default {
    name: 'login',
    data() {
      return {
        style: {
        },
        loading: false,
        loginForm: {
          username: '',
          password: '',
        },
        loginFormRules: {
          username: [
            {
              required: true,
              message: '请输入用户账号',
              trigger: 'blur',
            },
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur',
            },
          ],
        },
      };
    },
    mounted() {
      if (localStorage.getItem('__t')) {
        this.$router.push('/home');
      }
    },
    methods: {
      handleSubmit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.loading = true;
            // json 提交
            const params = {
              userName: this.loginForm.username,
              password: this.loginForm.password,
            };
            this.$router.push('/home');
            // 需要登陆
            /* API.login(params).then((res) => {
              this.loading = false;
              // console.log(res);
              if (res.code === 0) {
                localStorage.setItem('id', res.data.id);
                localStorage.setItem('token', res.data.token);
                this.$router.push('/home');
              } else {
                Message({
                  type: 'error',
                  message: res.message,
                });
              }
            }); */
          } else {
            console.log('error submit!!');
          }
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  #login {
    height: 100%;
    position: relative;
    background: url("../assets/images/loginbackgroup.jpeg");

    .login-wrapper {
      position: absolute;
      top: 45%;
      left: 50%;
      background-color: rgba(255, 255, 255, 0.95);
      border-radius: 15px;
      box-shadow: 0 0 50px rgba(0, 0, 0, 0.2);
      padding: 30px;
      width: 380px;
      margin: -190px 0 0 -190px;

      .signin-heading {
        margin-bottom: 30px;
        text-align: center;

        .logo {
          padding: 0 20%;
        }
      }

      .login-container {
        .el-form-item {
          .submit {
            width: 100%;
            background-color: blue;
            background-image: -webkit-linear-gradient(right, blue, #ff7563 90%);
            background-image: -moz-linear-gradient(right, blue, #ff7563 90%);
            background-image: -o-linear-gradient(right, blue, #ff7563 90%);
            background-image: -ms-linear-gradient(right, blue, #ff7563 90%);
            background-image: linear-gradient(to left, blue, #ff7563 90%);
            border: none;
            color: #ffffff;
            border-radius: 19px;
            font-size: 19px;
          }
        }
      }
    }
  }

  @media only screen and (max-width: 767px) {
    #login {
      height: 100%;
      .login-wrapper {
        width: 240px;
        margin: -150px 0 0 -150px;
      }
    }
  }

  #login {
    .login-wrapper {
      .login-container {
        .el-form-item {
          .el-input {
            input {
              border-radius: 0;
              border: none;
              border-bottom: 1px solid #bfcbd9;
              background: none;
            }
          }
        }
      }
    }
  }
  .bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 150px;
    text-align: center;
    color: blue;
    font-size: 16px;

    a {
      color: blue;
    }

  }
</style>

