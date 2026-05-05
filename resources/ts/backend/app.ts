import { createApp } from "vue";
import { createPinia } from 'pinia';
import { watch } from 'vue';
import App from "./App.vue";
import { Helpers } from './Utils/Helper';
import VueTelInput from 'vue3-tel-input';
import 'vue3-tel-input/dist/vue3-tel-input.css';
import BreadcrumbComponent from "./Components/Breadcrumb.vue";
import AddButton from "./Components/AddButton.vue";
import Tooltip  from './Components/Tooltip.vue';
import SearchInput from "./Components/SearchInput.vue";
import FormInput from "./Components/FormInput.vue";
import FlashMessage from "./Components/FlashMessage.vue";
import LoadingBox from "./Components/LoadingBox.vue";
import Avatar from "./Components/Avatar.vue";
import ValidateInput from "./Components/ValidateInput.vue";
import OffCanvas from "./Components/OffCanvas.vue";
import BaseMultiSelect from "./Components/BaseMultiSelect.vue";
import moment from 'moment'

// import GenericInput from "./Components/GenericInputComponent.vue";
import Uploader from 'vue-media-upload';


import { useGlobal } from './global-composables';
import router from "./router";
import { registerPWA } from './pwa/registerPWA';
import { usePermissionsStore } from '../shared/stores/permissionsStore';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $filters: {
      DateTimeFormat(date: String): string;
      HoursFormat(date: String): string;
    }
  }
}

const pinia = createPinia();
const app = createApp(App);
app.config.globalProperties.$filters = {
    DateTimeFormat(date: String) {
      return moment.utc(String(date)).local().format('DD-MMM-YYYY , h:mm a');
    },
    HoursFormat(date: String) {
      return moment.utc(String(date)).local().fromNow();
    },
  }

app.use(pinia);

const permissionsStore = usePermissionsStore();
permissionsStore.initFromWindow();

app.directive("can", {
    mounted(el, binding) {
        const store = usePermissionsStore();
        console.log("Permissions Store in v-can directive:", store);
        const apply = () => {
            const required = binding.value as string | undefined;
            const allowed = store.has(required);
            el.hidden = !allowed;
        };
        apply();
        watch(() => store.names, apply, { deep: true });
    },
});

app.use(router);
app.provide('useGlobal', useGlobal);
app.component('BreadcrumbComponent', BreadcrumbComponent);
app.component('AddButton', AddButton);
app.component('Uploader', Uploader);
app.component('SearchInput', SearchInput);
app.component('FormInput', FormInput);
app.component('LoadingBox', LoadingBox);
app.component('validate-input', ValidateInput);
app.component('Tooltip', Tooltip);

app.component('Avatar', Avatar);
app.component('FlashMessage', FlashMessage);
app.component('OffCanvas', OffCanvas);
app.component('BaseMultiSelect', BaseMultiSelect);

app.config.globalProperties.$helpers = Helpers
app.config.globalProperties.$router = router;
app.use(VueTelInput);

app.mount('#app');

registerPWA();
