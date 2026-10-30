export type PortalMenuItem = {
    title: string;
    icon?: string;
    type: 'single' | 'group' | 'heading';
    link?: string;
    can?: string | null;
    children?: PortalMenuItem[];
};

/**
 * Single source of truth for sidebar navigation.
 * Only modules backed by real routes and permissions are listed here.
 */
export default class SidebarMenu {
    private per_fix = '/app';

    private single(title: string, icon: string, link: string, can?: string): PortalMenuItem {
        return {
            title,
            type: 'single',
            icon,
            link: this.per_fix + link,
            can: can ?? null,
        };
    }

    private group(title: string, icon: string, children: PortalMenuItem[]): PortalMenuItem {
        return {
            title,
            type: 'group',
            icon,
            children,
        };
    }

    private heading(title: string): PortalMenuItem {
        return {
            title,
            type: 'heading',
        };
    }

    getMenuList(): PortalMenuItem[] {
        return [
            this.heading('Overview'),
            this.single('Dashboard', 'layout-dashboard', '/dashboard'),

            this.heading('Access control'),
            this.group('Access control', 'shield-check', [
                this.single('Users', 'users', '/management/users', 'users-list'),
                this.single('Roles', 'badge-check', '/management/roles', 'roles-list'),
                this.single('Permissions', 'key-round', '/management/permissions', 'permissions-list'),
            ]),

            this.heading('Operations'),
            this.single('Activity log', 'activity', '/activity', 'activity-list'),
            this.single('Reports', 'file-text', '/reports', 'reports-list'),

            this.heading('Workspace'),
            this.single('My profile', 'user-circle', '/settings/user-account'),
            this.single('App config', 'sliders-horizontal', '/settings/app-config'),
        ];
    }
}
