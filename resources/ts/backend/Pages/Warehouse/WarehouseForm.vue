<script setup lang="ts">
import { useWarehouseForm } from "./Composables/useWarehouseForm";

const props = defineProps(["isEditMode", "warehouseData"]);

const onPhoneInput = (_phone: any, phoneObject: any): void => {
    if (phoneObject?.formatted) {
        warehouse.phone = phoneObject.number;
    }
};

const { warehouse, errors, isLoading, onSubmit, countryModel, countryOptions } = useWarehouseForm(props?.warehouseData, props?.isEditMode);
</script>

<template>
    <div class="card pointer-events-auto flex w-full flex-col">
        <div class="card-header p-5">
            <h3 class="text-sm">{{ isEditMode ? "Update Warehouse Details" : "Create Warehouse Details" }}</h3>
        </div>
        <form @submit.prevent="onSubmit">
            <div class="card-body">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput v-model="warehouse.name" label="Warehouse Name" name="name" type="text" :errors="errors" autofocus />
                 
                    <FormInput v-model="warehouse.email" label="Email" name="email" type="email" :errors="errors" />
                    <div>
                        <label class="form-label">Phone Number</label>
                        <vue-tel-input :value="warehouse.phone" @input="onPhoneInput" :enabled-country-code="true" :searchable="true" />
                        <div v-if="errors" class="invalid-feedback">
                            <validate-input :errors="errors" value="phone" />
                        </div>
                    </div>
                    <FormInput v-model="warehouse.address" label="Address" name="address" type="text" :errors="errors" class="md:col-span-2" />
                    <div>
                        <label class="form-label">Country</label>
                        <MultiSelect
                            v-model="countryModel"
                            :options="countryOptions"
                            label="Country"
                            placeholder="Select Country"
                            trackBy="value"
                            optionLabel="label"
                            :multiple="false"
                        />
                        <div v-if="errors" class="invalid-feedback">
                            <validate-input :errors="errors" value="country" />
                        </div>
                    </div>
                    <FormInput v-model="warehouse.city" label="City" name="city" type="text" :errors="errors" />
                    <FormInput v-model="warehouse.zipcode" label="Zipcode" name="zipcode" type="text" :errors="errors" />
                    <FormInput v-model="warehouse.region" label="Region" name="region" type="text" :errors="errors" />
                    <FormInput v-model="warehouse.longitude" label="Longitude" name="longitude" type="number" :errors="errors" />
                    <FormInput v-model="warehouse.latitude" label="Latitude" name="latitude" type="number" :errors="errors" />
                    <FormInput v-model="warehouse.timezone" label="Timezone" name="timezone" type="text" :errors="errors" />
                    <FormInput v-model="warehouse.contact_first_name" label="Contact First Name" name="contact_first_name" type="text" :errors="errors" />
                    <FormInput v-model="warehouse.contact_last_name" label="Contact Last Name" name="contact_last_name" type="text" :errors="errors" />
                    <FormInput v-model="warehouse.contact_email" label="Contact Email" name="contact_email" type="email" :errors="errors" />
                    <FormInput v-model="warehouse.contact_phone" label="Contact Phone" name="contact_phone" type="text" :errors="errors" />

                    <div>
                        <label class="form-label">Status</label>
                        <select class="form-select" v-model="warehouse.status">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label class="flex items-center justify-between rounded-md border border-default-300 px-3 py-2">
                            <span class="text-sm">Default Warehouse</span>
                            <input type="checkbox" v-model="warehouse.is_default" class="size-4 cursor-pointer accent-primary" />
                        </label>
                        <label class="flex items-center justify-between rounded-md border border-default-300 px-3 py-2">
                            <span class="text-sm">Allow partial packing</span>
                            <input type="checkbox" v-model="warehouse.allow_partial_packing" class="size-4 cursor-pointer accent-primary" />
                        </label>
                        <label class="flex items-center justify-between rounded-md border border-default-300 px-3 py-2">
                            <span class="text-sm">Allow partial picking</span>
                            <input type="checkbox" v-model="warehouse.allow_partial_picking" class="size-4 cursor-pointer accent-primary" />
                        </label>
                        <label class="flex items-center justify-between rounded-md border border-default-300 px-3 py-2">
                            <span class="text-sm">Scan unique location</span>
                            <input type="checkbox" v-model="warehouse.scan_unique_location" class="size-4 cursor-pointer accent-primary" />
                        </label>
                        <label class="flex items-center justify-between rounded-md border border-default-300 px-3 py-2">
                            <span class="text-sm">Scan unique container</span>
                            <input type="checkbox" v-model="warehouse.scan_unique_container" class="size-4 cursor-pointer accent-primary" />
                        </label>
                    </div>
                </div>
            </div>

            <div class="border-default-300 flex items-center justify-end gap-x-2 border-t p-4">
                <router-link :to="{ name: 'warehouses' }" class="btn bg-light hover:text-primary">
                    <i class="iconify tabler--arrow-back-up"></i> Discard
                </router-link>
                <button :class="isEditMode ? 'btn bg-success text-white' : 'btn bg-primary text-white'" v-if="!isLoading" type="submit">
                    {{ isEditMode ? "Update Warehouse" : "Save Warehouse" }} <i class="iconify tabler--device-floppy"></i>
                </button>
                <button class="btn bg-primary text-white" type="button" disabled v-if="isLoading">
                    <span class="spinner-border spinner-border-sm align-middle" role="status" aria-hidden="true"></span>
                    Loading...
                </button>
            </div>
        </form>
    </div>
</template>
