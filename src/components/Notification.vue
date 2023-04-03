<template>
  <div v-if="notification.type" 
    class="banner has-text-weight-semibold is-overlay has-text-centered pt-3"
    :class="notification.type === 'success' ? [`has-background-success`, `has-text-success`] : [`has-background-danger-light`, `has-text-danger`]"
  >
    <div class="message-container">
      <span class="notification-message">{{notification.message}}</span>
      <span class="icon is-clickable is-text-danger" @click="closeErrorNotification">
        <i class="fa-regular fa-circle-xmark"></i>
      </span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Notification',
  computed: {
    notification() {
      return this.$store.state.notification;
    }
  },
  methods: {
    closeErrorNotification() {
      this.$store.commit('setNotification', {
        type: null,
        message: null
      })
    },
  }
})
</script>

<style scoped>
.banner {
  z-index: 2;
}
.message-container {
  position: relative;
}
.notification-message {
  margin-top: auto;
}
.icon {
  position: absolute;
  right: 15px;
}
</style>