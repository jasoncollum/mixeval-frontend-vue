<template>
  <div v-if="notification.type" 
    class="banner has-text-weight-semibold is-overlay has-text-centered pt-3"
    :class="notification.type === 'success' ? [`has-background-success-light`, `has-text-success`, `fade-out`] : [`has-background-danger-light`, `has-text-danger`]"
  >
    <div class="message-container">
      <span class="notification-message">{{notification.message}}</span>
      <span v-if="notification.type === 'error'" class="icon is-clickable is-text-danger" @click="closeNotification">
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
    closeNotification() {
      this.$store.commit('setNotification', {
        type: null,
        message: null
      })
    },
  },
  watch: {
    async notification() {
      // check that song is not an empty object
      if (Object.keys(this.notification).length !== 0 && this.notification.constructor === Object) {
        // close success notification after 6 seconds
        if (this.notification.type && this.notification.type === 'success') {
          setTimeout(() => {
            this.closeNotification();
          }, '6000');
      }
      }
    }
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
.fade-out {
  animation: fadeOut ease 2s;
  -webkit-animation: fadeOut ease 2s;
  -moz-animation: fadeOut ease 2s;
  -o-animation: fadeOut ease 2s;
  -ms-animation: fadeOut ease 2s;
  animation-delay: 2s;
}
@keyframes fadeOut {
  0% {
    opacity:1;
  }
  100% {
    opacity:0;
  }
}
@-moz-keyframes fadeOut {
  0% {
    opacity:1;
  }
  100% {
    opacity:0;
  }
}
@-webkit-keyframes fadeOut {
  0% {
    opacity:1;
  }
  100% {
    opacity:0;
  }
}
@-o-keyframes fadeOut {
  0% {
    opacity:1;
  }
  100% {
    opacity:0;
  }
}
@-ms-keyframes fadeOut {
  0% {
    opacity:1;
  }
  100% {
    opacity:0;
  }
}
</style>