<script setup lang="ts">
import BaseMultiSelect from "@/Backend/Components/BaseMultiSelect.vue";
import { useDriverForm } from "./Composables/useDriverForm";
import { Helpers } from "../../Utils/Helper";

const props = defineProps(["isEditMode", "driverData"]);

const onPhoneInput = (_phone: any, phoneObject: any): void => {
    if (phoneObject?.formatted) {
        driver.phone = phoneObject.number;
    }
};

const {
    driver,
    errors,
    isLoading,
    onSubmit,
    typeOptions,
    statusOptions,
    initialSavedMedia,
    handleProfileMediaChange,
    profileImageLocation,
    warehousesDropdownItems,
} = useDriverForm(props?.driverData, props?.isEditMode);

const warehousesModel = Helpers.useMultiSelectModel(driver, "warehouse_ids", warehousesDropdownItems);
</script>

<template>
    <div class="card pointer-events-auto flex w-full flex-col">
        <div class="card-header p-5">
            <h3 class="text-sm">{{ isEditMode ? "Update Driver Details" : "Create Driver Details" }}</h3>
        </div>
        <form @submit.prevent="onSubmit">
            <div class="card-body">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-if="isEditMode && driver.driver_code" class="md:col-span-2">
                        <label class="form-label">Driver ID</label>
                        <input type="text" class="form-input bg-default-50" :value="driver.driver_code" readonly />
                    </div>

                    <FormInput v-model="driver.full_name" label="Full Name" name="full_name" type="text" :errors="errors" autofocus />
                    <div>
                        <label class="form-label">Type</label>
                        <select class="form-select" v-model="driver.type" name="type">
                            <option v-for="item in typeOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
                        </select>
                        <div v-if="errors" class="invalid-feedback">
                            <validate-input :errors="errors" value="type" />
                        </div>
                    </div>

                    <div class="md:col-span-2">
                        <label class="form-label font-semibold block mb-2">
                            Profile Image
                            <small class="text-default-400 text-xs font-normal ml-2">JPG, PNG • Max 2MB</small>
                        </label>
                        <Uploader
                            server="/upload/driver/image"
                            :media="initialSavedMedia"
                            :location="profileImageLocation"
                            max="1"
                            maxFilesize="2"
                            :warnings="true"
                            @change="handleProfileMediaChange"
                        />
                        <div v-if="errors" class="invalid-feedback mt-2">
                            <validate-input :errors="errors" value="profile_image" />
                        </div>
                    </div>

                    <div>
                        <label class="form-label">Phone Number</label>
                        <vue-tel-input :value="driver.phone" @input="onPhoneInput" :enabled-country-code="true" :searchable="true" />
                        <div v-if="errors" class="invalid-feedback">
                            <validate-input :errors="errors" value="phone" />
                        </div>
                    </div>
                    <FormInput v-model="driver.email" label="Email" name="email" type="email" :errors="errors" />
                    <FormInput v-model="driver.cnic" label="CNIC / National ID" name="cnic" type="text" :errors="errors" />
                    <FormInput v-model="driver.license_number" label="License Number" name="license_number" type="text" :errors="errors" />
                    <FormInput v-model="driver.license_expiry_date" label="License Expiry Date" name="license_expiry_date" type="date" :errors="errors" />
                    <FormInput v-model="driver.address" label="Address" name="address" type="text" :errors="errors" class="md:col-span-2" />
                    <FormInput v-model="driver.city" label="City" name="city" type="text" :errors="errors" />
                    <div class="md:col-span-2">
                        <label class="form-label">Assigned Warehouses</label>
                        <BaseMultiSelect
                            v-model="warehousesModel"
                            :options="warehousesDropdownItems"
                            label="Assigned Warehouses"
                            placeholder="Select one or more warehouses"
                            trackBy="value"
                            optionLabel="label"
                            :errors="errors"
                            multiple
                        />
                        <small class="text-default-400 text-xs">A driver can be linked to multiple warehouses.</small>
                        <div v-if="errors" class="invalid-feedback">
                            <validate-input :errors="errors" value="warehouse_ids" />
                        </div>
                    </div>
                    <FormInput v-model="driver.joining_date" label="Joining Date" name="joining_date" type="date" :errors="errors" />
                    <div>
                        <label class="form-label">Driver Status</label>
                        <select class="form-select" v-model="driver.status" name="status">
                            <option v-for="item in statusOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
                        </select>
                        <div v-if="errors" class="invalid-feedback">
                            <validate-input :errors="errors" value="status" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="border-default-300 flex items-center justify-end gap-x-2 border-t p-4">
                <router-link :to="{ name: 'drivers' }" class="btn bg-light hover:text-primary">
                    <i class="iconify tabler--arrow-back-up"></i> Discard
                </router-link>
                <button :class="isEditMode ? 'btn bg-success text-white' : 'btn bg-primary text-white'" v-if="!isLoading" type="submit">
                    {{ isEditMode ? "Update Driver" : "Save Driver" }} <i class="iconify tabler--device-floppy"></i>
                </button>
                <button class="btn bg-primary text-white" type="button" disabled v-if="isLoading">
                    <span class="spinner-border spinner-border-sm align-middle" role="status" aria-hidden="true"></span>
                    Loading...
                </button>
            </div>
        </form>
    </div>
</template>
