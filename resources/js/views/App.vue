<template>
    <div id="main">
        <router-view></router-view>

        <!-- <loading></loading> -->
    </div>
</template>
<script>
  export default {
    watch: {
      isAppIdle: function() {
        if(this.isAppIdle) {
          if (localStorage.getItem('AccessToken')) this.$store.dispatch('auth/logout')
        }
      }
    }
  }
</script>

<style>
#app, #main {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%!important;
  height: 100%!important;
}
#loading-screen {
  display: none;
}
</style>
