export const hasUuid = (uuid?: string): boolean => {
    if (!uuid) {
        return false
    }
    return true
}


export interface  CommonFilters {
    search: string;
    role: string;
    status: string;
    page: number;
    per_page: number;
    sort_by: string;
    paginated: boolean;
    sort_dir: 'asc' | 'desc';
    date_from: string;
    date_to: string;
    date_range: string;
}



