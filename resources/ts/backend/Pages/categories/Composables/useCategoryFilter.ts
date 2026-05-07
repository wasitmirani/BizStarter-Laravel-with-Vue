
// ─── Types ────────────────────────────────────────────────────────────────────

import { Helpers } from "../../../Utils/Helper";

export interface UserFilters {
    search: string;
    sort_by: string;
    sort_dir: string;
    per_page: number;
}

export interface FilterOption {
    value: string;
    label: string;
}

// ─── Static Option Lists ──────────────────────────────────────────────────────

export const sortOptions: FilterOption[] = [
    { value: 'id', label: 'ID' },
    { value: 'name', label: 'Name' },
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
    sort_by: 'id',
    sort_dir: 'desc',
    per_page: 10,
};

// ─── Composable ───────────────────────────────────────────────────────────────

export function useUserFilter(
    initialFilters: UserFilters,
    emit: (event: 'filterChange', payload: UserFilters) => void
) {
    // Merge incoming props with defaults (props win over defaults)
    const filters = Helpers.useDynamicReactive<UserFilters>({
        search:    initialFilters.search    || defaultFilters.search,
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
