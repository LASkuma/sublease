<template>
  <div class="home">
    <img src="../assets/logo.png">
    <input ref="upload" id="upload" type="file" multiple="true" accept="image/*" />
    <button @click="handleClick">hi</button>
  </div>
</template>

<script>
// @ is an alias to /src
import posts from '../api/posts';

export default {
  name: 'home',
  methods: {
    handleClick() {
      console.log(this.$refs.upload.files);
      posts.uploadImages(Array.from(this.$refs.upload.files), '1');
    },
  },
};
</script>
