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

    setRoute('/unauthorized/user', '401', 'Errors/401', null),
    setRoute('/dashboard', 'dashboard', 'Dashboard/Dashboard', null),

    // Managment Routes
    // Users
    setRoute('/management/users', 'users', 'User/Users', 'users-list'),
    setRoute('/management/user/create', 'create-user', 'User/User', 'create-user'),
    setRoute('/management/user/edit/:uuid', 'edit-user', 'User/User', 'edit-user'),
    setRoute('/management/user/:uuid', 'show-user', 'User/UserShow','show-user'),

    // Roles and Permissions
    setRoute('/management/roles', 'roles', 'Role/Roles', 'roles-list'),
    setRoute('/management/role/create', 'create-role', 'Role/Role', 'create-role'),
    setRoute('/management/roles/edit/:id', 'edit-role', 'Role/Role', 'edit-role'),
    setRoute('/management/role/details/:id', 'show-role', 'Role/RoleShow', 'show-role'),
    setRoute('/management/permissions', 'permissions', 'Permission/Permissions', null),


    //Settings Routes
    setRoute('/settings/user-account', 'user-account', 'account/Account', null),

    // Catch-all routes MUST be at the end
    setRoute('/:catchAll(.*)', '404', 'Errors/404', null),


]
const router = createRouter({
    history: createWebHistory(),
    routes,
});


export default router;
