import { createApp } from "vue";
import { createPinia } from 'pinia';
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
import moment from 'moment'

// import GenericInput from "./Components/GenericInputComponent.vue";
import Uploader from 'vue-media-upload';
import VueMultiselect from 'vue-multiselect';
import "vue-multiselect/dist/vue-multiselect.css";
import router from "./router";

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
let permissions = JSON.parse(`${localStorage.getItem('permissions')}`);
app.config.globalProperties.$filters = {
    DateTimeFormat(date: String) {
      return moment.utc(String(date)).local().format('DD-MMM-YYYY , h:mm a');
    },
    HoursFormat(date: String) {
      return moment.utc(String(date)).local().fromNow();
    },
  }


app.directive("can", {
    beforeMount(el, binding, vnode) {
        if (permissions.includes(binding.value)) {
            vnode.el.hidden = false;
        } else {
            vnode.el.hidden = true;
        }
    }
});

app.use(pinia);
app.use(router);
// app.provide('useGlobal', useGlobal); // Provide the composable
app.component('BreadcrumbComponent', BreadcrumbComponent);
app.component('AddButton', AddButton);
app.component('Uploader', Uploader);
app.component('SearchInput', SearchInput);
app.component('FormInput', FormInput);
app.component('LoadingBox', LoadingBox);
app.component('validate-input', ValidateInput);
app.component('Tooltip', Tooltip);
app.component('VueMultiselect', VueMultiselect);
app.component('Avatar', Avatar);
app.component('FlashMessage', FlashMessage);
app.component('OffCanvas', OffCanvas);

app.config.globalProperties.$helpers = Helpers
app.config.globalProperties.$router = router;
app.use(VueTelInput);

app.mount('#app');
