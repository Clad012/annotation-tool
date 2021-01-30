<template>
  <div class="about">


    <h1>This is an about page 2</h1>
    <annotatable :annotations.sync="annotations" :options="options" input="input-menu">
      <img id="image" draggable="false" src="https://cdn.futura-sciences.com/buildsv6/images/mediumoriginal/6/5/2/652a7adb1b_98148_01-intro-773.jpg" alt="Vue logo">
    </annotatable>
    <output-area :annotations="annotations" />
  </div>
</template>

<script>
import Annotatable from '../components/Annotatable.vue'
// import Output from '../components/Output.vue'

export default {
  components:{Annotatable},
	data: function() {
		return {
          annotations: [
              {
                "x": 107,
                "y": 100,
                "width": 114,
                "height": 91,
                "label": "Chat Ocelot"
              }
            ],
          options: [
                  {
                      categorie: 'Chat',
                      options: ['Chat Ocelot', 'Chat Marionnette', 'Chat Persan'],
                  },
                  {
                      categorie: 'Ourson',
                      options: ['Ours brun', 'Ours polaire', 'Panda géant'],
                  },
                  {
                      categorie: 'Tiger',
                      options: ['Northeast Tiger', 'South China Tiger', 'Bengal Tiger'],
                  }
          ]
		}
  }
}
</script>