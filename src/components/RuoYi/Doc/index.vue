<template>
  <div>
    <svg-icon icon-class="platform" @click="goto"/>
  </div>
</template>

<script>
export default {
  name: 'RuoYiDoc',
  data() {
    return {
      url: 'http://42.192.94.183:8889/#/'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
