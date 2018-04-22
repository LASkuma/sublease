<template>
  <div class="inputs">
    <mt-field
      label="Street Address"
      placeholder="Required"
      v-model="lease.address"
    />
    <mt-field
      label="Building Name"
      placeholder="Optional"
      v-model="lease.building"
    />
    <mt-cell title="State" />
    <mt-picker
      ref="statePickerComponent"
      :slots="statePicker"
      :visibleItemCount="3"
      @change="onStateChange"
    />
    <mt-field
      label="City"
      placeholder="Required"
      v-model="lease.city"
    />
    <mt-field
      type="textarea"
      rows="4"
      label="Description"
      placeholder="Required"
      v-model="lease.description"
    />
    <mt-field
      label="Price"
      type="number"
      placeholder="Required"
      v-model="lease.price"
    />
    <mt-cell
      title="Sublease From"
      :value="displayFrom"
      @click.native="$refs.from.open()"
    />
    <mt-cell
      title="Sublease Until"
      :value="displayTo"
      @click.native="$refs.to.open()"
    />
    <mt-datetime-picker
      cancelText="Cancel"
      confirmText="Confirm"
      ref="from"
      type="date"
      :startDate="new Date()"
      v-model="lease.from"
    />
    <mt-datetime-picker
      cancelText="Cancel"
      confirmText="Confirm"
      ref="to"
      type="date"
      :startDate="lease.from || new Date()"
      v-model="lease.to"
    />
    <mt-field
      label="# of Bedrooms"
      type="number"
      placeholder="Required (0 for Studios)"
      v-model="lease.bedrooms"
    />
    <mt-field
      label="# of Bathrooms"
      type="number"
      placeholder="Required"
      v-model="lease.bathrooms"
    />
    <mt-cell
      title="Type of listing Room"
      value="Bedroom or Living room"
    />
    <mt-picker
      ref="typePickerComponent"
      :slots="typePicker"
      :visibleItemCount="3"
      @change="onTypeChange"
    />
    <mt-cell
      title="Select Pictures"
      value="Required (Max 9)"
    />
    <input
      type="file"
      ref="pictures"
      multiple
      accept="image/*"
    />
    <mt-button
      type="primary"
      size="large"
      @click.native="handleSubmit"
    >
      Submit
    </mt-button>
  </div>
</template>

<script>
import moment from 'moment';
import uuid from 'uuid-random';
import { Toast, Indicator } from 'mint-ui';

import states from '../utils/states';
import posts from '../api/posts';
import * as Posts from '../graphql/posts';

export default {
  data() {
    return {
      lease: {
        state: states[0],
        type: 'Bedroom',
        from: new Date(),
        to: new Date(),
      },
      selectState: false,
      statePicker: [
        {
          values: states,
        },
      ],
      typePicker: [
        {
          values: ['Bedroom', 'Living Room'],
        },
      ],
      loading: false,
    };
  },

  computed: {
    displayFrom() {
      return moment(this.lease.from).format('YYYY/MM/DD');
    },

    displayTo() {
      return moment(this.lease.to).format('YYYY/MM/DD');
    },
  },

  watch: {
    loading(newVal) {
      if (newVal) {
        Indicator.open();
      } else {
        Indicator.close();
      }
    },
  },

  methods: {
    onStateChange(picker, values) {
      [this.lease.state] = values;
    },

    onTypeChange(picker, values) {
      [this.lease.type] = values;
    },

    async handleSubmit() {
      this.loading = true;
      const { lease } = this;
      this.lease = {
        state: states[0],
        type: 'Bedroom',
        from: new Date(),
        to: new Date(),
      };

      const key = uuid();
      const images = Array.from(this.$refs.pictures.files);
      lease.pictureId = key;
      lease.pictureNumber = images.length;

      const uploadImagesPromise = posts.uploadImages(images, key);
      const createPostPromise = this.$apollo.mutate({
        mutation: Posts.helpers.createPost,
        variables: {
          lease,
        },
        update: (store, { data: { createPost } }) => {
          const data = store.readQuery({ query: Posts.queries.posts });
          data.posts.unshift(createPost);
          store.writeQuery({ query: Posts.queries.posts, data });
        },
      });

      try {
        await Promise.all([uploadImagesPromise, createPostPromise]);

        this.loading = false;
        this.$refs.statePickerComponent.setSlotValue(0, states[0]);
        this.$refs.typePickerComponent.setSlotValue(0, 'Bedroom');

        Toast('Post Success');
        this.$emit('post');
      } catch (err) {
        this.lease = lease;
        this.loading = false;
        Toast(err.message);
      }
    },
  },
};
</script>

<style scoped>
.inputs {
  margin-bottom: 50px;
}
</style>
