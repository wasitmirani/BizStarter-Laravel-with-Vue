import { createApp } from "vue";
import { watch } from "vue";

// import './registerServiceWorker'
import { createPinia } from 'pinia'
import App from "./App.vue";
import { useGlobal } from './global-composables';
import router from "./router";
import { usePermissionsStore } from '../shared/stores/permissionsStore';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);

const permissionsStore = usePermissionsStore();
permissionsStore.initFromWindow();

app.directive("can", {
  mounted(el, binding) {
    const store = usePermissionsStore();
    const apply = () => {
      const required = binding.value as string | undefined;
      el.hidden = !store.has(required);
    };
    apply();
    watch(() => store.names, apply, { deep: true });
  },
});

app.use(router);
app.provide('useGlobal', useGlobal);

app.config.globalProperties.$router = router;
app.mount('#frontend-app');
