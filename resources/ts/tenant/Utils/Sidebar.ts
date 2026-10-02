export default class SidebarMenu {
    private per_fix = "/app";

    setSingleMenu = (title: string, icon: string, link: string, can?: string) => {
        return {
            title,
            type: "single",
            icon,
            link: this.per_fix + link,
            can,
        };
    };

    setMultiMenu = (title: string, icon: string, can?: string, sub_menu?: any) => {
        return {
            title,
            icon,
            can,
            type: "multi",
            sub_menu,
        };
    };

    setSubMenu = (title: string, link: string, can?: string) => {
        return {
            title,
            link: this.per_fix + link,
            can,
        };
    };

    setHeadingMenu = (title: string) => {
        return {
            title,
            type: "heading",
        };
    };

    getMenuList(): any[] {
        return [
            this.setHeadingMenu("Analytics"),
            this.setMultiMenu("Dashboards", "layout-dashboard", undefined, [
                this.setSubMenu("Dashboard", "/dashboard", undefined),
            ]),

            this.setHeadingMenu("Tools"),
            this.setMultiMenu("Settings", "settings", undefined, [
                this.setSubMenu("Account", "/settings/user-account", undefined),
            ]),
        ];
    }
}
