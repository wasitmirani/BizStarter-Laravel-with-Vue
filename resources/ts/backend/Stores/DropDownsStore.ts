import { defineStore } from 'pinia';
import { Helpers } from '../Utils/Helper';
import  UserService from '../Services/User/UserService';
import { DropdownService } from '../Services/Settings/SettingsService';

export interface DropdownItem {
  value: string | number;
  label: string;
}

export const useDropDownsStore = defineStore('dropdowns', () => {
  // ─── State ──────────────────────────────────────────────────────────────────
  const roles = Helpers.useDynamicRef<DropdownItem[]>([]);
  const statuses = Helpers.useDynamicRef<DropdownItem[]>([
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
  ]);

  const countries = Helpers.useDynamicRef<DropdownItem[]>([]);
  const timezones = Helpers.useDynamicRef<DropdownItem[]>([]);

  const rolesLoaded = Helpers.useDynamicRef(false);
  const countriesLoaded = Helpers.useDynamicRef(false);
  const timezonesLoaded = Helpers.useDynamicRef(false);

  // ─── Actions ────────────────────────────────────────────────────────────────

  async function fetchRoles() {
    if (rolesLoaded.value) return;
    try {
      const response = await UserService.roles();
      // Assuming API returns an array of roles in response.data or response.data.result
      const data = (response?.data?.roles ?? response?.data ?? []) as any[];
      roles.value = data.map((role: any) => ({
        value: role.id ?? role.value ?? role.name,
        label: role.name ?? role.label ?? String(role.id ?? role),
      }));
      rolesLoaded.value = true;
    } catch (error) {
      console.error('Error fetching roles list:', error);
    }
  }

  async function fetchCountries() {
    if (countriesLoaded.value) return;
    try {
      const data = await DropdownService.countries();
      countries.value = (data ?? []).map((country: any) => ({
        value: country.id ?? country.code ?? country.value,
        label: country.name ?? country.label ?? country.code,
      }));
      countriesLoaded.value = true;
    } catch (error) {
      console.error('Error fetching countries list:', error);
    }
  }

  async function fetchTimezones() {
    if (timezonesLoaded.value) return;
    try {
      const data = await DropdownService.timezones();
      timezones.value = (data ?? []).map((tz: any) => ({
        value: tz.id ?? tz.value ?? tz.name ?? tz.timezone,
        label: tz.name ?? tz.label ?? tz.timezone ?? String(tz),
      }));
      timezonesLoaded.value = true;
    } catch (error) {
      console.error('Error fetching timezones list:', error);
    }
  }

  return {
    // state
    roles,
    statuses,
    countries,
    timezones,
    // actions
    fetchRoles,
    fetchCountries,
    fetchTimezones,
  };
});

