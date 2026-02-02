<script setup lang="ts">
import { ref } from 'vue';
import { Helpers } from '../../Utils/Helper';
import UserForm from './UserForm.vue';
import { UserService } from '../../Services/user/UserService';

const draftStatus = ref<string | null>(null);

const saveDraftHandler = (status?: string) => {
    draftStatus.value = status || 'no status provided';
    console.log(`Save draft with status: ${draftStatus.value}`);
};

// Emit from UserForm and handle it here
const handleSubmitForm = (formData: any) => {
    console.log('Form submitted with data:', formData);
    saveDraftHandler('submitted');
};

let user = Helpers.useDynamicReactive({});
const editmode = ref(false);
const getUser = () => {

    UserService.user(Helpers.route().params.uuid.toString()).then((res) => {
        user = res.data.result.user;
        editmode.value = true;
    })
}

Helpers.useDynamicOnMounted(() => {
    if (Helpers.route().params.uuid) {
        getUser();
    }
});


</script>

<template>
    <BreadcrumbComponent current="Create User" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Users', route: 'users' }]" />

    <UserForm class="mt-4" />

</template>
