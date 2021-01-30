<template>
  <div>
    <b-container class="mt-4">
    <h3>Choisir les images à noter</h3>
    <div class="text-left mt-4">
        <small>Vous pouvez ajouter plusieurs images à la fois</small>
        <b-button style="float:right;" variant="outline-success" @click="submitFiles()">Envoyer</b-button>
    </div>
    <div class="text-left">
    <b-form-group label="Type d'annotation">
      <b-form-radio-group
        v-model="selected"
        :options="options"
        name="annotation"
      ></b-form-radio-group>
    </b-form-group>
   </div>


    <b-form-file
      v-model="files"
      :state="Boolean(files)"
      placeholder="Choose files or drop it here..."
      drop-placeholder="Drop files here..."
       multiple
       class="multiple-input mt-4"
         ref="file"
    ></b-form-file>

    </b-container>
    <!-- Styled -->


  
  </div>
</template>

<script>
  export default {
    data() {
      return {
        files: [],
        selected: 'box',
        options: [
          { text: 'Box', value: 'box' },
          { text: 'Polygon (PaperJs)', value: 'polygon' }
        ]
      }
    },
    methods:{
    submitFiles() {

        // formData.append('file', this.file[0]);
        let uploadNb = 0;
        let self = this;
        this.files.forEach(element =>{
            let formData = new FormData();
            formData.append('files', element);
            this.$store.dispatch('uploadImages', formData)
            .then(function(){
              uploadNb+=1;
              if (uploadNb == self.files.length){
                  let routing = self.selected == 'box' ? '/annoter-image' : '/annoter-paperjs';
                  self.$router.push(routing)
                }

            })
            .catch(function(){
            });
        })
    },
    }
  }
</script>

<style>
.multiple-input .custom-file-label{
    height: 300px;
}
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
</style>