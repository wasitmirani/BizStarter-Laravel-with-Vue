<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ status: string; label?: string }>();

const labels: Record<string, string> = {
    likely_eligible: 'Likely Eligible',
    potential_match: 'Potential Match',
    ambitious: 'Ambitious',
    not_eligible: 'Not Eligible',
    insufficient_evidence: 'Insufficient Evidence',
    planned: 'Planned',
    in_progress: 'In Progress',
    submitted: 'Submitted',
    offer: 'Offer',
    rejected: 'Rejected',
    withdrawn: 'Withdrawn',
    pending: 'Pending',
    done: 'Done',
    open: 'Open',
    closed: 'Closed',
    upcoming: 'Upcoming',
};

const tone: Record<string, string> = {
    likely_eligible: 'bg-success-subtle text-success border-success-subtle',
    potential_match: 'bg-primary-subtle text-primary border-primary-subtle',
    ambitious: 'bg-warning-subtle text-warning border-warning-subtle',
    not_eligible: 'bg-danger-subtle text-danger border-danger-subtle',
    insufficient_evidence: 'bg-secondary-subtle text-secondary border-secondary-subtle',
    planned: 'bg-secondary-subtle text-secondary border-secondary-subtle',
    in_progress: 'bg-info-subtle text-info border-info-subtle',
    submitted: 'bg-primary-subtle text-primary border-primary-subtle',
    offer: 'bg-success-subtle text-success border-success-subtle',
    rejected: 'bg-danger-subtle text-danger border-danger-subtle',
    withdrawn: 'bg-secondary-subtle text-secondary border-secondary-subtle',
    pending: 'bg-warning-subtle text-warning border-warning-subtle',
    done: 'bg-success-subtle text-success border-success-subtle',
    open: 'bg-success-subtle text-success border-success-subtle',
    closed: 'bg-danger-subtle text-danger border-danger-subtle',
    upcoming: 'bg-info-subtle text-info border-info-subtle',
};

const classes = computed(() => tone[props.status] ?? 'bg-secondary-subtle text-secondary border-secondary-subtle');
const text = computed(() => props.label ?? labels[props.status] ?? props.status);
</script>

<template>
    <span class="badge border" :class="classes">{{ text }}</span>
</template>
