/**
 * ApexCharts ships with the Alloce template as a public ES module.
 * It is preloaded by the Blade layout, so a dynamic import keeps it out of the
 * main bundle while still letting us build real charts from API data.
 */
const APEX_URL = '/assets/apexcharts.esm-CF-OO0O0.js';

type ApexConstructor = new (el: Element, options: Record<string, unknown>) => {
    destroy: () => void;
    updateOptions: (options: Record<string, unknown>, redraw?: boolean) => void;
};

let loader: Promise<ApexConstructor> | null = null;

export function loadApexCharts(): Promise<ApexConstructor> {
    if (!loader) {
        loader = import(/* @vite-ignore */ APEX_URL)
            .then((module: Record<string, unknown>) => {
                const candidate = (module.default ?? module.t ?? module.ApexCharts) as ApexConstructor | undefined;
                if (!candidate) {
                    throw new Error('ApexCharts module did not expose a constructor');
                }
                return candidate;
            })
            .catch((error) => {
                loader = null;
                throw error;
            });
    }

    return loader;
}

export function chartTheme() {
    const styles = getComputedStyle(document.documentElement);
    const read = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;

    return {
        text: read('--lk-text-muted', '#64748b'),
        grid: read('--lk-border', '#e2e8f0'),
        primary: read('--lk-primary', '#059669'),
        surface: read('--lk-card', '#ffffff'),
    };
}
