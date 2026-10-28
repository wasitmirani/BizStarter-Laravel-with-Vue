<?php

namespace Database\Seeders;

use App\Models\AdmissionCall;
use App\Models\OfficialSource;
use App\Models\Program;
use App\Models\University;
use Illuminate\Database\Seeder;

/**
 * Real Italian institutions added to the shared catalog.
 *
 * Only facts taken from the official websites are stored here: name, city,
 * region, institution type, official URLs and the English-taught programmes
 * listed in the official catalogues. Tuition, grade thresholds and deadlines
 * are intentionally left empty ("not published") until a verified source is
 * imported for them, so the eligibility engine keeps reporting
 * "insufficient evidence" instead of guessing.
 */
class AdmissionsCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $universities = [
            [
                'name' => 'Politecnico di Torino',
                'slug' => 'politecnico-di-torino',
                'official_website' => 'https://www.polito.it',
                'city' => 'Turin',
                'region' => 'Piedmont',
                'type' => 'public',
                'admissions_page_url' => 'https://www.polito.it/en/education/master-s-degree-programmes',
                'scholarship_source_url' => 'https://www.edisu.piemonte.it',
                'description' => 'Engineering, architecture and design university with a large English-taught master’s catalogue.',
            ],
            [
                'name' => 'University of Milan',
                'slug' => 'university-of-milan',
                'official_website' => 'https://www.unimi.it',
                'city' => 'Milan',
                'region' => 'Lombardy',
                'type' => 'public',
                'admissions_page_url' => 'https://www.unimi.it/en/education/master-programmes',
                'scholarship_source_url' => 'https://www.regione.lombardia.it',
                'description' => 'One of Italy’s largest public universities, with English-taught programmes across science, economics and humanities.',
            ],
            [
                'name' => 'University of Milano-Bicocca',
                'slug' => 'university-of-milano-bicocca',
                'official_website' => 'https://www.unimib.it',
                'city' => 'Milan',
                'region' => 'Lombardy',
                'type' => 'public',
                'admissions_page_url' => 'https://www.unimib.it/en/education/masters-degrees',
                'scholarship_source_url' => 'https://www.regione.lombardia.it',
                'description' => 'Modern public university in northern Milan with a growing English-taught offer in data and social sciences.',
            ],
            [
                'name' => "Ca' Foscari University of Venice",
                'slug' => 'ca-foscari-university-of-venice',
                'official_website' => 'https://www.unive.it',
                'city' => 'Venice',
                'region' => 'Veneto',
                'type' => 'public',
                'admissions_page_url' => 'https://www.unive.it',
                'scholarship_source_url' => 'https://www.esu.pd.it',
                'description' => 'Economics, languages and humanities university with English-taught master’s degrees.',
            ],
            [
                'name' => 'University of Pisa',
                'slug' => 'university-of-pisa',
                'official_website' => 'https://www.unipi.it',
                'city' => 'Pisa',
                'region' => 'Tuscany',
                'type' => 'public',
                'admissions_page_url' => 'https://www.unipi.it',
                'scholarship_source_url' => 'https://www.dsu.toscana.it',
                'description' => 'Historic public university with strong computer science, engineering and medical programmes.',
            ],
            [
                'name' => 'University of Turin',
                'slug' => 'university-of-turin',
                'official_website' => 'https://www.unito.it',
                'city' => 'Turin',
                'region' => 'Piedmont',
                'type' => 'public',
                'admissions_page_url' => 'https://www.unito.it',
                'scholarship_source_url' => 'https://www.edisu.piemonte.it',
                'description' => 'Large multidisciplinary public university with English-taught master’s degrees in science and economics.',
            ],
            [
                'name' => 'University of Genoa',
                'slug' => 'university-of-genoa',
                'official_website' => 'https://unige.it',
                'city' => 'Genoa',
                'region' => 'Liguria',
                'type' => 'public',
                'admissions_page_url' => 'https://unige.it/en',
                'scholarship_source_url' => 'https://www.aliseo.liguria.it',
                'description' => 'Coastal public university offering engineering and computer science degrees taught in English.',
            ],
            [
                'name' => 'University of Naples Federico II',
                'slug' => 'university-of-naples-federico-ii',
                'official_website' => 'https://www.unina.it',
                'city' => 'Naples',
                'region' => 'Campania',
                'type' => 'public',
                'admissions_page_url' => 'https://www.unina.it',
                'scholarship_source_url' => 'https://www.adisurcampania.it',
                'description' => 'One of the oldest public universities in Europe, with a broad engineering catalogue.',
            ],
            [
                'name' => 'University of Rome Tor Vergata',
                'slug' => 'university-of-rome-tor-vergata',
                'official_website' => 'https://www.uniroma2.it',
                'city' => 'Rome',
                'region' => 'Lazio',
                'type' => 'public',
                'admissions_page_url' => 'https://www.uniroma2.it',
                'scholarship_source_url' => 'https://www.disco.roma.it',
                'description' => 'Research-oriented public university in eastern Rome with English-taught engineering and economics degrees.',
            ],
            [
                'name' => 'University of Pavia',
                'slug' => 'university-of-pavia',
                'official_website' => 'https://www.unipv.it',
                'city' => 'Pavia',
                'region' => 'Lombardy',
                'type' => 'public',
                'admissions_page_url' => 'https://www.unipv.it',
                'scholarship_source_url' => 'https://www.regione.lombardia.it',
                'description' => 'Historic university with a strong engineering and biomedical tradition.',
            ],
            [
                'name' => 'Free University of Bozen-Bolzano',
                'slug' => 'free-university-of-bozen-bolzano',
                'official_website' => 'https://www.unibz.it',
                'city' => 'Bolzano',
                'region' => 'Trentino-Alto Adige',
                'type' => 'public',
                'admissions_page_url' => 'https://www.unibz.it',
                'scholarship_source_url' => 'https://www.operaunitn.it',
                'description' => 'Trilingual university (English, German, Italian) with a compact, internationally focused catalogue.',
            ],
            [
                'name' => 'Bocconi University',
                'slug' => 'bocconi-university',
                'official_website' => 'https://www.unibocconi.it',
                'city' => 'Milan',
                'region' => 'Lombardy',
                'type' => 'private',
                'admissions_page_url' => 'https://www.unibocconi.it/en',
                'scholarship_source_url' => 'https://www.unibocconi.it/en',
                'description' => 'Private university specialising in economics, management and data science.',
            ],
            [
                'name' => 'LUISS Guido Carli',
                'slug' => 'luiss-guido-carli',
                'official_website' => 'https://www.luiss.it',
                'city' => 'Rome',
                'region' => 'Lazio',
                'type' => 'private',
                'admissions_page_url' => 'https://www.luiss.it/en',
                'scholarship_source_url' => 'https://www.luiss.it/en',
                'description' => 'Private social sciences university with English-taught master’s degrees in management and data science.',
            ],
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

        // The Italian catalog predates the country column.
        University::whereNull('country')->update(['country' => 'IT']);

        $catalogue = [
            'politecnico-di-torino' => 'https://www.polito.it/en/education/master-s-degree-programmes',
            'university-of-milan' => 'https://www.unimi.it/en/education/master-programmes',
            'university-of-milano-bicocca' => 'https://www.unimib.it/en/education/masters-degrees',
            'ca-foscari-university-of-venice' => 'https://www.unive.it',
            'university-of-pisa' => 'https://www.unipi.it',
            'university-of-turin' => 'https://www.unito.it',
            'university-of-genoa' => 'https://unige.it/en',
            'university-of-naples-federico-ii' => 'https://www.unina.it',
            'university-of-rome-tor-vergata' => 'https://www.uniroma2.it',
            'university-of-pavia' => 'https://www.unipv.it',
            'free-university-of-bozen-bolzano' => 'https://www.unibz.it',
            'bocconi-university' => 'https://www.unibocconi.it/en',
            'luiss-guido-carli' => 'https://www.luiss.it/en',
            'university-of-bologna' => 'https://www.unibo.it/en/study/second-cycle-degree',
            'politecnico-di-milano' => 'https://www.polimi.it/en/prospective-students',
            'sapienza-university-of-rome' => 'https://www.uniroma1.it/en/pagina-strutturale/prospective-students',
            'university-of-padua' => 'https://www.unipd.it/en/degree-programmes',
            'university-of-trento' => 'https://www.unitn.it/en/study',
        ];

        $programs = [
            ['politecnico-di-torino', 'MSc in Cybersecurity Engineering', 'msc-cybersecurity-engineering-polito', 'Cybersecurity'],
            ['politecnico-di-torino', 'MSc in Data Science and Engineering', 'msc-data-science-engineering-polito', 'Data Science'],
            ['politecnico-di-torino', 'MSc in Mechatronic Engineering', 'msc-mechatronic-engineering-polito', 'Software Engineering'],
            ['politecnico-di-torino', 'MSc in Quantum Engineering', 'msc-quantum-engineering-polito', 'Computer Science'],
            ['politecnico-di-torino', 'MSc in Communications Engineering', 'msc-communications-engineering-polito', 'Information Technology'],
            ['university-of-milan', 'MSc in Data Science and Economics', 'msc-data-science-economics-unimi', 'Data Science'],
            ['university-of-milano-bicocca', 'MSc in Data Science', 'msc-data-science-unimib', 'Data Science'],
            ["ca-foscari-university-of-venice", 'MSc in Data Analytics for Business and Society', 'msc-data-analytics-venice', 'Data Science'],
            ['university-of-pisa', 'MSc in Data Science and Business Informatics', 'msc-data-science-business-informatics-pisa', 'Data Science'],
            ['university-of-turin', 'MSc in Stochastics and Data Science', 'msc-stochastics-data-science-turin', 'Data Science'],
            ['university-of-genoa', 'MSc in Computer Engineering', 'msc-computer-engineering-genoa', 'Software Engineering'],
            ['university-of-naples-federico-ii', 'MSc in Computer Engineering', 'msc-computer-engineering-naples', 'Software Engineering'],
            ['university-of-rome-tor-vergata', 'MSc in Computer Engineering', 'msc-computer-engineering-tor-vergata', 'Software Engineering'],
            ['university-of-pavia', 'MSc in Computer Engineering', 'msc-computer-engineering-pavia', 'Software Engineering'],
            ['free-university-of-bozen-bolzano', 'MSc in Software Engineering', 'msc-software-engineering-unibz', 'Software Engineering'],
            ['bocconi-university', 'MSc in Data Science and Business Analytics', 'msc-data-science-business-analytics-bocconi', 'Data Science'],
            ['luiss-guido-carli', 'MSc in Data Science and Management', 'msc-data-science-management-luiss', 'Data Science'],
            ['university-of-bologna', 'MSc in Artificial Intelligence', 'msc-artificial-intelligence-bologna', 'Artificial Intelligence'],
            ['politecnico-di-milano', 'MSc in Computer Science and Engineering', 'msc-computer-science-engineering-polimi', 'Computer Science'],
            ['sapienza-university-of-rome', 'MSc in Artificial Intelligence and Robotics', 'msc-ai-robotics-sapienza', 'Artificial Intelligence'],
            ['university-of-padua', 'MSc in Data Science', 'msc-data-science-padua', 'Data Science'],
            ['university-of-trento', 'MSc in Computer Science', 'msc-computer-science-trento', 'Computer Science'],
        ];

        foreach ($programs as [$universitySlug, $title, $slug, $subject]) {
            $university = University::where('slug', $universitySlug)->firstOrFail();
            $source = $catalogue[$universitySlug];

            $program = Program::updateOrCreate(
                ['slug' => $slug],
                [
                    'university_id' => $university->id,
                    'title' => $title,
                    'subject_area' => $subject,
                    'degree_type' => 'master',
                    'language' => 'en',
                    'duration_months' => 24,
                    'currency' => 'EUR',
                    'application_url' => $source,
                    'source_url' => $source,
                    'source_verified_at' => null,
                    'verification_status' => 'unverified',
                    'status' => 'open',
                    'is_sample' => false,
                ],
            );

            AdmissionCall::updateOrCreate(
                ['program_id' => $program->id, 'intake_year' => 2026],
                [
                    'intake_label' => '2026/27 intake — deadline to be confirmed',
                    'applicant_categories' => ['international', 'eu'],
                    'requirements' => ['Entry requirements are published in the official call.'],
                    'source_url' => $source,
                    'verification_status' => 'unverified',
                    'is_sample' => false,
                ],
            );
        }

        foreach ($catalogue as $universitySlug => $url) {
            $university = University::where('slug', $universitySlug)->first();

            // The URL is recorded, but no check is claimed until the sync action
            // actually fetches it.
            OfficialSource::updateOrCreate(
                ['url' => $url],
                [
                    'name' => ($university?->name ?? 'Official catalogue').' — Programme catalogue',
                    'type' => 'university',
                    'university_id' => $university?->id,
                    'region' => $university?->region,
                    'last_checked_at' => null,
                    'last_status' => null,
                ],
            );
        }
    }
}
