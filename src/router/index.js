import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/annoter-image',
    name: 'Annotation des images',
    component: () => import(/* webpackChunkName: "about" */ '../views/AnnotationView.vue')
  },
  {
    path: '/upload-images',
    name: 'Importer des images',
    component: () => import(/* webpackChunkName: "about" */ '../views/UploadAnnotation.vue')
  },
  {
    path: '/historique-annotations',
    name: 'Historique',
    component: () => import(/* webpackChunkName: "about" */ '../views/AnnotationHistory.vue')
  },  
  {
    path: '/predict',
    name: 'Predict',
    component: () => import(/* webpackChunkName: "about" */ '../views/PredictView.vue')
  },
  {
    path: '/annoter-paperjs',
    name: 'Annotation (Paper.js)',
    component: () => import(/* webpackChunkName: "about" */ '../views/AnnotationPaper.vue')
  }


]

const router = new VueRouter({
  routes
})

export default router
