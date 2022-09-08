<template>
  <teleport to="body">
    <div open class="modal" :class="{ 'is-active': show }">
      <div v-if="show" @click="tryClose" class="modal-background"></div>
      <transition name="dialog">
        <div v-if="show" class="modal-card">
          <header class="modal-card-head">
            <slot name="header">
              <h2 class="modal-card-title">{{ title }}</h2>
            </slot>
          </header>
          <section class="modal-card-body">
            <slot></slot>
          </section>
          <footer class="modal-card-foot">
            <slot name="actions">
              <button class="button" @click="tryClose">Close</button>
            </slot>
          </footer>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script setup>
/* 
    Props
*/
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
  fixed: {
    type: Boolean,
    required: false,
    default: false,
  },
});

/* 
    Emits
*/
const emit = defineEmits(["close"]);

/* 
    Methods
*/
const tryClose = () => {
  if (props.fixed) {
    return;
  }
  emit("close");
};
</script>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 10;
}

dialog {
  position: fixed;
  top: 20hv;
  left: 10%;
  width: 80%;
  z-index: 100;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
.dialog-enter-active {
  transition: all 0.3s ease-out;
}
.dialog-leave-active {
  transition: all 0.3s ease-in;
}

.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
