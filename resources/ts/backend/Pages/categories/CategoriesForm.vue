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
    onSubmit,
    addThumbnail,
    togglePassword,
    generatePassword,
    copyPassword
} = useUserForm(props?.userData);

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

                        <div>
                            <label for="customerCountry" class="form-label">Marital Status</label>

                            <select v-model="user.marital_status" class="form-input" required>
                                <option disabled value="">Select Marital Status</option>
                                <option v-for="item in maritalStatusDropdownItems" :key="item.value"
                                    :value="item.value">
                                    {{ item.value }}
                                </option>
                            </select>
                        </div>

                        <FormInput v-model="user.address" label="Address" name="address" placeholder="Street"
                            type="text" :errors="errors" autofocus />
                        <FormInput v-model="user.city" label="City" name="city" placeholder="City" type="text"
                            :errors="errors" autofocus />
                        <FormInput v-model="user.state" label="State" name="state" placeholder="State" type="text"
                            :errors="errors" autofocus />
                        <FormInput v-model="user.zip_code" label="Postal/Zip code" name="zip_code"
                            placeholder="Postal/Zip code" type="text" :errors="errors" autofocus />

                        <div>
                            <label class="form-label">Country</label>
                            <select v-model="user.country" id="inputCountry" class="form-input">
                                <option disabled value="">Select Country</option>
                                <option value="PK">PAK</option>
                            </select>


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
                        <div>
                            <label class="form-label font-semibold block mb-2">Profile Picture <small>Allowed formats:
                                    JPG, GIF, PNG. Max size: 4MB</small> </label>
                            <Uploader server="/upload/user/image" max="1" maxFilesize="2" :warnings="true"
                                @add="(files:any) => addThumbnail(files)" />
                        </div>
                        <div>

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
                    <button class="btn bg-primary hover:bg-primary-hover text-white" v-if="!isLoading">
                        Save User <i class="iconify tabler--device-floppy"></i>
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
