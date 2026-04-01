

export default class SidebarMenu {

    private per_fix = "/app";

    setSingleMenu = (title: string, icon: string, link: string, can?: string) => {
        return {
            "title": title,
            "type": 'single',
            "icon": icon,
            "link": this.per_fix + link,
            "can": can,
        }
    }
    setMultiMenu = (title: string, icon: string, can?: string, sub_menu?: any) => {
        return {
            "title": title,
            "icon": icon,
            "can": can,
            "type": "multi",
            "sub_menu": sub_menu,
        }
    }
    setSubMenu = (title: string,  link: string, can?: string) => {
        return {
            "title": title,
            "link": this.per_fix + link,
            "can": can,

        }
    }
    setHeadingMenu = (title: string) => {
        return {
            "title": title,
            "type": "heading",
        }
    }
    getMenuList(): any[] {
        return [
            this.setHeadingMenu('Analytics'),
            this.setMultiMenu('Dashboards', 'layout-dashboard', undefined, [
                    this.setSubMenu('Dashboard', '/dashboard', undefined),
                ]
            ),

            this.setHeadingMenu('Modules & Apps'),
            this.setMultiMenu('Catalog', 'catalog ', 'Catalog',
                [
                    this.setSubMenu('Categories', '/categories', 'categories-view'),
                    this.setSubMenu('Products', '/products', 'products-view'),
                ]
            ),
            this.setHeadingMenu('Management & Apps'),
            this.setMultiMenu('Users Management', 'users', undefined, [
                    this.setSubMenu('Users', '/management/users', 'users-list'),
                    this.setSubMenu('Roles', '/management/roles', 'roles-list'),
                    this.setSubMenu('Permissions & Policy', '/management/permissions', undefined),
                ]
            ),
            this.setSingleMenu('Calendar', 'calendar', '/calendar', undefined),
            this.setHeadingMenu('Tools & Sessions'),
            this.setMultiMenu('Settings', 'settings', undefined, [
                    this.setSubMenu('Account', '/settings/user-account', undefined),
                    this.setSubMenu('App config', '/settings/app-config', undefined),
                ]
            ),
        ];
    }

}
