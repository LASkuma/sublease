<template>
  <div id="post-list">
    <PostListItem
      v-for="post in posts"
      :key="post.id"
      :post="post"
      @click.native="handleClick(post.id)"
    />
  </div>
</template>

<script>
import PostListItem from './PostListItem.vue';

export default {
  components: {
    PostListItem,
  },

  props: {
    posts: {
      type: Array,
      required: true,
    },
  },

  methods: {
    handleClick(id) {
      window.location.href = `${process.env.VUE_APP_POST_ROOT}/${id}`;
    },
  },
};
</script>

<style scoped>
#post-list {
  margin-bottom: 50px;
}
</style>

