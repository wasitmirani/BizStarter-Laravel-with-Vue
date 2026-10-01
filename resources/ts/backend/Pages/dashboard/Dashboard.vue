<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { loadAllocePageScript } from '../../Utils/alloce/loadAlloceScripts';

const HRM_CHARTS_SCRIPT = '/assets/js/src/dashboard-hrm.js';

let frame: number | null = null;

onMounted(() => {
    // Alloce ApexCharts init lives in dashboard-hrm.js and runs on DOMContentLoaded.
    // Load it after chart containers (#genderChart, #recruitmentChart, etc.) exist.
    frame = requestAnimationFrame(() => {
        void loadAllocePageScript(HRM_CHARTS_SCRIPT);
    });
});

onBeforeUnmount(() => {
    if (frame !== null) cancelAnimationFrame(frame);
});
</script>

<template>
<div class="gap-2 page-heading mb-4 flex-column flex-md-row">
        <h6 class="flex-grow-1 mb-0">HRM</h6>
        <ul class="breadcrumb flex-shrink-0 mb-0">
            <li class="breadcrumb-item"><a href="#!">Dashboard</a></li>
            <li class="breadcrumb-item active">HRM</li>
        </ul>
    </div>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-5 gx-5">
        <div class="col">
            <div class="card hrm-widget-card position-relative rounded-4">
                <div class="size-8 bg-primary position-absolute top-0 square-1"></div>
                <div class="size-8 bg-gradient-t-primary bg-opacity-75 position-absolute square-2"></div>
                <div class="hrm-widget-curve">
                    <div class="size-10 bg-primary avatar text-white">
                        <i class="ri-group-line fs-lg"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h6 class="fs-17 mb-7 ps-10 mt-n1">Total Employees</h6>
                    <div class="d-flex justify-content-between align-items-end mb-3">
                        <h3 class="mb-0"><span class="counter" data-start="0" data-end="245" data-duration="1000">245</span></h3>
                        <span class="badge bg-success-subtle text-success border border-success-subtle"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="trending-up" aria-hidden="true" class="lucide lucide-trending-up size-3 me-1"><path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path></svg>0.05%</span>
                    </div>
                    <span class="text-muted fs-15"><span class="text-success me-1 fw-medium">10%</span> Increased this month</span>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card hrm-widget-card position-relative rounded-4">
                <div class="size-8 bg-secondary position-absolute top-0 square-1"></div>
                <div class="size-8 bg-gradient-t-secondary bg-opacity-75 position-absolute square-2"></div>
                <div class="hrm-widget-curve">
                    <div class="size-10 bg-secondary avatar text-white">
                        <i class="ri-calendar-check-line fs-lg"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h6 class="fs-17 mb-7 ps-10 mt-n1">Attendance</h6>
                    <div class="d-flex justify-content-between align-items-end mb-3">
                        <h3 class="mb-0"><span class="counter" data-start="0" data-end="210" data-duration="1000">210</span></h3>
                        <span class="badge bg-success-subtle text-success border border-success-subtle">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="trending-up" aria-hidden="true" class="lucide lucide-trending-up size-3 me-1"><path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path></svg>2.1%
                        </span>
                    </div>
                    <span class="text-muted fs-15"><span class="text-success me-1 fw-medium">12%</span> employees today</span>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card hrm-widget-card position-relative rounded-4">
                <div class="size-8 bg-danger position-absolute top-0 square-1"></div>
                <div class="size-8 bg-gradient-t-danger bg-opacity-75 position-absolute square-2"></div>
                <div class="hrm-widget-curve">
                    <div class="size-10 bg-danger avatar text-white">
                        <i class="ri-plane-line fs-lg"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h6 class="fs-17 mb-7 ps-10 mt-n1">Employees Leave</h6>
                    <div class="d-flex justify-content-between align-items-end mb-3">
                        <h3 class="mb-0"><span class="counter" data-start="0" data-end="8" data-duration="1000">8</span></h3>
                        <span class="badge bg-danger-subtle text-danger border border-danger-subtle">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="trending-down" aria-hidden="true" class="lucide lucide-trending-down size-3 me-1"><path d="M16 17h6v-6"></path><path d="m22 17-8.5-8.5-5 5L2 7"></path></svg>1.2%
                        </span>
                    </div>
                    <span class="text-muted fs-15"><span class="text-danger me-1 fw-medium">0.5%</span> requests today</span>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card hrm-widget-card position-relative rounded-4">
                <div class="size-8 bg-success position-absolute top-0 square-1"></div>
                <div class="size-8 bg-gradient-t-success bg-opacity-75 position-absolute square-2"></div>
                <div class="hrm-widget-curve">
                    <div class="size-10 bg-success avatar text-white">
                        <i class="ri-user-add-line fs-lg"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h6 class="fs-17 mb-7 ps-10 mt-n1">New Hires</h6>
                    <div class="d-flex justify-content-between align-items-end mb-3">
                        <h3 class="mb-0"><span class="counter" data-start="0" data-end="12" data-duration="1000">12</span></h3>
                        <span class="badge bg-success-subtle text-success border border-success-subtle">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="trending-up" aria-hidden="true" class="lucide lucide-trending-up size-3 me-1"><path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path></svg>4.6%
                        </span>
                    </div>
                    <span class="text-muted fs-15"><span class="text-success me-1 fw-medium">11%</span> this month</span>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card hrm-widget-card position-relative rounded-4">
                <div class="size-8 bg-info position-absolute top-0 square-1"></div>
                <div class="size-8 bg-gradient-t-info bg-opacity-75 position-absolute square-2"></div>
                <div class="hrm-widget-curve">
                    <div class="size-10 bg-info avatar text-white">
                        <i class="ri-building-line fs-lg"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h6 class="fs-17 mb-7 ps-10 mt-n1">Departments</h6>
                    <div class="d-flex justify-content-between align-items-end mb-3">
                        <h3 class="mb-0"><span class="counter" data-start="0" data-end="9" data-duration="1000">9</span></h3>
                        <span class="badge bg-success-subtle text-success border border-success-subtle">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="trending-up" aria-hidden="true" class="lucide lucide-trending-up size-3 me-1"><path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path></svg>0.8%
                        </span>
                    </div>
                    <span class="text-muted fs-15"><span class="text-success me-1 fw-medium">0.8%</span> the organization</span>
                </div>
            </div>
        </div>
    </div>
    

    <div class="row gx-5">
        <div class="col-xxl-5">
            <div class="card">
                <div class="card-header d-flex flex-wrap justify-content-between align-items-center">
                    <h5 class="card-title mb-0 flex-grow-1">Weekly Attendance</h5>
                    <div class="d-flex gap-4">
                        <a href="#!" class="text-muted"><i class="mgc_download_2_line"></i></a>
                        <div class="dropdown">
                            <a href="#!" class="text-muted" data-bs-toggle="dropdown"><i class="mgc_more_2_fill"></i></a>
                            <div class="dropdown-menu dropdown-menu-end">
                                <a class="dropdown-item" href="#!"><i class="mgc_eye_line lh-1 me-2 align-middle"></i>View</a>
                                <a class="dropdown-item" href="#!"><i class="mgc_edit_2_line lh-1 me-2 align-middle"></i>Edit</a>
                                <a class="dropdown-item text-danger" href="#!" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="mgc_delete_2_line lh-1 me-2 align-middle"></i>Delete</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body px-0">
                    <div class="d-flex flex-wrap gap-4 justify-content-between align-items-start mb-5 px-5">
                        <div class="d-flex gap-8">
                            <div>
                                <h5 class="mb-1">78</h5>
                                <p class="text-muted fs-15">On time</p>
                            </div>
                            <div>
                                <h5 class="mb-1">15</h5>
                                <p class="text-muted fs-15">Late</p>
                            </div>
                            <div>
                                <h5 class="mb-1">6</h5>
                                <p class="text-muted fs-15">Absent</p>
                            </div>
                        </div>
                        <ul class="nav nav-pills nav-light border p-1 rounded d-inline-flex" id="underlineTabs" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link py-1 fs-15 rounded-1 active" id="day-tab" data-bs-toggle="tab" data-bs-target="#day-tab-pane" type="button" role="tab" aria-controls="day-tab-pane" aria-selected="true">Day</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link py-1 fs-15 rounded-1" id="week-tab" data-bs-toggle="tab" data-bs-target="#week-tab-pane" type="button" role="tab" aria-controls="week-tab-pane" aria-selected="false">Week</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link py-1 fs-15 rounded-1" id="month-tab" data-bs-toggle="tab" data-bs-target="#month-tab-pane" type="button" role="tab" aria-controls="month-tab-pane" aria-selected="false">Month</button>
                            </li>
                        </ul>
                    </div>
                    <div class="px-5" data-simplebar="" style="max-height: 275px">
                        <div class="table-card table-responsive custom-scroll">
                            <table class="table table-borderless align-middle text-nowrap mb-0">
                                <thead class="border-bottom">
                                    <tr>
                                        <th class="text-muted fw-medium">Employee</th>
                                        <th class="text-muted fw-medium">Status</th>
                                        <th class="text-muted fw-medium">Time In</th>
                                        <th class="text-muted fw-medium">Time Out</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center gap-3">
                                                <img src="/assets/images/user-17-1.webp" class="size-8 rounded-circle" alt="User 17" />
                                                <a href="#!" class="link text-body fw-medium">Sonia Keebler</a>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="badge bg-success-subtle text-success-emphasis border border-success-subtle">On time</span>
                                        </td>
                                        <td>09:00 AM</td>
                                        <td>06:15 PM</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center gap-3">
                                                <img src="/assets/images/user-18-1.webp" class="size-8 rounded-circle" alt="User 18" />
                                                <a href="#!" class="link text-body fw-medium">Jerome Bell</a>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">Late</span>
                                        </td>
                                        <td>09:35 AM</td>
                                        <td>06:10 PM</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center gap-3">
                                                <img src="/assets/images/user-19-1.webp" class="size-8 rounded-circle" alt="User 19" />
                                                <a href="#!" class="link text-body fw-medium">Marvin McKinney</a>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="badge bg-success-subtle text-success-emphasis border border-success-subtle">On time</span>
                                        </td>
                                        <td>08:55 AM</td>
                                        <td>06:00 PM</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center gap-3">
                                                <img src="/assets/images/user-20-1.webp" class="size-8 rounded-circle" alt="User 20" />
                                                <a href="#!" class="link text-body fw-medium">Kathryn Murphy</a>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="badge bg-danger-subtle text-danger-emphasis border border-danger-subtle">Absent</span>
                                        </td>
                                        <td>--</td>
                                        <td>--</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center gap-3">
                                                <img src="/assets/images/user-2-1.webp" class="size-8 rounded-circle" alt="User 2" />
                                                <a href="#!" class="link text-body fw-medium">Leslie Alexander</a>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="badge bg-success-subtle text-success-emphasis border border-success-subtle">On time</span>
                                        </td>
                                        <td>09:02 AM</td>
                                        <td>06:20 PM</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xxl-7">
            <div class="card card-h-100">
                <div class="card-header d-flex flex-wrap gap-4 justify-content-between align-items-center">
                    <h5 class="card-title mb-0">Performance by Department</h5>
                    <div class="d-flex gap-4 align-items-center">
                        <a href="#!" class="text-muted fs-lg"><i class="mgc_download_2_line"></i></a>
                        <div class="dropdown flex-shrink-0">
                            <a href="#!" class="link link-custom-primary badge border avatar bg-body-custom fw-normal fs-13 py-6px px-3 gap-1 dropdown-toggle" aria-label="Dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                Monthly
                            </a>
                            <div class="dropdown-menu dropdown-menu-end">
                                <a class="dropdown-item" href="#!">Monthly</a>
                                <a class="dropdown-item" href="#!">Weekly</a>
                                <a class="dropdown-item" href="#!">Yearly</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div id="categoryPerformanceChart"></div>
                </div>
            </div>
        </div>
        <div class="col-xxl-7">
            <div class="card">
                <div class="card-header d-flex flex-wrap gap-4 justify-content-between align-items-center">
                    <h5 class="card-title mb-0">Leave Requests</h5>
                    <a href="#!" class="link link-custom-primary">View All <i class="ri-arrow-right-line"></i></a>
                </div>
                <div class="card-body">
                    <div class="table-card table-responsive custom-scroll">
                        <table class="table table-borderless align-middle mb-0">
                            <thead class="border-bottom">
                                <tr>
                                    <th class="text-muted fw-medium">Employee</th>
                                    <th class="text-muted fw-medium">Leave Type</th>
                                    <th class="text-muted fw-medium">Start Date</th>
                                    <th class="text-muted fw-medium">End Date</th>
                                    <th class="text-muted fw-medium">Status</th>
                                    <th class="text-muted fw-medium text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center gap-2">
                                            <img src="/assets/images/user-1-1.webp" alt="Image" class="rounded-circle" width="32" />
                                            <h6 class="mb-0 fw-medium"><a href="#!" class="text-reset">Michael Anderson</a></h6>
                                        </div>
                                    </td>
                                    <td>Annual Leave</td>
                                    <td>10 Mar 2026</td>
                                    <td>12 Mar 2026</td>
                                    <td>
                                        <span class="badge bg-warning-subtle text-warning border border-warning-subtle">Pending</span>
                                    </td>
                                    <td>
                                        <div class="d-flex justify-content-end gap-2">
                                            <button type="button" class="btn btn-icon btn-sub-success size-7-5" aria-label="check"><i class="mgc_check_line"></i></button>
                                            <button type="button" class="btn btn-icon btn-sub-danger size-7-5" aria-label="close"><i class="mgc_close_line"></i></button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center gap-2">
                                            <img src="/assets/images/user-2-1.webp" alt="Image" class="rounded-circle" width="32" />
                                            <h6 class="mb-0 fw-medium"><a href="#!" class="text-reset">Sarah Johnson</a></h6>
                                        </div>
                                    </td>
                                    <td>Sick Leave</td>
                                    <td>14 Mar 2026</td>
                                    <td>15 Mar 2026</td>
                                    <td>
                                        <span class="badge bg-success-subtle text-success border border-success-subtle">Approved</span>
                                    </td>
                                    <td>
                                        <div class="d-flex justify-content-end gap-2">
                                            <button type="button" class="btn btn-icon btn-sub-success size-7-5" aria-label="check"><i class="mgc_check_line"></i></button>
                                            <button type="button" class="btn btn-icon btn-sub-danger size-7-5" aria-label="close"><i class="mgc_close_line"></i></button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center gap-2">
                                                <img src="/assets/images/user-3-1.webp" alt="Image" class="rounded-circle" width="32" />
                                            <h6 class="mb-0 fw-medium"><a href="#!" class="text-reset">David Williams</a></h6>
                                        </div>
                                    </td>
                                    <td>Casual Leave</td>
                                    <td>18 Mar 2026</td>
                                    <td>19 Mar 2026</td>
                                    <td>
                                        <span class="badge bg-danger-subtle text-danger border border-danger-subtle">Rejected</span>
                                    </td>
                                    <td>
                                        <div class="d-flex justify-content-end gap-2">
                                            <button type="button" class="btn btn-icon btn-sub-success size-7-5" aria-label="check"><i class="mgc_check_line"></i></button>
                                            <button type="button" class="btn btn-icon btn-sub-danger size-7-5" aria-label="close"><i class="mgc_close_line"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="row align-items-center g-3 mt-1">
                        <div class="col-md-6">
                            <p class="text-muted text-center text-md-start mb-0">Showing <b class="me-1">1-3</b>of<b class="ms-1">27</b> Results</p>
                        </div>
                        <div class="col-md-6">
                            <nav aria-label="Page navigation example">
                                <ul class="pagination justify-content-center justify-content-md-end mb-0 products-pagination">
                                    <li class="page-item disabled"><a class="page-link" href="#!"><i data-lucide="chevron-left" class="size-4"></i> Previous</a></li>
                                    <li class="page-item"><a class="page-link" href="#!">1</a></li>
                                    <li class="page-item active"><a class="page-link" href="#!">2</a></li>
                                    <li class="page-item"><a class="page-link" href="#!">3</a></li>
                                    <li class="page-item"><a class="page-link" href="#!">Next <i data-lucide="chevron-right" class="size-4"></i></a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xxl-5">
            <div class="card card-h-100">
                <div class="card-header d-flex flex-wrap gap-4 align-items-center gap-3">
                    <h5 class="card-title mb-0 flex-grow-1">Performance Overview</h5>
                    <div class="dropdown flex-shrink-0">
                        <a href="#!" class="link link-custom-primary badge border avatar bg-body-custom fw-normal fs-13 py-6px px-3 gap-1 dropdown-toggle" aria-label="Dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            Monthly
                        </a>
                        <div class="dropdown-menu dropdown-menu-end">
                            <a class="dropdown-item" href="#!">Monthly</a>
                            <a class="dropdown-item" href="#!">Weekly</a>
                            <a class="dropdown-item" href="#!">Yearly</a>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row g-2">
                        <div class="col-md-2">
                            <div class="employee-prf-card d-flex flex-column gap-4 justify-content-between">
                                <div class="px-2 py-1">
                                    <h4 class="mb-2"><span class="counter" data-start="0" data-end="24" data-duration="1000"></span></h4>
                                    <span class="text-muted fs-15">Growth</span>
                                </div>
                                <div class="h-5 performer-line bg-orange"></div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="employee-prf-card d-flex flex-column gap-4 justify-content-between">
                                <div class="px-2 py-1">
                                    <h4 class="mb-2"><span class="counter" data-start="0" data-end="87" data-duration="1000"></span>%</h4>
                                    <span class="text-muted fs-15">Productivity</span>
                                </div>
                                <div class="h-5 performer-line bg-warning"></div>
                            </div>
                        </div>
                        <div class="col-md-5">
                            <div class="employee-prf-card d-flex flex-column gap-4 justify-content-between">
                                <div class="px-2 py-1">
                                    <h4 class="mb-2"><span class="counter" data-start="0" data-end="95" data-duration="1000"></span>%</h4>
                                    <span class="text-muted fs-15">Improvement</span>
                                </div>
                                <div class="h-5 performer-line bg-info"></div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="employee-prf-card d-flex flex-column gap-4 justify-content-between">
                                <div class="px-2 py-1">
                                    <h4 class="mb-2"><span class="counter" data-start="0" data-end="12" data-duration="1000"></span></h4>
                                    <span class="text-muted fs-15">Decline</span>
                                </div>
                                <div class="h-5 performer-line bg-danger"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-6 col-xxl-4">
            <div class="card">
                <div class="card-header d-flex align-items-center gap-3">
                    <h5 class="card-title mb-0 flex-grow-1">Recent Hires</h5>
                    <div class="dropdown flex-shrink-0">
                        <a href="#!" class="link link-custom-primary badge border avatar bg-body-custom fw-normal fs-13 py-6px px-3 gap-1 dropdown-toggle" aria-label="Dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            Monthly
                        </a>
                        <div class="dropdown-menu dropdown-menu-end">
                            <a class="dropdown-item" href="#!">Monthly</a>
                            <a class="dropdown-item" href="#!">Weekly</a>
                            <a class="dropdown-item" href="#!">Yearly</a>
                        </div>
                    </div>
                </div>
                <div class="card-body px-0">
                    <div class="px-5" data-simplebar="" style="max-height: 371px">
                        <div class="table-card table-responsive custom-scroll">
                            <table class="table table-borderless align-middle mb-0">
                                <thead class="border-bottom">
                                    <tr>
                                        <th class="text-muted fw-medium">Employee</th>
                                        <th class="text-muted fw-medium">Department</th>
                                        <th class="text-muted fw-medium text-end">Join Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center gap-3">
                                                <img src="/assets/images/user-1-1.webp" alt="Image" class="rounded-circle size-10" />
                                                <div>
                                                    <h6 class="mb-1 lh-1 fw-medium"><a href="#!" class="link text-body">Michael Anderson</a></h6>
                                                    <p class="text-muted fs-15">UI Designer</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>Design</td>
                                        <td class="text-end">05 Mar 2026</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center gap-3">
                                                <img src="/assets/images/user-2-1.webp" alt="Image" class="rounded-circle size-10" />
                                                <div>
                                                    <h6 class="mb-1 lh-1 fw-medium">
                                                        <a href="#!" class="link text-body">Sophia Martinez</a>
                                                    </h6>
                                                    <p class="text-muted fs-15">HR Executive</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>HR</td>
                                        <td class="text-end">04 Mar 2026</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center gap-3">
                                                <img src="/assets/images/user-3-1.webp" alt="Image" class="rounded-circle size-10" />
                                                <div>
                                                    <h6 class="mb-1 lh-1 fw-medium">
                                                        <a href="#!" class="link text-body">Daniel Carter</a>
                                                    </h6>
                                                    <p class="text-muted fs-15">Backend Developer</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>Development</td>
                                        <td class="text-end">03 Mar 2026</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center gap-3">
                                                <img src="/assets/images/user-4-1.webp" alt="Image" class="rounded-circle size-10" />
                                                <div>
                                                    <h6 class="mb-1 lh-1 fw-medium">
                                                        <a href="#!" class="link text-body">Olivia Johnson</a>
                                                    </h6>
                                                    <p class="text-muted fs-15">Marketing Manager</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>Marketing</td>
                                        <td class="text-end">02 Mar 2026</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center gap-3">
                                                <img src="/assets/images/user-5-1.webp" alt="Image" class="rounded-circle size-10" />
                                                <div>
                                                    <h6 class="mb-1 lh-1 fw-medium">
                                                        <a href="#!" class="link text-body">James Walker</a>
                                                    </h6>
                                                    <p class="text-muted fs-15">QA Engineer</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>QA</td>
                                        <td class="text-end">01 Mar 2026</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center gap-3">
                                                <img src="/assets/images/user-6-1.webp" alt="Image" class="rounded-circle size-10" />
                                                <div>
                                                    <h6 class="mb-1 lh-1 fw-medium">
                                                        <a href="#!" class="link text-body">Emma Thompson</a>
                                                    </h6>
                                                    <p class="text-muted fs-15">Product Manager</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>Product</td>
                                        <td class="text-end">28 Feb 2026</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-6 col-xxl-4">
            <div class="card card-h-100">
                <div class="card-header d-flex flex-wrap gap-4 align-items-center gap-3">
                    <h5 class="card-title mb-0 flex-grow-1">Recruitment Overview</h5>
                    <div class="dropdown flex-shrink-0">
                        <a href="#!" class="link link-custom-primary badge border avatar bg-body-custom fw-normal fs-13 py-6px px-3 gap-1 dropdown-toggle" aria-label="Dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            Monthly
                        </a>
                        <div class="dropdown-menu dropdown-menu-end">
                            <a class="dropdown-item" href="#!">Monthly</a>
                            <a class="dropdown-item" href="#!">Weekly</a>
                            <a class="dropdown-item" href="#!">Yearly</a>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row text-center mb-5 g-5">
                        <div class="col-6 col-md-4">
                            <div class="px-2 py-3 bg-light rounded">
                                <h5 class="mb-1"><span class="counter" data-start="0" data-end="78" data-duration="1000"></span></h5>
                                <p class="fs-15 text-muted mb-0">Open Jobs</p>
                            </div>
                        </div>
                        <div class="col-6 col-md-4">
                            <div class="px-2 py-3 bg-light rounded">
                                <h5 class="mb-1"><span class="counter" data-start="0" data-end="120" data-duration="1000"></span></h5>
                                <p class="fs-15 text-muted mb-0">Applications</p>
                            </div>
                        </div>
                        <div class="col-6 col-md-4">
                            <div class="px-2 py-3 bg-light rounded">
                                <h5 class="mb-1"><span class="counter" data-start="0" data-end="67" data-duration="1000"></span></h5>
                                <p class="fs-15 text-muted mb-0">Hires</p>
                            </div>
                        </div>
                    </div>
                    <div id="recruitmentChart"></div>
                </div>
            </div>
        </div>
        <div class="col-xxl-4">
            <div class="card">
                <div class="card-header d-flex flex-wrap gap-4 justify-content-between align-items-center">
                    <h5 class="card-title mb-0 flex-grow-1">Upcoming Events</h5>
                    <div class="d-flex gap-4">
                        <a href="#!" class="text-muted"><i class="mgc_download_2_line"></i></a>
                        <div class="dropdown">
                            <a href="#!" class="text-muted" data-bs-toggle="dropdown"><i class="mgc_more_2_fill"></i></a>
                            <div class="dropdown-menu dropdown-menu-end">
                                <a class="dropdown-item" href="#!"><i class="mgc_eye_line lh-1 me-2 align-middle"></i>View</a>
                                <a class="dropdown-item" href="#!"><i class="mgc_edit_2_line lh-1 me-2 align-middle"></i>Edit</a>
                                <a class="dropdown-item text-danger" href="#!" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="mgc_delete_2_line lh-1 me-2 align-middle"></i>Delete</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body px-0">
                    <div class="px-5" data-simplebar="" style="max-height: 380px">
                        <div class="vstack gap-4">
                            <div class="d-flex gap-4 align-items-center border-bottom pb-4 border-dashed">
                                <span class="bg-light avatar size-11 mt-1 rounded fs-lg fw-semibold event-date-box position-relative">
                                    07
                                    <span class="d-flex gap-5 justify-content-center position-absolute event-box-stand">
                                        <span class="rounded bg-dark bg-opacity-25 d-block event-stand"></span>
                                        <span class="rounded bg-dark bg-opacity-25 d-block event-stand"></span>
                                    </span>
                                </span>
                                <div class="overflow-hidden">
                                    <h6 class="mb-1 lh-sm text-truncate"><a href="#!" class="text-reset">HR Team Meeting</a></h6>
                                    <p class="text-muted fs-15 text-truncate">Mon, 07 Dec 2026 â€¢ 10:00 AM</p>
                                </div>
                                <div class="ms-auto">
                                    <span class="badge bg-success-subtle text-success border border-success-subtle">Meeting</span>
                                </div>
                            </div>
                            <div class="d-flex gap-4 align-items-center border-bottom pb-4 border-dashed">
                                <span class="bg-light avatar size-11 mt-1 rounded fs-lg fw-semibold event-date-box position-relative">
                                    08
                                    <span class="d-flex gap-5 justify-content-center position-absolute event-box-stand">
                                        <span class="rounded bg-dark bg-opacity-25 d-block event-stand"></span>
                                        <span class="rounded bg-dark bg-opacity-25 d-block event-stand"></span>
                                    </span>
                                </span>
                                <div class="overflow-hidden">
                                    <h6 class="mb-1 lh-sm text-truncate"><a href="#!" class="text-reset">Employee Training Session</a></h6>
                                    <p class="text-muted fs-15 text-truncate">Tue, 08 Dec 2026 â€¢ 02:00 PM</p>
                                </div>
                                <div class="ms-auto">
                                    <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle">Training</span>
                                </div>
                            </div>
                            <div class="d-flex gap-4 align-items-center border-bottom pb-4 border-dashed">
                                <span class="bg-light avatar size-11 mt-1 rounded fs-lg fw-semibold event-date-box position-relative">
                                    10
                                    <span class="d-flex gap-5 justify-content-center position-absolute event-box-stand">
                                        <span class="rounded bg-dark bg-opacity-25 d-block event-stand"></span>
                                        <span class="rounded bg-dark bg-opacity-25 d-block event-stand"></span>
                                    </span>
                                </span>
                                <div class="overflow-hidden">
                                    <h6 class="mb-1 lh-sm text-truncate"><a href="#!" class="text-reset">Project Review Meeting</a></h6>
                                    <p class="text-muted fs-15 text-truncate">Thu, 10 Dec 2026 â€¢ 11:30 AM</p>
                                </div>
                                <div class="ms-auto">
                                    <span class="badge bg-warning-subtle text-warning border border-warning-subtle">Review</span>
                                </div>
                            </div>
                            <div class="d-flex gap-4 align-items-center border-bottom pb-4 border-dashed">
                                <span class="bg-light avatar size-11 mt-1 rounded fs-lg fw-semibold event-date-box position-relative">
                                    12
                                    <span class="d-flex gap-5 justify-content-center position-absolute event-box-stand">
                                        <span class="rounded bg-dark bg-opacity-25 d-block event-stand"></span>
                                        <span class="rounded bg-dark bg-opacity-25 d-block event-stand"></span>
                                    </span>
                                </span>
                                <div class="overflow-hidden">
                                    <h6 class="mb-1 lh-sm text-truncate"><a href="#!" class="text-reset">Company Town Hall</a></h6>
                                    <p class="text-muted fs-15 text-truncate">Sat, 12 Dec 2026 â€¢ 04:00 PM</p>
                                </div>
                                <div class="ms-auto">
                                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle">Event</span>
                                </div>
                            </div>
                            <div class="d-flex gap-4 align-items-center border-bottom pb-4 border-dashed">
                                <span class="bg-light avatar size-11 mt-1 rounded fs-lg fw-semibold event-date-box position-relative">
                                    15
                                    <span class="d-flex gap-5 justify-content-center position-absolute event-box-stand">
                                        <span class="rounded bg-dark bg-opacity-25 d-block event-stand"></span>
                                        <span class="rounded bg-dark bg-opacity-25 d-block event-stand"></span>
                                    </span>
                                </span>
                                <div class="overflow-hidden">
                                    <h6 class="mb-1 lh-sm text-truncate"><a href="#!" class="text-reset">Performance Review Discussion</a></h6>
                                    <p class="text-muted fs-15 text-truncate">Tue, 15 Dec 2026 â€¢ 09:30 AM</p>
                                </div>
                                <div class="ms-auto">
                                    <span class="badge bg-danger-subtle text-danger border border-danger-subtle">Discussion</span>
                                </div>
                            </div>
                            <div class="d-flex gap-4 align-items-center border-bottom pb-4 border-dashed">
                                <span class="bg-light avatar size-11 mt-1 rounded fs-lg fw-semibold event-date-box position-relative">
                                    18
                                    <span class="d-flex gap-5 justify-content-center position-absolute event-box-stand">
                                        <span class="rounded bg-dark bg-opacity-25 d-block event-stand"></span>
                                        <span class="rounded bg-dark bg-opacity-25 d-block event-stand"></span>
                                    </span>
                                </span>
                                <div class="overflow-hidden">
                                    <h6 class="mb-1 lh-sm text-truncate"><a href="#!" class="text-reset">Weekly HR Sync Meeting</a></h6>
                                    <p class="text-muted fs-15 text-truncate">Fri, 18 Dec 2026 â€¢ 11:00 AM</p>
                                </div>
                                <div class="ms-auto">
                                    <span class="badge bg-success-subtle text-success border border-success-subtle">Meeting</span>
                                </div>
                            </div>
                            <div class="d-flex gap-4 align-items-center">
                                <span class="bg-light avatar size-11 mt-1 rounded fs-lg fw-semibold event-date-box position-relative">
                                    20
                                    <span class="d-flex gap-5 justify-content-center position-absolute event-box-stand">
                                        <span class="rounded bg-dark bg-opacity-25 d-block event-stand"></span>
                                        <span class="rounded bg-dark bg-opacity-25 d-block event-stand"></span>
                                    </span>
                                </span>
                                <div class="overflow-hidden">
                                    <h6 class="mb-1 lh-sm text-truncate"><a href="#!" class="text-reset">Leadership Skills Training</a></h6>
                                    <p class="text-muted fs-15 text-truncate">Sun, 20 Dec 2026 â€¢ 03:00 PM</p>
                                </div>
                                <div class="ms-auto">
                                    <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle">Training</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xxl-9">
            <div class="row gx-5">
                <div class="col-lg-5">
                    <div class="card card-h-100">
                        <div class="card-header d-flex flex-wrap gap-4 justify-content-between align-items-center">
                            <h5 class="card-title mb-0 flex-grow-1">Gender Distribution</h5>
                            <div class="dropdown">
                                <a href="#!" class="text-muted" data-bs-toggle="dropdown"><i class="mgc_more_2_fill"></i></a>
                                <div class="dropdown-menu dropdown-menu-end">
                                    <a class="dropdown-item" href="#!"><i class="mgc_eye_line lh-1 me-2 align-middle"></i>View</a>
                                    <a class="dropdown-item" href="#!"><i class="mgc_edit_2_line lh-1 me-2 align-middle"></i>Edit</a>
                                    <a class="dropdown-item text-danger" href="#!" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="mgc_delete_2_line lh-1 me-2 align-middle"></i>Delete</a>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="d-flex gap-5 mb-5">
                                <span class="text-muted">Female: <span class="text-danger">45%</span></span>
                                <span class="text-muted">Male: <span class="text-success">55%</span></span>
                            </div>
                            <div id="genderChart"></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-7">
                    <div class="card">
                        <div class="card-header d-flex align-items-center gap-3">
                            <h5 class="card-title mb-0 flex-grow-1">Income Statistics</h5>
                            <div class="dropdown flex-shrink-0">
                                <a href="#!" class="link link-custom-primary badge border avatar bg-body-custom fw-normal fs-13 py-6px px-3 gap-1 dropdown-toggle" aria-label="Dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                    Monthly
                                </a>
                                <div class="dropdown-menu dropdown-menu-end">
                                    <a class="dropdown-item" href="#!">Monthly</a>
                                    <a class="dropdown-item" href="#!">Weekly</a>
                                    <a class="dropdown-item" href="#!">Yearly</a>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="incomeStatisticsChart" dir="ltr"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xxl-3">
            <div class="card">
                <div class="card-header d-flex align-items-center gap-3">
                    <h5 class="card-title mb-0 flex-grow-1">Job Summary</h5>
                    <div class="dropdown flex-shrink-0">
                        <a href="#!" class="link link-custom-primary badge border avatar bg-body-custom fw-normal fs-13 py-6px px-3 gap-1 dropdown-toggle" aria-label="Dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            Monthly
                        </a>
                        <div class="dropdown-menu dropdown-menu-end">
                            <a class="dropdown-item" href="#!">Monthly</a>
                            <a class="dropdown-item" href="#!">Weekly</a>
                            <a class="dropdown-item" href="#!">Yearly</a>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div id="jobSummaryChart"></div>
                </div>
            </div>
        </div>
        <div class="col-12">
            <div class="card">
                <div class="card-header d-flex flex-wrap gap-4 justify-content-between align-items-center">
                    <h5 class="card-title mb-0">Employees List</h5>
                    <div class="d-flex align-items-center flex-wrap gap-3">
                        <button type="button" class="btn btn-outline-light"><i class="ri-download-cloud-2-line me-1"></i>Download</button>
                        <a href="#!" class="link link-custom-primary">View All <i class="ri-arrow-right-line"></i></a>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-card table-responsive custom-scroll">
                        <table class="table table-borderless mb-0 text-nowrap align-middle">
                            <thead>
                                <tr class="border-top border-bottom">
                                    <th class="w-14">
                                        <div class="form-check check-primary">
                                            <input class="form-check-input" type="checkbox" id="checkAll" />
                                        </div>
                                    </th>
                                    <th class="text-muted fw-medium">Employee</th>
                                    <th class="text-muted fw-medium">Email</th>
                                    <th class="text-muted fw-medium">Department</th>
                                    <th class="text-muted fw-medium">Role</th>
                                    <th class="text-muted fw-medium">Join Date</th>
                                    <th class="text-muted fw-medium">Salary</th>
                                    <th class="text-muted fw-medium">Status</th>
                                    <th class="text-muted fw-medium text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="form-check check-primary">
                                            <input class="form-check-input" type="checkbox" />
                                        </div>
                                    </td>
                                    <td>
                                        <div class="d-flex align-items-center gap-3">
                                            <img src="/assets/images/user-1-1.webp" class="size-8 rounded-circle" alt="User 1" />
                                            <a href="#!" class="link text-body fw-medium">Sonia Keebler</a>
                                        </div>
                                    </td>
                                    <td><a href="#!" class="text-body">sonia@alloce.com</a></td>
                                    <td>Human Resource</td>
                                    <td>HR Manager</td>
                                    <td>12 Mar 2022</td>
                                    <td>$18,000</td>
                                    <td><span class="badge bg-success-subtle text-success border border-success-subtle">Active</span></td>
                                    <td>
                                        <div class="d-flex justify-content-center gap-2">
                                            <button type="button" class="btn btn-outline-light btn-icon size-7-5" aria-label="Preview"><i class="mgc_eye_line"></i></button>
                                            <button type="button" class="btn btn-outline-light btn-icon size-7-5" aria-label="Download"><i class="mgc_pencil_2_ai_line"></i></button>
                                            <button type="button" class="btn btn-outline-light btn-icon size-7-5" data-bs-toggle="modal" data-bs-target="#deleteModal" aria-label="Delete"><i class="mgc_delete_2_line"></i></button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="form-check check-primary">
                                            <input class="form-check-input" type="checkbox" />
                                        </div>
                                    </td>
                                    <td>
                                        <div class="d-flex align-items-center gap-3">
                                            <img src="/assets/images/user-2-1.webp" class="size-8 rounded-circle" alt="User 2" />
                                            <a href="#!" class="link text-body fw-medium">Jerome Bell</a>
                                        </div>
                                    </td>
                                    <td><a href="#!" class="text-body">jerome@alloce.com</a></td>
                                    <td>Development</td>
                                    <td>Frontend Developer</td>
                                    <td>05 Jul 2023</td>
                                    <td>$14,500</td>
                                    <td><span class="badge bg-success-subtle text-success border border-success-subtle">Active</span></td>
                                    <td>
                                        <div class="d-flex justify-content-center gap-2">
                                            <button type="button" class="btn btn-outline-light btn-icon size-7-5" aria-label="Preview"><i class="mgc_eye_line"></i></button>
                                            <button type="button" class="btn btn-outline-light btn-icon size-7-5" aria-label="Edit"><i class="mgc_pencil_2_ai_line"></i></button>
                                            <button type="button" class="btn btn-outline-light btn-icon size-7-5" data-bs-toggle="modal" data-bs-target="#deleteModal" aria-label="Delete"><i class="mgc_delete_2_line"></i></button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="form-check check-primary">
                                            <input class="form-check-input" type="checkbox" />
                                        </div>
                                    </td>
                                    <td>
                                        <div class="d-flex align-items-center gap-3">
                                            <img src="/assets/images/user-3-1.webp" class="size-8 rounded-circle" alt="User 3" />
                                            <a href="#!" class="link text-body fw-medium">Marvin McKinney</a>
                                        </div>
                                    </td>
                                    <td><a href="#!" class="text-body">marvin@alloce.com</a></td>
                                    <td>Development</td>
                                    <td>Backend Developer</td>
                                    <td>18 Jan 2023</td>
                                    <td>$16,000</td>
                                    <td><span class="badge bg-success-subtle text-success border border-success-subtle">Active</span></td>
                                    <td>
                                        <div class="d-flex justify-content-center gap-2">
                                            <button type="button" class="btn btn-outline-light btn-icon size-7-5" aria-label="Preview"><i class="mgc_eye_line"></i></button>
                                            <button type="button" class="btn btn-outline-light btn-icon size-7-5" aria-label="Edit"><i class="mgc_pencil_2_ai_line"></i></button>
                                            <button type="button" class="btn btn-outline-light btn-icon size-7-5" data-bs-toggle="modal" data-bs-target="#deleteModal" aria-label="Delete"><i class="mgc_delete_2_line"></i></button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="form-check check-primary">
                                            <input class="form-check-input" type="checkbox" />
                                        </div>
                                    </td>
                                    <td>
                                        <div class="d-flex align-items-center gap-3">
                                            <img src="/assets/images/user-4-1.webp" class="size-8 rounded-circle" alt="User 4" />
                                            <a href="#!" class="link text-body fw-medium">Kathryn Murphy</a>
                                        </div>
                                    </td>
                                    <td><a href="#!" class="text-body">kathryn@alloce.com</a></td>
                                    <td>Finance</td>
                                    <td>Account Manager</td>
                                    <td>10 Sep 2021</td>
                                    <td>$17,200</td>
                                    <td><span class="badge bg-warning-subtle text-warning border border-warning-subtle">On Leave</span></td>
                                    <td>
                                        <div class="d-flex justify-content-center gap-2">
                                            <button type="button" class="btn btn-outline-light btn-icon size-7-5" aria-label="Preview"><i class="mgc_eye_line"></i></button>
                                            <button type="button" class="btn btn-outline-light btn-icon size-7-5" aria-label="Edit"><i class="mgc_pencil_2_ai_line"></i></button>
                                            <button type="button" class="btn btn-outline-light btn-icon size-7-5" data-bs-toggle="modal" data-bs-target="#deleteModal" aria-label="Delete"><i class="mgc_delete_2_line"></i></button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="form-check check-primary">
                                            <input class="form-check-input" type="checkbox" />
                                        </div>
                                    </td>
                                    <td>
                                        <div class="d-flex align-items-center gap-3">
                                            <img src="/assets/images/user-5-1.webp" class="size-8 rounded-circle" alt="User 5" />
                                            <a href="#!" class="link text-body fw-medium">Cody Fisher</a>
                                        </div>
                                    </td>
                                    <td><a href="#!" class="text-body">cody@alloce.com</a></td>
                                    <td>Marketing</td>
                                    <td>SEO Specialist</td>
                                    <td>21 May 2022</td>
                                    <td>$13,900</td>
                                    <td><span class="badge bg-danger-subtle text-danger border border-danger-subtle">Inactive</span></td>
                                    <td>
                                        <div class="d-flex justify-content-center gap-2">
                                            <button type="button" class="btn btn-outline-light btn-icon size-7-5" aria-label="Preview"><i class="mgc_eye_line"></i></button>
                                            <button type="button" class="btn btn-outline-light btn-icon size-7-5" aria-label="Edit"><i class="mgc_pencil_2_ai_line"></i></button>
                                            <button type="button" class="btn btn-outline-light btn-icon size-7-5" data-bs-toggle="modal" data-bs-target="#deleteModal" aria-label="Delete"><i class="mgc_delete_2_line"></i></button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="form-check check-primary">
                                            <input class="form-check-input" type="checkbox" />
                                        </div>
                                    </td>
                                    <td>
                                        <div class="d-flex align-items-center gap-3">
                                                <img src="/assets/images/user-6-1.webp" class="size-8 rounded-circle" alt="User 6" />
                                            <a href="#!" class="link text-body fw-medium">Leslie Alexander</a>
                                        </div>
                                    </td>
                                    <td><a href="#!" class="text-body">leslie@alloce.com</a></td>
                                    <td>Design</td>
                                    <td>UI/UX Designer</td>
                                    <td>02 Feb 2024</td>
                                    <td>$12,800</td>
                                    <td><span class="badge bg-success-subtle text-success border border-success-subtle">Active</span></td>
                                    <td>
                                        <div class="d-flex justify-content-center gap-2">
                                            <button type="button" class="btn btn-outline-light btn-icon size-7-5" aria-label="Preview"><i class="mgc_eye_line"></i></button>
                                            <button type="button" class="btn btn-outline-light btn-icon size-7-5" aria-label="Edit"><i class="mgc_pencil_2_ai_line"></i></button>
                                            <button type="button" class="btn btn-outline-light btn-icon size-7-5" data-bs-toggle="modal" data-bs-target="#deleteModal" aria-label="Delete"><i class="mgc_delete_2_line"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="row align-items-center g-3 mt-2">
                        <div class="col-md-6">
                            <p class="text-muted text-center text-md-start mb-0">Showing <b class="me-1">1-6</b>of<b class="ms-1">27</b> Results</p>
                        </div>
                        <div class="col-md-6">
                            <nav aria-label="Page navigation example">
                                <ul class="pagination justify-content-center justify-content-md-end mb-0 products-pagination">
                                    <li class="page-item disabled"><a class="page-link" href="#!"><i data-lucide="chevron-left" class="size-4"></i> Previous</a></li>
                                    <li class="page-item"><a class="page-link" href="#!">1</a></li>
                                    <li class="page-item active"><a class="page-link" href="#!">2</a></li>
                                    <li class="page-item"><a class="page-link" href="#!">3</a></li>
                                    <li class="page-item"><a class="page-link" href="#!">Next <i data-lucide="chevron-right" class="size-4"></i></a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
