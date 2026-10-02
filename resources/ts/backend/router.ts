import { createRouter, createWebHistory } from "vue-router";
import { usePermissionsStore } from "../shared/stores/permissionsStore";

const getComponent = (file_name: string) => {
    return import(`./Pages/${file_name}.vue`);
};

const per_fix = "/app";

const setRoute = (url: string, name: string, path: string, permission: string | null) => {
    return {
        path: per_fix + url,
        name: name,
        component: () => getComponent(path),
        meta: { permissions: permission ?? null },
    };
};

const routes = [
    {
        path: "/app",
        redirect: { name: "dashboard" },
    },

    setRoute("/unauthorized/user", "401", "errors/401", null),
    setRoute("/dashboard", "dashboard", "Dashboard/Dashboard", null),

    // Users
    setRoute("/management/users", "users", "User/Users", "users-list"),
    setRoute("/management/user/create", "create-user", "User/User", "create-user"),
    setRoute("/management/user/edit/:uuid", "edit-user", "User/User", "edit-user"),
    setRoute("/management/user/:uuid", "show-user", "User/UserShow", "show-user"),

    // Tenants
    setRoute("/management/tenants", "tenants", "Tenant/Tenants", "tenants-list"),
    setRoute("/management/tenant/create", "create-tenant", "Tenant/Tenant", "create-tenant"),
    setRoute("/management/tenant/edit/:id", "edit-tenant", "Tenant/Tenant", "edit-tenant"),
    setRoute("/management/tenant/:id", "show-tenant", "Tenant/TenantShow", "show-tenant"),

    // Roles
    setRoute("/management/roles", "roles", "Role/Roles", "roles-list"),
    setRoute("/management/role/create", "create-role", "Role/Role", "create-role"),
    setRoute("/management/roles/edit/:id", "edit-role", "Role/Role", "edit-role"),
    setRoute("/management/role/details/:id", "show-role", "Role/RoleShow", "show-role"),

    // Permissions
    setRoute("/management/permissions", "permissions", "Permission/Permissions", "permissions-list"),
    setRoute("/management/permission/create", "create-permission", "Permission/Permission", "create-permission"),
    setRoute("/management/permission/edit/:id", "edit-permission", "Permission/Permission", "edit-permission"),
    setRoute("/management/permission/details/:id", "show-permission", "Permission/PermissionShow", "show-permission"),

    // Settings
    setRoute("/settings/user-account", "user-account", "account/Account", null),
    setRoute("/settings/app-config", "app-config", "Settings/AppConfig", null),

    // Catch-all
    setRoute("/:catchAll(.*)", "404", "errors/404", null),
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, _from, next) => {
    const required = to.meta?.permissions as string | null | undefined;
    if (!required) {
        return next();
    }

    const store = usePermissionsStore();
    if (!store.names?.length) {
        store.initFromWindow();
    }

    if (store.has(required)) {
        return next();
    }

    return next({ name: "401" });
});

export default router;
