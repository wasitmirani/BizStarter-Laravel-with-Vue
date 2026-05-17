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
    setRoute('/products/:uuid/add-variants', 'add-product-variants', 'products/ProductAddVariants', 'create-variant'),
    setRoute('/products/:uuid', 'show-product', 'products/ProductShow', 'show-product'),
    setRoute('/variants', 'variants', 'variants/Variants', 'variants-list'),
    setRoute('/variants/create', 'create-variant', 'variants/Variant', 'create-variant'),
    setRoute('/variants/edit/:uuid', 'edit-variant', 'variants/Variant', 'edit-variant'),
    setRoute('/variants/:uuid', 'show-variant', 'variants/VariantShow', 'show-variant'),

    // Purchases Routes
    setRoute('/purchase-orders', 'purchase-orders', 'purchaseOrders/PurchaseOrders', 'purchase-orders-list'),
    setRoute('/purchase-orders/create', 'create-purchase-order', 'purchaseOrders/PurchaseOrder', 'create-purchase-order'),
    setRoute('/purchase-orders/edit/:uuid', 'edit-purchase-order', 'purchaseOrders/PurchaseOrder', 'edit-purchase-order'),
    setRoute('/purchase-orders/:uuid', 'show-purchase-order', 'purchaseOrders/PurchaseOrderShow', 'show-purchase-order'),
    setRoute('/purchase/suppliers', 'suppliers', 'Supplier/Suppliers', 'suppliers-list'),
    setRoute('/purchase/supplier/create', 'create-supplier', 'Supplier/Supplier', 'create-supplier'),
    setRoute('/purchase/supplier/edit/:id', 'edit-supplier', 'Supplier/Supplier', 'edit-supplier'),
    setRoute('/purchase/supplier/details/:id', 'show-supplier', 'Supplier/SupplierShow', 'show-supplier'),

    // Managment Routes
    
    // Users
    setRoute('/management/users', 'users', 'User/Users', 'users-list'),
    setRoute('/management/user/create', 'create-user', 'User/User', 'create-user'),
    setRoute('/management/user/edit/:uuid', 'edit-user', 'User/User', 'edit-user'),
    setRoute('/management/user/:uuid', 'show-user', 'User/UserShow','show-user'),

    // Roles
    setRoute('/management/roles', 'roles', 'Role/Roles', 'roles-list'),
    setRoute('/management/role/create', 'create-role', 'Role/Role', 'create-role'),
    setRoute('/management/roles/edit/:id', 'edit-role', 'Role/Role', 'edit-role'),
    setRoute('/management/role/details/:id', 'show-role', 'Role/RoleShow', 'show-role'),

    // Permissions
    setRoute('/management/permissions', 'permissions', 'Permission/Permissions', 'permissions-list'),
    setRoute('/management/permission/create', 'create-permission', 'Permission/Permission', 'create-permission'),
    setRoute('/management/permission/edit/:id', 'edit-permission', 'Permission/Permission', 'edit-permission'),
    setRoute('/management/permission/details/:id', 'show-permission', 'Permission/PermissionShow', 'show-permission'),

    // Warehouses
    setRoute('/management/warehouses', 'warehouses', 'Warehouse/Warehouses', 'warehouses-list'),
    setRoute('/management/warehouse/create', 'create-warehouse', 'Warehouse/Warehouse', 'create-warehouse'),
    setRoute('/management/warehouse/edit/:id', 'edit-warehouse', 'Warehouse/Warehouse', 'edit-warehouse'),
    setRoute('/management/warehouse/details/:id', 'show-warehouse', 'Warehouse/WarehouseShow', 'show-warehouse'),
    // Tenants
    setRoute('/management/tenants', 'tenants', 'Tenant/Tenants', null),
    setRoute('/management/tenant/create', 'create-tenant', 'Tenant/Tenant', null),
    setRoute('/management/tenant/edit/:id', 'edit-tenant', 'Tenant/Tenant', null),



    //Settings Routes
    setRoute('/settings/user-account', 'user-account', 'account/Account', null),
    setRoute('/settings/tenant', 'tenant-settings', 'Settings/TenantSettings', null),
    setRoute('/settings/app-config', 'app-config', 'Settings/AppConfig', null),


    // Sale Orders
    setRoute('/sale-orders', 'sale-orders', 'SaleOrder/SaleOrders', 'sale-orders-list'),

    // Catch-all routes MUST be at the end
    setRoute('/:catchAll(.*)', '404', 'Errors/404', null),


]
const router = createRouter({
    history: createWebHistory(),
    routes,
});


export default router;
