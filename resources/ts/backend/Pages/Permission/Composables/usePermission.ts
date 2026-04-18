
import  PermissionService  from '../../../Services/Permission/PermissionService'
import { DropdownOptions } from '../../../Utils/DropdownOptions'
import { Helpers } from '../../../Utils/Helper'
import { useDropDownsStore } from '../../../Stores/DropDownsStore'
import {defaultFilters} from "../../../Utils/Constants";


export function usePermissions() {
    const router =Helpers.router()
    const route = Helpers.route();
    const dropdownsStore = useDropDownsStore()

    // State
    const roles = Helpers.useDynamicRef([])
    const permissions = Helpers.useDynamicRef([])
    const users = Helpers.useDynamicRef([]) // --- IGNORE ---

    // const roles = Helpers.useDynamicComputed(() => dropdownsStore.roles)
    const currentPage = Helpers.useDynamicRef(1)
    const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>(
        'toast',
        { showToast: () => {} }
    )
    const isLoading = Helpers.useDynamicRef(false)
    const sortableFilterOptions = Helpers.useDynamicComputed(() => DropdownOptions.sortableFilterOptions())

    // Default filter values (single source of truth)
    const permissionFilters = {
        ...defaultFilters,
    };

    // Reactive filter state
    const filters = Helpers.useDynamicReactive({ ...permissionFilters })

    // Wrapper for generic URL update helper
    const updateUrlWithFilters = () => {
        Helpers.updateUrlWithFilters(route, router, filters, {
            defaults: permissionFilters,
            omitDefaults: true,
        })
    }

    // Load filters from URL query parameters using generic helper
    const loadFiltersFromUrl = () => {
        Helpers.loadFiltersFromQuery(filters, route.query as Record<string, any>)
        currentPage.value = filters.page
    }

    // Fetch permissions
    const fetchPermissions = async (page?: number, per_page?: number) => {
        // Update filters if parameters provided
        if (page !== undefined) filters.page = page
        if (per_page !== undefined) filters.per_page = per_page

        currentPage.value = filters.page
        isLoading.value = true

        const params = Helpers.buildQueryFromFilters(filters)

        try {
            const res = await PermissionService.permissions(params)
            permissions.value = res.data.result.permissions
            // toast.value.showToast(res.status, 'Permission Data', res.data)
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
        // Update filters: Only update filters present in newFilters,
        // Remaining filters not in newFilters are reset to default
        Object.keys(filters).forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(newFilters, key)) {
                // @ts-ignore
                filters[key] = newFilters[key]
            } else {
                // @ts-ignore
                filters[key] = defaultFilters[key]
            }
        });
        filters.page = 1 // Reset to first page when filters change
        updateUrlWithFilters()
        fetchPermissions()
    }

    // Handle search input changes
    const handleSearchChange = (searchTerm: string) => {
        filters.search = searchTerm
        filters.page = 1 // Reset to first page when search changes
        updateUrlWithFilters()
        fetchPermissions()
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
        roles.value = data?.result?.roles || data?.result || []
    }

    // Reset filters to default
    const resetFilters = () => {
        Object.assign(filters, defaultFilters)
        updateUrlWithFilters()
        fetchPermissions()
    }

    // Initialize on mount
    const init = () => {
        loadFiltersFromUrl()
        dropdownsStore.fetchRoles()
        fetchPermissions()
    }

    return {
        // State
        users,
        roles,
        permissions,
        currentPage,
        isLoading,
        filters,
        sortableFilterOptions,

        // Methods
        fetchPermissions,
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
        dropdownsStore,
    }
}
