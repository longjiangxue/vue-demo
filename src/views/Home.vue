<template>
  <div class="container-fluid">
    <div class="top row">
      <!--<div class="logo">JRS管理后台</div>-->
      <div class="logo">管理后台</div>
      <div class="userInfo">
        <div class="username">{{user.userName}}</div>
        <a class="logout" @click="logout">退出</a>
      </div>
    </div>
    <div class="main row">
      <aside class="main-sidebar" v-if="!collapsed">
        <!--导航菜单-->
        <section class="sidebar">
          <el-menu
            class="el-menu-vertical"
            @select="elMenuSelected"
            unique-opened
            :default-active="navPath[0]">
            <template v-for="(item, index) in asideTree" >
              <el-submenu :index="item.index || item.name" v-if="item.children.length > 0 && !item.hidden">
                <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
                <el-menu-item v-for="(child, index) in item.children" :index="child.index || child.name" :key="index" v-if="!child.hidden">{{child.name}}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else-if="item.children.length === 0 && !item.hidden" :index="item.index || item.name"><i :class="item.icon"></i>{{item.name}}</el-menu-item>
            </template>
          </el-menu>
        </section>
      </aside>
      <div class="main-content" :class="collapsed ? '' : 'extend'">
        <section class="content-container">
          <div class="breadcrumb-container">
            {{navPath[0]}}
          </div>
          <div class="content-wrapper">
            <transition name="fade" mode="out-in">

              <component :is="navSelectedCompName" :data1="user" class="comp"></component>
            </transition>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
  import API from '@/api/index';
  import { Message } from 'element-ui';

  const example1 = () => import('@/components/example1');

  export default {
    name: 'home',
    components: {
      example1,
    },
    mounted() {
      let data = {
        userId: localStorage.getItem('id'),
      };
      API.post('botList', data).then((res) => {
        console.log(res.data);
        if (res.code === 0) {
         // this.user = res.data;
        } else {
          console.log(res.message);
          Message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    data() {
      return {
        navPath: [localStorage.getItem('navPath')],
        navSelectedCompName: localStorage.getItem('navSelectedCompName') || 'homeFloatBtn',
        collapsed: false,
        sysUserName: '',
        asideTree: [
          {
            name: 'example1',
            index: '',
            compName: 'example1',
            children: [],
          },
        ],
        user: {},
      };
    },
    computed: {
    },
    methods: {
      elMenuSelected(index, indexPath) {
        this.navPath = indexPath;
        let compName = 'null-com';
        let path = '';
        this.asideTree.forEach((elem) => {
          if (elem.name === indexPath[0]) {
            if (elem.compName) {
              compName = elem.compName;
              path = elem.name;
            } else {
              elem.children.forEach((elem1) => {
                if (elem1.name === indexPath[1]) {
                  if (elem1.compName !== '') {
                    compName = elem1.compName;
                    path = elem1.name;
                  }
                }
              });
            }
          }
        });
        this.navSelectedCompName = compName;
        localStorage.setItem('navSelectedCompName', compName);
        localStorage.setItem('navPath', path);
      },
      // 退出登录
      logout() {
        const self = this;
        this.$confirm('确认退出吗?', '提示', {
          // type: 'warning'
        }).then(() => {
          localStorage.removeItem('id');
          localStorage.removeItem('token');
          self.$router.push('/login');
        }).catch(() => {});
      },
      // 折叠导航栏
      collapse() {
        this.collapsed = !this.collapsed;
      },
    },
  };

</script>

<style scoped lang="scss">
  .container-fluid {
    height: 100%;

    $top-h: 60px;
    .top {
      height: $top-h;
      background: #48576a;
      display: flex;

      .logo {
        font-size: 30px;
        height: $top-h;
        line-height: $top-h;
        padding-left: 20px;
        color: #fff;
      }

      .userInfo {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 20px;
        color: #fff;

        .username {
          margin-right: 30px;
        }

        .logout {
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }

    .main{
      height: calc(100% - 60px);
      overflow: hidden ;

      .main-sidebar {
        width: 230px;
        height: 100%;
        background: #EFF2F7;
        float: left;
        text-align: center;
        overflow: auto;
        .sidebar {
          .el-menu.el-menu-vertical {
            .el-submenu.is-active.is-opened {
              .el-menu {
                .el-menu-item.is-active {
                  background: #9ea6b1;
                  color: #ffffff;
                }
              }
            }
          }

          .el-menu-item {
            border-bottom: solid 1px #e6e6e6;
          }
        }
      }

      .main-content {
        width: 100%;
        height: 100%;
        float: left;

        &.extend {
          width: calc(100% - 230px);
        }

        .main-toolbar {
          width: 100%;
          height: 50px;
          float: left;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #ff5c73;
          background-image: -webkit-linear-gradient(right, #ff5c73, #ff7563 90%);
          background-image: -moz-linear-gradient(right, #ff5c73, #ff7563 90%);
          background-image: -o-linear-gradient(right, #ff5c73, #ff7563 90%);
          background-image: -ms-linear-gradient(right, #ff5c73, #ff7563 90%);
          background-image: linear-gradient(to left, #ff5c73, #ff7563 90%);


          .menu {
            padding: 15px;
            line-height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 19px;
            color: #000000;
          }

          .userinfo {
            height: 50px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-right: 15px;

            .message {
              padding: 15px;
              line-height: 20px;
              position: relative;

              i {
                color: #ffffff;
                font-size: 18px;
              }

              .label {
                position: absolute;
                top: 9px;
                right: 7px;
                text-align: center;
                font-size: 9px;
                padding: 2px 3px;
                line-height: .9;
              }
            }

            .userinfo-inner {
              padding: 15px;
              font-size: 17px;
              color: #ffffff;
            }
          }
        }
        .content-container {
          height: 100%;
          .breadcrumb-container {
            font-size: 16px;
            text-align: left;
            min-width: 320px;
            padding: 20px;
            .breadcrumb-inner {
              float: left;
            }
          }
          .content-wrapper {
            padding: 0 20px;
            width: 100%;
            height: calc(100% - 63px);
            min-width: 320px;
            background-color: #fff;
            box-sizing: border-box;
            overflow: auto;
            border-top: 1px solid #eeeeee;

            .comp {
              height: 100%;
              display: flex;
              flex-direction: column;
            }
          }
        }
      }
    }
  }
</style>
