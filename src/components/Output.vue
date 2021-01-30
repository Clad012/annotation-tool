<template>
	<textarea class="text-output"> {{ summarized }}</textarea>
</template>
<script>
export default {
	props: ['annotations'],
	computed: {
		summarized() {
			return this.annotations
				.filter(annotation => annotation.status != 'new')
				.map(annotation => {
					let {x, y , width, height, label, categorie} = annotation
					return {x, y, width, height, label, categorie}
				});
		}
	}
}
</script>

<style scoped>
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