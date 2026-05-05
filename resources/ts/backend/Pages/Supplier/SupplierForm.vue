<script setup lang="ts">
import { useSupplierForm } from "./Composables/useSupplierForm";

const props = defineProps(["isEditMode", "supplierData"]);

const onPhoneInput = (_phone: any, phoneObject: any): void => {
    if (phoneObject?.formatted) {
        supplier.phone = phoneObject.number;
    }
};

const { supplier, errors, isLoading, onSubmit, countryModel, countryOptions } = useSupplierForm(props?.supplierData, props?.isEditMode);
</script>

<template>
    <div class="card pointer-events-auto flex w-full flex-col">
        <div class="card-header p-5">
            <h3 class="text-sm">{{ isEditMode ? "Update Supplier Details" : "Create Supplier Details" }}</h3>
        </div>
        <form @submit.prevent="onSubmit">
            <div class="card-body">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput v-model="supplier.name" label="Supplier Name" name="name" type="text" :errors="errors" autofocus />
                    <FormInput v-model="supplier.email" label="Email" name="email" type="email" :errors="errors" />
                    <div>
                        <label class="form-label">Phone Number</label>
                        <vue-tel-input :value="supplier.phone" @input="onPhoneInput" :enabled-country-code="true" :searchable="true" />
                        <div v-if="errors" class="invalid-feedback">
                            <validate-input :errors="errors" value="phone" />
                        </div>
                    </div>
                    <FormInput v-model="supplier.address" label="Address" name="address" type="text" :errors="errors" class="md:col-span-2" />
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
                    <FormInput v-model="supplier.city" label="City" name="city" type="text" :errors="errors" />
                    <FormInput v-model="supplier.zipcode" label="Zipcode" name="zipcode" type="text" :errors="errors" />
                    <FormInput v-model="supplier.region" label="Region" name="region" type="text" :errors="errors" />
                    <FormInput v-model="supplier.contact_first_name" label="Contact First Name" name="contact_first_name" type="text" :errors="errors" />
                    <FormInput v-model="supplier.contact_last_name" label="Contact Last Name" name="contact_last_name" type="text" :errors="errors" />
                    <FormInput v-model="supplier.contact_email" label="Contact Email" name="contact_email" type="email" :errors="errors" />
                    <FormInput v-model="supplier.contact_phone" label="Contact Phone" name="contact_phone" type="text" :errors="errors" />

                    <div>
                        <label class="form-label">Status</label>
                        <select class="form-select" v-model="supplier.status">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="border-default-300 flex items-center justify-end gap-x-2 border-t p-4">
                <router-link :to="{ name: 'suppliers' }" class="btn bg-light hover:text-primary">
                    <i class="iconify tabler--arrow-back-up"></i> Discard
                </router-link>
                <button :class="isEditMode ? 'btn bg-success text-white' : 'btn bg-primary text-white'" v-if="!isLoading" type="submit">
                    {{ isEditMode ? "Update Supplier" : "Save Supplier" }} <i class="iconify tabler--device-floppy"></i>
                </button>
                <button class="btn bg-primary text-white" type="button" disabled v-if="isLoading">
                    <span class="spinner-border spinner-border-sm align-middle" role="status" aria-hidden="true"></span>
                    Loading...
                </button>
            </div>
        </form>
    </div>
</template>
