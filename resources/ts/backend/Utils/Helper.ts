



import { useRoute } from "vue-router";
import { ref, onMounted,inject, Ref, UnwrapRef, reactive, UnwrapNestedRefs, defineAsyncComponent,computed, watch } from "vue";
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
    useDynamicComputed<T>(getter: () => T) {
        return computed(getter);
    }
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
                return "badge bg-primary/15 text-primary"
                break;
            case 'success':
                return "badge bg-success/15 text-success"
                break;
            case 'danger':
                return "badge bg-danger/15 text-danger"
                break;
            case 'warning':
                return "badge bg-warning/15 text-warning"
                break;
            case 'info':
                return "badge bg-info/15 text-info"
                break;
            case 'dark':
                return "badge bg-dark/15 text-dark"
                break;
            case 'light':
                return "badge bg-light/15 text-dark"
                break;
            default:
                return "badge bg-dark/15 text-white hover:bg-dark-hover"
                break;
        }
    }

    capitalize(str?: string): string {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
  }
}


export const Helpers = new Helper();
// Attach the Helpers class to the global object for easy access
if (typeof global !== "undefined") {
    global.Helpers = Helpers; // For Node.js
} else if (typeof window !== "undefined") {
    window.Helpers = Helpers; // For browser environment
}
