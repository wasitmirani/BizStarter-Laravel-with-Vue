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
    setRoute('/unauthorized/user', '401', 'errors/401', null),
    setRoute('/dashboard', 'dashboard', 'dashboard/Dashboard', null),

    // Catalog Routes
    setRoute('/categories', 'categories', 'categories/Categories', 'categories-list'),
    setRoute('/categories/create', 'create-category', 'categories/Category', 'create-category'),
    setRoute('/categories/edit/:uuid', 'edit-category', 'categories/Category', 'edit-category'),
    setRoute('/categories/:uuid', 'show-category', 'categories/CategoryShow', 'show-category'),
    setRoute('/brands', 'brands', 'brands/Brands', 'brands-list'),
    setRoute('/brands/create', 'create-brand', 'brands/Brand', 'create-brand'),
    setRoute('/brands/edit/:uuid', 'edit-brand', 'brands/Brand', 'edit-brand'),
    setRoute('/products', 'products', 'products/Products', 'products-list'),
    setRoute('/products/create', 'create-product', 'products/Product', 'create-product'),
    setRoute('/products/edit/:uuid', 'edit-product', 'products/Product', 'edit-product'),
    setRoute('/products/:uuid', 'show-product', 'products/ProductShow', 'show-product'),
    setRoute('/variants', 'variants', 'variants/Variants', 'variants-list'),
    setRoute('/variants/create', 'create-variant', 'variants/Variant', 'create-variant'),
    setRoute('/variants/edit/:uuid', 'edit-variant', 'variants/Variant', 'edit-variant'),
    setRoute('/variants/:uuid', 'show-variant', 'variants/VariantShow', 'show-variant'),

    // Managment Routes
    setRoute('/management/users', 'users', 'User/Users', 'users-list'),
    setRoute('/management/users/create', 'create-user', 'User/User', 'create-user'),
    setRoute('/management/users/edit/:uuid', 'edit-user', 'User/User', 'edit-user'),
    setRoute('/management/users/:uuid', 'show-user', 'User/UserShow','show-user'),
    setRoute('/management/roles', 'roles', 'Role/Roles', 'roles-list'),
    setRoute('/management/roles/create', 'create-role', 'Role/Role', 'create-role'),
    setRoute('/management/roles/edit/:uuid', 'edit-role', 'Role/Role', 'edit-role'),
    setRoute('/management/role/details/:uuid', 'show-role', 'Role/RoleShow', 'show-role'),
    setRoute('/management/permissions', 'permissions', 'Permission/Permissions', null),


    //Settings Routes
    setRoute('/settings/user-account', 'user-account', 'account/Account', null),


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
