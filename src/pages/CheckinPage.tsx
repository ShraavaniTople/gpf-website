import { useState, useEffect, useRef, useMemo } from 'react'

const ACCESS_PASSWORD = 'TGPF@2026'
const SESSION_KEY     = 'tgpf_checkin_auth'
const STORAGE_KEY     = 'tgpf2026_checkins'

type Tier   = 'General' | 'VIP' | 'Premium' | 'Hackathon'
type Bucket = 'Speaker' | 'Hackathon' | 'VIP' | 'Premium' | 'General'
type Attendee = {
  name: string; email: string; company: string; role: string
  tier: Tier; bucket: Bucket
}

// ── helper: same hash as the Python send scripts ──────────────────────────────
function genPass(email: string, tier: Tier): string {
  const e = email.toLowerCase().trim()
  let h = 0
  for (const c of e) h = (h * 31 + c.charCodeAt(0)) & 0xFFFFFF
  const pre = tier === 'VIP' ? 'V' : tier === 'Premium' ? 'P' : tier === 'Hackathon' ? 'H' : 'G'
  return `GPF26-${pre}-${h.toString(16).toUpperCase().padStart(6, '0')}`
}

// ── Emails that get Speaker bucket (overrides their pass tier) ────────────────
const SPEAKER_EMAILS = new Set([
  'lalithark@google.com', 'deeksha.anand29@gmail.com', 'kaulbhavik@gmail.com',
  'anshuman.awasthi@mercedes-benz.com', 'tanay.a@kronosx.ai', 'suman@vobiz.ai',
  'nikkitha@superbryn.com', 'sanyal.sreya0490@gmail.com', 'ektabshah1994@gmail.com',
  'rekha.poosala@gmail.com', 'dvarahappian@ebay.com', 'subhadeep@kalaari.com',
  'shalini.dayanidhi@gmail.com', 'viswanathan.puthukode@freshworks.com',
  'sheetal.kale@dataart.com', 'vijetapai90@gmail.com',
  'radhika.yuvraj@women-in-tech.org', 'omar.saud@karnatakadigital.in',
])

// ── Emails that get Hackathon bucket ─────────────────────────────────────────
const HACKATHON_EMAILS = new Set([
  'neoprithish@gmail.com', 'ebenezer.s.2007@gmail.com', 'srisudarsan.s@freshworks.com',
  'manyajahnvi@gmail.com', 'muthusivabalan2007@gmail.com', 'nimmakayalahimavarshitha@gmail.com',
  'tanvichelamkuri@gmail.com', 'vinayg1752004@gmail.com', 'sanjayelango06@gmail.com',
  'aakash.anbazhagan@toasttab.com', 'pratyakshkwatra@gmail.com', 'saianandro@gmail.com',
  'nakulnuked@gmail.com', 'dineshrajdhanapathy@gmail.com', 'edevadarshini@gmail.com',
  'dhanishka.24cs@kct.ac.in', 'annam.pavanraaj@freshworks.com',
  // hackathon-specific emails (different from conference registration)
  'mayankagg9722@gmail.com', 'pavanh14@gmail.com',
])

function deriveBucket(email: string, tier: Tier): Bucket {
  const e = email.toLowerCase()
  if (SPEAKER_EMAILS.has(e))   return 'Speaker'
  if (HACKATHON_EMAILS.has(e)) return 'Hackathon'
  if (tier === 'Hackathon')    return 'Hackathon'
  if (tier === 'VIP')          return 'VIP'
  if (tier === 'Premium')      return 'Premium'
  return 'General'
}

function mk(name: string, email: string, company: string, role: string, tier: Tier): Attendee {
  return { name, email, company, role, tier, bucket: deriveBucket(email, tier) }
}
function spk(name: string, company: string, role: string, uid: string): Attendee {
  return { name, email: uid, company, role, tier: 'VIP', bucket: 'Speaker' }
}
function hk(name: string, email: string, company: string, role: string): Attendee {
  return { name, email, company, role, tier: 'Hackathon', bucket: 'Hackathon' }
}

// ── Full attendee list ────────────────────────────────────────────────────────
const RAW: Attendee[] = [
  // ── Speakers (on-stage, not in attendee list) ───────────────────────────────
  spk('Sangeeta Bavi',       'Anthropic',              'Head of Digital & Startup Growth', '_spk_sangeeta_bavi'),
  spk('Murali Swaminathan',  'Freshworks',             'CTO',                              '_spk_murali_swaminathan'),
  spk('Ryan Manning',        'Freshworks',             'CPO',                              '_spk_ryan_manning'),
  spk('Swati Awasthi',       'Women in Product India', 'Founder',                          '_spk_swati_awasthi'),
  spk('Vikas Bansal',        'Groww',                  'CPO',                              '_spk_vikas_bansal'),
  spk('Mansi Jain',          'Glance',                 'COO',                              '_spk_mansi_jain'),
  spk('Pulkit Jain',         'Vedantu',                'Co-Founder & CPO',                 '_spk_pulkit_jain'),
  spk('Usha Rengaraju',      'NVIDIA',                 'AI Technologist',                  '_spk_usha_rengaraju'),
  spk('Aditya Singh',        'Salesforce',             'VP Product & India Site Head',     '_spk_aditya_singh'),
  spk('Seema Kumar',         'Databricks',             'Director of Engineering',           '_spk_seema_kumar'),
  spk('Minakshi Khuntia',    'Freshworks',             'Senior Director PM',               '_spk_minakshi_khuntia'),
  spk('Anuj Rathi',          'Profound.me',            'Founder & CEO',                    '_spk_anuj_rathi'),
  spk('Neha Bagaria',        'HerKey',                 'Founder & CEO',                    '_spk_neha_bagaria'),
  spk('Supriya Rao',         'ClearRoute',             'India MD',                         '_spk_supriya_rao'),
  spk('Amrit Raj',           'Women in Product India', 'CMO',                              '_spk_amrit_raj'),
  spk('Dipika Jaikishan',    'Pronto',                 'VP Special Projects',              '_spk_dipika_jaikishan'),
  spk('Shivalik Sen',        'Rapido',                 'Head of Product',                  '_spk_shivalik_sen'),
  spk('Ritika Chugh',        'Milestone Inc.',         'Head of Product',                  '_spk_ritika_chugh'),
  spk('Sachin Jain',         'Milestone Inc.',         'Senior PMM',                       '_spk_sachin_jain'),
  spk('Sreedhar Gade',       'Freshworks',             'Head of AI & Data',                '_spk_sreedhar_gade'),
  spk('Kavita Viswanath',    'Toast',                  'SVP & Country Head',               '_spk_kavita_viswanath'),
  spk('Rajat Harlalka',      'Toast',                  'Director of Product',              '_spk_rajat_harlalka'),
  spk('Kushagra Swami',      'POP by Razorpay',        'AI Product Designer',              '_spk_kushagra_swami'),
  spk('Mitasha Singh',       'All Things Talent',      'Founder',                          '_spk_mitasha_singh'),
  spk('Vaishnavi Devi',      'Swiggy',                 'AVP of Product',                   '_spk_vaishnavi_devi'),
  spk('Adithi Sampath',      'Stellantis',             'VP of Product & Design',           '_spk_adithi_sampath'),
  spk('Sahil Gupta',         'Murf AI',                'Head of Product',                  '_spk_sahil_gupta'),
  spk('Ira Banerjee',        'Even Health',            'Head of Clinical Product',         '_spk_ira_banerjee'),
  spk('Nitin Pulyani',       'Cashfree Payments',      'SVP Product',                      '_spk_nitin_pulyani'),
  spk('Gagandeep',           'Tata Digital',           'GM Payments',                      '_spk_gagandeep'),
  spk('Poorvi Vijay',        'Elevation Capital',      'Principal',                        '_spk_poorvi_vijay'),
  spk('Rishabh Golchha',     'Venture Catalysts',      'Managing Partner',                 '_spk_rishabh_golchha'),
  spk('Jivesh Madan',        'Shastra VC',             'VC',                               '_spk_jivesh_madan'),
  spk('Devansh Ghatak',      'Simplismart',            'Co-Founder & CTO',                 '_spk_devansh_ghatak'),
  spk('Jagriti Shreya',      'OneInbox',               'COO',                              '_spk_jagriti_shreya'),

  // ── Hackathon-only entries (different email from conference reg) ─────────────
  hk('Mayank Aggarwal',      'mayankagg9722@gmail.com',   'Microsoft', 'Senior Software Engineer'),
  hk('Pavan Kumar H',        'pavanh14@gmail.com',         'Accionlabs', 'Associate Architect'),

  // ── Main attendee list ───────────────────────────────────────────────────────
  mk('Akshay Balakrishnan',   'akbgunner4ever@gmail.com',              'Accenture Strategy and Consulting', 'Management Consultant',             'Premium'),
  mk('Manavi Singh',           'singhmanavi12@gmail.com',               'Kite',                              'Product Manager',                   'VIP'),
  mk('Rituparna Haldar',       'rhalder197@gmail.com',                  'Accenture',                         'Product Marketing',                 'Premium'),
  mk('Meenakshi Subramanian',  'smeena06@gmail.com',                    'Optum',                             'Product Leader',                    'VIP'),
  mk('Deepika Verma',          'deepikaverma.pm@gmail.com',             'Insight Software',                  'Product Manager',                   'Premium'),
  mk('Rachna Dixit',           'nikkiejazz@gmail.com',                  'Axis Bank',                         'Product Manager',                   'General'),
  mk('Tammana Sriraj',         'tammanasriraj@gmail.com',               'Appian',                            'Product Manager',                   'General'),
  mk('Kumud Acharya',          'kumudacharya2000@gmail.com',            'LenDenClub',                        'Product Manager',                   'VIP'),
  mk('Shalini Singh',          'shalinitsingh28@gmail.com',             'Publicis Re:Sources',               'Senior Associate Agentic AI',       'Premium'),
  mk('Mrudula Jonnavithula',   'mrudula.jonnavithula@gmail.com',        'Walmart',                           'Senior Engineering Manager',        'Premium'),
  mk('Sid Shrivastava',        'sidshrivastava@deloitte.com',           'Deloitte',                          'Product Manager',                   'Premium'),
  mk('Saloni Sarkar',          'salsarkar@deloitte.com',                'Deloitte',                          'Product Specialist',                'Premium'),
  mk('Rajalaksmi Sankarlingam','ajalaksmi.sankar.work@gmail.com',       'Deloitte',                          'Product Manager',                   'Premium'),
  mk('Saba Khalili',           'sakhalili@deloitte.com',                'Deloitte',                          'Product Manager',                   'Premium'),
  mk('Shruti Anand',           'shruthianand0603@gmail.com',            'Freelance',                         'Independent Architect',             'Premium'),
  mk('Priyanka Mahadev',       'priya1687@gmail.com',                   'ICON plc',                          'Business Analyst',                  'VIP'),
  mk('Apurva Nitanjay',        'apuayush@gmail.com',                    'Genesis Global',                    'Senior Software Engineer',          'General'),
  mk('Aparna TA',              'aparnata@gmail.com',                    'Zoho',                              'Product Program Manager',           'General'),
  mk('Ilamthendral Gajendran', 'ilamthendralgajendran@gmail.com',       'Probeplus Innovative Solutions',    'Senior Product Manager',            'General'),
  mk('Ryan Chowdhury',         'ryan24work@gmail.com',                  'Career Break',                      'Career Break',                      'General'),
  mk('Aishwarya Varadarajan',  'aish.varad@gmail.com',                  'Airbnb',                            'Product Manager',                   'General'),
  mk('Saurav M',               'ksauravmahato@deloitte.com',            'Deloitte',                          'Product Specialist',                'Premium'),
  mk('Sidhant Sawant',         'sidhant.s.sawant@gmail.com',            'Booking Holdings',                  'Technical Product Manager',         'General'),
  mk('Nikita Bastian',         'nickybastian67@gmail.com',              'Akamai Technologies',               'Product Owner',                     'General'),
  mk('Kheem Dhanik',           'kheemchandrasingh@gmail.com',           'UrbanPiper',                        'Platform Support Engineer',         'General'),
  mk('Sreya Sanyal',           'sanyal.sreya0490@gmail.com',            'Ford Motor Company',                'Product Lead',                      'General'),
  mk('Sowmya Gattupalli',      'sowmya.gattupalli@gmail.com',           'Real Page Inc',                     'Senior Product Manager',            'General'),
  mk('Suganthi Arumugam',      'suganthi.arumugam@lseg.com',            'LSEG',                              'Head of Data Asset',                'General'),
  mk('Chanakya Varma',         'chanakya.varma@dataart.com',            'DataArt',                           'Forward Deployed Solutions Leader', 'General'),
  mk('Glory Michael',          'glory.michael@dataart.com',             'DataArt',                           'Sales and Revenue Growth Manager',  'General'),
  mk('Poorvaja Sadasivam',     'poorvaja.sadasivam@gmail.com',          'Verizon',                           'Senior Manager',                    'Premium'),
  mk('Viswajith Vishnusai',    'viswajithvishnusai@gmail.com',          'Amrita School Of Business',         'MBA Student',                       'Premium'),
  mk('Suhas Srinivas',         'pavankrishna1994@gmail.com',            'Adobe',                             'Enterprise Account Sales Manager',  'General'),
  mk('Anmol Kala',             'anmol.kala@murf.ai',                    'Murf AI',                           'Sales Development Representative',  'General'),
  mk('Gaurav Sukumar',         'gaurav.sukumar@murf.ai',                'Murf AI',                           'Global Enterprise Sales Manager',   'General'),
  mk('Sathiya Prakash',        'sathiym@ebay.com',                      'eBay',                              'Product Manager 3',                 'Premium'),
  mk('Atreyi Bose',            'atreyi.ai@gmail.com',                   'AccelData',                         'Director Customer Success',         'General'),
  mk('Jyothi Hallikeri',       'jyothi.hallikeri2@gmail.com',           'ZeroFox',                           'Technical Product Manager',         'Premium'),
  mk('Anagha Suchitra',        'anagha.s.08@gmail.com',                 'Intuit',                            'Senior Product Manager',            'General'),
  mk('Raghunath Sajeev',       'raghusajeev1994@gmail.com',             'Ellucian',                          'Product Manager',                   'Premium'),
  mk('Dharma Varahappian',     'dvarahappian@ebay.com',                 'eBay',                              'Product Leader',                    'Premium'),
  mk('Shivam Gupta',           'shivamg.iitr@gmail.com',                'Flexport',                          'Senior Product Manager',            'General'),
  mk('Balaji Bhanu',           'balaji.07.bolla@gmail.com',             'Ellucian',                          'Associate Product Manager',         'VIP'),
  mk('Hema Jayprakash',        'hemah3@gmail.com',                      'Deephealth',                        'Senior Architect',                  'Premium'),
  mk('Malathesh MG',           'mgsmalathesh@gmail.com',                'Societe Generale',                  'Senior Product Owner',              'General'),
  mk('Nishikanth',             'dominic.pereira@automationanywhere.com','Automation Anywhere',               'Director Product Management',       'General'),
  mk('Neha Sapru',             'neha.sapru@automationanywhere.com',     'Automation Anywhere',               'Principal Product Manager',         'General'),
  mk('Arun Mudaliar',          'arun.mudaliar@automationanywhere.com',  'Automation Anywhere',               'Principal Product Manager',         'General'),
  mk('Vineet Pujari',          'vineet.pujari@automationanywhere.com',  'Automation Anywhere',               'Principal Product Manager',         'General'),
  mk('Amarnath Chavva',        'amarnath.chavva@automationanywhere.com','Automation Anywhere',               'Principal Product Manager',         'General'),
  mk('Swati Suresh',           'swathis@adobe.com',                     'Adobe',                             'Computer Scientist II',             'Premium'),
  mk('Neha Priya',             'nehapr92@gmail.com',                    'TPH',                               'AI PM',                             'General'),
  mk('Aditya Sonthalia',       'adityasonthalia14@gmail.com',           'eBay',                              'Senior Product Manager',            'Premium'),
  mk('Urvashi Kodwani',        'kodwaniurvashi@gmail.com',              'Adobe',                             'Tech Lead',                         'Premium'),
  mk('Vidhi Mittal',           'mittalvidhi130@gmail.com',              'Adobe',                             'Software Developer 2',              'Premium'),
  mk('Swati Tiwari',           'tiwari.swati11@gmail.com',              'Elanco',                            'Product Manager',                   'Premium'),
  mk('Mrunalini Palakurthi',   'pmrunalini@gmail.com',                  'Ellucian',                          'Product Manager',                   'VIP'),
  mk('Sowmya Ashok',           'sowmyashok2007@gmail.com',              'CertifyOS',                         'Principal Program Manager',         'General'),
  mk('Sumit Pal',              'sumit.pal@iiml.org',                    'eBay',                              'Senior Product Manager',            'Premium'),
  mk('Angel Walia',            'anwalia@ebay.com',                      'eBay',                              'Product Manager',                   'Premium'),
  mk('Bindisha Sarang',        'bindisha.sarang@gmail.com',             'Adfactors PR',                      'Senior Account Director',           'VIP'),
  mk('Archana Sinha',          'archanas.connect@gmail.com',            'Ex-Greenway Health',                'Product Manager',                   'Premium'),
  mk('Sireeshasur',            'sireeshasur@gmail.com',                 'Haleon',                            'Product Leader',                    'Premium'),
  mk('Lubna Thabseem',         'thabseem@deloitte.com',                 'Deloitte',                          'Product Manager',                   'Premium'),
  mk('Dipali Dubey',           'dipali.dubey@silverminegroup.com',      'Silvermine Group',                  'Director - Product',                'VIP'),
  mk('Ranjitha C',             'ranjithaac@gmail.com',                  'Ford',                              'Product Lead',                      'General'),
  mk('Prerna Bansal',          'prernaba@gmail.com',                    'Adobe',                             'Senior Security Engineer',          'Premium'),
  mk('Gaurav Diwan',           'gdiwan@ebay.com',                       'eBay',                              'Senior Product Manager',            'Premium'),
  mk('Swetha Kulkarni',        'swetha.kulkarni@gmail.com',             'Oracle',                            'Product Manager',                   'General'),
  mk('Pallavi Balasubramanya', 'pallavi.subramanya@gmail.com',          'Deloitte',                          'Product Manager',                   'General'),
  mk('Sathish Srinivasan',     'sathish.srinivasan@clearroute.io',      'ClearRoute',                        'Staff Engineer',                    'General'),
  mk('Monalisa Mahapatra',     'monalisa.mahapatra@clearroute.io',      'ClearRoute',                        'Senior Engineer',                   'General'),
  mk('Ankur Joshi',            'ankur.joshi@clearroute.io',             'ClearRoute',                        'Senior Engineer',                   'General'),
  mk('Subalakshmi J',          'subalakshmi.j@clearroute.io',           'ClearRoute',                        'Engineering',                       'General'),
  mk('Sara Agarwal',           'saraagarwal23@gmail.com',               'Merit Labs',                        'Software Developer',                'General'),
  mk('Gaurav Sharma',          'gaurav.sharma@toasttab.com',            'Toast',                             'Senior Software Engineer',          'Premium'),
  mk('Tushar Khandelwal',      'tushar.khandelwal@toasttab.com',        'Toast',                             'Software Engineer 2',               'Premium'),
  mk('Hardik Sharma',          'hardik.sharma@toasttab.com',            'Toast',                             'Senior Software Engineer',          'Premium'),
  mk('Karuna Kukreja',         'karuna.kukreja@toasttab.com',           'Toast',                             'Senior Software Engineer',          'Premium'),
  mk('Prakshi Bajaj',          'prakshi.bajaj@wissen.com',              'Wissen Technology',                 'Senior Solution Designer',          'VIP'),
  mk('Yash Vahi',              'yash.vahi@gmail.com',                   'Artus AI',                          'Co-founder & CEO',                  'VIP'),
  mk('Lalit Shewani',          'lalit.shewani01@gmail.com',             'Ford Motor Company',                'Senior Product Manager',            'Premium'),
  mk('Kapil K',                'kapil7k@outlook.com',                   'Talentship',                        'Product Owner',                     'Premium'),
  mk('Martin Gasser',          'martin_gasser@bluewin.ch',              'Coaching4Leaders',                  'Leadership-Coach',                  'General'),
  mk('Varun Prasadd',          'varunprasadd23@gmail.com',              'Facilio',                           'Product Manager',                   'General'),
  mk('Nitya Samavedam',        'nityaksam02@gmail.com',                 'Fwdslash AI',                       'Product Manager',                   'General'),
  mk('Versha Jain',            'versha@getpanelready.com',              'PanelReady',                        'Founder',                           'General'),
  mk('P K Jain',               'pkjain@idehost.com',                    'PanelReady',                        'CTO',                               'General'),
  mk('Mukesh KR',              'codejets@gmail.com',                    'Userorbit',                         'Founder',                           'General'),
  mk('Mohamed Siddique',       'mohamed@userorb.com',                   'Userorbit',                         'Growth & GTM Lead',                 'General'),
  mk('Arvind Anuram',          'arvind@ardivent.com',                   'Ardivent',                          'Founder',                           'General'),
  mk('Souvik Sarkar',          'souvikrishi@gmail.com',                 'Mercedes Benz R&D',                 'Senior Product Manager',            'General'),
  mk('Suchitra Ravichander',   'suchitraravichander@gmail.com',         'Comcast',                           'Senior Product Manager',            'Premium'),
  mk('Shabbir Ahmed',          'shabbir.ahmed@smithsdetection.com',     'Smiths Detection',                  'Tech Lead',                         'General'),
  mk('Neha Bangar',            'neha.bangar@gmail.com',                 'Adobe',                             'Principal Project Manager',         'VIP'),
  mk('Sagar Daliya',           'sagar.daliya@plivo.com',                'Plivo',                             'Product Lead - Voice',              'General'),
  mk('Ranjan Pai',             'ranjanp@sprinto.com',                   'Sprinto',                           'Senior Product Designer',           'General'),
  mk('Adarsh Manikandan',      'adarshm@sprinto.com',                   'Sprinto',                           'Product Manager',                   'General'),
  mk('Rajat S',                'rajats@sprinto.com',                    'Sprinto',                           'Senior Product Designer',           'General'),
  mk('Shubham Danannavar',     'shubhamd@sprinto.com',                  'Sprinto',                           'Product Manager',                   'General'),
  mk('Jyotsna Guduguntla',     'jyotsnad@sprinto.com',                  'Sprinto',                           'Product Manager',                   'General'),
  mk('Kalyanaraman',           'kalyan@basedynamics.com',               'BaseDynamics Inc',                  'Cofounder & CEO',                   'General'),
  mk('Harshita Sodani',        'harshita25sodani@gmail.com',            'Optum',                             'Product Manager',                   'Premium'),
  mk('Rajeev',                 'rajeev@hiringeye.com',                  'Hiring Eye',                        'Founder & CEO',                     'General'),
  mk('Chandra Nudurupati',     'chandra@hiringeye.com',                 'Hiring Eye',                        'Recruitment Advisor',               'General'),
  mk('Shanmugapriya KS',       'shanmugapriya@hiringeye.com',           'Hiring Eye',                        'HR',                                'General'),
  mk('Dharmik Nitin',          'dharmik@hiringeye.com',                 'Hiring Eye',                        '',                                  'General'),
  mk('Samyutha',               'r.samyutha@gmail.com',                  'Gravity ilabs',                     'BI/BA Analyst',                     'General'),
  mk('Gokul Surendran',        'gokul.surendran@wissen.com',            'Wissen Technology',                 'Associate Director',                'VIP'),
  mk('Karthik S Rao',          'karthik.rao@wissen.com',                'Wissen Technology',                 'Executive Director',                'VIP'),
  mk('Durgaprasad Balakuntla', 'durgaprasad.balakuntla@wissen.com',     'Wissen Technology',                 'Senior Director',                   'Premium'),
  mk('Vijayanto Vyakulasamy',  'vijayanto.vyakulasamy@wissen.com',      'Wissen Technology',                 'Executive Director',                'Premium'),
  mk('Divya',                  'divya@dfourpower.com',                  'D4powerzee Technologies',           'Founder',                           'General'),
  mk('Vaibhav Gupta',          'vaibhgupta@ebay.com',                   'eBay',                              'Senior Product Manager',            'Premium'),
  mk('Sri Harsha',             'connect.ksriharsha@gmail.com',          'Flexera',                           'Product Manager',                   'Premium'),
  mk('Satya Sri Dharmika',     'satyasrikanakala@gmail.com',            'Novi',                              'Co Founder',                        'Premium'),
  mk('Madhushree',             'findmadhu.roy@gmail.com',               'Mastercard',                        'Director',                          'Premium'),
  mk('Sheethal Ann George',    'sheethalg@gmail.com',                   'Adobe',                             'Software Engineer',                 'Premium'),
  mk('Lavanya Karunakaran',    'lavanya.karunakaran@gmail.com',         'Light And Wonder iGaming',          'Deputy Director Product Management','Premium'),
  mk('Sai Keerthana Srinivasan','ssai.keerthana@gmail.com',             'Docusign',                          'Lead Product Designer',             'Premium'),
  mk('Swati Sharma',           'swati.sharma8621@gmail.com',            'Ellucian India',                    'Senior Product Manager',            'Premium'),
  mk('Nidhi Shreya',           'nidhishreya@gmail.com',                 'Simpplr',                           'Principal PM',                      'Premium'),
  mk('Swathi Chirravuri',      'swathi.chirravuri@gmail.com',           'Stealth Startup',                   'AI Product Manager',                'General'),
  mk('Aditi Rajesh',           'aditirajesh1234@gmail.com',             'Hashfame',                          'Product Manager',                   'General'),
  mk('Sonika Panghal',         'sonikap70@gmail.com',                   'Godrej Capital',                    'Product Manager MarTech',           'General'),
  mk('Khyaati Jindal',         'khyaatijindal2000@gmail.com',           'Apple Tech',                        'AI Engineer',                       'General'),
  mk('Sangeetha Balakrishnan', 'sangeetha.balakrishnan.k@gmail.com',    'Workday',                           'Product Manager',                   'General'),
  mk('Shubhodaye Hiremath',    'shubhodaye@gmail.com',                  'Freelancer',                        'Software Tester',                   'General'),
  mk('Nidhi Bartakke',         'nidhibartakke@gmail.com',               'Target',                            'Sr Data Analyst',                   'General'),
  mk('Vishwajeet Jonnada',     'jonnada.vishwajeet@gmail.com',          'CGI',                               'Technical Product Owner',           'General'),
  mk('Deeksha Anand',          'deeksha.anand29@gmail.com',             'Google',                            'Senior Product Marketing Manager',  'VIP'),
  mk('Mahi Monga',             'mahimonga04@gmail.com',                 'Sprinklr',                          'AI Product Manager',                'General'),
  mk('Anchal Garg',            'anchalgarg1995@gmail.com',              'Arintra',                           'Senior AI Product Manager',         'General'),
  mk('Sree Pasumarthy',        'sreevally86@gmail.com',                 'Leoforce',                          'Senior Product Manager',            'General'),
  mk('Pragya Ananth',          'pragya.ananth@gmail.com',               'Bosch',                             'Forward Deployed Engineer',         'General'),
  mk('Nandini Jani',           'nandinibytes@gmail.com',                'Supervity',                         'Jr Product Marketing Manager',      'General'),
  mk('Siya Agarwal',           'siyaagarwal0225@gmail.com',             'Passport',                          'Senior Product Manager',            'General'),
  mk('Lasya Kuppa',            'lasyakuppa@gmail.com',                  'Realpage',                          'Principal Product Manager',         'General'),
  mk('Ekta Shah',              'ektabshah1994@gmail.com',               'MSCI',                              'Associate Data Scientist',          'VIP'),
  mk('Neha Nadiger',           'nehanadigerwork@gmail.com',             'Unimad',                            'Product Manager',                   'General'),
  mk('Aarati Mankar',          'aarati.mankar@gmail.com',               'TensorN',                           'Founder',                           'General'),
  mk('Shakti Babbar',          'babbarshakti@outlook.com',              'S&P Global MI',                     'Product Manager',                   'General'),
  mk('Eshika Mahajan',         'eshikamahajan21@gmail.com',             'Optum AI',                          'AI ML Engineer',                    'General'),
  mk('Chintan Shah',           'chintshah.91@gmail.com',                'Future AGI',                        'Product',                           'General'),
  mk('Saaniya Afreen',         'saaniya@vibtree.com',                   'Oneinbox',                          'Product Manager',                   'General'),
  mk('Sheetal Kale',           'sheetal.kale@dataart.com',              'DataArt India',                     'Managing Director',                 'VIP'),
  mk('Manoj Ponnusamy',        'manoj.ponnusamy@dataart.com',           'DataArt India',                     'Director Account Management',       'General'),
  mk('Shaik Mahammad Shahid Afrid','23091a32d4@rgmcet.edu.in',          'RGMCET',                            'Student',                           'General'),
  mk('Godugu Veena',           '23091a32h9@rgmcet.edu.in',              'RGMCET',                            'Undergraduate Student',             'General'),
  mk('Shaik Rehana',           '23091a32c1@rgmcet.edu.in',              'RGMCET',                            'Student',                           'General'),
  mk('Dr. P. Penchala Prasad', 'prasadcseds@rgmcet.edu.in',             'RGMCET',                            'Associate Professor',               'General'),
  mk('Gangavarapu Vikram Chandra','vikramcseds@rgmcet.edu.in',           'RGMCET',                            'Assistant Professor',               'General'),
  mk('Anshuman Awasthi',       'anshuman.awasthi@mercedes-benz.com',    'MBRDI',                             'Senior VP',                         'VIP'),
  mk('Nikhil Mankar',          'nikhilpmankar@gmail.com',               'BD',                                'Lead Engineer Medical Devices R&D', 'General'),
  mk('Priya Ahuja',            'hi@priyaahuja.in',                      'Kitty Party',                       'Angel Investor',                    'VIP'),
  mk('Bhavik Kaul',            'kaulbhavik@gmail.com',                  'ex-CPO SuperMoney & LazyPay',       'ex-CPO',                            'VIP'),
  mk('Sobhitha Neelanath',     'sneelanath@salesforce.com',             'Salesforce',                        'Senior Manager Software Engineering','General'),
  mk('Nency Shah',             'nency.shah@healthedge.com',             'HealthEdge',                        'Product Manager',                   'General'),
  mk('Ritik Gupta',            'gupta.ritik@popclub.co',                'POP by Razorpay',                   'Design Engineer',                   'General'),
  mk('Rekha Poosala',          'rekha.poosala@gmail.com',               'Dell',                              'Senior Engineering Manager',        'VIP'),
  mk('Sumit Dutta',            'sumit@unwindventures.com',              'Unwind Ventures',                   'Managing Partner',                  'VIP'),
  mk('Vivek Bharadwaj',        'vivek.bharadwaj@grabtaxi.com',          'Grab',                              'Group Product Manager',             'General'),
  mk('Subhadeep Mondal',       'subhadeep@kalaari.com',                 'Kalaari Capital',                   'Venture Partner',                   'VIP'),
  mk('Manish S Sugandhi',      'manish@noon.design',                    'Noon',                              'Product',                           'General'),
  mk('Abhinav Gandotra',       'agandotra@microsoft.com',               'Microsoft',                         'Senior AI PM',                      'General'),
  mk('Sanil Bhatte',           'sanil.bhatte@jpmorgan.com',             'JP Morgan Chase',                   'VP Product Design Lead',            'General'),
  mk('Swapnil Agrawal',        'swapnilagrawal1@kpmg.com',              'KPMG',                              'Associate Director',                'General'),
  mk('Yuti Swapnil Agrawal',   'yuti.nangliya@citiustech.com',          'CitiusTech',                        'Technical Sr. Lead',                'General'),
  mk('Neha Gupta',             'gargneha@microsoft.com',                'Microsoft',                         'Partner PM',                        'General'),
  mk('Devanshi Choudhary',     'devanshi.choudhary@walmart.com',        'Walmart',                           'Director of Engineering',           'General'),
  mk('Manju Bhagtani',         'mbhagtani@microsoft.com',               'Microsoft',                         'Software Engineer 2',               'General'),
  mk('Vijeta Pai',             'vijetapai90@gmail.com',                 'Lumitia',                           'Cloud and AI Advisor',              'General'),
  mk('Kavya Joseph',           'kavyajoseph@microsoft.com',             'Microsoft',                         'Senior Product Manager Lead',       'General'),
  mk('Pranay Bansal',          'pranay.bansal@jpmorgan.com',            'JPMC',                              'VP UX',                             'General'),
  mk('Gautam Mahesh',          'gautam.mahesh@paytm.com',               'Paytm',                             'AVP of Product',                    'General'),
  mk('Ankit Ambasht',          'ankit.ambasht@tcs.com',                 'TCS',                               'Product Manager',                   'General'),
  mk('Pallavi Ghadyalpatil',   'pallavi@nuvikatech.com',                'Nuvika Technologies',               'Director Growth and Delivery',      'General'),
  mk('Prasen Ghadyalpatil',    'prasen@nuvikatech.com',                 'Nuvika Technologies',               'Intern',                            'General'),
  mk('Ashish Goyal',           'ashisharsh2022@gmail.com',              'ThriveX Studios',                   'Co Founder',                        'General'),
  mk('Viha Shomikha A S',      'viha@weareautumn.com',                  'Autumn Tech Worx',                  'Associate Project Manager',         'General'),
  mk('Nikhil Sharma',          'snikhil@athenahealth.com',              'Athenahealth',                      'Sr Product Manager',                'General'),
  mk('Nisha Chandrasekaran',   'nishac0506@gmail.com',                  'Previously Intuit',                 'Senior Product Designer',           'General'),
  mk('Smriti Chawla',          'smritic.1607@gmail.com',                'PMM Lens',                          'Product Marketing Consultant',      'General'),
  mk('Darshan Krishna N',      'darshan.krishna@jll.com',               'JLL Technologies',                  'Data Analyst',                      'General'),
  mk('Dipayan Ghatak',         'dipayan.ghatak@walmart.com',            'Walmart',                           'Senior Manager',                    'General'),
  mk('Krishna N Mehta',        'krimehta@visa.com',                     'Visa Inc',                          'Senior Software Engineer',          'General'),
  mk('Mudrika C',              'mudrika@google.com',                    'Google',                            'Product Manager',                   'General'),
  mk('Reetika Choudhary',      'reetika.choudhary@walmart.com',         'Walmart Global Tech',               'Senior Manager Product Management', 'General'),
  mk('Rakhi Sharma',           'rakhi.ptr@gmail.com',                   'House of Manthan',                  'Creator and Founder',               'General'),
  mk('Diana Panda',            'diapanda@gmail.com',                    'PayPal',                            'Lead Product Manager',              'General'),
  mk('Caleb Matthew Friesen',  'caleb@odyssey.build',                   'Odyssey/RuntimeBRT',                'Content Creator',                   'VIP'),
  mk('Shalini Dayanidhi',      'shalini.dayanidhi@gmail.com',           'M Venture Partners',                'Investments',                       'VIP'),
  mk('Gouthami Kristam',       'gouthamicsg@gmail.com',                 'Cloud Software Group',              'Lead Software Engineer',            'General'),
  mk('SMK Murthy',             'murthy.sistla@jpmchase.com',            'JPMorganChase',                     'Sr. Associate',                     'General'),
  mk('Apala Bhatt',            'apalabhatt74@gmail.com',                'Oracle',                            'Software Developer',                'General'),
  mk('Sayali Shaligram',       'sayalishaligram12@gmail.com',           'Independent Consultant',            'Domain Consultant',                 'General'),
  mk('Akshay Nandwana',        'akshay.nandwana@agora.io',              'Agora',                             'Developer Advocate',                'General'),
  mk('Rahul Dasari',           'dasarirahulpatel.drp@gmail.com',        'Rahul Talks',                       'Tech Content Creator',              'General'),
  mk('Shalini Raina',          'shalini.raina@observe.ai',              'Observe.ai',                        'Lead Product Manager',              'General'),
  mk('Adithya C H',            'adithya@meridiona.com',                 'Meridiona',                         'CTO',                               'General'),
  mk('Akarsh Hegde',           'akarsh@meridiona.com',                  'Meridiona',                         'Founder',                           'General'),
  mk('Pavan Gowda S',          'pg0061375@gmail.com',                   'RNSIT',                             'Student',                           'General'),
  mk('Ramanathan Manikandan',  'ramanathanmanikandan.cse2025@citchennai.net','Chennai Institute of Technology','Student',                          'General'),
  mk('Anurag Sarkar',          'sarkar@sift-talent.com',                'Sift',                              'Founder',                           'General'),
  mk('Rhudhresh',              'rhudhresh3697@gmail.com',               'Saveetha Engineering College',      'Student',                           'General'),
  mk('Bala Saravanan K',       'balasaravanank.student@saveetha.ac.in', 'Saveetha Engineering College',      'Student',                           'General'),
  mk('Chethan Gowda S N',      'iamchethan2813@gmail.com',              'Presidency University',             'Student',                           'General'),
  mk('Arham Begani',           'arhambegani2@gmail.com',                'Forze',                             'CEO',                               'General'),
  mk('Hemashree Sureshkumar',  'hemashrees.cse2024@citchennai.net',     'Chennai Institute of Technology',   'Student',                           'General'),
  mk('Savitha R',              'savithar.cse2024@citchennai.net',       'Chennai Institute of Technology',   'Student',                           'General'),
  mk('Sadhana Shanmugam',      'sadhanashanmugam.cse2025@citchennai.net','Chennai Institute of Technology',  'Student',                           'General'),
  mk('Avantika Garg',          'avantikagarg007@gmail.com',             'Noon',                              'Associate Director of Product',     'General'),
  mk('Sujeet Singh',           'sujeetsingh121696@gmail.com',           'Toast Inc.',                        'Software Engineer II',              'General'),
  mk('Fauzan Jiteker',         'mjitekar@lululemon.com',                'lululemon',                         'Product Manager',                   'General'),
  mk('Lasya Annam',            'lasyagoudannam@gmail.com',              'N.B.K.R. Institute of Science and Technology','Fresher',                 'General'),
  mk('Lalasa Annam',           'lalasagoudannam@gmail.com',             'N.B.K.R. Institute of Science and Technology','Fresher',                 'General'),
  mk('Kritika Singh',          'kritika@dazeinfo.com',                  'Dazeinfo Media and Research',       'Growth Executive',                  'General'),
  mk('Arnab Das',              'raj713335@gmail.com',                   'Target',                            'Senior Engineer',                   'General'),
  mk('Haridharshini J',        'haridharshinij.student@saveetha.ac.in','Saveetha Engineering College',       'Student',                           'General'),
  mk('Raj Nayan Datta',        'raj@waterbridge.vc',                    'WaterBridge Ventures',              'VP-Investments',                    'VIP'),
  mk('Tanay Agrawal',          'tanay.a@kronosx.ai',                    'KronosX AI',                        'Director of AI & Platform',         'VIP'),
  mk('Roshan Vadassery',       'roshan@permissionless.net',             'Zopu/Permissionless',               'Founder',                           'VIP'),
  mk('Kirthik Roshan P',       'kirthikroshan60@gmail.com',             'Chennai Institute of Technology',   'Student',                           'General'),
  mk('Vishal Chaudhary',       'chvishal@athenahealth.com',             'Athenahealth',                      'Product Manager',                   'General'),
  mk('Tanya Goel',             'tanya.goel1@aexp.com',                  'American Express',                  'Product Manager',                   'General'),
  mk('Mayank Aggarwal',        'mayaggar@microsoft.com',                'Microsoft',                         'Senior Software Engineer',          'General'),
  mk('Jonathan Jerrick B',     'jonathanjerrick1410@gmail.com',         'NIT Tiruchirappalli',               '3rd Year BTech Student',            'General'),
  mk('Sivabalan M',            'muthusivabalan2007@gmail.com',          'Saveetha Engineering College',      'Full Stack and AI Engineer',        'General'),
  mk('Richa Kulkarni',         'richa.kulkarni@unilever.com',           'Unilever',                          'Data AI Lead',                      'General'),
  mk('Sangeetha S',            'sangeetha1232007@gmail.com',            'Saveetha Engineering College',      'Student',                           'General'),
  mk('Nikkitha Shanker',       'nikkitha@superbryn.com',                'SuperBryn',                         'Co-Founder & CEO',                  'VIP'),
  mk('Parth Jain',             'parth@superbryn.com',                   'SuperBryn',                         'Head Product Growth',               'General'),
  mk('Niralya J',              'niralyaj.student@saveetha.ac.in',       'Saveetha Engineering College',      'Student',                           'General'),
  mk('Pavan Kumar H',          'pavan.kumarh@accionlabs.com',           'Accionlabs',                        'Associate Architect',               'General'),
  mk('Arunima',                'arunima@webzero.ai',                    'Webzero',                           'Founder CEO',                       'General'),
  mk('Kailash Ahirwar',        'kailash@levit8labs.in',                 'Levit8 Labs',                       'Founder & CEO',                     'General'),
  mk('Arun Antony Augustine',  'arun@gistr.so',                         'Gistr',                             'CEO',                               'General'),
  mk('Aniruddha Mandal',       'aniruddha@webzero.ai',                  'WebZero',                           'Founding Engineer',                 'General'),
  mk('Prithish S',             'neoprithish@gmail.com',                 'Chennai Institute of Technology',   'Student',                           'General'),
  mk('Ebenezer S',             'ebenezer.s.2007@gmail.com',             'Chennai Institute of Technology',   'Student',                           'General'),
  mk('Sri Sudarsan S',         'srisudarsan.s@freshworks.com',          'Freshworks',                        'Staff Software Engineer',           'General'),
  mk('Manya Malik',            'manyajahnvi@gmail.com',                 'GGSIPU',                            'Student',                           'General'),
  mk('N. Hima Varshitha',      'nimmakayalahimavarshitha@gmail.com',    'Amrita Vishwa Vidyapeetham',         'Student',                           'General'),
  mk('Tanvi Chelamkuri',       'tanvichelamkuri@gmail.com',             'Amrita Vishwa Vidyapeetham',         'Student',                           'General'),
  mk('Vinay G',                'vinayg1752004@gmail.com',               'Presidency University',             'Student',                           'General'),
  mk('Suman Gandham',          'suman@vobiz.ai',                        'Vobiz AI',                          'Co-Founder & CEO',                  'VIP'),
  mk('Sanjay E',               'sanjayelango06@gmail.com',              'Chennai Institute of Technology',   'Student',                           'General'),
  mk('Aakash A',               'aakash.anbazhagan@toasttab.com',        'Toast',                             'Senior Software Engineer',          'General'),
  mk('Pratyaksh Kwatra',       'pratyakshkwatra@gmail.com',             'IP University',                     'Student',                           'General'),
  mk('Sushma Bhargav',         'sbhargav@matchbookai.com',              'Matchbook AI',                      'Global Product Leader',             'General'),
  mk('Snigdhaa Sharma',        'snigdhaa.s@cogniquest.ai',              'Cogniquest AI',                     'Product Manager',                   'General'),
  mk('Sai Charan A',           'saianandro@gmail.com',                  'Chennai Institute of Technology',   'Student',                           'General'),
  mk('Reshma Hariharan',       'reshma@zensible.com',                   'Zensible Technologies',             'Head - Agentic Products',           'General'),
  mk('Nakul T',                'nakulnuked@gmail.com',                  'KPR Institute of Engineering and Technology','B.Tech AI & Data Science','General'),
  mk('Dineshraj Dhanapathy',   'dineshrajdhanapathy@gmail.com',         'Freelancer',                        'Cloud & DevOps',                    'General'),
  mk('Chandini Rajput',        'chandini.rajput@dataart.com',           'DataArt Technologies',              'Workplace Manager',                 'General'),
  mk('Akshyee Bhadrawal',      'abhadrawal@clickup.com',                'ClickUp',                           'Senior Analyst',                    'General'),
  mk('Dhaarini Vijay',         'dhaarini.vijay@paytm.com',              'Paytm',                             'Sr Director of Product',            'General'),
  mk('Atul Mishra',            'atulmishraiec@gmail.com',               'Allen Career Institute',            'HOD',                               'General'),
  mk('Raj Aryan',              'raj.aryan@revrag.ai',                   'RevRag AI',                         'Marketing Associate',               'General'),
  mk('Prashant Srinivasan',    'prashant.s@codewalla.com',              'Codewalla',                         'Managing Director',                 'General'),
  mk('Devadarshini Elango',    'edevadarshini@gmail.com',               'Chennai Institute of Technology',   'Student',                           'General'),
  mk('Zairah Zaheer',          'zairah.zaheer@dataart.com',             'DataArt Technologies India',        'HR Manager',                        'General'),
  mk('Arthi Vinod',            'arthivinod28@gmail.com',                'Employ',                            'Product Manager',                   'General'),
  mk('Omar Saud',              'omar.saud@karnatakadigital.in',         'Karnataka Digital Economy Mission', 'Manager Startups & Innovation',     'VIP'),
  mk('Dhanishka C K',          'dhanishka.24cs@kct.ac.in',             'Kumaraguru College of Technology',  'Student',                           'General'),
  mk('Shweta Chakraborty',     'shweta.chakraborty@salesforce.com',     'Salesforce',                        'Director Software Engineering',     'General'),
  mk('Annam Pavan Raaj',       'annam.pavanraaj@freshworks.com',        'Freshworks',                        'Software Engineer Backend',         'General'),
  mk('Sanketh Y S',            'sanketh.ys@zohocorp.com',               'Zoho Corporation',                  'Principal - Growth & Strategy',     'General'),
  mk('Reet Wadhwani',          'reet.wadhwani@murf.ai',                 'Murf AI',                           'Brand Marketing Associate',         'General'),
  mk('Ambar Dange',            'dange.ambar@gmail.com',                 'Agilitas Sports',                   'Product Lead',                      'General'),
  mk('Bhavana M',              'bhavanabhan29@gmail.com',               'Kumaraguru College of Technology',  'Student',                           'General'),
  mk('Sachin A S',             'sachin0621@gmail.com',                  'KPR Institute of Engineering and Technology','Student',                  'General'),
  mk('Thanushree Vijayakanth', 'thanushreevijayakanth@gmail.com',       'Saveetha Engineering College',      'Student',                           'General'),
  mk('Mohith Guntamadugu',     'guntamadugumohith0601@gmail.com',       'Government Polytechnic Pillaripattu','Student',                           'General'),
  mk('Pavan Sai Pokkalla',     'pavansaipokkalla@gmail.com',            'Government Polytechnic Pillaripattu','Student',                           'General'),
  mk('MGM Manjunath',          'manju@vaaniresearch.com',               'Vaani AI Research',                 'Founding CS Manager',               'General'),
  mk('Bhavya Singh',           'bhavya@vaaniresearch.com',              'Vaani AI Research',                 'GTM and Revenue Operations',        'General'),
  mk('Shashank Sharma',        'sharma.shanx@gmail.com',                'Walmart',                           'Staff Product Manager',             'General'),
  mk('Dr. S. Senthil',         'dean-sca@dsu.edu.in',                   'Dayananda Sagar University',        'Professor and Dean',                'VIP'),
  mk('Manik Singhal',          'manik@vaaniresearch.com',               'Vaani Research Labs',               'DevOps Engineer',                   'General'),
  mk('Malthi SS',              'malthi@sparkprod.in',                   'SparkProd Consulting',              'Product Executive',                 'General'),
  mk('Ayush Awasthi',          'ayush@vaaniresearch.com',               'Vaani Research Labs',               'Forward Deployed Engineer',         'General'),
  mk('Nimish Beriwal',         'nimish@glib.ai',                        'Genesis Artificial Intelligence',   'Product Manager',                   'General'),
  mk('Mohammad Palla',         'mohammad@vaaniresearch.com',            'Vaani Research Labs',               'Founding Engineer',                 'General'),
  mk('Priyanshi Yadav',        'priyanshi.yadav@toasttab.com',          'Toast',                             'SDE2',                              'General'),
  mk('Soumyadeep Bohidar',     'sb001206210@techmahindra.com',          'Tech Mahindra',                     'Senior Business Associate',         'General'),
  mk('Somil Jain',             'somil@vaaniresearch.com',               'Vaani AI Research',                 'Founding Engineer',                 'General'),
  mk('Romit Lakra',            'romit.lakra@sap.com',                   'SAP Labs India',                    'Senior Product Manager',            'General'),
  mk('Vijayraj Honnur',        'vijayraj.honnur@ibm.com',               'IBM',                               'Senior Product Designer',           'General'),
  mk('Pallavi Bhowmick',       'pallavi.g.bhowmick@accenture.com',      'Accenture',                         'Managing Director',                 'VIP'),
  mk('Purnesh Dixit',          'purnesh.dixit92@gmail.com',             'Google',                            'Senior Software Engineer',          'General'),
  mk('Atul Pal',               'atul@vobiz.ai',                         'Vobiz AI',                          'Director Growth',                   'General'),
  mk('Deepali Lalwani',        'deepali@vobiz.ai',                      'Vobiz AI',                          'Head of Brand & Marketing',         'General'),
  mk('Piyush Sahoo',           'piyush@vobiz.ai',                       'Vobiz AI',                          'Founding Member',                   'General'),
  mk('Rupesh Kumar',           'rupesh.kumar@wework.co.in',             'WeWork India',                      'Chief Product and Technology Officer','VIP'),
  mk('Arya K Nair',            'arya.k@wework.co.in',                   'WeWork India',                      'Head of Product and Design',        'VIP'),
  mk('Kushagr Khera',          'kushkhera@theattire.ai',                'Attire.ai',                         'Founder',                           'General'),
  mk('Yugansh Aggarwal',       'yugansh20@gmail.com',                   'Google',                            'Senior Software Engineer',          'Premium'),
  mk('Shrinivas Chouraddi',    'shrinivas@valuecart.in',                'Valuecart Pvt Ltd',                 'VP Technology',                     'VIP'),
  mk('Sumit Dev',              'sumit.d@atollsolutions.com',            'Atoll Solutions',                   'CPO',                               'General'),
  mk('Lalitha Ramani',         'lalithark@google.com',                  'Google',                            'General Manager',                   'VIP'),
  mk('Anusha Venkatasubramanian','anushavenkat@salesforce.com',          'Salesforce',                        'Director of Product',               'Premium'),
  mk('Rajat S',                'rajat@purplfox.com',                    'PurplFox',                          'Product Leader',                    'General'),
  mk('Srivatsan Sundaravaradan','srivats1@netapp.com',                  'NetApp',                            'Staff Product Manager',             'General'),
  mk('Nishant Sinha',          'nisan@amazon.com',                      'Amazon',                            'Sr AI PM',                          'General'),
  mk('Vardhan Jain',           'vardhan.jain@payu.in',                  'PayU',                              'Director Product Growth and Strategy','Premium'),
  mk('Saloni Chandra',         'salonichandra.insead@gmail.com',        'Fyx Technologies',                  'Lead - Product & GTM',              'General'),
  mk('Rachna Bhalla',          'rachna.bhalla23@gmail.com',             'Igel',                              'Product Manager',                   'General'),
  mk('Chandrashekran Y',       'chandra@vaaniresearch.com',             'Vaani AI Research Labs',            "Founder's Office",                  'General'),
  mk('Praneet',                'teenarp@amazon.com',                    'Amazon',                            'SPM',                               'General'),
  mk('Sparsh Gupta',           'sparsh.gupta@toasttab.com',             'Toast',                             'Data Scientist',                    'General'),
  mk('Jagadish Vinjamuri',     'jagadish.vinjamuri@toasttab.com',       'Toast',                             'Senior Product Manager',            'General'),
  mk('Pratik Mishra',          'pratik.mishra@toasttab.com',            'Toast',                             'Software Engineer',                 'General'),
  mk('Lokesh Goel',            'lokesh.goel@toasttab.com',              'Toast',                             'Software Engineer',                 'General'),
  mk('Rahul Rathore',          'rahul.rathore@toasttab.com',            'Toast',                             'Senior QA Automation Engineer',     'General'),
  mk('Rishav Dutta',           'rishav.dutta@toasttab.com',             'Toast',                             'Senior Data Scientist',             'General'),
  mk('Raghava Prasad Sridar',  'raghava.prasad.sridar@toasttab.com',    'Toast',                             'Senior Data Analyst',               'General'),
  mk('Ankush Sharma',          'ankush.sharma@toasttab.com',            'Toast',                             'Engineering Manager',               'General'),
  mk('Anuraag Ravi',           'anuraag.ravi@toasttab.com',             'Toast',                             'Senior Customer Care Specialist',   'General'),
  mk('Manasa',                 'manasastyles@gmail.com',                '',                                  '',                                  'General'),
  mk('Tanushree Naaz',         'tanushree.naaz@walmart.com',            'Walmart',                           '',                                  'General'),
  mk('Prachi Rai',             'prachi.rai@glib.ai',                    'Glib AI',                           '',                                  'General'),
  mk('Shobhit Suman',          'shobhit.suman@hungerbox.com',           'HungerBox',                         '',                                  'General'),
  mk('Abhijeet Yadav',         'abhijeety.c@anitab.org',                'AnitaB.org',                        '',                                  'General'),
  mk('Pranalika Mahanta',      'pranalikam.c@anitab.org',               'AnitaB.org',                        '',                                  'General'),
  mk('Yasha V',                'yashaswini@autothinker.org',            'AutoThinker',                       '',                                  'General'),
  mk('Radhika Janarthanam',    'radhika_janarthanam@comcast.com',       'Comcast',                           '',                                  'General'),
  mk('Aditi Jain',             'aditi.jain@walmart.com',                'Walmart',                           '',                                  'General'),
  mk('Rakshitha',              'rakshitha@herkey.com',                  'HerKey',                            '',                                  'General'),
  mk('Devansh Tripathi',       'devansh@superbryn.com',                 'SuperBryn',                         '',                                  'General'),
  mk('Aayushi Gupta',          'aayushi@superbryn.com',                 'SuperBryn',                         '',                                  'General'),
  mk('Viswanathan Puthukode',  'viswanathan.puthukode@freshworks.com',  'Freshworks',                        'Director of Product Management',    'VIP'),
  mk('Jahnvi Bedia',           'jahnvibedia.28@ibm.com',                'IBM',                               'Product Manager',                   'General'),
  mk('Monica Singh',           'monica.singh@salesforce.com',           'Salesforce',                        'PM',                                'General'),
  mk('Iptisha Gupta',          'iptishagupta@gmail.com',                'ABInBev',                           'Product Manager',                   'General'),
  mk('Sakshi Tiwari',          'sakshi.tiwari@servicenow.com',          'ServiceNow',                        'Inbound Product Manager',           'General'),
  mk('Pradhyuman Shaktawat',   'pradhyumansingh575@gmail.com',          'IBM India',                         'Product Manager',                   'General'),
  mk('Aman Gour',              'amangour88@gmail.com',                  'IBM',                               'Product Manager',                   'General'),
  mk('Kalpana Kempanna',       'kalpanak.ravikumar@gmail.com',          'Dell',                              'Senior Manager',                    'General'),
  mk('Ninkesh Neema',          'ninkesh5@gmail.com',                    'Glance',                            'Product Manager',                   'General'),
  mk('Anushka Seth',           'anushka.seth@ibm.com',                  'IBM',                               'Product Manager',                   'General'),
  mk('Tushar Anand',           'tusharanandinbox@gmail.com',            'Expedia',                           'Product Manager',                   'General'),
  mk('Kunal Kotak',            'kunalkotak9@gmail.com',                 'IBM',                               'Senior PM - AI',                    'General'),
  mk('Aayesha Mishra',         'aayeshamishranitw@gmail.com',           '',                                  '',                                  'General'),
  mk('Khushbu Kamal',          'khushbu.kamal@ibm.com',                 'IBM',                               'Product Manager',                   'General'),
  mk('Mayanka Sumanth',        'mayanka148@gmail.com',                  'Dell',                              'Product Manager',                   'General'),
  mk('Sai Sudha Shenoy',       'saisudha.shenoy@gmail.com',             'Dell Technologies',                 'Principal Product Manager',         'General'),
  mk('Anwesha Bangabash',      'anwesha.bangabash@flipkart.com',        'Flipkart',                          '',                                  'General'),
  mk('Anshul Yadav',           'anshulyadav1968@gmail.com',             '',                                  '',                                  'General'),
  mk('Akash P',                'akashpnith@gmail.com',                  '',                                  '',                                  'General'),
  mk('Amazon Attendee',        'bsrid@amazon.com',                      'Amazon',                            '',                                  'General'),
  mk('Shilpa P',               'p.shilpa@flipkart.com',                 'Flipkart',                          '',                                  'General'),
  mk('Siya Singh',             'siyasingh060120@gmail.com',             'Shell',                             'Product Manager',                   'General'),
  mk('Sohail Khan',            'sohail@thebuildersclub.me',             'The Builders Club',                 'Founder',                           'General'),
  mk('Sajid Ali',              'syed.sajid.ali.2403@gmail.com',         'The Builders Club',                 'Marketing Lead',                    'General'),
  // ── GPFINFINITE (unique, not in main list) ──────────────────────────────────
  mk('Soumya Choubey',         'soumya.c304@gmail.com',                 'Flipkart',                          'Product Designer',                  'General'),
  mk('Diya Vijay',             'diyavijay2371@gmail.com',               'Finance Buddha',                    'SDE 2',                             'General'),
  mk('Ashutosh Poddar',        'ashpd21@gmail.com',                     'Jio Platforms',                     'Product Manager',                   'General'),
  mk('Muskan Gupta',           'guptamuskan1798@gmail.com',             'Dun and Bradstreet',                'Product Manager',                   'General'),
  mk('Vishwas Saini',          'vishwassaini32@gmail.com',              'Vegapay',                           'Product Manager',                   'General'),
  mk('Arpita Behura',          'arpitabehura186@gmail.com',             'Altimetrik',                        'Product Owner',                     'General'),
  mk('Palak Jadwani',          'palak.jadwani@flipkart.com',            'Flipkart',                          'Senior PM',                         'General'),
  mk('Sahana Mukherjee',       'sahanamukherjee8@gmail.com',            'Micron Technology',                 'Product Manager',                   'General'),
  mk('Suyash Ratna',           'su.shrey1167@gmail.com',                'Flipkart',                          'Product Manager',                   'General'),
  mk('Srishti Agrawal',        'aggrawal.srishti@gmail.com',            'Flipkart',                          'Product Manager II',                'General'),
  mk('Madhuparna Dutta',       'md.dutta.10@gmail.com',                 'Employ',                            'Product Manager',                   'General'),
  mk('Meghana Swethadri',      'smeghana@lululemon.com',                'lululemon',                         'Associate Product Manager',         'General'),
  mk('Shraddha Suresh',        'sshraddha@lululemon.com',               'lululemon',                         'Associate Product Manager',         'General'),
  mk('Udit Gattani',           'uditgattani.ism@gmail.com',             'Mercari',                           'Senior Engineering Leader',         'General'),
  mk('Swasthik Prabhu',        'swasthik.prabhu@flipkart.com',          'Flipkart',                          'Product Manager',                   'General'),
  mk('Saranya Prakash',        'saranya.prakash@flipkart.com',          'Flipkart Internet',                 'Product Manager',                   'General'),
  mk('Snehesh Mitra',          'snehesh@google.com',                    'Google',                            'Group Product Manager',             'General'),
  mk('Appanna Prakash',        'appanna.prakash@ibm.com',               'IBM',                               'Product Manager',                   'General'),
  mk('Mitali Dubey',           'dubey.mitali90@gmail.com',              'Dell',                              'Product Owner',                     'General'),
  // ── Batch 4 additions ────────────────────────────────────────────────────────
  mk('Anuradha Dwarakanath',   'anukolar@gmail.com',                    'Lam Research',                      'Sr Staff Technical Program Manager','General'),
  mk('Mohammed Jaffar',        'ugcet2401014@reva.edu.in',              'Reva University',                   'Student',                           'General'),
  mk('Parth Mehta',            'parth.mehta2801@gmail.com',             'KrowdKraft',                        'Student',                           'General'),
  mk('Dhruvam Upadhyay',       'udhruvam@gmail.com',                    'KrowdKraft',                        'Student',                           'General'),
  mk('Radhika Yuvraj Iyengar', 'radhika.yuvraj@women-in-tech.org',      'Women In Tech India',               'Country Director',                  'VIP'),
  mk('Rajiv Gopal',            'rajiv_iyengar@hotmail.com',             'Women In Tech India',               'Logistics Lead',                    'VIP'),
  mk('Penchala Tharun',        'penchalatharun@wanderfly.in',           'Wanderfly',                         'Co-Founder and CEO',                'VIP'),
  mk('Kartheek Dama',          'dama.kartheek@accenture.com',           'Accenture Solutions',               'Advanced App Engineering Associate','General'),
  mk('Sandeep Balaji',         'sandeep@incrementumx.com',              'IncrementumX',                      'CEO',                               'VIP'),
  mk('Richa Bhandari',         'richab.c@anitab.org',                   'Anitab.org India',                  'Manager',                           'General'),
  mk('Aparna Srinivasan',      'aparnas@adobe.com',                     'Adobe Systems India',               'Account Executive',                 'Premium'),
  mk('Shobha Rani Basavaraj',  'sbasavar@adobe.com',                    'Adobe Systems India',               'Group Manager',                     'General'),
  mk('Vikram Bodavula',        'vikramb@microsoft.com',                 'Microsoft India',                   'Principal Lead Product Manager',    'General'),
  mk('Pramod Muralimohan',     'pramod.muralimohan@mercedes-benz.com',  'Mercedes-Benz Research',            'Lead Data Scientist',               'General'),
  mk('Ashwin Srinivasan',      'ashwin.srinivasan@moengage.com',        'MoEngage',                          'VP Product',                        'VIP'),
  mk('Chirag Shenoy',          'chirag.shenoy@phonepe.com',             'PhonePe',                           'Engineering Manager',               'General'),
]

// ── Deduplicate by email key (first occurrence wins) ─────────────────────────
const seen = new Set<string>()
const ATTENDEES = RAW.filter(a => {
  const k = a.email.toLowerCase()
  if (seen.has(k)) return false
  seen.add(k)
  return true
})

// ── Persistence ───────────────────────────────────────────────────────────────
function loadCheckins(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}
function saveCheckins(d: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d))
}
async function syncServer(a: Attendee, action: 'checkin' | 'undo') {
  try {
    await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: a.name, email: a.email, bucket: a.bucket, tier: a.tier,
        action, pass_number: a.email.startsWith('_spk_') ? 'SPEAKER' : genPass(a.email, a.tier),
        timestamp: new Date().toISOString(),
      }),
    })
  } catch { /* localStorage already saved; server sync is best-effort */ }
}

// ── Colours ───────────────────────────────────────────────────────────────────
const BC: Record<Bucket, { bg: string; text: string; border: string; label: string }> = {
  Speaker:   { bg: 'rgba(245,158,11,.15)',  text: '#FBBF24', border: 'rgba(245,158,11,.4)',  label: 'SPEAKER'   },
  Hackathon: { bg: 'rgba(59,130,246,.15)',  text: '#60A5FA', border: 'rgba(59,130,246,.4)',  label: 'HACKATHON' },
  VIP:       { bg: 'rgba(167,139,250,.15)', text: '#A78BFA', border: 'rgba(167,139,250,.4)', label: 'VIP'       },
  Premium:   { bg: 'rgba(251,146,60,.15)',  text: '#FB923C', border: 'rgba(251,146,60,.4)',  label: 'PREMIUM'   },
  General:   { bg: 'rgba(52,211,153,.1)',   text: '#34D399', border: 'rgba(52,211,153,.3)',  label: 'GENERAL'   },
}

const BUCKET_ORDER: Bucket[] = ['Speaker', 'Hackathon', 'VIP', 'Premium', 'General']

// ── Password gate ─────────────────────────────────────────────────────────────
function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { ref.current?.focus() }, [])
  function submit() {
    if (pw === ACCESS_PASSWORD) { sessionStorage.setItem(SESSION_KEY, '1'); onAuth() }
    else { setErr(true); setPw(''); ref.current?.focus() }
  }
  return (
    <div style={{ minHeight: '100vh', background: '#05040C', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 360, background: '#0D0B1E', border: '1px solid #1C1A32', borderRadius: 20, padding: '40px 32px', textAlign: 'center' }}>
        <p style={{ margin: '0 0 6px', fontFamily: 'monospace', fontSize: 10, color: '#7C3AED', letterSpacing: '.2em', textTransform: 'uppercase' }}>TGPF 2026 · Volunteers Only</p>
        <h2 style={{ margin: '0 0 28px', fontSize: 22, fontWeight: 800, color: '#F0EEF8' }}>Check-in Access</h2>
        <input ref={ref} type="password" value={pw}
          onChange={e => { setPw(e.target.value); setErr(false) }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Enter password"
          style={{ width: '100%', boxSizing: 'border-box', padding: '13px 16px', marginBottom: 12, background: '#080618', border: `1px solid ${err ? '#F87171' : '#3B3860'}`, borderRadius: 10, color: '#F0EEF8', fontSize: 15, outline: 'none', textAlign: 'center', letterSpacing: '.1em' }}
        />
        {err && <p style={{ margin: '0 0 12px', fontSize: 12, color: '#F87171' }}>Incorrect password.</p>}
        <button onClick={submit} style={{ width: '100%', padding: 13, background: '#7C3AED', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '.08em' }}>ENTER</button>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CheckinPage() {
  const [authed,      setAuthed]      = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  const [checkins,    setCheckins]    = useState<Record<string, boolean>>(loadCheckins)
  const [query,       setQuery]       = useState('')
  const [activeTab,   setActiveTab]   = useState<Bucket | 'All'>('All')
  const [lastChecked, setLastChecked] = useState<Attendee | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (authed) inputRef.current?.focus() }, [authed])

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />

  function doCheckin(a: Attendee) {
    const next = { ...checkins, [a.email.toLowerCase()]: true }
    setCheckins(next); saveCheckins(next); setLastChecked(a)
    syncServer(a, 'checkin')
    setQuery(''); inputRef.current?.focus()
  }
  function doUndo(a: Attendee) {
    const next = { ...checkins }; delete next[a.email.toLowerCase()]
    setCheckins(next); saveCheckins(next)
    syncServer(a, 'undo')
  }

  function exportCSV() {
    const rows = ['Name,Email,Company,Role,Bucket,Tier,PassNumber,CheckedIn']
    ATTENDEES.forEach(a => {
      const pn = a.email.startsWith('_spk_') ? 'SPEAKER' : genPass(a.email, a.tier)
      const ci = checkins[a.email.toLowerCase()] ? 'YES' : 'NO'
      rows.push(`"${a.name}","${a.email}","${a.company}","${a.role}",${a.bucket},${a.tier},${pn},${ci}`)
    })
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const el = document.createElement('a'); el.href = url; el.download = 'tgpf2026-checkins.csv'; el.click()
  }

  // ── Filter logic ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    let list = activeTab === 'All' ? ATTENDEES : ATTENDEES.filter(a => a.bucket === activeTab)
    if (!q) return list
    return list.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.company.toLowerCase().includes(q) ||
      (!a.email.startsWith('_spk_') && genPass(a.email, a.tier).toLowerCase().includes(q))
    )
  }, [query, activeTab])

  // ── Counts ────────────────────────────────────────────────────────────────
  const totalIn  = Object.values(checkins).filter(Boolean).length
  const total    = ATTENDEES.length
  const bCounts  = useMemo(() => {
    const c: Record<string, { in: number; total: number }> = {}
    BUCKET_ORDER.forEach(b => { c[b] = { in: 0, total: 0 } })
    ATTENDEES.forEach(a => {
      c[a.bucket].total++
      if (checkins[a.email.toLowerCase()]) c[a.bucket].in++
    })
    return c
  }, [checkins])

  return (
    <div style={{ minHeight: '100vh', background: '#05040C', padding: '20px 16px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: '0 0 3px', fontFamily: 'monospace', fontSize: 10, color: '#7C3AED', letterSpacing: '.2em', textTransform: 'uppercase' }}>Admin · Check-in · TGPF 2026</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#F0EEF8' }}>Entry · RMZ Ecoworld</h1>
            <button onClick={exportCSV} style={{ background: '#0D0B1E', border: '1px solid #1C1A32', borderRadius: 10, padding: '8px 16px', color: '#52506A', fontSize: 12, cursor: 'pointer' }}>Export CSV</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ background: '#0D0B1E', border: '1px solid #1C1A32', borderRadius: 12, padding: '10px 18px', flex: '1 1 120px' }}>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#34D399' }}>{totalIn}<span style={{ fontSize: 14, color: '#52506A' }}>/{total}</span></p>
            <p style={{ margin: 0, fontSize: 11, color: '#52506A' }}>Total Checked In</p>
          </div>
          {BUCKET_ORDER.map(b => (
            <div key={b} style={{ background: '#0D0B1E', border: `1px solid ${BC[b].border}`, borderRadius: 12, padding: '10px 16px', flex: '1 1 100px' }}>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: BC[b].text }}>{bCounts[b].in}<span style={{ fontSize: 12, color: '#52506A' }}>/{bCounts[b].total}</span></p>
              <p style={{ margin: 0, fontSize: 10, color: BC[b].text, fontFamily: 'monospace', letterSpacing: '.1em' }}>{b.toUpperCase()}</p>
            </div>
          ))}
        </div>

        {/* Last checked-in */}
        {lastChecked && (
          <div style={{ background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.3)', borderRadius: 12, padding: '12px 18px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontSize: 10, color: '#34D399', fontFamily: 'monospace', letterSpacing: '.1em' }}>JUST CHECKED IN</p>
              <p style={{ margin: '2px 0 0', fontSize: 18, fontWeight: 700, color: '#F0EEF8' }}>{lastChecked.name}</p>
              <p style={{ margin: '1px 0 0', fontSize: 12, color: '#6B7280' }}>{lastChecked.company} · <span style={{ color: BC[lastChecked.bucket].text }}>{lastChecked.bucket} lanyard</span></p>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#34D399' }}>✓</div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, overflowX: 'auto', paddingBottom: 2 }}>
          {(['All', ...BUCKET_ORDER] as const).map(tab => {
            const active = activeTab === tab
            const count  = tab === 'All' ? total : bCounts[tab].total
            const inCount = tab === 'All' ? totalIn : bCounts[tab].in
            const color  = tab === 'All' ? '#F0EEF8' : BC[tab].text
            return (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  flexShrink: 0, padding: '7px 14px', borderRadius: 20, border: `1px solid ${active ? (tab === 'All' ? '#3B3860' : BC[tab].border) : '#1C1A32'}`,
                  background: active ? (tab === 'All' ? '#1C1A32' : BC[tab].bg) : 'transparent',
                  color: active ? color : '#52506A', cursor: 'pointer', fontFamily: 'monospace',
                  fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}>
                {tab} <span style={{ opacity: .7 }}>{inCount}/{count}</span>
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <input ref={inputRef} value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && filtered.length === 1 && !checkins[filtered[0].email.toLowerCase()])
                doCheckin(filtered[0])
            }}
            placeholder="Search name · email · company · or scan QR code…"
            autoComplete="off" autoCorrect="off" spellCheck={false}
            style={{ width: '100%', boxSizing: 'border-box', padding: '13px 40px 13px 16px', background: '#0D0B1E', border: '1px solid #3B3860', borderRadius: 12, color: '#F0EEF8', fontSize: 15, outline: 'none' }}
          />
          {query && (
            <button onClick={() => { setQuery(''); inputRef.current?.focus() }}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#52506A', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>×</button>
          )}
        </div>

        {/* List */}
        <div style={{ border: '1px solid #1C1A32', borderRadius: 16, overflow: 'hidden' }}>
          {filtered.length === 0
            ? <div style={{ padding: '32px 20px', textAlign: 'center', color: '#52506A' }}>No match for "{query}"</div>
            : filtered.map((a, i) => {
              const isIn  = checkins[a.email.toLowerCase()]
              const pn    = a.email.startsWith('_spk_') ? 'SPEAKER PASS' : genPass(a.email, a.tier)
              const bc    = BC[a.bucket]
              return (
                <div key={a.email + i} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                  background: isIn ? 'rgba(16,185,129,.04)' : (i % 2 === 0 ? '#080618' : '#05040C'),
                  borderBottom: i < filtered.length - 1 ? '1px solid #1C1A32' : 'none',
                  opacity: isIn ? 0.65 : 1,
                }}>
                  {/* Bucket badge */}
                  <span style={{ flexShrink: 0, fontFamily: 'monospace', fontSize: 8, letterSpacing: '.1em', padding: '3px 7px', borderRadius: 20, background: bc.bg, color: bc.text, border: `1px solid ${bc.border}`, textTransform: 'uppercase' }}>
                    {bc.label}
                  </span>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: isIn ? '#52506A' : '#F0EEF8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {isIn && <span style={{ color: '#34D399', marginRight: 6 }}>✓</span>}{a.name}
                    </p>
                    <p style={{ margin: 0, fontSize: 11, color: '#52506A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {[a.company, a.role].filter(Boolean).join(' · ')}
                    </p>
                    <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 9, color: '#2D2B4A' }}>{pn}</p>
                  </div>
                  {/* Button */}
                  {isIn
                    ? <button onClick={() => doUndo(a)} style={{ flexShrink: 0, fontFamily: 'monospace', fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase', padding: '5px 10px', borderRadius: 8, background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', color: '#F87171', cursor: 'pointer' }}>Undo</button>
                    : <button onClick={() => doCheckin(a)} style={{ flexShrink: 0, fontFamily: 'monospace', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', padding: '7px 14px', borderRadius: 8, background: 'rgba(16,185,129,.15)', border: '1px solid rgba(16,185,129,.35)', color: '#34D399', cursor: 'pointer', fontWeight: 700 }}>Check In</button>
                  }
                </div>
              )
            })
          }
        </div>

        <p style={{ margin: '14px 0 0', fontSize: 10, color: '#2D2B4A', textAlign: 'center' }}>
          {filtered.length} shown · {total} total · saved locally + synced to server · <a href="/" style={{ color: '#7C3AED' }}>← home</a>
        </p>
      </div>
    </div>
  )
}
