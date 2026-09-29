
<script setup lang="ts">
const TabButtonComponent = Helpers.useDynamicDefineAsyncComponent(() => import('../../Components/TabButton.vue'));
import { Helpers } from "../../Utils/Helper";
const UserProfile = Helpers.useDynamicDefineAsyncComponent(()=>import('./partials/UserProfileComponent.vue'));
const SecurityComponent = Helpers.useDynamicDefineAsyncComponent(()=>import('./partials/SecurityComponent.vue'));



const auth_user = Helpers.auth();
const tabs_list = Helpers.useDynamicRef([
    {name:'account',icon:'ri-user-settings-line',label:'Account',class:'active'},
    {name:'security',icon:'ri-lock-line',label:'Security',class:''},
    {name:'billing',icon:'ri-lock-line',label:'Billing & Plans',class:''},
    {name:'branding',icon:'ri-layout-line',label:'Custom Branding',class:''},

]);

// Function to get the correct component based on the item name
const getComponent = (name:any) => {
  switch (name) {
    case 'account':
      return UserProfile;
    case 'security':
      return SecurityComponent;
    default:
      return null;
  }
};
</script>


<template>
    <div>
       
    </div>

</template>

