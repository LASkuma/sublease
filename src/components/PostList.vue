<template>
  <div id="post-list">
    <PostListItem
      v-for="post in posts"
      :key="post.id"
      :post="post"/>
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
