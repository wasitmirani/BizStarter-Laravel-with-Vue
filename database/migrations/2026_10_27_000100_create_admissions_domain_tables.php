<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('full_name')->nullable();
            $table->string('nationality', 2)->nullable();
            $table->string('country_of_residence', 2)->nullable();
            $table->string('applicant_category')->nullable();
            $table->string('target_country', 2)->default('IT');
            $table->unsignedSmallInteger('target_intake_year')->nullable();
            $table->string('intended_level')->default('master');
            $table->string('preferred_language', 2)->default('en');
            $table->unsignedTinyInteger('onboarding_step')->default(1);
            $table->timestamp('onboarding_completed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('education_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('qualification_title');
            $table->string('degree_level')->default('bachelor');
            $table->string('institution_name');
            $table->string('institution_country', 2)->nullable();
            $table->unsignedSmallInteger('graduation_year')->nullable();
            $table->string('grading_system')->default('percentage');
            $table->decimal('grade_value', 6, 2)->nullable();
            $table->decimal('grade_max', 6, 2)->nullable();
            $table->boolean('transcript_available')->default(false);
            $table->boolean('certificate_available')->default(false);
            $table->json('prerequisite_subjects')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'graduation_year']);
        });

        Schema::create('language_qualifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('language', 2)->default('en');
            $table->string('test_type');
            $table->decimal('score', 5, 2)->nullable();
            $table->decimal('score_max', 5, 2)->nullable();
            $table->boolean('certificate_available')->default(false);
            $table->date('issue_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'test_type']);
        });

        Schema::create('work_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('job_title');
            $table->string('company')->nullable();
            $table->string('country', 2)->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('is_current')->default(false);
            $table->json('skills')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'start_date']);
        });

        Schema::create('study_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->json('subject_areas')->nullable();
            $table->json('preferred_universities')->nullable();
            $table->json('preferred_regions')->nullable();
            $table->string('institution_type')->default('any');
            $table->decimal('max_tuition', 10, 2)->nullable();
            $table->decimal('application_budget', 10, 2)->nullable();
            $table->boolean('needs_scholarship')->default(true);
            $table->json('preferred_scholarship_types')->nullable();
            $table->string('min_relevance')->default('medium');
            $table->string('deadline_preference')->default('any');
            $table->timestamps();
        });

        Schema::create('notification_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('email')->nullable();
            $table->string('frequency')->default('weekly');
            $table->time('preferred_time')->nullable();
            $table->string('timezone')->default('UTC');
            $table->json('reminder_windows')->nullable();
            $table->boolean('scholarship_alerts')->default(true);
            $table->boolean('new_announcements')->default(true);
            $table->boolean('eligibility_change_alerts')->default(true);
            $table->boolean('slack_enabled')->default(false);
            $table->text('slack_webhook_url')->nullable();
            $table->timestamp('last_notified_at')->nullable();
            $table->timestamps();
        });

        Schema::create('universities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('official_website')->nullable();
            $table->string('city')->nullable();
            $table->string('region')->nullable();
            $table->string('type')->default('public');
            $table->string('admissions_page_url')->nullable();
            $table->string('scholarship_source_url')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index(['region', 'type']);
        });

        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('university_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('subject_area');
            $table->string('degree_type')->default('master');
            $table->string('language', 2)->default('en');
            $table->unsignedSmallInteger('duration_months')->nullable();
            $table->decimal('tuition_min', 10, 2)->nullable();
            $table->decimal('tuition_max', 10, 2)->nullable();
            $table->string('currency', 3)->default('EUR');
            $table->string('required_degree_level')->nullable();
            $table->decimal('minimum_grade_percentage', 5, 2)->nullable();
            $table->json('required_subjects')->nullable();
            $table->string('required_language_test')->nullable();
            $table->decimal('minimum_language_score', 5, 2)->nullable();
            $table->unsignedSmallInteger('minimum_work_experience_months')->nullable();
            $table->text('admission_prerequisites')->nullable();
            $table->json('required_documents')->nullable();
            $table->string('application_url')->nullable();
            $table->string('source_url')->nullable();
            $table->timestamp('source_verified_at')->nullable();
            $table->string('verification_status')->default('unverified');
            $table->string('status')->default('open');
            $table->boolean('is_sample')->default(false);
            $table->timestamps();

            $table->index(['subject_area', 'language']);
            $table->index(['status', 'verification_status']);
        });

        Schema::create('admission_calls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('intake_year');
            $table->string('intake_label');
            $table->date('opens_at')->nullable();
            $table->date('deadline')->nullable();
            $table->json('applicant_categories')->nullable();
            $table->json('requirements')->nullable();
            $table->string('source_url')->nullable();
            $table->date('published_at')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->string('verification_status')->default('unverified');
            $table->boolean('is_sample')->default(false);
            $table->timestamps();

            $table->index(['program_id', 'intake_year']);
            $table->index('deadline');
        });

        Schema::create('scholarships', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('provider');
            $table->string('region')->nullable();
            $table->string('type')->default('regional');
            $table->text('description')->nullable();
            $table->json('eligibility_criteria')->nullable();
            $table->text('benefits')->nullable();
            $table->json('required_documents')->nullable();
            $table->string('application_url')->nullable();
            $table->string('source_url')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->string('verification_status')->default('unverified');
            $table->boolean('is_sample')->default(false);
            $table->timestamps();

            $table->index(['region', 'type']);
        });

        Schema::create('scholarship_calls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scholarship_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('intake_year');
            $table->date('opens_at')->nullable();
            $table->date('deadline')->nullable();
            $table->json('eligibility_criteria')->nullable();
            $table->string('source_url')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->string('status')->default('open');
            $table->boolean('is_sample')->default(false);
            $table->timestamps();

            $table->index(['scholarship_id', 'intake_year']);
            $table->index('deadline');
        });

        Schema::create('official_sources', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('url')->unique();
            $table->string('type')->default('university');
            $table->foreignId('university_id')->nullable()->constrained()->nullOnDelete();
            $table->string('region')->nullable();
            $table->timestamp('last_checked_at')->nullable();
            $table->string('last_status')->nullable();
            $table->timestamps();
        });

        Schema::create('source_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('official_source_id')->constrained()->cascadeOnDelete();
            $table->string('content_hash', 64)->nullable();
            $table->unsignedSmallInteger('http_status')->nullable();
            $table->text('payload_excerpt')->nullable();
            $table->timestamp('captured_at');
            $table->timestamps();

            $table->index(['official_source_id', 'captured_at']);
        });

        Schema::create('eligibility_assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('program_id')->constrained()->cascadeOnDelete();
            $table->foreignId('admission_call_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status');
            $table->unsignedTinyInteger('score')->default(0);
            $table->json('matching_criteria')->nullable();
            $table->json('unmet_criteria')->nullable();
            $table->json('unknown_criteria')->nullable();
            $table->json('evidence_urls')->nullable();
            $table->text('next_action')->nullable();
            $table->timestamp('assessed_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'program_id']);
            $table->index(['user_id', 'status']);
        });

        Schema::create('user_program_bookmarks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('program_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'program_id']);
        });

        Schema::create('user_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('program_id')->constrained()->cascadeOnDelete();
            $table->foreignId('admission_call_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status')->default('planned');
            $table->string('priority')->default('medium');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('decision_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'program_id']);
            $table->index(['user_id', 'status']);
        });

        Schema::create('application_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_application_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->string('name');
            $table->string('disk')->default('local');
            $table->string('path');
            $table->string('original_name')->nullable();
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });

        Schema::create('user_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_application_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('due_date')->nullable();
            $table->string('priority')->default('medium');
            $table->string('status')->default('pending');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'due_date']);
        });

        Schema::create('daily_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('report_date');
            $table->string('type')->default('daily');
            $table->text('summary')->nullable();
            $table->json('payload')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'report_date', 'type']);
        });

        Schema::create('notification_deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('channel')->default('email');
            $table->string('subject');
            $table->string('status')->default('queued');
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->text('error')->nullable();
            $table->string('dedupe_key')->unique();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action');
            $table->string('subject_type')->nullable();
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('notification_deliveries');
        Schema::dropIfExists('daily_reports');
        Schema::dropIfExists('user_tasks');
        Schema::dropIfExists('application_documents');
        Schema::dropIfExists('user_applications');
        Schema::dropIfExists('user_program_bookmarks');
        Schema::dropIfExists('eligibility_assessments');
        Schema::dropIfExists('source_snapshots');
        Schema::dropIfExists('official_sources');
        Schema::dropIfExists('scholarship_calls');
        Schema::dropIfExists('scholarships');
        Schema::dropIfExists('admission_calls');
        Schema::dropIfExists('programs');
        Schema::dropIfExists('universities');
        Schema::dropIfExists('notification_preferences');
        Schema::dropIfExists('study_preferences');
        Schema::dropIfExists('work_experiences');
        Schema::dropIfExists('language_qualifications');
        Schema::dropIfExists('education_records');
        Schema::dropIfExists('user_profiles');
    }
};
