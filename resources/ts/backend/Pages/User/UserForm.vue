<script setup lang="ts">
import { useUserForm } from './Composables/useUserForm';
const onInput = (_phone: any, phoneObject: any, _input: any): void => {
    if (phoneObject?.formatted) {
        user.phone = phoneObject.number;
    }
};
const props = defineProps(['isEditMode', 'userData']);

const {
    user,
    errors,
    isLoading,
    showPassword,
    genderDropdownItems,
    maritalStatusDropdownItems,
    countryModel,
    timezoneModel,
    languageModel,
    countryOptions,
    timezoneOptions,
    languageOptions,

    onSubmit,
    addThumbnail,
    removeThumbnail,
    resetThumbnail,
    togglePassword,
    generatePassword,
    copyPassword
} = useUserForm(props?.userData, props?.isEditMode);

</script>

<template>
    <div>
        <div class="w-full flex flex-col card pointer-events-auto">
            <div class="flex justify-between items-center card-body border-b border-default-300">
                <h3 id="addCustomerModalLabel" class="font-bold flex items-center">{{ isEditMode ? 'Update User Details'  : 'Create User Details' }}  </h3>

            </div>
            <form @submit.prevent="onSubmit">
                <div class="card-body">
                    <div class="grid lg:grid-cols-3 grid-cols-2 gap-base">
                        <!-- Full Name -->
                        <FormInput v-model="user.first_name" label="First Name" name="first_name" placeholder="John"
                            type="text" :errors="errors" autofocus />
                        <FormInput v-model="user.last_name" label="Last Name" name="last_name" placeholder="Last name"
                            type="text" :errors="errors" autofocus />
                        <FormInput v-model="user.email" label="Email Address" name="email" placeholder="Email Address"
                            type="email" :errors="errors" autofocus />


                        <!-- Phone -->
                        <div>
                            <label class="form-label">Contact Number</label>
                            <vue-tel-input :value="user.phone" @input="onInput" :enabled-country-code="true"
                                :searchable="true" />
                            <div v-if="errors" class="invalid-feedback">
                                <validate-input :errors="errors" value="phone" />
                            </div>
                        </div>


                        <div>
                            <label class="form-label">Password</label>
                            <div class="input-group">
                                <input v-model="user.password" name="password" placeholder="********"
                                    :type="showPassword ? 'text' : 'password'" class="form-input "
                                    :class="{ 'is-invalid': errors?.password }" autofocus>
                                <button
                                    class="btn border-primary text-primary hover:bg-primary  border hover:text-white"
                                    type="button" @click="togglePassword" tabindex="-1">
                                    <i :class="showPassword ? 'iconify tabler--eye-off' : 'iconify tabler--eye'"></i>
                                </button>
                                <button
                                    class="btn border-primary text-primary hover:bg-primary  border hover:text-white"
                                    type="button" @click="generatePassword" tabindex="-1">
                                    <i class="iconify tabler--key"></i>
                                </button>
                                <button class="btn border-primary text-primary hover:bg-primary border hover:text-white"
                                    type="button" @click="copyPassword" tabindex="-1">
                                    <i class="iconify tabler--copy"></i>
                                </button>
                            </div>
                            <validate-input class="text-danger" v-if="errors" :errors="errors" value="password" />
                        </div>

                        <!-- Confirm Password -->
                        <div>
                            <label class="form-label">Confirm Password</label>
                            <input v-model="user.password_confirmation" name="password_confirmation" class="form-input"
                                placeholder="******" :type="showPassword ? 'text' : 'password'"
                                :class="{ 'is-invalid': errors?.errors?.password_confirmation }" autofocus>
                            <validate-input class="text-danger" v-if="errors" :errors="errors"
                                value="password_confirmation" />
                        </div>

                        <!-- <div>
                            <label for="customerCountry" class="form-label">Marital Status</label>

                            <select v-model="user.marital_status" class="form-input" required>
                                <option disabled value="">Select Marital Status</option>
                                <option v-for="item in maritalStatusDropdownItems" :key="item.value"
                                    :value="item.value">
                                    {{ item.value }}
                                </option>
                            </select>
                        </div> -->

                        <!-- <FormInput v-model="user.address" label="Address" name="address" placeholder="Street"
                            type="text" :errors="errors" autofocus />
                        <FormInput v-model="user.city" label="City" name="city" placeholder="City" type="text"
                            :errors="errors" autofocus />
                        <FormInput v-model="user.state" label="State" name="state" placeholder="State" type="text"
                            :errors="errors" autofocus />
                        <FormInput v-model="user.zip_code" label="Postal/Zip code" name="zip_code"
                            placeholder="Postal/Zip code" type="text" :errors="errors" autofocus /> -->

                        <div>
                            <label class="form-label">Country </label>
                            <BaseMultiSelect
                            v-model="countryModel"
                            :options="countryOptions"
                            optionLabel="label"
                            trackBy="value"
                            placeholder="Select Country"
                            >
                            <!-- 🔥 OPTION SLOT (dropdown) -->
                            <template #option="{ option }">
                                <div class="flex items-center gap-2">
                                <img
                                    v-if="option.flag"
                                    :src="option.flag"
                                    class="w-5 h-4 rounded-sm"
                                />
                                <span>{{ option.label }}</span>
                                </div>
                            </template>

                            <!-- 🔥 SELECTED VALUE -->
                            <template #singleLabel="{ option }">
                                <div class="flex items-center gap-2">
                                <img
                                    v-if="option.flag"
                                    :src="option.flag"
                                    class="w-5 h-4 rounded-sm"
                                />
                                <span>{{ option.label }}</span>
                                </div>
                            </template>

                            </BaseMultiSelect>


                            <validate-input class="text-danger" v-if="errors" :errors="errors" value="country_id" />
                        </div>

                        <div>
                            <label class="form-label">Timezone</label>
                            <BaseMultiSelect
                            v-model="timezoneModel"
                            :options="timezoneOptions"
                            optionLabel="label"
                            trackBy="value"
                            placeholder="Select Timezone"
                            :multiple="false"
                            />
                            <validate-input class="text-danger" v-if="errors" :errors="errors" value="timezone_id" />
                        </div>

                        <div>
                            <label class="form-label">Language</label>

                            <BaseMultiSelect
                            v-model="languageModel"
                            :options="languageOptions"
                            optionLabel="label"
                            trackBy="value"
                            placeholder="Select Language"
                            :multiple="false"
                            />
                            <validate-input class="text-danger" v-if="errors" :errors="errors" value="language_id" />
                        </div>

                        <div>
                            <label class="form-label">Gender</label>
                            <select v-model="user.gender" class="form-input"
                                :class="{ 'is-invalid': errors?.errors?.gender }" required>
                                <option disabled value="">Select Gender</option>
                                <option v-for="item in genderDropdownItems" :key="item.value" :value="item.value">
                                    {{ item.value }}
                                </option>
                            </select>
                            <validate-input class="text-danger" v-if="errors" :errors="errors" value="gender" />
                        </div>

                        <FormInput v-model="user.dob" label="Date Of Birth" name="dob" placeholder="Date Of Birth"
                            type="date" :errors="errors" autofocus />
                        <div class="col-span-2 lg:col-span-3">
                            <label class="form-label font-semibold block mb-4">Profile Picture
                                <small class="text-default-400 text-xs sm:text-sm font-normal ml-2">JPG, PNG • Max 2MB</small>
                            </label>

                            <!-- Thumbnail Preview Card -->
                            <div v-if="user.thumbnail" class="mb-4 bg-gradient-to-br from-default-50 to-default-100 border border-default-200 rounded-xl p-4 sm:p-6">
                                <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                                    <!-- Image -->
                                    <div class="flex-shrink-0">
                                        <img :src="user.thumbnail" alt="profile-preview" class="size-20 sm:size-28 rounded-xl object-cover shadow-md border-2 border-white" />
                                    </div>

                                    <!-- Actions -->
                                    <div class="flex-1 w-full sm:w-auto">
                                        <p class="text-sm text-default-600 mb-3 text-center sm:text-left">Current profile picture</p>
                                        <div class="flex gap-2 w-full">
                                            <button type="button" @click="removeThumbnail" class="flex-1 sm:flex-none btn btn-sm btn-outline-danger">
                                                <i class="iconify tabler--trash"></i>
                                                <span class="ml-1">Remove</span>
                                            </button>
                                            <button v-if="isEditMode" type="button" @click="resetThumbnail" class="flex-1 sm:flex-none btn btn-sm btn-outline-secondary">
                                                <i class="iconify tabler--refresh"></i>
                                                <span class="ml-1">Reset</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- File Uploader -->
                            <div class="border-2 border-dashed border-primary rounded-xl p-6 sm:p-8 hover:bg-primary/5 transition-colors">
                                <Uploader server="/upload/user/image" max="1" maxFilesize="2" :warnings="true"
                                    @add="(files:any) => addThumbnail(files)" />
                            </div>
                        </div>



                    </div>
                </div>
                <div class="flex justify-end items-center gap-2 p-5 border-t border-default-300">


                    <router-link :to="{ name: 'users' }" class="btn bg-light hover:text-primary">
                        <i class="iconify tabler--arrow-back-up"></i> Discard
                    </router-link>
                    <button class="btn bg-secondary hover:bg-secondary-hover text-white ">
                        Draft User <i class="iconify tabler--folder-open"></i>
                    </button>
                    <button :class="isEditMode ? 'btn bg-success hover:bg-success-hover text-white' : 'btn bg-primary hover:bg-primary-hover text-white'" v-if="!isLoading">
                        {{ isEditMode ? 'Update User' : 'Save User' }} <i class="iconify tabler--device-floppy"></i>
                    </button>
                    <button class="btn bg-primary hover:bg-success-hover text-white" type="button" disabled
                        v-if="isLoading">
                        <span class="spinner-border spinner-border-sm align-middle" role="status"
                            aria-hidden="true"></span>
                        Loading...
                    </button>
                </div>
            </form>

        </div>
    </div>
</template>
