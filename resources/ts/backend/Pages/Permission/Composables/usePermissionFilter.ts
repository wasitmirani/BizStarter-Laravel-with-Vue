
// ─── Types ────────────────────────────────────────────────────────────────────

import { Helpers } from "../../../Utils/Helper";

export interface PermissionFilters {
    search: string;
    role: string;
    status: string;
    date_from: string;
    date_to: string;
    sort_by: string;
    sort_dir: string;
    per_page: string;
    date_range: string;
}

export interface FilterOption {
    value: string;
    label: string;
}

// ─── Static Option Lists ──────────────────────────────────────────────────────

export const roles: FilterOption[] = [
    { value: '', label: 'All Roles' },
  
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

export const dateRanges: FilterOption[] = [
    { value: '1', label: 'Today' },
    { value: '7', label: 'Last 7 Days' },
    { value: '30', label: 'Last 30 Days' },
    { value: '60', label: 'Last 60 Days' },
    { value: '90', label: 'Last 90 Days' },
    { value: '360', label: 'This Year' },
];
// ─── Default Filter Values ────────────────────────────────────────────────────

export const defaultFilters: PermissionFilters = {
    search: '',
    role: '',
    status: '',
    date_from: '',
    date_to: '',
    sort_by: 'id',
    sort_dir: 'desc',
    per_page: '10',
    date_range:'',
};

// ─── Composable ───────────────────────────────────────────────────────────────

export function usePermissionFilter(
    initialFilters: PermissionFilters,
    emit: (event: 'filterChange', payload: PermissionFilters) => void
) {
    // Merge incoming props with defaults (props win over defaults)
    const filters = Helpers.useDynamicReactive<PermissionFilters>({
        search:    initialFilters.search    || defaultFilters.search,
        role:      initialFilters.role      || defaultFilters.role,
        status:    initialFilters.status    || defaultFilters.status,
        date_from: initialFilters.date_from || defaultFilters.date_from,
        date_to:   initialFilters.date_to   || defaultFilters.date_to,
        sort_by:   initialFilters.sort_by   || defaultFilters.sort_by,
        sort_dir:  initialFilters.sort_dir  || defaultFilters.sort_dir,
        per_page:  initialFilters.per_page  || defaultFilters.per_page,
        date_range: initialFilters.date_range  || defaultFilters.date_range,
    });

    const onSubmit = (): void => {
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
