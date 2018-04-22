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
    <mt-cell title="Type of listing Room" value="Bedroom or Living room"/>
    <mt-picker
      :slots="typePicker"
      :visibleItemCount="3"
      @change="onTypeChange"
    />
  </div>
</template>

<script>
import moment from 'moment';
import states from '../utils/states';

export default {
  data() {
    return {
      lease: {
        address: '',
        building: '',
        state: states[0],
        city: '',
        description: '',
        from: null,
        to: null,
        bedrooms: null,
        bathrooms: null,
        type: 'Bedroom',
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
    };
  },

  computed: {
    displayFrom() {
      if (!this.lease.from) {
        return 'Required';
      }
      return moment(this.lease.from).format('YYYY/MM/DD');
    },

    displayTo() {
      if (!this.lease.to) {
        return 'Optional';
      }
      return moment(this.lease.to).format('YYYY/MM/DD');
    },
  },

  methods: {
    onStateChange(picker, values) {
      [this.lease.state] = values;
    },

    onTypeChange(picker, values) {
      [this.lease.type] = values;
    },
  },
};
</script>

<style scoped>
.inputs {
  margin-bottom: 50px;
}
</style>
