

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
            "sub_menu": sub_menu, // Initialize an empty array for sub-menu
        }
    }
    setSubMenu = (title: string,  link: string, can?: string) => {
        return {
            "title": title,
            // "icon": icon,
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
            this.setMultiMenu('Dashboards', 'basket', 'dashboard-view',
                 [
                    this.setSubMenu('Dashboard', '/dashboard', 'dashboard-view'),

                ]
            ),

            // this.setHeadingMenu('Management & Apps'),
            this.setMultiMenu('Catalog', 'users ', 'Catalog',
                [
                    this.setSubMenu('Account ', '/settings/user-account', 'account-view'),
                    this.setSubMenu('Users', '/settings/users', 'users-view'),
                    this.setSubMenu('Roles', '/settings/roles', 'roles-view'),
                ]
            ),
            this.setSingleMenu('Calendar', 'calendar-event', '/calendar', 'calendar-view'),
            this.setHeadingMenu('Tools & Sessions'),
            this.setMultiMenu('Settings', 'settings', 'Settings',
                [
                    this.setSubMenu('Account ', '/settings/users-list', 'account-view'),
                    // this.setSubMenu('Users', '/settings/users', 'users-view'),
                    // this.setSubMenu('Roles', '/settings/roles', 'roles-view'),
                ]
            ),



        ];
    }

}
