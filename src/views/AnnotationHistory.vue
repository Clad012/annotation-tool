<template>
<div class="sub-container">
    <template>
    <div>
        <b-sidebar id="sidebar-1" title="Liste des images" shadow>
        <div class="mt-4">
            <div v-for="(item, index) in db_images" :key="index">
            <img :src="item.image" class="thumb-img" @click="selectImg(item.id)" :class="item.id == currentImgId ? 'selected' : ''" />
            </div>
        </div>
        </b-sidebar>
    </div>
    </template>
  <div class="text-left"  v-if="db_images.length > 0">
    <b-row class="mt-3">
        <b-col cols="7">
         <b-button v-b-toggle.sidebar-1 variant="secondary">Images présentes dans la base de données</b-button>
        <!-- // <div>
        //     <h6>Liste des images importées</h6>
        //     <b-pagination :total-rows="totalRows" per-page="1" v-model="currentImgId" pills  @change="selectImg()"></b-pagination>
        //      <b-button v-b-toggle.sidebar-1 variant="secondary">Aperçu des images</b-button>
        // </div> -->
        </b-col>
        <b-col><b-button variant="outline-secondary" style="white-space: nowrap;" v-b-modal.modal-1>Ajouter produit</b-button></b-col>
        <b-col><b-button variant="outline-primary" @click="save()">Enregistrer</b-button></b-col>
    </b-row>
    <div><b-badge :variant="this.selectedImg.treated ? 'success': 'warning'">{{this.selectedImg.treated ? 'Image traitée par ML' : 'Image Non encore traitée par le ML'}}</b-badge></div>
    <h3 class="mt-2">Identifier les produits présents dans l'image ci-dessous:</h3>
    <annotatable :annotations.sync="selectedImg.annotations" :options="products" @removeAnnotation="removeAnnotation" input="input-menu">
      <img id="image" draggable="false" :src="selectedImg.image" alt="Vue logo">
    </annotatable>
    <h5 class="mt-4">Produits Identifiés en Format JSON: </h5>
    <output-area :annotations="selectedImg.annotations" />
  </div>
  <div v-else>
    <h3 class="mt-5">Aucune image trouvée! <router-link to="/upload-images">Importer des images</router-link></h3>
  </div>
   <b-modal id="modal-1" title="Ajouter un nouveau produit">
    <div>
      <b-form-group id="input-group-2" label="Nom du Produit" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="product.label"
          required
          placeholder="Entrer nom du produit"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-2" label="Catégorie du Produit" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="product.categorie"
          required
          placeholder="Entrer la catégorie du produit"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-2" label="Prix du produit" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="product.prix"
          placeholder="Préciser le prix"
        ></b-form-input>
      </b-form-group>
    </div>
    <template v-slot:modal-footer="{ cancel }">
      <b-button size="sm" variant="outline-secondary"  @click="cancel()">
        Annuler
      </b-button>
      <b-button size="sm" variant="outline-primary" @click="addProduct()">
         Ajouter
      </b-button>
    </template>
  </b-modal>
</div>
</template>

<script>
import Annotatable from '../components/Annotatable.vue'
// import Output from '../components/Output.vue'

export default {
  components:{Annotatable},
	data: function() {
		return {
          product:{},
          selectedImg: {annotations:[]},
          currentImgId: 0,
		}
  },
  methods:{
    save(){
        this.$store.dispatch('updateAnnotation', {annotation: this.selectedImg});
        this.$bvToast.toast(`Les modifications apportées à cette annotation sont enregistrées!`, {
            title: 'Success',
            variant: 'success'
        })   
    },
    removeAnnotation(msg){
        this.selectedImg.annotations = this.selectedImg.annotations.filter(function(annotation){
            return annotation.id != msg.id;
        });
    },
    selectImg(id){
        // if(index != this.currentImgId)
        if(id === '0'){
            console.log(this.db_images)
            id = this.db_images[0].id;
        }
        this.currentImgId = id;
        setTimeout(() => {
            let obj = this.db_images.find(element => element.id == id)
            if (obj)
                this.selectedImg = obj
        }, 30);
    },
    addProduct(){
        if(this.product.label)
            this.$store.dispatch('addProduct', {product: this.product})
            .then(() =>{
                this.$bvModal.hide('modal-1')
            });
    }
  },
  created(){
    this.$store.dispatch('getProducts');
    this.$store.dispatch('getDbImages').then(() =>{
        if(this.db_images.length == 0)
            console.log('Aucune image trouvée!')
        else{
            this.selectImg('0');
        }
    });

  },
  computed:{
    db_images(){
        return this.$store.getters.db_images;
    },
    totalRows(){
        return this.$store.getters.db_images.length;   
    },
    products(){
        return this.$store.getters.products;
    }
  }
}
</script>
<style scoped>
.sub-container{
  margin-left: 0 !important;
}
.thumb-img{
  margin-top: 10px;
  width: 180px;
  height: 80px;
  border: 1px solid rgb(90, 88, 88);
  border-radius: 3px;
  cursor: pointer;
}
.thumb-img:hover{
  border: 3px solid rgb(43, 42, 42);
}
.selected{
  border: 3px solid rgb(28, 115, 247);
}
</style>