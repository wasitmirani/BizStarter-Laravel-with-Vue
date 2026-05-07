export interface FilterOption {
    value: string | number;
    label: string;
}

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
