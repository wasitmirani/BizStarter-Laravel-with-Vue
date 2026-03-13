// composables/useUsers.ts
import { ref, reactive, computed } from 'vue'
import { UserService } from '../../../Services/user/UserService'
import { DropdownOptions } from '../../../Utils/DropdownOptions'
import { Helpers } from '../../../Utils/Helper'
import { useDropDownsStore } from '../../../Stores/DropDownsStore'


export function useUsers() {
    const router =Helpers.router()
    const route = Helpers.route();
    const dropdownsStore = useDropDownsStore()

    // State
    const users = Helpers.useDynamicRef([])
    const roles = Helpers.useDynamicReactive([])
    const currentPage = Helpers.useDynamicRef(1)
    const toast = Helpers.useDynamicInject('toast')
    const isLoading = Helpers.useDynamicRef(false)
    const sortableFilterOptions = computed(() => DropdownOptions.sortableFilterOptions())

    // Reactive filter state
    const filters = reactive({
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
    })

    // Helper function to build query parametersne
    const buildQueryParams = () => {
        const params: Record<string, string | undefined> = {
            page: filters.page.toString(),
            per_page: filters.per_page.toString(),
            search: filters.search || undefined,
            role: filters.role || undefined,
            status: filters.status || undefined,
            sort_by: filters.sort_by || undefined,
            sort_dir: filters.sort_dir || undefined,
            date_from: filters.date_from || undefined,
            date_to: filters.date_to || undefined,
            paginated: filters.paginated ? 'true' : 'false',
        }

        // Remove undefined values
        Object.keys(params).forEach(key => {
            if (params[key] === undefined) delete params[key]
        })

        return params
    }

    // Update URL with all query parameters
    const updateUrlWithFilters = () => {
        const query = { ...route.query }

        // Update query parameters
        Object.keys(filters).forEach(key => {
            const value = filters[key as keyof typeof filters]
            if (value && value !== '' && !(key === 'page' && value === 1)) {
                query[key] = value.toString()
            } else {
                delete query[key]
            }
        })

        router.replace({ query })
    }

    // Load filters from URL query parameters
    const loadFiltersFromUrl = () => {
        const query = route.query

        filters.search = query.search?.toString() || ''
        filters.role = query.role?.toString() || ''
        filters.status = query.status?.toString() || ''
        filters.page = parseInt(query.page?.toString() || '1')
        filters.per_page = parseInt(query.per_page?.toString() || '10')
        filters.sort_by = query.sort_by?.toString() || 'id'
        filters.sort_dir = query.sort_dir?.toString() || 'desc'
        filters.date_from = query.date_from?.toString() || ''
        filters.date_to = query.date_to?.toString() || ''
        filters.paginated = query.paginated !== 'false'

        currentPage.value = filters.page
    }

    // Fetch users
    const fetchUsers = async (page?: number, per_page?: number) => {
        // Update filters if parameters provided
        if (page !== undefined) filters.page = page
        if (per_page !== undefined) filters.per_page = per_page

        currentPage.value = filters.page
        isLoading.value = true

        const params = buildQueryParams()

        try {
            const res = await UserService.users(params)
            users.value = res.data.result.users
            // toast.value.showToast(res.status, 'User Data', res.data)
        } catch (err: any) {
            console.log("err:", err.response?.data?.message)
            toast.value?.showToast(
                err.status,
                'Error: ' + err.status,
                err.response?.data?.message
            )
        } finally {
            setTimeout(() => {
                isLoading.value = false
            }, 1000)
        }
    }

    // Handle filter changes
    const handleFilterChange = (newFilters: Partial<typeof filters>) => {
        Object.assign(filters, newFilters)
        filters.page = 1 // Reset to first page when filters change
        updateUrlWithFilters()
        fetchUsers()
    }

    // Handle search input changes
    const handleSearchChange = (searchTerm: string) => {
        filters.search = searchTerm
        filters.page = 1 // Reset to first page when search changes
        updateUrlWithFilters()
        fetchUsers()
    }

    // Handle search query
    const handleSearchQuery = (query: string) => {
        handleSearchChange(query)
    }

    // Set loading state
    const setLoading = (value: boolean) => {
        isLoading.value = value
    }

    // Filter data handler
    const filterData = (data: any) => {
        users.value = data.result.users
    }

    // Reset filters to default
    const resetFilters = () => {
        filters.search = ''
        filters.role = ''
        filters.status = ''
        filters.page = 1
        filters.per_page = 20
        filters.sort_by = 'id'
        filters.sort_dir = 'desc'
        filters.date_from = ''
        filters.date_to = ''
        filters.paginated = true

        updateUrlWithFilters()
        fetchUsers()
    }

    // Initialize on mount
    const init = () => {
        loadFiltersFromUrl()
        fetchUsers()
    }

    return {
        // State
        users,
        roles,
        currentPage,
        isLoading,
        filters,
        sortableFilterOptions,

        // Methods
        fetchUsers,
        handleFilterChange,
        handleSearchChange,
        handleSearchQuery,
        setLoading,
        filterData,
        resetFilters,
        init,

        // Utilities
        loadFiltersFromUrl,
        updateUrlWithFilters,
    }
}
