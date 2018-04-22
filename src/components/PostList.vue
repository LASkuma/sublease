<template>
  <div id="post-list">
    <PostListItem
      v-for="post in posts"
      :key="post.id"
      :post="post"
      @click.native="$router.push({ name: 'post', params: { id: post.id }})"
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
};
</script>

<style scoped>
#post-list {
  margin-bottom: 50px;
}
</style>

