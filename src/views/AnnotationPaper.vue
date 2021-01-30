<template>
<div class="sub-container">
  <template>
    <div>
      
      <b-sidebar id="sidebar-1" title="Liste des images" shadow>
        <div class="mt-4">
          <div v-for="(item, index) in images" :key="index">
            <img :src="item.image" class="thumb-img" @click="selectImg(item.imgId)" :class="currentImgId == item.imgId ? 'selected' : ''" />
          </div>
        </div>
      </b-sidebar>
    </div>
  </template>
  <div class="text-left"  v-if="images.length > 0">
    <b-row class="mt-3">
        <b-col cols="7">
        <div>
            
            <h6>Liste des images importées</h6>
            <b-pagination :total-rows="totalRows" per-page="1" v-model="currentImgId" pills  @change="selectImg()"></b-pagination>
             <b-button v-b-toggle.sidebar-1 variant="secondary">Aperçu des images</b-button>
        </div>
        </b-col>
        <b-col><b-button variant="outline-secondary" style="white-space: nowrap;" v-b-modal.modal-1>Ajouter produit</b-button></b-col>
        <b-col><b-button variant="outline-primary" @click="save()">Enregistrer</b-button></b-col>
    </b-row>
    <h3 class="mt-2">Identifier les produits présents dans l'image ci-dessous:</h3>
            <img id="img" class="visuallyhidden" :src="selectedImg.image">
            <canvas  ref="canvas" id="canvas" :style="{ backgroundImage: selectedImg.image }" :width="width" :height="height" class="canvas-style" v-on:mousedown="mouseDown" @mouseover="mouseOver" />
    <h5 class="mt-4">Produits Identifiés en Format JSON: </h5>
    <!-- <output-area :annotations="selectedImg.annotations" /> -->
    <div>
            <textarea class="text-output">{{annotations}}</textarea>
    </div>
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

   <b-modal id="modal-2" title="Choisir un porduit">
    <template>
    <div>
        <b-form-group label="Products">
             <b-form-radio v-model="selected" name="some-radios" :value="product" v-for="(product, index) in products" :key="index">{{product.label}}</b-form-radio>
        </b-form-group>
    </div>
    </template>
    <template v-slot:modal-footer="{ cancel }">
      <b-button size="sm" variant="outline-secondary"  @click="cancel()">
        Annuler
      </b-button>
      <b-button size="sm" variant="outline-primary" @click="saveAnnotation()">
         Choisir
      </b-button>
    </template>
  </b-modal>
</div>
</template>

<script>
import Annotatable from '../components/Annotatable.vue'
const paper = require('paper');
export default {
  components:{Annotatable},
	data: function() {
		return {
            product:{},
            selected: {},
            selectedImg: {annotations:[]},
            currentImgId: 1,
            path: [],
            pathCoordinates: [],
            nbPaths: 0,
            scope: null,
            tool: null,
            startingPoint: null,
            selectionPath: null,
            nbPointInPath: 0,
            pathDrawn: false,
            width: '1000',
            height: '1000',
            selectedPath: 0,
            labels: [],
            annotations: []
        }
  },
  methods:{
    save(){
        this.$store.dispatch('saveAnnotations', {annotations: this.images})
        .then(() =>{
          this.$bvToast.toast(`Les modifications sont envoyés à la base de données!`, {
            title: 'Success',
            variant: 'success'
          })
        });

    },
    removeAnnotation(msg){
        this.selectedImg.annotations = this.selectedImg.annotations.filter(function(annotation){
            return annotation.id != msg.id;
        });
    },
    selectImg(imgId = this.currentImgId){
        if(imgId != this.currentImgId)
            this.currentImgId = imgId;
        setTimeout(() => {
            let obj = this.images.find(element => element.imgId == this.currentImgId)
            if (obj)
                this.selectedImg = obj
        }, 30);
        console.log(this.images)
    },
    addProduct(){
        if(this.product.label)
            this.$store.dispatch('addProduct', {product: this.product})
            .then(() =>{
                this.$bvModal.hide('modal-1')
            });
    },
    reset() {
        this.scope.project.activeLayer.removeChildren();
    },
    pathCreate(scope) {
        scope.activate();
        return new paper.Path({
            strokeColor: "#000000",
            strokeJoin: 'round',
            strokeWidth: 1.5
        })
    },
    createTool(scope) {
        scope.activate();
        return new paper.Tool();
    },
    mouseDown() {
        // in order to access functions in nested tool
        let self = this;
        // // create drawing tool
        // this.tool = this.createTool(this.scope);
        this.tool.onMouseDown = (event) => {
            if(!self.startingPoint){
                self.path[self.nbPaths] = new paper.Path();
                self.path[self.nbPaths].strokeWidth = 2;
                self.path[self.nbPaths].dashArray = [7, 5];
                self.path[self.nbPaths].strokeColor = '#0984e3';
                
                var firstPoint = new paper.Path.Circle({
                    center: event.point,
                    radius: 10,
                    fillColor: 'white',
                    strokeColor: 'black',
                    opacity: 0
                });
                firstPoint.onMouseEnter = function(event) {
                    this.opacity = 1
                }
                firstPoint.onMouseLeave = function(event) {
                    this.opacity = 0
                }
                firstPoint.onClick = function(event) {
                    if(self.path[self.nbPaths] && self.nbPointInPath > 2){
                        self.pathDrawn = true;
                        self.path[self.nbPaths].closed = true;
                        self.startingPoint = null;
                        self.selectionPath.selected = false;
                        self.selectionPath.remove();
                        self.openModal(self.nbPaths)
                        self.nbPaths++;
                        console.log(self.path)
                    }
                }
            }
            
            if(!self.pathDrawn || !self.startingPoint){
                 self.startingPoint = event.point;
                // if(self.nbPointInPath > 0 && !self.pathDrawn){
                    var point = new paper.Path.Circle({
                        center: event.point,
                        radius: 2,
                        strokeColor: 'black',
                        fillColor: 'black',
                        strokeWidth: 1,
                    }); 
                    point.strokeWidth = 1;
                    self.path[self.nbPaths].join(point, -1);
                    self.pathCoordinates.push({x: event.point.x, y: event.point.y, pathId: self.nbPaths})
                // }else{
                //     self.path[self.nbPaths].add(self.startingPoint)
                // }

                self.nbPointInPath ++;

                // path.fullySelected = true;    
                self.pathDrawn = false
            }else{
                self.pathDrawn = false
            }
            // self.path[self.nbPaths] = new paper.Path({
            //         strokeColor: "#000000",
            //         strokeJoin: 'round',
            //         strokeWidth: 1.5
            // });
            // // add point to path[self.nbPaths]
            // self.path[self.nbPaths].add(event.point);
        };
        this.tool.onMouseDrag = (event) => {
            //self.path[self.nbPaths].add(event);
        };
        this.tool.onMouseUp = (event) => {
            // line completed
            // self.path[self.nbPaths].add(event.point);
        }
        this.tool.onMouseMove = (event) =>{
            if(self.startingPoint && !self.selectionPath){
                self.selectionPath = new paper.Path.Line({
                        from: self.startingPoint,
                        to: event.point,
                        selected: true
                    });
                //self.selectionPath.removeOnDown();
            }else if (self.selectionPath){
                self.selectionPath.lastSegment.curve.point1 = self.startingPoint
                self.selectionPath.lastSegment.curve.point2 = event.point
            }
        }
    },
    mouseOver() {
         this.tool.onMouseMove = (event) =>{
            if(self.startingPoint && !self.selectionPath){
                self.selectionPath = new paper.Path.Line({
                        from: self.startingPoint,
                        to: event.point,
                        selected: true
                    });
                self.selectionPath.removeOnDown();
            }
            if (self.selectionPath){
                self.selectionPath.lastSegment.curve.point2 = event.point
            }
            
        }       
    },
    openModal(pathId){
        this.selectedPath = pathId;
        this.$bvModal.show('modal-2')

    },
    saveAnnotation(){
        var text = new paper.PointText(new paper.Point(this.path[this.selectedPath].bounds.x, this.path[this.selectedPath].bounds.y));
        text.justification = 'center';
        text.fillColor = 'black';
        text.strokeWidth = 2;
        text.content = this.selected.label;
        this.labels[this.selectedPath] = this.selected.label;
        this.$bvModal.hide('modal-2');
        let i = 0;
        let self = this;
        this.path.forEach(element =>{
            let paths = this.pathCoordinates.filter(element => {
                 return element.pathId == i    
            });
            let annotation= {label: self.labels[i]};
            let segments = [];
            paths.forEach(e => {
                // let annotation = {
                //     label: self.labels[i],
                //     annotations: e       
                // }
                segments.push({x: e.x, y: e.y})
            });
            annotation.segments = segments;
            this.annotations.push(annotation);
            i++;
        });
        console.log(this.selectedImg.annotations)
        
    },
    resizeCanvas()
    {
        var img = document.getElementById('img'); 
        if(img){
            this.width = img.width;
            this.height = img.height;   
         }else{
            setTimeout(() => {
                this.resizeCanvas()
            }, 500);
            
        }

        // setTimeout(() => {
        //     document.getElementById('canvas').style = 'background-image:' + this.selectedImg.image
        // }, 1000);
        
        // console.log(width)
        // var canvas = document.getElementById('canvas'); 
        // canvas.width = width 
        // canvas.height = height
        // canvas.stye.width = width 
        // canvas.stye.height = height
    }
  },
    mounted() {
        if(this.images.length > 0){
            this.resizeCanvas();
            setTimeout(() => {
                this.scope = new paper.PaperScope();
                this.scope.setup('canvas');
                this.scope.activate();
                this.tool = new paper.Tool();
                this.tool.minDistance = 30;       
                var raster = new paper.Raster({source: this.selectedImg.image, position: this.scope.view.center});
                this.ready = true;
            }, 1000);
        }


        
// var ctx = document.getElementById('canvas');
        // ctx = ctx.getContext('2d');

        // //Loading of the home test image - img1
        // var img1 = new Image();

        // //drawing of the test image - img1
        // img1.onload = function () {
        //     //draw background image
        //     ctx.drawImage(img1, 0, 0);
        //     //draw a box over the top
        //     ctx.fillStyle = "rgba(200, 0, 0, 0.5)";
        //     ctx.fillRect(0, 0, 500, 500);

        // };

        // img1.src = 'https://d1fmx1rbmqrxrr.cloudfront.net/cnet/optim/i/edit/2019/04/eso1644bsmall__w770.jpg';


    },
  created(){
    this.$store.dispatch('getProducts');
    if(this.images.length == 0)
        console.log('Aucune image trouvée!')
    else{
        this.selectImg();
        this.resizeCanvas();
    }
  },
  computed:{
    images(){
        return this.$store.getters.images;
    },
    totalRows(){
        return this.$store.getters.images.length;   
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
    .canvas-style {
        cursor: crosshair;
        background-repeat:no-repeat;
    }
.visuallyhidden{
    display: none;
}
.text-output{
margin-top: 2px;
width: 100%;
min-height: 250px;
padding: 20px;
font-style: italic;
background: rgb(51, 50, 50);
color: rgb(193, 192, 240);
border-radius: 5px;
}
</style>