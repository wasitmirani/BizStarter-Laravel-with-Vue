import { defineStore } from 'pinia';
import { Helpers } from '../Utils/Helper';
import UserService from '../Services/User/UserService';
import DropDownService  from '../Services/DropDown/DropDownService';

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
  const languages = Helpers.useDynamicRef<DropdownItem[]>([]);
  const currencies = Helpers.useDynamicRef<DropdownItem[]>([]);

  const rolesLoaded = Helpers.useDynamicRef(false);
  const dropdownsLoaded = Helpers.useDynamicRef(false);

  // ─── Actions ────────────────────────────────────────────────────────────────

  async function fetchRoles() {
    if (rolesLoaded.value) return;

    try {
      const response = await UserService.roles();
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

  // 🚀 SINGLE CALL FOR ALL DROPDOWNS
  async function fetchDropdowns() {
    if (dropdownsLoaded.value) return;

    try {
      const response = await DropDownService.getAll();
      const data = response?.data.result ?? {};

      // Countries
      countries.value = (data.countries ?? []).map((item: any) => ({
        value: item.id ?? item.code ?? item.value,
        label: item.name ?? item.label ?? item.code,
        flag: item.flag ?? item.flag ?? '',
      }));

      // Timezones
      timezones.value = (data.timezones ?? []).map((item: any) => ({
        value: item.id ?? item.value ?? item.name,
        label: item.name ?? item.label ?? item.timezone,
      }));

      // Languages
      languages.value = (data.languages ?? []).map((item: any) => ({
        value: item.id ?? item.code ?? item.value,
        label: (item.name ? `${item.name} | ${item.code ?? ''}` : item.code) ?? (item.label ? `${item.label} ${item.code ?? ''}` : item.code),
      }));

      // Currencies
      currencies.value = (data.currencies ?? []).map((item: any) => ({
        value: item.id ?? item.code ?? item.value,
        label: item.name ?? item.label ?? item.code,
      }));

      dropdownsLoaded.value = true;
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  }

  return {
    // state
    roles,
    statuses,
    countries,
    timezones,
    languages,
    currencies,

    // actions
    fetchRoles,
    fetchDropdowns,
  };
});
