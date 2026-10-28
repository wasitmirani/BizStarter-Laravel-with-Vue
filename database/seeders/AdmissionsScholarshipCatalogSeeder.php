<?php

namespace Database\Seeders;

use App\Models\Scholarship;
use App\Models\ScholarshipCall;
use Illuminate\Database\Seeder;

/**
 * Real right-to-study and government scholarship schemes.
 *
 * Only the scheme name, provider, official URL and published purpose are
 * stored. Deadlines and amounts change every year, so they are left empty
 * (and flagged unverified) until the official call is imported or checked
 * with the in-app source sync.
 */
class AdmissionsScholarshipCatalogSeeder extends Seeder
{
    public function run(): void
    {
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
            ],
        ];

        foreach ($scholarships as $data) {
            $scholarship = Scholarship::updateOrCreate(
                ['slug' => $data['slug']],
                $data + [
                    'verification_status' => 'unverified',
                    'is_sample' => false,
                ],
            );

            ScholarshipCall::updateOrCreate(
                ['scholarship_id' => $scholarship->id, 'intake_year' => 2027],
                [
                    'opens_at' => null,
                    'deadline' => null,
                    'eligibility_criteria' => $scholarship->eligibility_criteria,
                    'source_url' => $scholarship->source_url,
                    'status' => 'open',
                    'is_sample' => false,
                ],
            );
        }
    }
}
