<template>
  <div>
    <b-container class="mt-4">
    <div>
        <h3>Choisir l'image' à prédire</h3>
        <div class="text-left mt-4">
            <b-button style="float:right;" variant="outline-success" @click="submitFiles()">{{ !this.processing ? 'Predict' : 'Refaire'}}</b-button>
        </div>

        <b-form-file
        v-model="files"
        :state="Boolean(files)"
        placeholder="Choose files or drop it here..."
        drop-placeholder="Drop files here..."
        class="multiple-input-2 mt-4"
        ref="file"
        ></b-form-file>
    </div>
    <div class="loader" v-if="loading">
            <b-spinner variant="primary" label="Spinning"></b-spinner>  
    </div>
    <div v-if="processing">
        <img :src="predictedImg" class="predict-img" />
    </div>


    </b-container>
    <!-- Styled -->

  
  </div>
</template>

<script>
  export default {
    data() {
      return {
        files: null,
        predictedImg: '',
        processing: false,
        loading: false,
      }
    },
    methods:{
    submitFiles() {
    // formData.append('file', this.file[0]);
    this.loading = true;
    let formData = new FormData();
    formData.append('files', this.files);
    this.$store.dispatch('uploadForPredict', formData)
    .then((resp) => {
        this.$store.dispatch('predict', {image: {url: resp}}).then((resp2)=>{
            this.predictedImg = resp2;
            this.processing = true;
            this.loading = false;
        })

    })
    .catch(function(){
    });
     
    },
    }
  }
</script>

<style>
/* .multiple-input .custom-file-label{
  
} */
.was-validated .custom-file-input:valid ~ .custom-file-label, .custom-file-input.is-valid ~ .custom-file-label {
    border-color: rgb(108, 116, 238);
}
.custom-file-label::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    display: block;
    height: calc(1.5em + 0.75rem);
    padding: 0.375rem 0.75rem;
    line-height: 1.5;
    color: rgb(34, 48, 240);
    content: "Browse";
    background-color: transparent;
    border-left: inherit;
    border-bottom: inherit;
    border: 1px solid rgb(108, 116, 238);
    border-top: none;
    border-right: none;
    border-radius: 0 0 0 0.25rem;
}
.form-file-text{
    text-align: left;
    width: 250px;
    white-space: break-spaces;
}
.predict-img{
    margin-top: 10px;
}
.loader{
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: center;
}
</style>