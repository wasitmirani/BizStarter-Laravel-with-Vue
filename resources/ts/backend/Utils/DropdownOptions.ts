export const genderDropdownItems = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
];

export const maritalStatusDropdownItems = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' }
];


export const sortableFilterDropdownItems = [
    { value: 'status', label: 'Status' },
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' }
];
export class DropdownOptions {
    static genderOptions() {
        return genderDropdownItems;
    }

    static maritalStatusOptions() {
        return maritalStatusDropdownItems;
    }

    static sortableFilterOptions() {
        return sortableFilterDropdownItems;
    }

    static getUsersListOptions(users: any[]) {
        console.log("users",users)
        if (!users || users.length === 0) {
            return [];
        }
        return users.map(user => ({
            value: Number(user.id),
            label: `${user.name}`
        }));
    }
    static getPermissionsListOptions(permissions: any[]) {
        if (!permissions || permissions.length === 0) {
            return [];
        }
        return permissions?.map(permission => ({
            value: Number(permission.id),
            label: permission.name
        }));
    }
}
