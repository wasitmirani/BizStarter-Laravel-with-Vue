
// ─── Types ────────────────────────────────────────────────────────────────────

import { Helpers } from "../../../Utils/Helper";

export interface UserFilters {
    search: string;
    role: string;
    status: string;
    date_from: string;
    date_to: string;
    sort_by: string;
    sort_dir: string;
    per_page: string;
}

export interface FilterOption {
    value: string;
    label: string;
}

// ─── Static Option Lists ──────────────────────────────────────────────────────

export const roles: FilterOption[] = [
    { value: '', label: 'All Roles' },
    { value: 'Security Officer', label: 'Security Officer' },
    { value: 'Project Manager', label: 'Project Manager' },
    { value: 'Developer', label: 'Developer' },
    { value: 'Support Lead', label: 'Support Lead' },
];

export const statuses: FilterOption[] = [
    { value: '', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Suspended', label: 'Suspended' },
];

export const sortOptions: FilterOption[] = [
    { value: 'id', label: 'ID' },
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'created_at', label: 'Date Created' },
    { value: 'updated_at', label: 'Last Updated' },
];

export const sortDirOptions: FilterOption[] = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
];

export const perPageOptions: FilterOption[] = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '15', label: '15' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
];

// ─── Default Filter Values ────────────────────────────────────────────────────

export const defaultFilters: UserFilters = {
    search: '',
    role: '',
    status: '',
    date_from: '',
    date_to: '',
    sort_by: 'id',
    sort_dir: 'desc',
    per_page: '10',
};

// ─── Composable ───────────────────────────────────────────────────────────────

export function useUserFilter(
    initialFilters: UserFilters,
    emit: (event: 'filterChange', payload: UserFilters) => void
) {
    // Merge incoming props with defaults (props win over defaults)
    const filters = Helpers.useDynamicReactive<UserFilters>({
        search:    initialFilters.search    || defaultFilters.search,
        role:      initialFilters.role      || defaultFilters.role,
        status:    initialFilters.status    || defaultFilters.status,
        date_from: initialFilters.date_from || defaultFilters.date_from,
        date_to:   initialFilters.date_to   || defaultFilters.date_to,
        sort_by:   initialFilters.sort_by   || defaultFilters.sort_by,
        sort_dir:  initialFilters.sort_dir  || defaultFilters.sort_dir,
        per_page:  initialFilters.per_page  || defaultFilters.per_page,
    });

    const onSubmit = (): void => {
        console.log('Filters Applied:', filters);
        emit('filterChange', { ...filters });
    };

    const resetFilters = (): void => {
        Object.assign(filters, defaultFilters);
        emit('filterChange', { ...filters });
    };

    return {
        filters,
        onSubmit,
        resetFilters,
    };
}