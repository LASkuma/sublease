<template>
  <div>
    <mt-tab-container
      v-model="active">
      <mt-tab-container-item id="home">
        <PostList :posts="posts" />
      </mt-tab-container-item>
      <mt-tab-container-item id="new">
        <NewPost @post="active = 'home'"/>
      </mt-tab-container-item>
      <mt-tab-container-item id="settings">
        <Settings @logout="active = 'home'"/>
      </mt-tab-container-item>
    </mt-tab-container>
    <mt-tabbar
      v-model="active"
      :fixed="true"
    >
      <mt-tab-item id="home">
        <img slot="icon" src="../assets/home.png">
      </mt-tab-item>
      <mt-tab-item id="new">
        <img slot="icon" src="../assets/post.png">
      </mt-tab-item>
      <mt-tab-item id="settings">
        <img slot="icon" src="../assets/settings.png">
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Toast } from 'mint-ui';

import PostList from '../components/PostList.vue';
import NewPost from '../components/NewPost.vue';
import Settings from '../components/Settings.vue';
import * as Posts from '../graphql/posts';

export default {
  components: {
    PostList,
    NewPost,
    Settings,
  },

  data() {
    return {
      active: 'home',
      posts: [],
    };
  },

  computed: {
    ...mapState({
      authenticated: state => state.user.authenticated,
    }),
  },

  apollo: {
    posts: {
      query: Posts.queries.posts,
    },
  },

  watch: {
    active(newVal, oldVal) {
      if (
        (newVal === 'new' || newVal === 'settings') &&
        this.authenticated !== 1
      ) {
        this.active = oldVal;
        Toast('Please login first');
        this.$router.push('/login');
      }
    },
  },
};
</script>
