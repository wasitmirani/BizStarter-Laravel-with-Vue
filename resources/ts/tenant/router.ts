import { createRouter, createWebHistory } from "vue-router";
import { usePermissionsStore } from "../shared/stores/permissionsStore";

const getComponent = (file_name: string) => {
    return import(`./Pages/${file_name}.vue`);
};

const per_fix = "/app";

const setRoute = (url: string, name: string, path: string, permission: string | null = null) => {
    return {
        path: per_fix + url,
        name,
        component: () => getComponent(path),
        meta: { permissions: permission ?? null },
    };
};

const routes = [
    {
        path: "/",
        redirect: { name: "dashboard" },
    },
    {
        path: "/app",
        redirect: { name: "dashboard" },
    },

    setRoute("/unauthorized/user", "401", "errors/401", null),
    setRoute("/dashboard", "dashboard", "Dashboard/Dashboard", null),

    // Settings
    setRoute("/settings/user-account", "user-account", "account/Account", null),

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
