export interface FilterOption {
    value: string | number;
    label: string;
}

export const statuses: FilterOption[] = [
    { value: "", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "suspended", label: "Suspended" },
    { value: "on-leave", label: "On Leave" },
];

export const types: FilterOption[] = [
    { value: "", label: "All Types" },
    { value: "driver", label: "Driver" },
    { value: "clearing-agent", label: "Clearing Agent" },
];

export const perPageOptions: FilterOption[] = [
    { value: 10, label: "10 / page" },
    { value: 20, label: "20 / page" },
    { value: 50, label: "50 / page" },
    { value: 100, label: "100 / page" },
];

export const dateRanges: FilterOption[] = [
    { value: "", label: "All Time" },
    { value: 1, label: "Today" },
    { value: 7, label: "Last 7 Days" },
    { value: 30, label: "Last 30 Days" },
    { value: 90, label: "Last 90 Days" },
];
