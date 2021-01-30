import Vue from 'vue'
import Vuex from 'vuex'
import Axios from "axios";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    images:[
    ],
    db_images:[
    ],
    products:[],
    api: 'http://127.0.0.1:5000',
    api_colab: 'http://6fb11f841705.ngrok.io',

    ngrok_api: 'http://331887411997.ngrok.io'
  },
  getters: {
    images(state){
      return state.images;
    },
    db_images(state){
      return state.db_images;
    },
    products(state){
      return state.products;
    }
  },
  mutations: {
    pushImage(state, image){
      let imgObj = {imgId: state.images.length + 1, image: `${state.api}/uploads/${image}`, annotations: [], treated: false};
      state.images.push(imgObj);
    },
    setDbImages(state, db_images){
      state.db_images = db_images;
    },
    setProducts(state, products){
      state.products = products;
    },
    pushProduct(state, data){
      state.products.push(data.product);
    }
  },
  actions: {
    uploadImages(context, data){
        return new Promise((resolve, reject) => {
            Axios.post('http://127.0.0.1:5000/api/upload', data,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
               }
            }
            )
            .then(response => {
                context.commit('pushImage', response.data)
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            })
        })   
    },
    getProducts(context, data){
        return new Promise((resolve, reject) => {
            Axios.get('http://127.0.0.1:5000/api/products')
            .then(response => {
                context.commit('setProducts', response.data.result)
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            })
        })   
    },
    addProduct(context, data){
        return new Promise((resolve, reject) => {
            Axios.post('http://127.0.0.1:5000/api/products', data)
            .then(response => {
                context.commit('pushProduct', data)
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            })
        })   
    },
    saveAnnotations(context, data){
        return new Promise((resolve, reject) => {
            Axios.post('http://127.0.0.1:5000/api/annotations', data)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            })
        })   
    },
    getDbImages(context, data){
        return new Promise((resolve, reject) => {
            Axios.get('http://127.0.0.1:5000/api/annotations')
            .then(response => {
                context.commit('setDbImages', response.data.result)
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            })
        })   
    },
    updateAnnotation(context, data){
        return new Promise((resolve, reject) => {
            Axios.put('http://127.0.0.1:5000/api/annotations', data)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            })
        })   
    },
    predict(context, data){
        return new Promise((resolve, reject) => {
            Axios.post(context.state.api_colab+'/api/predict-image', data
            )
            .then(response => {
                resolve(context.state.api_colab+response.data);
            })
            .catch(error => {
                reject(error);
            })
        })   
    },
    uploadForPredict(context, data){
        return new Promise((resolve, reject) => {
            Axios.post('http://127.0.0.1:5000/api/upload', data,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
               }
            }
            )
            .then(response => {
                resolve(context.state.ngrok_api+'/uploads/'+response.data);
            })
            .catch(error => {
                reject(error);
            })
        })   
    },
  },
  modules: {
  }
})
