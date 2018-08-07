import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Login from '@/views/Login';
import page404 from '@/views/404';
import Home from '@/views/Home';


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/hello',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    {
      path: '/login',
      name: '登陆',
      component: Login,
    },
    {
      path: '/home',
      name: '后台管理',
      component: Home,
    },
    {
      path: '/404',
      name: '404',
      component: page404,
    },
    {
      path: '*',
      component: page404,
    },
  ],
});
