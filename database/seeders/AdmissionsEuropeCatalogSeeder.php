<?php

namespace Database\Seeders;

use App\Models\AdmissionCall;
use App\Models\OfficialSource;
use App\Models\Program;
use App\Models\University;
use Illuminate\Database\Seeder;

/**
 * Real European institutions (public and private) added to the shared catalog.
 *
 * Only facts taken from official websites are stored: name, city, region,
 * country, institution type, official URLs and the English-taught master's
 * programmes listed in the official catalogues. Tuition, grade thresholds and
 * deadlines are intentionally left empty until a verified import exists, so the
 * eligibility engine reports "insufficient evidence" instead of guessing.
 */
class AdmissionsEuropeCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $universities = [
            // Germany
            [
                'name' => 'Technical University of Munich',
                'slug' => 'technical-university-of-munich',
                'official_website' => 'https://www.tum.de',
                'city' => 'Munich',
                'region' => 'Bavaria',
                'country' => 'DE',
                'type' => 'public',
                'admissions_page_url' => 'https://www.tum.de/en/studies/degree-programs',
                'scholarship_source_url' => 'https://www.daad.de/en/',
                'description' => 'Public technical university in Munich with a broad English-taught master’s catalogue in engineering, informatics and data science.',
            ],
            [
                'name' => 'RWTH Aachen University',
                'slug' => 'rwth-aachen-university',
                'official_website' => 'https://www.rwth-aachen.de',
                'city' => 'Aachen',
                'region' => 'North Rhine-Westphalia',
                'country' => 'DE',
                'type' => 'public',
                'admissions_page_url' => 'https://www.rwth-aachen.de/go/id/bnpy/',
                'scholarship_source_url' => 'https://www.daad.de/en/',
                'description' => 'Public engineering university in Aachen with English-taught master’s programmes in computer science and data science.',
            ],
            [
                'name' => 'Heidelberg University',
                'slug' => 'heidelberg-university',
                'official_website' => 'https://www.uni-heidelberg.de',
                'city' => 'Heidelberg',
                'region' => 'Baden-Württemberg',
                'country' => 'DE',
                'type' => 'public',
                'admissions_page_url' => 'https://www.uni-heidelberg.de/en/study/all-subjects',
                'scholarship_source_url' => 'https://www.daad.de/en/',
                'description' => 'Historic public research university in Heidelberg with English-taught master’s programmes in the life sciences.',
            ],
            [
                'name' => 'Technische Universität Berlin',
                'slug' => 'technische-universitaet-berlin',
                'official_website' => 'https://www.tu.berlin',
                'city' => 'Berlin',
                'region' => 'Berlin',
                'country' => 'DE',
                'type' => 'public',
                'admissions_page_url' => 'https://www.tu.berlin/en/studying/study-programs/',
                'scholarship_source_url' => 'https://www.daad.de/en/',
                'description' => 'Public technical university in Berlin with English-taught engineering and production master’s programmes.',
            ],
            [
                'name' => 'Constructor University',
                'slug' => 'constructor-university',
                'official_website' => 'https://constructor.university',
                'city' => 'Bremen',
                'region' => 'Bremen',
                'country' => 'DE',
                'type' => 'private',
                'admissions_page_url' => 'https://constructor.university/programs',
                'scholarship_source_url' => 'https://www.daad.de/en/',
                'description' => 'Private English-taught university in Bremen with master’s programmes in computer science and data science.',
            ],
            [
                'name' => 'IU International University of Applied Sciences',
                'slug' => 'iu-international-university',
                'official_website' => 'https://www.iu.org',
                'city' => 'Erfurt',
                'region' => 'Thuringia',
                'country' => 'DE',
                'type' => 'private',
                'admissions_page_url' => 'https://www.iu.org/',
                'scholarship_source_url' => 'https://www.daad.de/en/',
                'description' => 'Private applied-sciences university offering English-taught master’s programmes in computer science and data science.',
            ],

            // Hungary
            [
                'name' => 'Eötvös Loránd University',
                'slug' => 'eotvos-lorand-university',
                'official_website' => 'https://www.elte.hu',
                'city' => 'Budapest',
                'region' => 'Central Hungary',
                'country' => 'HU',
                'type' => 'public',
                'admissions_page_url' => 'https://www.elte.hu/en/find-degree-program',
                'scholarship_source_url' => 'https://stipendiumhungaricum.hu/',
                'description' => 'Public university in Budapest with English-taught master’s programmes in computer science and data science.',
            ],
            [
                'name' => 'Budapest University of Technology and Economics',
                'slug' => 'budapest-university-of-technology-and-economics',
                'official_website' => 'https://www.bme.hu',
                'city' => 'Budapest',
                'region' => 'Central Hungary',
                'country' => 'HU',
                'type' => 'public',
                'admissions_page_url' => 'https://www.bme.hu/en/education',
                'scholarship_source_url' => 'https://stipendiumhungaricum.hu/',
                'description' => 'Public technical university in Budapest with English-taught master’s programmes in engineering and computer science.',
            ],
            [
                'name' => 'University of Debrecen',
                'slug' => 'university-of-debrecen',
                'official_website' => 'https://www.unideb.hu',
                'city' => 'Debrecen',
                'region' => 'Northern Great Plain',
                'country' => 'HU',
                'type' => 'public',
                'admissions_page_url' => 'https://edu.unideb.hu/',
                'scholarship_source_url' => 'https://stipendiumhungaricum.hu/',
                'description' => 'Public university in Debrecen with English-taught engineering and computer science master’s programmes.',
            ],
            [
                'name' => 'Corvinus University of Budapest',
                'slug' => 'corvinus-university-of-budapest',
                'official_website' => 'https://www.uni-corvinus.hu',
                'city' => 'Budapest',
                'region' => 'Central Hungary',
                'country' => 'HU',
                'type' => 'public',
                'admissions_page_url' => 'https://www.uni-corvinus.hu/main-page/education/degree-programs/?lang=en',
                'scholarship_source_url' => 'https://stipendiumhungaricum.hu/',
                'description' => 'Public business and economics university in Budapest with English-taught master’s programmes.',
            ],

            // Netherlands
            [
                'name' => 'Delft University of Technology',
                'slug' => 'delft-university-of-technology',
                'official_website' => 'https://www.tudelft.nl',
                'city' => 'Delft',
                'region' => 'South Holland',
                'country' => 'NL',
                'type' => 'public',
                'admissions_page_url' => 'https://www.tudelft.nl/en/education/programmes/masters',
                'scholarship_source_url' => 'https://www.studyinnl.org/finances',
                'description' => 'Public technical university in Delft with English-taught master’s programmes in computer science and artificial intelligence.',
            ],
            [
                'name' => 'University of Amsterdam',
                'slug' => 'university-of-amsterdam',
                'official_website' => 'https://www.uva.nl',
                'city' => 'Amsterdam',
                'region' => 'North Holland',
                'country' => 'NL',
                'type' => 'public',
                'admissions_page_url' => 'https://www.uva.nl/en/programmes/masters/masters.html',
                'scholarship_source_url' => 'https://www.studyinnl.org/finances',
                'description' => 'Public research university in Amsterdam with English-taught master’s programmes in artificial intelligence and data science.',
            ],
            [
                'name' => 'Eindhoven University of Technology',
                'slug' => 'eindhoven-university-of-technology',
                'official_website' => 'https://www.tue.nl',
                'city' => 'Eindhoven',
                'region' => 'North Brabant',
                'country' => 'NL',
                'type' => 'public',
                'admissions_page_url' => 'https://www.tue.nl/en/education/graduate-school/master-programs',
                'scholarship_source_url' => 'https://www.studyinnl.org/finances',
                'description' => 'Public technical university in Eindhoven with English-taught master’s programmes in computer science and data science.',
            ],
            [
                'name' => 'Maastricht University',
                'slug' => 'maastricht-university',
                'official_website' => 'https://www.maastrichtuniversity.nl',
                'city' => 'Maastricht',
                'region' => 'Limburg',
                'country' => 'NL',
                'type' => 'public',
                'admissions_page_url' => 'https://www.maastrichtuniversity.nl/education/master',
                'scholarship_source_url' => 'https://www.studyinnl.org/finances',
                'description' => 'Public university in Maastricht with English-taught master’s programmes in data science and business.',
            ],

            // Austria
            [
                'name' => 'TU Wien',
                'slug' => 'tu-wien',
                'official_website' => 'https://www.tuwien.at',
                'city' => 'Vienna',
                'region' => 'Vienna',
                'country' => 'AT',
                'type' => 'public',
                'admissions_page_url' => 'https://www.tuwien.at/en/studies/degree-programmes',
                'scholarship_source_url' => 'https://oead.at/en/',
                'description' => 'Public technical university in Vienna with English-taught master’s programmes in computer science and data science.',
            ],
            [
                'name' => 'University of Vienna',
                'slug' => 'university-of-vienna',
                'official_website' => 'https://www.univie.ac.at',
                'city' => 'Vienna',
                'region' => 'Vienna',
                'country' => 'AT',
                'type' => 'public',
                'admissions_page_url' => 'https://studieren.univie.ac.at/en/degree-programmes/',
                'scholarship_source_url' => 'https://oead.at/en/',
                'description' => 'Public research university in Vienna with English-taught master’s programmes in computer science and data science.',
            ],

            // Belgium
            [
                'name' => 'KU Leuven',
                'slug' => 'ku-leuven',
                'official_website' => 'https://www.kuleuven.be',
                'city' => 'Leuven',
                'region' => 'Flanders',
                'country' => 'BE',
                'type' => 'public',
                'admissions_page_url' => 'https://www.kuleuven.be/programmes/master',
                'scholarship_source_url' => 'https://www.vliruos.be/',
                'description' => 'Public research university in Leuven with English-taught master’s programmes in artificial intelligence and computer science.',
            ],
            [
                'name' => 'Ghent University',
                'slug' => 'ghent-university',
                'official_website' => 'https://www.ugent.be',
                'city' => 'Ghent',
                'region' => 'Flanders',
                'country' => 'BE',
                'type' => 'public',
                'admissions_page_url' => 'https://www.ugent.be/en/education/degree-programmes',
                'scholarship_source_url' => 'https://www.vliruos.be/',
                'description' => 'Public university in Ghent with English-taught master’s programmes in computer science engineering.',
            ],

            // Spain
            [
                'name' => 'Universitat Politècnica de Catalunya',
                'slug' => 'universitat-politecnica-de-catalunya',
                'official_website' => 'https://www.upc.edu',
                'city' => 'Barcelona',
                'region' => 'Catalonia',
                'country' => 'ES',
                'type' => 'public',
                'admissions_page_url' => 'https://www.upc.edu/en/masters',
                'scholarship_source_url' => 'https://www.aecid.gob.es/',
                'description' => 'Public technical university in Barcelona with English-taught master’s programmes in data science and artificial intelligence.',
            ],
            [
                'name' => 'IE University',
                'slug' => 'ie-university',
                'official_website' => 'https://www.ie.edu',
                'city' => 'Madrid',
                'region' => 'Community of Madrid',
                'country' => 'ES',
                'type' => 'private',
                'admissions_page_url' => 'https://www.ie.edu/school-science-technology/',
                'scholarship_source_url' => 'https://www.aecid.gob.es/',
                'description' => 'Private university in Madrid with English-taught master’s programmes in computer science and business technology.',
            ],

            // Portugal
            [
                'name' => 'University of Porto',
                'slug' => 'university-of-porto',
                'official_website' => 'https://www.up.pt',
                'city' => 'Porto',
                'region' => 'Norte',
                'country' => 'PT',
                'type' => 'public',
                'admissions_page_url' => 'https://sigarra.up.pt/up/en/cursos',
                'scholarship_source_url' => 'https://www.fct.pt/',
                'description' => 'Public research university in Porto with English-taught master’s programmes in computer science and data science.',
            ],
            [
                'name' => 'NOVA University Lisbon',
                'slug' => 'nova-university-lisbon',
                'official_website' => 'https://www.unl.pt',
                'city' => 'Lisbon',
                'region' => 'Lisbon',
                'country' => 'PT',
                'type' => 'public',
                'admissions_page_url' => 'https://www.novasbe.unl.pt/en/programs/masters',
                'scholarship_source_url' => 'https://www.fct.pt/',
                'description' => 'Public university in Lisbon with English-taught master’s programmes in data science and advanced analytics.',
            ],

            // Sweden
            [
                'name' => 'KTH Royal Institute of Technology',
                'slug' => 'kth-royal-institute-of-technology',
                'official_website' => 'https://www.kth.se',
                'city' => 'Stockholm',
                'region' => 'Stockholm',
                'country' => 'SE',
                'type' => 'public',
                'admissions_page_url' => 'https://www.kth.se/en/studies/master',
                'scholarship_source_url' => 'https://si.se/en/',
                'description' => 'Public technical university in Stockholm with English-taught master’s programmes in machine learning and computer science.',
            ],
            [
                'name' => 'Lund University',
                'slug' => 'lund-university',
                'official_website' => 'https://www.lunduniversity.lu.se',
                'city' => 'Lund',
                'region' => 'Scania',
                'country' => 'SE',
                'type' => 'public',
                'admissions_page_url' => 'https://www.lunduniversity.lu.se/admissions/masters-programmes',
                'scholarship_source_url' => 'https://si.se/en/',
                'description' => 'Public research university in Lund with English-taught master’s programmes in machine learning and control.',
            ],

            // Denmark
            [
                'name' => 'Technical University of Denmark',
                'slug' => 'technical-university-of-denmark',
                'official_website' => 'https://www.dtu.dk',
                'city' => 'Kongens Lyngby',
                'region' => 'Capital Region',
                'country' => 'DK',
                'type' => 'public',
                'admissions_page_url' => 'https://www.dtu.dk/english/education/graduate/msc-programmes',
                'scholarship_source_url' => 'https://studyindenmark.dk/',
                'description' => 'Public technical university near Copenhagen with English-taught master’s programmes in computer science and engineering.',
            ],
            [
                'name' => 'University of Copenhagen',
                'slug' => 'university-of-copenhagen',
                'official_website' => 'https://www.ku.dk',
                'city' => 'Copenhagen',
                'region' => 'Capital Region',
                'country' => 'DK',
                'type' => 'public',
                'admissions_page_url' => 'https://www.ku.dk/english/education/graduate/',
                'scholarship_source_url' => 'https://studyindenmark.dk/',
                'description' => 'Public research university in Copenhagen with English-taught master’s programmes in computer science and data science.',
            ],

            // Finland
            [
                'name' => 'Aalto University',
                'slug' => 'aalto-university',
                'official_website' => 'https://www.aalto.fi',
                'city' => 'Espoo',
                'region' => 'Uusimaa',
                'country' => 'FI',
                'type' => 'public',
                'admissions_page_url' => 'https://www.aalto.fi/en/study-at-aalto/masters-programmes',
                'scholarship_source_url' => 'https://www.studyinfinland.fi/scholarships',
                'description' => 'Public university in Espoo with English-taught master’s programmes in computer science.',
            ],
            [
                'name' => 'University of Helsinki',
                'slug' => 'university-of-helsinki',
                'official_website' => 'https://www.helsinki.fi',
                'city' => 'Helsinki',
                'region' => 'Uusimaa',
                'country' => 'FI',
                'type' => 'public',
                'admissions_page_url' => 'https://www.helsinki.fi/en/admissions-and-education/apply-masters-programmes',
                'scholarship_source_url' => 'https://www.studyinfinland.fi/scholarships',
                'description' => 'Public research university in Helsinki with English-taught master’s programmes in computer science and data science.',
            ],

            // Ireland
            [
                'name' => 'Trinity College Dublin',
                'slug' => 'trinity-college-dublin',
                'official_website' => 'https://www.tcd.ie',
                'city' => 'Dublin',
                'region' => 'Leinster',
                'country' => 'IE',
                'type' => 'public',
                'admissions_page_url' => 'https://www.tcd.ie/courses/postgraduate/',
                'scholarship_source_url' => 'https://hea.ie/funding-governance-performance/funding/student-finance/',
                'description' => 'Public university in Dublin with English-taught master’s programmes in computer science and data science.',
            ],
            [
                'name' => 'University College Dublin',
                'slug' => 'university-college-dublin',
                'official_website' => 'https://www.ucd.ie',
                'city' => 'Dublin',
                'region' => 'Leinster',
                'country' => 'IE',
                'type' => 'public',
                'admissions_page_url' => 'https://www.ucd.ie/graduatestudies/coursefinder/',
                'scholarship_source_url' => 'https://hea.ie/funding-governance-performance/funding/student-finance/',
                'description' => 'Public research university in Dublin with English-taught master’s programmes in computer science and data science.',
            ],

            // France
            [
                'name' => 'Université Paris-Saclay',
                'slug' => 'universite-paris-saclay',
                'official_website' => 'https://www.universite-paris-saclay.fr',
                'city' => 'Gif-sur-Yvette',
                'region' => 'Île-de-France',
                'country' => 'FR',
                'type' => 'public',
                'admissions_page_url' => 'https://www.universite-paris-saclay.fr/en/education/masters',
                'scholarship_source_url' => 'https://www.campusfrance.org/en',
                'description' => 'Public research university near Paris with English-taught master’s programmes in computer science.',
            ],
            [
                'name' => 'HEC Paris',
                'slug' => 'hec-paris',
                'official_website' => 'https://www.hec.edu',
                'city' => 'Jouy-en-Josas',
                'region' => 'Île-de-France',
                'country' => 'FR',
                'type' => 'private',
                'admissions_page_url' => 'https://www.hec.edu/en/master-s-programs',
                'scholarship_source_url' => 'https://www.campusfrance.org/en',
                'description' => 'Private business school near Paris with English-taught master’s programmes in data science and management.',
            ],

            // Switzerland
            [
                'name' => 'ETH Zurich',
                'slug' => 'eth-zurich',
                'official_website' => 'https://ethz.ch',
                'city' => 'Zurich',
                'region' => 'Zurich',
                'country' => 'CH',
                'type' => 'public',
                'admissions_page_url' => 'https://ethz.ch/en/studies/master.html',
                'scholarship_source_url' => 'https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships.html',
                'description' => 'Public technical university in Zurich with English-taught master’s programmes in computer science and data science.',
            ],
            [
                'name' => 'EPFL',
                'slug' => 'epfl',
                'official_website' => 'https://www.epfl.ch',
                'city' => 'Lausanne',
                'region' => 'Vaud',
                'country' => 'CH',
                'type' => 'public',
                'admissions_page_url' => 'https://www.epfl.ch/education/master/',
                'scholarship_source_url' => 'https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships.html',
                'description' => 'Public technical university in Lausanne with English-taught master’s programmes in computer science and data science.',
            ],

            // Czechia
            [
                'name' => 'Charles University',
                'slug' => 'charles-university',
                'official_website' => 'https://www.cuni.cz',
                'city' => 'Prague',
                'region' => 'Prague',
                'country' => 'CZ',
                'type' => 'public',
                'admissions_page_url' => 'https://www.cuni.cz/UKEN-164.html',
                'scholarship_source_url' => 'https://www.dzs.cz/en/',
                'description' => 'Public research university in Prague with English-taught master’s programmes in computer science.',
            ],
            [
                'name' => 'Czech Technical University in Prague',
                'slug' => 'czech-technical-university-in-prague',
                'official_website' => 'https://www.cvut.cz',
                'city' => 'Prague',
                'region' => 'Prague',
                'country' => 'CZ',
                'type' => 'public',
                'admissions_page_url' => 'https://www.cvut.cz/en/study-programs',
                'scholarship_source_url' => 'https://www.dzs.cz/en/',
                'description' => 'Public technical university in Prague with English-taught master’s programmes in computer science.',
            ],

            // Poland
            [
                'name' => 'University of Warsaw',
                'slug' => 'university-of-warsaw',
                'official_website' => 'https://www.uw.edu.pl',
                'city' => 'Warsaw',
                'region' => 'Masovia',
                'country' => 'PL',
                'type' => 'public',
                'admissions_page_url' => 'https://www.uw.edu.pl/en/education/study-programmes/',
                'scholarship_source_url' => 'https://nawa.gov.pl/en/',
                'description' => 'Public research university in Warsaw with English-taught master’s programmes in computer science and data science.',
            ],
            [
                'name' => 'Warsaw University of Technology',
                'slug' => 'warsaw-university-of-technology',
                'official_website' => 'https://www.pw.edu.pl',
                'city' => 'Warsaw',
                'region' => 'Masovia',
                'country' => 'PL',
                'type' => 'public',
                'admissions_page_url' => 'https://www.pw.edu.pl/engpw/Study-programmes',
                'scholarship_source_url' => 'https://nawa.gov.pl/en/',
                'description' => 'Public technical university in Warsaw with English-taught master’s programmes in computer science.',
            ],

            // Estonia
            [
                'name' => 'University of Tartu',
                'slug' => 'university-of-tartu',
                'official_website' => 'https://ut.ee',
                'city' => 'Tartu',
                'region' => 'Tartu County',
                'country' => 'EE',
                'type' => 'public',
                'admissions_page_url' => 'https://ut.ee/en/studies/masters',
                'scholarship_source_url' => 'https://www.harno.ee/en',
                'description' => 'Public research university in Tartu with English-taught master’s programmes in computer science and data science.',
            ],
        ];

        foreach ($universities as $university) {
            University::updateOrCreate(['slug' => $university['slug']], $university);
        }

        $programs = [
            // Germany
            ['technical-university-of-munich', 'MSc in Informatics', 'msc-informatics-tum', 'Computer Science'],
            ['technical-university-of-munich', 'MSc in Data Engineering and Analytics', 'msc-data-engineering-analytics-tum', 'Data Science'],
            ['rwth-aachen-university', 'MSc in Data Science', 'msc-data-science-rwth', 'Data Science'],
            ['rwth-aachen-university', 'MSc in Computer Science', 'msc-computer-science-rwth', 'Computer Science'],
            ['heidelberg-university', 'MSc in Molecular Biosciences', 'msc-molecular-biosciences-heidelberg', 'Healthcare Management'],
            ['technische-universitaet-berlin', 'MSc in Global Production Engineering', 'msc-global-production-engineering-tub', 'Software Engineering'],
            ['constructor-university', 'MSc in Data Science', 'msc-data-science-constructor', 'Data Science'],
            ['constructor-university', 'MSc in Computer Science', 'msc-computer-science-constructor', 'Computer Science'],
            ['iu-international-university', 'MSc in Computer Science', 'msc-computer-science-iu', 'Computer Science'],
            ['iu-international-university', 'MSc in Data Science', 'msc-data-science-iu', 'Data Science'],

            // Hungary
            ['eotvos-lorand-university', 'MSc in Computer Science', 'msc-computer-science-elte', 'Computer Science'],
            ['eotvos-lorand-university', 'MSc in Data Science', 'msc-data-science-elte', 'Data Science'],
            ['budapest-university-of-technology-and-economics', 'MSc in Computer Engineering', 'msc-computer-engineering-bme', 'Software Engineering'],
            ['budapest-university-of-technology-and-economics', 'MSc in Electrical Engineering', 'msc-electrical-engineering-bme', 'Information Technology'],
            ['university-of-debrecen', 'MSc in Computer Science Engineering', 'msc-computer-science-engineering-debrecen', 'Software Engineering'],
            ['corvinus-university-of-budapest', 'MSc in Business Informatics', 'msc-business-informatics-corvinus', 'Data Science'],

            // Netherlands
            ['delft-university-of-technology', 'MSc in Computer Science', 'msc-computer-science-tudelft', 'Computer Science'],
            ['delft-university-of-technology', 'MSc in Data Science and Artificial Intelligence', 'msc-data-science-ai-tudelft', 'Data Science'],
            ['university-of-amsterdam', 'MSc in Artificial Intelligence', 'msc-artificial-intelligence-uva', 'Artificial Intelligence'],
            ['university-of-amsterdam', 'MSc in Data Science', 'msc-data-science-uva', 'Data Science'],
            ['eindhoven-university-of-technology', 'MSc in Computer Science and Engineering', 'msc-computer-science-engineering-tue', 'Computer Science'],
            ['eindhoven-university-of-technology', 'MSc in Data Science and Artificial Intelligence', 'msc-data-science-ai-tue', 'Data Science'],
            ['maastricht-university', 'MSc in Data Science for Decision Making', 'msc-data-science-decision-making-maastricht', 'Data Science'],

            // Austria
            ['tu-wien', 'MSc in Data Science', 'msc-data-science-tuwien', 'Data Science'],
            ['tu-wien', 'MSc in Computer Science', 'msc-computer-science-tuwien', 'Computer Science'],
            ['university-of-vienna', 'MSc in Data Science', 'msc-data-science-univie', 'Data Science'],
            ['university-of-vienna', 'MSc in Computer Science', 'msc-computer-science-univie', 'Computer Science'],

            // Belgium
            ['ku-leuven', 'MSc in Artificial Intelligence', 'msc-artificial-intelligence-kuleuven', 'Artificial Intelligence'],
            ['ku-leuven', 'MSc in Computer Science', 'msc-computer-science-kuleuven', 'Computer Science'],
            ['ghent-university', 'MSc in Computer Science Engineering', 'msc-computer-science-engineering-ghent', 'Software Engineering'],

            // Spain
            ['universitat-politecnica-de-catalunya', 'MSc in Data Science', 'msc-data-science-upc', 'Data Science'],
            ['universitat-politecnica-de-catalunya', 'MSc in Artificial Intelligence', 'msc-artificial-intelligence-upc', 'Artificial Intelligence'],
            ['ie-university', 'MSc in Computer Science and Business Technology', 'msc-computer-science-business-technology-ie', 'Computer Science'],

            // Portugal
            ['university-of-porto', 'MSc in Data Science', 'msc-data-science-porto', 'Data Science'],
            ['university-of-porto', 'MSc in Computer Science', 'msc-computer-science-porto', 'Computer Science'],
            ['nova-university-lisbon', 'MSc in Data Science and Advanced Analytics', 'msc-data-science-advanced-analytics-nova', 'Data Science'],

            // Sweden
            ['kth-royal-institute-of-technology', 'MSc in Machine Learning', 'msc-machine-learning-kth', 'Artificial Intelligence'],
            ['kth-royal-institute-of-technology', 'MSc in Computer Science', 'msc-computer-science-kth', 'Computer Science'],
            ['lund-university', 'MSc in Machine Learning, Systems and Control', 'msc-machine-learning-systems-control-lund', 'Artificial Intelligence'],

            // Denmark
            ['technical-university-of-denmark', 'MSc in Computer Science and Engineering', 'msc-computer-science-engineering-dtu', 'Computer Science'],
            ['university-of-copenhagen', 'MSc in Computer Science', 'msc-computer-science-ucph', 'Computer Science'],
            ['university-of-copenhagen', 'MSc in Data Science', 'msc-data-science-ucph', 'Data Science'],

            // Finland
            ['aalto-university', 'MSc in Computer Science', 'msc-computer-science-aalto', 'Computer Science'],
            ['university-of-helsinki', 'MSc in Computer Science', 'msc-computer-science-helsinki', 'Computer Science'],
            ['university-of-helsinki', 'MSc in Data Science', 'msc-data-science-helsinki', 'Data Science'],

            // Ireland
            ['trinity-college-dublin', 'MSc in Computer Science', 'msc-computer-science-tcd', 'Computer Science'],
            ['trinity-college-dublin', 'MSc in Data Science', 'msc-data-science-tcd', 'Data Science'],
            ['university-college-dublin', 'MSc in Computer Science', 'msc-computer-science-ucd', 'Computer Science'],
            ['university-college-dublin', 'MSc in Data Science', 'msc-data-science-ucd', 'Data Science'],

            // France
            ['universite-paris-saclay', 'MSc in Computer Science', 'msc-computer-science-paris-saclay', 'Computer Science'],
            ['hec-paris', 'MSc in Data Science for Business', 'msc-data-science-business-hec', 'Data Science'],

            // Switzerland
            ['eth-zurich', 'MSc in Computer Science', 'msc-computer-science-eth', 'Computer Science'],
            ['eth-zurich', 'MSc in Data Science', 'msc-data-science-eth', 'Data Science'],
            ['epfl', 'MSc in Computer Science', 'msc-computer-science-epfl', 'Computer Science'],
            ['epfl', 'MSc in Data Science', 'msc-data-science-epfl', 'Data Science'],

            // Czechia
            ['charles-university', 'MSc in Computer Science', 'msc-computer-science-charles', 'Computer Science'],
            ['czech-technical-university-in-prague', 'MSc in Computer Science', 'msc-computer-science-ctu', 'Computer Science'],

            // Poland
            ['university-of-warsaw', 'MSc in Computer Science', 'msc-computer-science-uw', 'Computer Science'],
            ['university-of-warsaw', 'MSc in Data Science', 'msc-data-science-uw', 'Data Science'],
            ['warsaw-university-of-technology', 'MSc in Computer Science', 'msc-computer-science-wut', 'Computer Science'],

            // Estonia
            ['university-of-tartu', 'MSc in Computer Science', 'msc-computer-science-tartu', 'Computer Science'],
            ['university-of-tartu', 'MSc in Data Science', 'msc-data-science-tartu', 'Data Science'],
        ];

        foreach ($programs as [$universitySlug, $title, $slug, $subject]) {
            $university = University::where('slug', $universitySlug)->firstOrFail();
            $source = $university->admissions_page_url ?? $university->official_website;

            $program = Program::updateOrCreate(
                ['slug' => $slug],
                [
                    'university_id' => $university->id,
                    'title' => $title,
                    'subject_area' => $subject,
                    'degree_type' => 'master',
                    'language' => 'en',
                    'duration_months' => null,
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

        foreach ($universities as $university) {
            // The URL is recorded, but no check is claimed until the sync action
            // actually fetches it.
            OfficialSource::updateOrCreate(
                ['url' => $university['admissions_page_url']],
                [
                    'name' => $university['name'].' — Programme catalogue',
                    'type' => 'university',
                    'university_id' => University::where('slug', $university['slug'])->value('id'),
                    'region' => $university['region'],
                    'last_checked_at' => null,
                    'last_status' => null,
                ],
            );
        }
    }
}
