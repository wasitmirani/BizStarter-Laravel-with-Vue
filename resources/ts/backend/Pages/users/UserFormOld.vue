<script setup lang="ts">
import { useUserForm } from './Composables/useUserForm';

const {
    user,
    errors,
    isLoading,
    showPassword,
    genderDropdownItems,
    maritalStatusDropdownItems,
    onSubmit,
    onInput,
    addThumbnail,
    togglePassword,
    generatePassword,
    copyPassword,
} = useUserForm();
</script>

<template>
    <div class="row gap-x-6">
        <div class="col-xl-9">
            <form @submit.prevent="onSubmit">
                <div class="card custom-card">
                    <div class="card-body add-products">
                        <div class="card custom-card shadow-none mb-0 border-0">
                            <div class="card-body p-0">
                                <div class="row gy-3 mx-0">
                                    <div class="col-xl-12">
                                        <h6 class="bg-primary-transparent p-3 py-2 mb-0 rounded fw-semibold">User Details</h6>
                                    </div>
                                    <div class="row mt-4">

                                        <div class="col-md-6 mb-3">
                                            <FormInput v-model="user.first_name" label="First Name" name="first_name"
                                                placeholder="John" type="text" :errors="errors" autofocus />
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <FormInput v-model="user.last_name" label="Last Name" name="last_name"
                                                placeholder="Last name" type="text" :errors="errors" autofocus />
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <FormInput v-model="user.email" label="Email Address" name="email"
                                                placeholder="Email Address" type="email" :errors="errors" autofocus />
                                        </div>

                                        <!-- Phone -->
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label">Contact Number</label>
                                            <vue-tel-input
                                                :value="user.phone"
                                                @input="onInput"
                                                :enabled-country-code="true"
                                                :searchable="true"
                                            />
                                            <div v-if="errors" class="invalid-feedback">
                                                <validate-input :errors="errors" value="phone" />
                                            </div>
                                        </div>

                                        <!-- Password -->
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label">Password</label>
                                            <div class="input-group">
                                                <input
                                                    v-model="user.password"
                                                    name="password"
                                                    placeholder="********"
                                                    :type="showPassword ? 'text' : 'password'"
                                                    class="form-control"
                                                    :class="{ 'is-invalid': errors?.password }"
                                                    autofocus
                                                >
                                                <button class="btn border-primary text-primary hover:bg-primary size-11.25 border hover:text-white" type="button" @click="togglePassword" tabindex="-1">
                                                    <i :class="showPassword ? 'iconify tabler--eye-off' : 'iconify tabler--eye'"></i>
                                                </button>
                                                <button class="btn border-primary text-primary hover:bg-primary size-11.25 border hover:text-white" type="button" @click="generatePassword" tabindex="-1">
                                                    <i class="iconify tabler--key"></i>
                                                </button>
                                                <button class="btn border-primary text-primary hover:bg-primary size-11.25 border hover:text-white" type="button" @click="copyPassword" tabindex="-1">
                                                    <i class="iconify tabler--copy"></i>
                                                </button>
                                            </div>
                                            <validate-input class="text-danger" v-if="errors" :errors="errors" value="password" />
                                        </div>

                                        <!-- Confirm Password -->
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label">Confirm Password</label>
                                            <input
                                                v-model="user.password_confirmation"
                                                name="password_confirmation"
                                                class="form-control"
                                                placeholder="******"
                                                :type="showPassword ? 'text' : 'password'"
                                                :class="{ 'is-invalid': errors?.errors?.password_confirmation }"
                                                autofocus
                                            >
                                            <validate-input class="text-danger" v-if="errors" :errors="errors" value="password_confirmation" />
                                        </div>

                                        <!-- Address block -->
                                        <div class="col-md-6 mb-3">
                                            <div class="row">
                                                <div class="col-xl-12 mb-3">
                                                    <label class="form-label">Marital Status</label>
                                                    <select v-model="user.marital_status" class="form-select">
                                                        <option disabled value="">Select Marital Status</option>
                                                        <option v-for="item in maritalStatusDropdownItems" :key="item.value" :value="item.value">
                                                            {{ item.value }}
                                                        </option>
                                                    </select>
                                                </div>
                                                <div class="col-xl-12 mb-3">
                                                    <FormInput v-model="user.address" label="Address" name="address"
                                                        placeholder="Street" type="text" :errors="errors" autofocus />
                                                </div>
                                                <div class="col-xl-6 mb-3">
                                                    <FormInput v-model="user.city" label="City" name="city"
                                                        placeholder="City" type="text" :errors="errors" autofocus />
                                                </div>
                                                <div class="col-xl-6 mb-3">
                                                    <FormInput v-model="user.state" label="State" name="state"
                                                        placeholder="State" type="text" :errors="errors" autofocus />
                                                </div>
                                                <div class="col-xl-6 mb-3">
                                                    <FormInput v-model="user.zip_code" label="Postal/Zip code" name="zip_code"
                                                        placeholder="Postal/Zip code" type="text" :errors="errors" autofocus />
                                                </div>
                                                <div class="col-xl-6 mb-3">
                                                    <label class="form-label">Country</label>
                                                    <select v-model="user.country" id="inputCountry" class="form-select">
                                                        <option disabled value="">Select Country</option>
                                                        <option value="PK">PAK</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Gender & DOB block -->
                                        <div class="col-md-6 mb-3">
                                            <div class="row">
                                                <div class="col-xl-12 mb-3">
                                                    <label class="form-label">Gender</label>
                                                    <select v-model="user.gender" class="form-select"
                                                        :class="{ 'is-invalid': errors?.errors?.gender }">
                                                        <option disabled value="">Select Gender</option>
                                                        <option v-for="item in genderDropdownItems" :key="item.value" :value="item.value">
                                                            {{ item.value }}
                                                        </option>
                                                    </select>
                                                    <validate-input class="text-danger" v-if="errors" :errors="errors" value="gender" />
                                                </div>
                                                <div class="col-xl-12 mb-3">
                                                    <label class="form-label">Date Of Birth</label>
                                                    <div class="input-group">
                                                        <div class="input-group-text text-muted">
                                                            <i class="ri-calendar-line"></i>
                                                        </div>
                                                        <input type="text" class="form-control" v-model="user.dob"
                                                            id="humanfrienndlydate" placeholder="Choose Date">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card-footer border-top border-block-start-dashed d-sm-flex justify-content-end">
                        <router-link :to="{ name: 'users' }" class="btn bg-danger hover:bg-danger-hover text-white me-2 mb-2 mb-sm-0">
                            <i class="iconify tabler--arrow-back-up"></i> Discard
                        </router-link>
                        <button class="btn bg-secondary hover:bg-secondary-hover text-white me-2 mb-2 mb-sm-0">
                            Draft User <i class="iconify tabler--folder-open"></i>
                        </button>
                        <button class="btn bg-primary hover:bg-primary-hover text-white" v-if="!isLoading">
                            Save User <i class="iconify tabler--device-floppy"></i>
                        </button>
                        <button class="btn btn-primary mb-2 mb-sm-0" type="button" disabled v-if="isLoading">
                            <span class="spinner-border spinner-border-sm align-middle" role="status" aria-hidden="true"></span>
                            Loading...
                        </button>
                    </div>
                </div>
            </form>
        </div>

        <!-- Profile Picture Uploader -->
        <div class="col-xl-3">
            <div class="card custom-card">
                <div class="card-body add-products">
                    <div class="card custom-card shadow-none mb-0 border-0">
                        <div class="card-body p-0">
                            <div class="row gy-3 mx-0">
                                <div class="col-xl-12">
                                    <h6 class="bg-primary-transparent p-3 py-2 mb-0 rounded fw-semibold">Profile Picture</h6>
                                </div>
                                <Uploader server="/upload/user/image" max="1" maxFilesize="2" :warnings="true"
                                    @add="addThumbnail" />
                                <div class="button-wrapper">
                                    <div class="small">Allowed formats: JPG, GIF, PNG. Max size: 4MB</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
