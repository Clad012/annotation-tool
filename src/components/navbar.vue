<template>
<div>
  <b-navbar type="dark" variant="dark">
  <b-navbar-brand href="#">Mo-ka</b-navbar-brand>
    <b-navbar-nav class="ml-auto">
    

      <!-- Navbar dropdowns -->

      <router-link class="nav-link" to="/predict">Identifier des produits</router-link>
      <router-link class="nav-link" to="/annoter-image">Annoter des produits</router-link>
      <router-link class="nav-link" to="/historique-annotations">Historique</router-link>
      <!-- <b-nav-item-dropdown text="User" right>
        <b-dropdown-item href="#">Account</b-dropdown-item>
        <b-dropdown-item href="#">Settings</b-dropdown-item>
      </b-nav-item-dropdown> -->
    </b-navbar-nav>
  </b-navbar>
</div>
</template>
      
<script>
export default {
  name: 'Navbar',
}
</script>