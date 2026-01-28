import { createRouter, createWebHistory } from "vue-router";


const getComponent = (file_name: string) => {
    return import(`./Pages/${file_name}.vue`);
}



const per_fix = "/app";
const setRoute = (url: string, name: string, path: string, permission: string | null) => {
    return {
        path: per_fix+url,
        name: name,
        component: ()=> getComponent(path),
        meta: { permissions: permission ?? null},

    }
}

const routes = [
    {
        path: "/app",
        redirect: { name: 'dashboard' }
    },
    setRoute('/:catchAll(.*)', '404', 'errors/404', null),
    setRoute('/unauthorized/user', '401', 'error/401', null),
    setRoute('/dashboard', 'dashboard', 'dashboard/Dashboard', null),
    setRoute('/settings/users', 'users', 'users/Users', null),
    setRoute('/settings/users/create', 'create-user', 'users/CreateUser', null),
    setRoute('/settings/users/edit/:uuid', 'edit-user', 'users/CreateUser', null),
    setRoute('/settings/user-account', 'user-account', 'account/Account', null),
    setRoute('/settings/roles', 'roles', 'roles/Roles', null),
    setRoute('/settings/roles/create', 'create-role', 'roles/CreateRole', null),
    setRoute('/settings/roles/edit/:uuid', 'edit-role', 'roles/CreateRole', null),
    setRoute('/settings/role/details/:uuid', 'role-details', 'roles/RoleDetails', null),
    setRoute('/settings/permissions', 'permissions', 'permissions/Permissions', null),


    // {
    //     path: per_fix+'/dashboard',
    //     name: 'dashboard',
    //     component: import('./Pages/dashboard/DashbordComponent.vue'),
    //     meta: { permissions: '' ?? null },

    // }



]
const router = createRouter({
    history: createWebHistory(),
    routes,
});


export default router;
