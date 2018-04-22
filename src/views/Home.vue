<template>
  <div>
    <mt-tab-container
      v-model="active">
      <mt-tab-container-item id="home">
        <h1>home</h1>
      </mt-tab-container-item>
      <mt-tab-container-item id="new">
        <NewPost />
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
import NewPost from '../components/NewPost.vue';
import Settings from '../components/Settings.vue';

export default {
  components: {
    NewPost,
    Settings,
  },
  data() {
    return {
      active: 'home',
    };
  },
};
</script>
