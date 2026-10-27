<script setup lang="ts">
import StatusBadge from './StatusBadge.vue';
import SourceBadge from './SourceBadge.vue';

const props = defineProps<{ program: any }>();
const emit = defineEmits<{
    (event: 'open', program: any): void;
    (event: 'toggle-bookmark', program: any): void;
}>();

const assessment = () => props.program?.assessment ?? null;
const deadline = () => props.program?.next_call?.deadline ?? null;
const daysLeft = () => props.program?.next_call?.days_left ?? null;

const urgencyClass = (days: number | null) => {
    if (days === null) return 'text-muted';
    if (days <= 14) return 'text-danger fw-semibold';
    if (days <= 45) return 'text-warning fw-semibold';
    return 'text-muted';
};
</script>

<template>
    <div class="card h-100">
        <div class="card-body d-flex flex-column gap-3">
            <div class="d-flex align-items-start justify-content-between gap-2">
                <div class="min-w-0">
                    <h6 class="mb-1">
                        <a href="#!" class="text-reset" @click.prevent="emit('open', program)">{{ program.title }}</a>
                    </h6>
                    <p class="text-muted fs-15 mb-0">
                        {{ program.university?.name }}
                        <span v-if="program.university?.region">· {{ program.university.region }}</span>
                    </p>
                </div>
                <button
                    type="button"
                    class="btn btn-icon btn-sm flex-shrink-0"
                    :class="program.bookmarked ? 'bg-warning-subtle text-warning' : 'bg-light text-muted'"
                    :aria-label="program.bookmarked ? 'Remove bookmark' : 'Bookmark program'"
                    @click="emit('toggle-bookmark', program)"
                >
                    <AppIcon :name="program.bookmarked ? 'bookmark-filled' : 'bookmark'" :size="16" />
                </button>
            </div>

            <div class="d-flex flex-wrap gap-2 align-items-center">
                <span class="badge bg-light text-body border">{{ program.subject_area }}</span>
                <span class="badge bg-light text-body border">{{ program.language?.toUpperCase() }}</span>
                <span v-if="program.duration_months" class="badge bg-light text-body border">{{ program.duration_months }} months</span>
                <StatusBadge v-if="assessment()" :status="assessment().status" :label="assessment().status_label" />
            </div>

            <div class="d-flex flex-wrap align-items-center gap-3 fs-15 text-muted">
                <span><AppIcon name="cash" class="me-1" />{{ program.tuition?.label }}</span>
                <span v-if="deadline()" :class="urgencyClass(daysLeft())">
                    <AppIcon name="calendar-event" class="me-1" />
                    {{ deadline() }}
                    <template v-if="daysLeft() !== null">({{ daysLeft() }} days)</template>
                </span>
                <span v-else><AppIcon name="calendar-off" class="me-1" />No open call stored</span>
            </div>

            <div class="d-flex align-items-center justify-content-between gap-2 mt-auto pt-2 border-top">
                <SourceBadge :status="program.verification_status" :verified-at="program.source_verified_at" :sample="program.is_sample" />
                <button type="button" class="btn btn-sm btn-sub-primary" @click="emit('open', program)">
                    Details <AppIcon name="arrow-right" class="ms-1" />
                </button>
            </div>
        </div>
    </div>
</template>
