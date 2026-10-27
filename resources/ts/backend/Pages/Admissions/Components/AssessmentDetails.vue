<script setup lang="ts">
defineProps<{ assessment: any }>();
</script>

<template>
    <div v-if="assessment" class="d-flex flex-column gap-3">
        <div v-if="assessment.next_action" class="alert alert-light border mb-0 py-2 px-3 fs-15">
            <strong>Next action:</strong> {{ assessment.next_action }}
        </div>

        <div class="row g-3">
            <div class="col-md-4">
                <h6 class="fs-15 text-success mb-2">
                    <AppIcon name="circle-check" class="me-1" />Matching ({{ assessment.matching_criteria?.length ?? 0 }})
                </h6>
                <ul class="list-unstyled mb-0 d-flex flex-column gap-1 fs-14">
                    <li v-for="(item, index) in assessment.matching_criteria" :key="`match-${index}`" class="text-muted">• {{ item }}</li>
                    <li v-if="!assessment.matching_criteria?.length" class="text-muted">No criteria confirmed yet.</li>
                </ul>
            </div>
            <div class="col-md-4">
                <h6 class="fs-15 text-danger mb-2">
                    <AppIcon name="circle-x" class="me-1" />Unmet ({{ assessment.unmet_criteria?.length ?? 0 }})
                </h6>
                <ul class="list-unstyled mb-0 d-flex flex-column gap-1 fs-14">
                    <li v-for="(item, index) in assessment.unmet_criteria" :key="`unmet-${index}`" class="text-muted">• {{ item }}</li>
                    <li v-if="!assessment.unmet_criteria?.length" class="text-muted">None recorded.</li>
                </ul>
            </div>
            <div class="col-md-4">
                <h6 class="fs-15 text-warning mb-2">
                    <AppIcon name="help-circle" class="me-1" />Unknown ({{ assessment.unknown_criteria?.length ?? 0 }})
                </h6>
                <ul class="list-unstyled mb-0 d-flex flex-column gap-1 fs-14">
                    <li v-for="(item, index) in assessment.unknown_criteria" :key="`unknown-${index}`" class="text-muted">• {{ item }}</li>
                    <li v-if="!assessment.unknown_criteria?.length" class="text-muted">None recorded.</li>
                </ul>
            </div>
        </div>

        <div v-if="assessment.evidence_urls?.length" class="pt-2 border-top">
            <p class="text-muted fs-14 mb-2">Official evidence</p>
            <div class="d-flex flex-wrap gap-2">
                <a
                    v-for="(url, index) in assessment.evidence_urls"
                    :key="`evidence-${index}`"
                    :href="url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-sm btn-sub-primary"
                >
                    <AppIcon name="external-link" class="me-1" />Source {{ index + 1 }}
                </a>
            </div>
        </div>
    </div>
</template>
