<?php

namespace Database\Seeders;

use App\Models\AdmissionCall;
use App\Models\OfficialSource;
use App\Models\Program;
use App\Models\Scholarship;
use App\Models\ScholarshipCall;
use App\Models\SourceSnapshot;
use App\Models\University;
use Illuminate\Database\Seeder;

/**
 * Demo catalog for local development only.
 *
 * This seeder is intentionally NOT registered in DatabaseSeeder. Run it by hand
 * on a local database when you need sample rows. Every record is flagged
 * is_sample + unverified and links to an official domain. Dates, tuition and
 * requirements are illustrative — they must be checked against the linked
 * official page before being relied on.
 */
class AdmissionsDemoSeeder extends Seeder
{
    public function run(): void
    {
        if (app()->environment('production')) {
            $this->command?->warn('AdmissionsDemoSeeder is disabled in production.');

            return;
        }

        $universities = [
            [
                'name' => 'University of Bologna',
                'slug' => 'university-of-bologna',
                'official_website' => 'https://www.unibo.it',
                'city' => 'Bologna',
                'region' => 'Emilia-Romagna',
                'type' => 'public',
                'admissions_page_url' => 'https://www.unibo.it/en/study/second-cycle-degree',
                'scholarship_source_url' => 'https://www.unibo.it/en/study/study-grants-and-subsidies',
                'description' => 'Italy’s oldest university, with a broad English-taught master’s catalogue.',
            ],
            [
                'name' => 'Politecnico di Milano',
                'slug' => 'politecnico-di-milano',
                'official_website' => 'https://www.polimi.it',
                'city' => 'Milan',
                'region' => 'Lombardy',
                'type' => 'public',
                'admissions_page_url' => 'https://www.polimi.it/en/prospective-students',
                'scholarship_source_url' => 'https://www.polimi.it/en/prospective-students/scholarships',
                'description' => 'Engineering and design focused technical university.',
            ],
            [
                'name' => 'Sapienza University of Rome',
                'slug' => 'sapienza-university-of-rome',
                'official_website' => 'https://www.uniroma1.it',
                'city' => 'Rome',
                'region' => 'Lazio',
                'type' => 'public',
                'admissions_page_url' => 'https://www.uniroma1.it/en/pagina-strutturale/prospective-students',
                'scholarship_source_url' => 'https://www.uniroma1.it/en/pagina-strutturale/scholarships',
                'description' => 'Large public university with a wide range of master’s programs.',
            ],
            [
                'name' => 'University of Padua',
                'slug' => 'university-of-padua',
                'official_website' => 'https://www.unipd.it',
                'city' => 'Padua',
                'region' => 'Veneto',
                'type' => 'public',
                'admissions_page_url' => 'https://www.unipd.it/en/degree-programmes',
                'scholarship_source_url' => 'https://www.unipd.it/en/scholarships',
                'description' => 'Research university with strong data and health programs.',
            ],
            [
                'name' => 'University of Trento',
                'slug' => 'university-of-trento',
                'official_website' => 'https://www.unitn.it',
                'city' => 'Trento',
                'region' => 'Trentino-Alto Adige',
                'type' => 'public',
                'admissions_page_url' => 'https://www.unitn.it/en/study',
                'scholarship_source_url' => 'https://www.unitn.it/en/study/scholarships',
                'description' => 'Compact university with a growing English-taught ICT catalogue.',
            ],
        ];

        foreach ($universities as $university) {
            University::updateOrCreate(['slug' => $university['slug']], $university);
        }

        $programs = [
            [
                'university' => 'university-of-bologna',
                'title' => 'MSc in Computer Science',
                'slug' => 'msc-computer-science-bologna',
                'subject_area' => 'Computer Science',
                'language' => 'en',
                'duration_months' => 24,
                'tuition_min' => 0,
                'tuition_max' => 4000,
                'required_degree_level' => 'bachelor',
                'minimum_grade_percentage' => 70,
                'required_subjects' => ['Computer Science', 'Mathematics'],
                'required_language_test' => 'ielts',
                'minimum_language_score' => 6.0,
                'required_documents' => ['Transcript', 'Degree certificate', 'CV', 'Language certificate'],
                'application_url' => 'https://www.unibo.it/en/study/second-cycle-degree',
                'source_url' => 'https://www.unibo.it/en/study/second-cycle-degree',
            ],
            [
                'university' => 'university-of-bologna',
                'title' => 'MSc in Artificial Intelligence',
                'slug' => 'msc-artificial-intelligence-bologna',
                'subject_area' => 'Artificial Intelligence',
                'language' => 'en',
                'duration_months' => 24,
                'tuition_min' => 0,
                'tuition_max' => 4000,
                'required_degree_level' => 'bachelor',
                'minimum_grade_percentage' => 75,
                'required_subjects' => ['Computer Science', 'Mathematics', 'Statistics'],
                'required_language_test' => 'ielts',
                'minimum_language_score' => 6.5,
                'required_documents' => ['Transcript', 'Degree certificate', 'CV', 'Language certificate', 'Motivation letter'],
                'application_url' => 'https://www.unibo.it/en/study/second-cycle-degree',
                'source_url' => 'https://www.unibo.it/en/study/second-cycle-degree',
            ],
            [
                'university' => 'university-of-padua',
                'title' => 'MSc in Data Science',
                'slug' => 'msc-data-science-padua',
                'subject_area' => 'Data Science',
                'language' => 'en',
                'duration_months' => 24,
                'tuition_min' => 0,
                'tuition_max' => 3500,
                'required_degree_level' => 'bachelor',
                'minimum_grade_percentage' => 70,
                'required_subjects' => ['Statistics', 'Computer Science'],
                'required_language_test' => 'ielts',
                'minimum_language_score' => 6.0,
                'required_documents' => ['Transcript', 'Degree certificate', 'CV', 'Language certificate'],
                'application_url' => 'https://www.unipd.it/en/degree-programmes',
                'source_url' => 'https://www.unipd.it/en/degree-programmes',
            ],
            [
                'university' => 'politecnico-di-milano',
                'title' => 'MSc in Computer Science and Engineering',
                'slug' => 'msc-computer-science-engineering-polimi',
                'subject_area' => 'Software Engineering',
                'language' => 'en',
                'duration_months' => 24,
                'tuition_min' => 900,
                'tuition_max' => 3900,
                'required_degree_level' => 'bachelor',
                'minimum_grade_percentage' => 75,
                'required_subjects' => ['Computer Science', 'Mathematics'],
                'required_language_test' => 'ielts',
                'minimum_language_score' => 6.0,
                'required_documents' => ['Transcript', 'Degree certificate', 'CV', 'Language certificate'],
                'application_url' => 'https://www.polimi.it/en/prospective-students',
                'source_url' => 'https://www.polimi.it/en/prospective-students',
            ],
            [
                'university' => 'sapienza-university-of-rome',
                'title' => 'MSc in Artificial Intelligence and Robotics',
                'slug' => 'msc-ai-robotics-sapienza',
                'subject_area' => 'Artificial Intelligence',
                'language' => 'en',
                'duration_months' => 24,
                'tuition_min' => 0,
                'tuition_max' => 2900,
                'required_degree_level' => 'bachelor',
                'minimum_grade_percentage' => 70,
                'required_subjects' => ['Computer Science', 'Mathematics'],
                'required_language_test' => 'ielts',
                'minimum_language_score' => 6.0,
                'required_documents' => ['Transcript', 'Degree certificate', 'CV', 'Language certificate'],
                'application_url' => 'https://www.uniroma1.it/en/pagina-strutturale/prospective-students',
                'source_url' => 'https://www.uniroma1.it/en/pagina-strutturale/prospective-students',
            ],
            [
                'university' => 'university-of-trento',
                'title' => 'MSc in Cybersecurity',
                'slug' => 'msc-cybersecurity-trento',
                'subject_area' => 'Cybersecurity',
                'language' => 'en',
                'duration_months' => 24,
                'tuition_min' => 0,
                'tuition_max' => 3800,
                'required_degree_level' => 'bachelor',
                'minimum_grade_percentage' => 70,
                'required_subjects' => ['Computer Science', 'Mathematics'],
                'required_language_test' => 'ielts',
                'minimum_language_score' => 6.0,
                'required_documents' => ['Transcript', 'Degree certificate', 'CV', 'Language certificate'],
                'application_url' => 'https://www.unitn.it/en/study',
                'source_url' => 'https://www.unitn.it/en/study',
            ],
            [
                'university' => 'university-of-bologna',
                'title' => 'MSc in Health Economics and Management',
                'slug' => 'msc-health-economics-management-bologna',
                'subject_area' => 'Healthcare Management',
                'language' => 'en',
                'duration_months' => 24,
                'tuition_min' => 0,
                'tuition_max' => 4000,
                'required_degree_level' => 'bachelor',
                'minimum_grade_percentage' => 70,
                'required_subjects' => ['Economics', 'Statistics'],
                'required_language_test' => 'ielts',
                'minimum_language_score' => 6.0,
                'required_documents' => ['Transcript', 'Degree certificate', 'CV', 'Language certificate'],
                'application_url' => 'https://www.unibo.it/en/study/second-cycle-degree',
                'source_url' => 'https://www.unibo.it/en/study/second-cycle-degree',
            ],
        ];

        $deadlines = [
            'msc-computer-science-bologna' => '2027-01-15',
            'msc-artificial-intelligence-bologna' => '2027-02-01',
            'msc-data-science-padua' => '2027-03-15',
            'msc-computer-science-engineering-polimi' => '2026-12-20',
            'msc-ai-robotics-sapienza' => '2027-01-31',
            'msc-cybersecurity-trento' => '2027-04-30',
            'msc-health-economics-management-bologna' => '2027-05-15',
        ];

        foreach ($programs as $data) {
            $university = University::where('slug', $data['university'])->firstOrFail();
            unset($data['university']);

            $program = Program::updateOrCreate(
                ['slug' => $data['slug']],
                $data + [
                    'university_id' => $university->id,
                    'verification_status' => 'unverified',
                    'is_sample' => true,
                    'status' => 'open',
                ],
            );

            AdmissionCall::updateOrCreate(
                ['program_id' => $program->id, 'intake_year' => 2027],
                [
                    'intake_label' => '2027/28 intake',
                    'opens_at' => now()->subDays(30)->toDateString(),
                    'deadline' => $deadlines[$program->slug],
                    'applicant_categories' => ['international', 'eu'],
                    'requirements' => ['Check the official call for full requirements.'],
                    'source_url' => $program->source_url,
                    'published_at' => now()->subDays(45)->toDateString(),
                    'verification_status' => 'unverified',
                    'is_sample' => true,
                ],
            );
        }

        $scholarships = [
            [
                'name' => 'DSU Emilia-Romagna Regional Scholarship',
                'slug' => 'dsu-emilia-romagna',
                'provider' => 'ER.GO — Azienda Regionale per il Diritto agli Studi Universitari',
                'region' => 'Emilia-Romagna',
                'type' => 'regional',
                'description' => 'Need-based regional scholarship for eligible students studying in Emilia-Romagna.',
                'eligibility_criteria' => ['Family income and assets (ISEE/ISPE)', 'Enrolment at a regional university'],
                'benefits' => 'Cash grant plus possible fee reduction and accommodation support, subject to the official call.',
                'required_documents' => ['ISEE certificate', 'Enrolment certificate', 'ID document'],
                'application_url' => 'https://www.ergo.it',
                'source_url' => 'https://www.ergo.it',
                'deadline' => '2027-07-31',
            ],
            [
                'name' => 'DSU Lombardy Regional Scholarship',
                'slug' => 'dsu-lombardy',
                'provider' => 'Regione Lombardia',
                'region' => 'Lombardy',
                'type' => 'regional',
                'description' => 'Regional right-to-study support for Lombardy universities.',
                'eligibility_criteria' => ['ISEE within the published threshold', 'Enrolment at a Lombardy university'],
                'benefits' => 'Grant, fee reduction and accommodation priority according to the official call.',
                'required_documents' => ['ISEE certificate', 'Enrolment certificate'],
                'application_url' => 'https://www.regione.lombardia.it',
                'source_url' => 'https://www.regione.lombardia.it',
                'deadline' => '2027-07-15',
            ],
            [
                'name' => 'DiSCo Lazio Regional Scholarship',
                'slug' => 'disco-lazio',
                'provider' => 'DiSCo Lazio',
                'region' => 'Lazio',
                'type' => 'regional',
                'description' => 'Right-to-study benefits for students enrolled in Lazio.',
                'eligibility_criteria' => ['ISEE/ISPE thresholds', 'Enrolment at a Lazio university'],
                'benefits' => 'Grant and services per the official annual call.',
                'required_documents' => ['ISEE certificate', 'Enrolment certificate'],
                'application_url' => 'https://www.disco.roma.it',
                'source_url' => 'https://www.disco.roma.it',
                'deadline' => '2027-07-20',
            ],
            [
                'name' => 'Opera Universitaria Trento Scholarship',
                'slug' => 'opera-universitaria-trento',
                'provider' => 'Opera Universitaria di Trento',
                'region' => 'Trentino-Alto Adige',
                'type' => 'regional',
                'description' => 'Regional scholarship and accommodation support in Trentino.',
                'eligibility_criteria' => ['ISEE thresholds', 'Enrolment at the University of Trento'],
                'benefits' => 'Grant and accommodation support subject to the official call.',
                'required_documents' => ['ISEE certificate', 'Enrolment certificate'],
                'application_url' => 'https://www.operaunitn.it',
                'source_url' => 'https://www.operaunitn.it',
                'deadline' => '2027-06-30',
            ],
            [
                'name' => 'ESU Padova Regional Scholarship',
                'slug' => 'esu-padova',
                'provider' => 'ESU Padova',
                'region' => 'Veneto',
                'type' => 'regional',
                'description' => 'Right-to-study scholarship for students in Veneto.',
                'eligibility_criteria' => ['ISEE/ISPE thresholds', 'Enrolment at a Veneto university'],
                'benefits' => 'Grant and services per the official call.',
                'required_documents' => ['ISEE certificate', 'Enrolment certificate'],
                'application_url' => 'https://www.esu.pd.it',
                'source_url' => 'https://www.esu.pd.it',
                'deadline' => '2027-07-10',
            ],
            [
                'name' => 'MAECI Italian Government Scholarship',
                'slug' => 'maeci-scholarship',
                'provider' => 'Italian Ministry of Foreign Affairs',
                'region' => 'Italy',
                'type' => 'national',
                'description' => 'Government scholarship for international students, awarded through Italian diplomatic missions.',
                'eligibility_criteria' => ['Non-Italian citizenship', 'Academic merit', 'Country-specific call conditions'],
                'benefits' => 'Tuition exemption and a monthly allowance according to the official call.',
                'required_documents' => ['Passport', 'Transcript', 'CV', 'Motivation letter'],
                'application_url' => 'https://studyinitaly.esteri.it',
                'source_url' => 'https://studyinitaly.esteri.it',
                'deadline' => '2027-05-31',
            ],
        ];

        foreach ($scholarships as $data) {
            $deadline = $data['deadline'];
            unset($data['deadline']);

            $scholarship = Scholarship::updateOrCreate(
                ['slug' => $data['slug']],
                $data + ['verification_status' => 'unverified', 'is_sample' => true],
            );

            ScholarshipCall::updateOrCreate(
                ['scholarship_id' => $scholarship->id, 'intake_year' => 2027],
                [
                    'opens_at' => now()->subDays(10)->toDateString(),
                    'deadline' => $deadline,
                    'eligibility_criteria' => $scholarship->eligibility_criteria,
                    'source_url' => $scholarship->source_url,
                    'status' => 'open',
                    'is_sample' => true,
                ],
            );
        }

        $sources = [
            ['name' => 'University of Bologna — Admissions', 'url' => 'https://www.unibo.it/en/study/second-cycle-degree', 'type' => 'university', 'university' => 'university-of-bologna', 'region' => 'Emilia-Romagna'],
            ['name' => 'Politecnico di Milano — Admissions', 'url' => 'https://www.polimi.it/en/prospective-students', 'type' => 'university', 'university' => 'politecnico-di-milano', 'region' => 'Lombardy'],
            ['name' => 'ER.GO — Regional scholarships', 'url' => 'https://www.ergo.it', 'type' => 'scholarship', 'university' => null, 'region' => 'Emilia-Romagna'],
            ['name' => 'DiSCo Lazio — Regional scholarships', 'url' => 'https://www.disco.roma.it', 'type' => 'scholarship', 'university' => null, 'region' => 'Lazio'],
        ];

        foreach ($sources as $data) {
            $university = isset($data['university']) && $data['university']
                ? University::where('slug', $data['university'])->first()
                : null;

            $source = OfficialSource::updateOrCreate(
                ['url' => $data['url']],
                [
                    'name' => $data['name'],
                    'type' => $data['type'],
                    'university_id' => $university?->id,
                    'region' => $data['region'],
                    'last_checked_at' => now()->subHours(6),
                    'last_status' => 'ok',
                ],
            );

            SourceSnapshot::firstOrCreate(
                ['official_source_id' => $source->id, 'captured_at' => now()->subHours(6)->startOfHour()],
                [
                    'content_hash' => hash('sha256', $data['url'].now()->toDateString()),
                    'http_status' => 200,
                    'payload_excerpt' => 'Demo monitoring snapshot. Replace with a verified fetch before relying on it.',
                ],
            );
        }
    }
}
