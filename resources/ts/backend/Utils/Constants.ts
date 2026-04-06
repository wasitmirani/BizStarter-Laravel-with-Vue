import {CommonFilters} from './Common';

export const defaultFilters: CommonFilters = {
    search: '',
    role: '',
    status: '',
    page: 1,
    per_page: 20,
    sort_by: 'id',
    paginated: true,
    sort_dir: 'desc',
    date_from: '',
    date_to: '',
    date_range: '',
};
