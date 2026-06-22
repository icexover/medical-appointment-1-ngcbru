import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: { title: '首页', showTabBar: true },
  },
  {
    path: '/appointment',
    name: 'Appointment',
    component: () => import('@/views/appointment/index.vue'),
    meta: { title: '预约', showTabBar: true },
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('@/views/messages/index.vue'),
    meta: { title: '消息', showTabBar: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/profile/index.vue'),
    meta: { title: '我的', showTabBar: true },
  },
  {
    path: '/department/:id',
    name: 'DepartmentDetail',
    component: () => import('@/views/department/[id].vue'),
    meta: { title: '科室详情', showTabBar: false },
  },
  {
    path: '/doctor/:id',
    name: 'DoctorDetail',
    component: () => import('@/views/doctor/[id].vue'),
    meta: { title: '医生详情', showTabBar: false },
  },
  {
    path: '/booking/confirm',
    name: 'BookingConfirm',
    component: () => import('@/views/booking/confirm.vue'),
    meta: { title: '预约确认', showTabBar: false },
  },
  {
    path: '/booking/payment',
    name: 'BookingPayment',
    component: () => import('@/views/booking/payment.vue'),
    meta: { title: '支付', showTabBar: false },
  },
  {
    path: '/booking/success',
    name: 'BookingSuccess',
    component: () => import('@/views/booking/success.vue'),
    meta: { title: '预约成功', showTabBar: false },
  },
  {
    path: '/order/:id',
    name: 'OrderDetail',
    component: () => import('@/views/order/[id].vue'),
    meta: { title: '订单详情', showTabBar: false },
  },
  {
    path: '/profile/patients',
    name: 'PatientManage',
    component: () => import('@/views/profile/patients.vue'),
    meta: { title: '就诊人管理', showTabBar: false },
  },
  {
    path: '/hospital',
    name: 'HospitalInfo',
    component: () => import('@/views/hospital/index.vue'),
    meta: { title: '医院信息', showTabBar: false },
  },
  {
    path: '/hospital/map',
    name: 'HospitalMap',
    component: () => import('@/views/hospital/map.vue'),
    meta: { title: '科室分布图', showTabBar: false },
  },
  {
    path: '/hospital/navigation',
    name: 'HospitalNavigation',
    component: () => import('@/views/hospital/navigation.vue'),
    meta: { title: '院内导航', showTabBar: false },
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/search/index.vue'),
    meta: { title: '搜索', showTabBar: false },
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/reports/index.vue'),
    meta: { title: '报告查询', showTabBar: false },
  },
  {
    path: '/medicine',
    name: 'Medicine',
    component: () => import('@/views/medicine/index.vue'),
    meta: { title: '药品查询', showTabBar: false },
  },
  {
    path: '/exam',
    name: 'Exam',
    component: () => import('@/views/exam/index.vue'),
    meta: { title: '检查预约', showTabBar: false },
  },
  {
    path: '/emergency',
    name: 'Emergency',
    component: () => import('@/views/emergency/index.vue'),
    meta: { title: '急诊就医', showTabBar: false },
  },
  {
    path: '/outpatient-payment',
    name: 'OutpatientPayment',
    component: () => import('@/views/outpatient-payment/index.vue'),
    meta: { title: '门诊缴费', showTabBar: false },
  },
  {
    path: '/checkup',
    name: 'Checkup',
    component: () => import('@/views/checkup/index.vue'),
    meta: { title: '体检预约', showTabBar: false },
  },
  {
    path: '/service',
    name: 'Service',
    component: () => import('@/views/service/index.vue'),
    meta: { title: '在线客服', showTabBar: false },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  document.title = (to.meta.title as string) || '智慧医院'
  next()
})

export default router
