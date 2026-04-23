



import { useRoute } from "vue-router";
import { ref, onMounted,inject, Ref, UnwrapRef, reactive, UnwrapNestedRefs, defineAsyncComponent,computed, watch,ComputedRef  } from "vue";
import router from "../router"
import Swal from 'sweetalert2'
import * as moment from "moment";


class Helper {

    public static base_url = window.location.origin;

    useDynamicReactive<T extends object>(initialValue: T): UnwrapNestedRefs<T> {
        return reactive(initialValue);
    }
    useDynamicRef<T>(initialValue: T): Ref<UnwrapRef<T>> {
        return ref(initialValue) as Ref<UnwrapRef<T>>;
    }
    useDynamicInject<T>(key: string, defaultValue: T): Ref<UnwrapRef<T>> {
        return inject(key, ref(defaultValue)) as Ref<UnwrapRef<T>>;
    }   useDynamicOnMounted(callback?: () => void) {
        onMounted(() => {
            // Execute any optional code when the component mounts
            if (callback) {
                callback();
            }

            // Return the onMounted function if needed
            return onMounted;
        });
    }
    useDynamicDefineAsyncComponent(loader: () => Promise<any>, callback?: () => void) {
        return defineAsyncComponent(() => loader().then(component => {
            if (callback) {
                onMounted(() => {
                    callback();
                });
            }
            return component;
        }));
    }
     // ─────────────────────────────────────────
  // Readonly computed
  // ─────────────────────────────────────────
   useDynamicComputed<T>(getter: () => T): ComputedRef<T>;

  // ─────────────────────────────────────────
  // Writable computed (get/set)
  // ─────────────────────────────────────────
   useDynamicComputed<T>(options: {
    get: () => T;
    set: (value: T) => void;
  }): ComputedRef<T>;

  // ─────────────────────────────────────────
  // Implementation
  // ─────────────────────────────────────────
   useDynamicComputed<T>(input: any) {
    if (typeof input === 'function') {
      return computed(input);
    }

    return computed({
      get: input.get,
      set: input.set,
    });
  }

  // (optional) add more helpers here

    useDynamicWatch<T>(source: any, callback: (value: T, oldValue: T) => void) {
        return watch(source, callback);
     }
    route = () => {
        return useRoute();
    };

    Swal = () => {
        return Swal;
    }
    router = () => {
        return router;
    }
    navigateTo(routeName: string) {
        return router.push({ name: routeName });
    }

    appendValidateClass = (errors: any, value: string) => {
        if (errors && errors[value])
            return "validate";
    }

    auth() {
        return window.user;
    }

    DateTimeFormat(date: String) {
        return moment.utc(String(date)).local().format('DD-MMM-YYYY , h:mm a')
    }
    HourFormat(date: String) {
        return moment.utc(String(date)).local().fromNow();
    }

    setStatusBadge(status:string){
        switch (status) {
            case 'primary':
                return "badge bagde-label bg-primary/15 text-primary"
                break;
            case 'success':
                return "badge bagde-label bg-success/15 text-success"
                break;
            case 'danger':
                return "badge bagde-label bg-danger/15 text-danger"
                break;
            case 'warning':
                return "badge bagde-label bg-warning/15 text-warning"
                break;
            case 'info':
                return "badge bagde-label bg-info/15 text-info"
                break;
            case 'dark':
                return "badge bagde-label bg-dark/15 text-dark"
                break;
            case 'light':
                return "badge bagde-label bg-light/15 text-dark"
                break;
            default:
                return "badge bagde-label bg-dark/15 text-white hover:bg-dark-hover"
                break;
        }
    }

    capitalize(str?: string): string {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
    }

     useMultiSelectModel = (source: any,key: string,options: Ref<any[]>     ) => {
    return computed({
        get() {
            if (!options.value?.length) return [];

            const current = source[key] || [];

            return options.value.filter((item: any) => {
                // case: [1,2,3]
                if (typeof current?.[0] === 'number') {
                    return current.includes(item.value);
                }

                // case: [{id,name}] OR [{value,label}]
                return current.some((c: any) =>
                    c?.id === item.value || c?.value === item.value
                );
            });
        },

        set(val: any[]) {
            // store as IDs (clean for API)
            source[key] = val.map(v => v.value);
        }
    });
}

    /**
     * Build a plain query-object from a reactive filters object.
     * - Skips empty values (undefined, null, empty string)
     * - Serializes booleans to "true"/"false"
     * - Optionally omits keys whose value matches provided defaults
     */
    buildQueryFromFilters<T extends Record<string, any>>(
        filters: T,
        options?: {
            defaults?: Partial<T>;
            omitDefaults?: boolean;
        }
    ): Record<string, string> {
        const query: Record<string, string> = {};
        const defaults = options?.defaults ?? {};
        const omitDefaults = options?.omitDefaults ?? false;

        Object.entries(filters).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '') {
                return;
            }

            if (
                omitDefaults &&
                Object.prototype.hasOwnProperty.call(defaults, key) &&
                String(value) === String((defaults as Record<string, any>)[key])
            ) {
                return;
            }

            if (typeof value === 'boolean') {
                query[key] = value ? 'true' : 'false';
            } else {
                query[key] = String(value);
            }
        });

        return query;
    }

    /**
     * Load values from a route query object into a reactive filters object.
     * Casting is based on the current type of each filter field:
     * - number  -> parsed with parseInt (if numeric)
     * - boolean -> "false"/"0"/"" => false, otherwise true
     * - other   -> toString()
     */
    loadFiltersFromQuery<T extends Record<string, any>>(
        filters: T,
        query: Record<string, any>
    ): void {
        Object.keys(filters).forEach((key) => {
            if (!Object.prototype.hasOwnProperty.call(query, key)) {
                return;
            }

            const current = (filters as Record<string, any>)[key];
            const raw = query[key];
            const value = Array.isArray(raw) ? raw[0] : raw;

            if (value === undefined || value === null) {
                return;
            }

            if (typeof current === 'number') {
                const parsed = parseInt(String(value), 10);
                if (!isNaN(parsed)) {
                    (filters as Record<string, any>)[key] = parsed;
                }
            } else if (typeof current === 'boolean') {
                const str = String(value).toLowerCase();
                (filters as Record<string, any>)[key] = !(
                    str === 'false' ||
                    str === '0' ||
                    str === ''
                );
            } else {
                (filters as Record<string, any>)[key] = String(value);
            }
        });
    }

    /**
     * Update the current URL's query string using the provided filters.
     * - Existing non-filter query params are preserved
     * - Filter keys are removed then re-applied from the filters object
     */
    updateUrlWithFilters<T extends Record<string, any>>(
        route: any,
        router: any,
        filters: T,
        options?: {
            defaults?: Partial<T>;
            omitDefaults?: boolean;
        }
    ): void {
        const baseQuery: Record<string, any> = { ...route.query };

        Object.keys(filters).forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(baseQuery, key)) {
                delete baseQuery[key];
            }
        });

        const filterQuery = this.buildQueryFromFilters(filters, options);
        router.replace({ query: { ...baseQuery, ...filterQuery } });
    }

    /**
     * Generic helper to merge a partial filter state into an existing one.
     * Useful when new filter fields are added – no extra wiring required.
     */
    mergeFilterState<T extends Record<string, any>>(
        filters: T,
        patch: Partial<T>
    ): T {
        Object.assign(filters, patch);
        return filters;
    }
}


export const Helpers = new Helper();
// Attach the Helpers class to the global object for easy access
if (typeof global !== "undefined") {
    global.Helpers = Helpers; // For Node.js
} else if (typeof window !== "undefined") {
    window.Helpers = Helpers; // For browser environment
}
