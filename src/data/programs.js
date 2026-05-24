export const programCategories = [
  {
    name: 'Artificial Intelligence',
    areas: [
      { id: 'ai', label: 'Artificial Intelligence' },
      { id: 'ml', label: 'Machine Learning' },
      { id: 'nlp', label: 'Natural Language Processing' },
      { id: 'vision', label: 'Computer Vision' },
      { id: 'robotics', label: 'Robotics' },
      { id: 'ir', label: 'Information Retrieval' }
    ]
  },
  {
    name: 'Systems',
    areas: [
      { id: 'systems', label: 'Computer Systems' },
      { id: 'networks', label: 'Networks' },
      { id: 'security', label: 'Security & Privacy' },
      { id: 'databases', label: 'Databases' },
      { id: 'hpc', label: 'High Performance Computing' },
      { id: 'mobile', label: 'Mobile Computing' }
    ]
  },
  {
    name: 'Theory',
    areas: [
      { id: 'theory', label: 'Algorithms & Theory' },
      { id: 'crypto', label: 'Cryptography' },
      { id: 'logic', label: 'Logic & Verification' }
    ]
  },
  {
    name: 'Interdisciplinary',
    areas: [
      { id: 'ds', label: 'Data Science' },
      { id: 'hci', label: 'Human-Computer Interaction' },
      { id: 'bioinformatics', label: 'Bioinformatics' },
      { id: 'graphics', label: 'Computer Graphics' },
      { id: 'se', label: 'Software Engineering' },
      { id: 'tic', label: 'Tech, Info & Computing' }
    ]
  }
];

export const regions = [
  { id: 'all', label: 'World' },
  { id: 'northamerica', label: 'North America' },
  { id: 'europe', label: 'Europe' },
  { id: 'asia', label: 'Asia' },
  { id: 'australasia', label: 'Australasia' },
  { id: 'southamerica', label: 'South America' },
  { id: 'africa', label: 'Africa' }
];

export const degreeTypes = [
  { id: 'all', label: 'All Programs' },
  { id: 'phd', label: 'PhD' },
  { id: 'ms', label: 'Masters' }
];

export const countryNames = {
  us: 'United States',
  gb: 'United Kingdom',
  de: 'Germany',
  ch: 'Switzerland',
  ca: 'Canada',
  fr: 'France',
  cn: 'China',
  jp: 'Japan',
  kr: 'South Korea',
  in: 'India',
  sg: 'Singapore',
  hk: 'Hong Kong',
  au: 'Australia',
  nl: 'Netherlands',
  se: 'Sweden',
  dk: 'Denmark',
  fi: 'Finland',
  il: 'Israel',
  it: 'Italy',
  es: 'Spain',
  at: 'Austria',
  be: 'Belgium',
  pt: 'Portugal',
  no: 'Norway',
  ie: 'Ireland',
  nz: 'New Zealand',
  tw: 'Taiwan',
  br: 'Brazil',
  cz: 'Czech Republic',
  pl: 'Poland',
  ro: 'Romania',
  hu: 'Hungary',
  gr: 'Greece',
  tr: 'Turkey',
  ru: 'Russia',
  ua: 'Ukraine',
  eg: 'Egypt',
  sa: 'Saudi Arabia',
  qa: 'Qatar',
  ae: 'UAE',
  ir: 'Iran',
  th: 'Thailand',
  my: 'Malaysia',
  ph: 'Philippines',
  bd: 'Bangladesh',
  pk: 'Pakistan',
  lk: 'Sri Lanka',
  lb: 'Lebanon',
  jo: 'Jordan',
  cl: 'Chile',
  co: 'Colombia',
  mx: 'Mexico',
  ar: 'Argentina',
  bg: 'Bulgaria',
  cy: 'Cyprus',
  hr: 'Croatia',
  ee: 'Estonia',
  lu: 'Luxembourg',
  si: 'Slovenia',
  sk: 'Slovakia',
  rs: 'Serbia',
  mo: 'Macau'
};

export const countryFlags = {
  us: '🇺🇸',
  gb: '🇬🇧',
  de: '🇩🇪',
  ch: '🇨🇭',
  ca: '🇨🇦',
  fr: '🇫🇷',
  cn: '🇨🇳',
  jp: '🇯🇵',
  kr: '🇰🇷',
  in: '🇮🇳',
  sg: '🇸🇬',
  hk: '🇭🇰',
  au: '🇦🇺',
  nl: '🇳🇱',
  se: '🇸🇪',
  dk: '🇩🇰',
  fi: '🇫🇮',
  il: '🇮🇱',
  it: '🇮🇹',
  es: '🇪🇸',
  at: '🇦🇹',
  be: '🇧🇪',
  pt: '🇵🇹',
  no: '🇳🇴',
  ie: '🇮🇪',
  nz: '🇳🇿',
  tw: '🇹🇼',
  br: '🇧🇷',
  cz: '🇨🇿',
  pl: '🇵🇱',
  ro: '🇷🇴',
  hu: '🇭🇺',
  gr: '🇬🇷',
  tr: '🇹🇷',
  ru: '🇷🇺',
  ua: '🇺🇦',
  eg: '🇪🇬',
  sa: '🇸🇦',
  qa: '🇶🇦',
  ae: '🇦🇪',
  ir: '🇮🇷',
  th: '🇹🇭',
  my: '🇲🇾',
  ph: '🇵🇭',
  bd: '🇧🇩',
  pk: '🇵🇰',
  lk: '🇱🇰',
  lb: '🇱🇧',
  jo: '🇯🇴',
  cl: '🇨🇱',
  co: '🇨🇴',
  mx: '🇲🇽',
  ar: '🇦🇷',
  bg: '🇧🇬',
  cy: '🇨🇾',
  hr: '🇭🇷',
  ee: '🇪🇪',
  lu: '🇱🇺',
  si: '🇸🇮',
  sk: '🇸🇰',
  rs: '🇷🇸',
  mo: '🇲🇴'
};

export const areaToInterest = {
  // AI & Machine Learning
  nips: 'Machine Learning', neurips: 'Machine Learning', icml: 'Machine Learning', iclr: 'Machine Learning',
  aaai: 'Artificial Intelligence', ijcai: 'Artificial Intelligence',
  
  // Computer Vision
  cvpr: 'Computer Vision', iccv: 'Computer Vision', eccv: 'Computer Vision',
  
  // NLP
  acl: 'Natural Language Processing', emnlp: 'Natural Language Processing', naacl: 'Natural Language Processing', eacl: 'Natural Language Processing', coling: 'Natural Language Processing',
  
  // Robotics
  icra: 'Robotics', iros: 'Robotics', rss: 'Robotics',
  
  // Data Science / Data Mining
  kdd: 'Data Science', wsdm: 'Data Science', icdm: 'Data Science', sdm: 'Data Science', www: 'Data Science',
  
  // Information Retrieval
  sigir: 'Information Retrieval', ecir: 'Information Retrieval',
  
  // Security
  ccs: 'Security & Privacy', ndss: 'Security & Privacy', 'usenixsec': 'Security & Privacy', sp: 'Security & Privacy', pets: 'Security & Privacy',
  crypto: 'Cryptography', eurocrypt: 'Cryptography', asiacrypt: 'Cryptography',
  
  // Systems
  sosp: 'Systems', osdi: 'Systems', eurosys: 'Systems', atc: 'Systems', asplos: 'Systems',
  isca: 'Computer Architecture', micro: 'Computer Architecture', hpca: 'Computer Architecture',
  
  // Networking
  sigcomm: 'Networking', nsdi: 'Networking', infocom: 'Networking', imc: 'Networking', conext: 'Networking',
  
  // Databases
  sigmod: 'Databases', vldb: 'Databases', icde: 'Databases', pods: 'Databases',
  
  // Theory
  stoc: 'Theory', focs: 'Theory', soda: 'Theory', colt: 'Theory', icalp: 'Theory',
  
  // HCI
  chiconf: 'Human-Computer Interaction', chi: 'Human-Computer Interaction', uist: 'Human-Computer Interaction', cscw: 'Human-Computer Interaction',
  
  // Graphics
  siggraph: 'Computer Graphics', 'siggraph-asia': 'Computer Graphics', eurographics: 'Computer Graphics',
  
  // Software Engineering
  icse: 'Software Engineering', fse: 'Software Engineering', ase: 'Software Engineering', issta: 'Software Engineering',
  
  // PL
  popl: 'Programming Languages', pldi: 'Programming Languages', oopsla: 'Programming Languages', ecoop: 'Programming Languages',
  
  // EDA
  dac: 'Design Automation', iccad: 'Design Automation',
  
  // HPC
  sc: 'High-Performance Computing', ics: 'High-Performance Computing', ppopp: 'High-Performance Computing',
  
  // Mobile
  mobicom: 'Mobile Computing', mobisys: 'Mobile Computing', sensys: 'Mobile Computing',
  
  // Bioinformatics
  recomb: 'Bioinformatics', ismb: 'Bioinformatics',
  
  // Visualization
  vis: 'Visualization', infovis: 'Visualization', eurovis: 'Visualization',
};

// Also add a mapping of interest colors for UI
export const interestColors = {
  'Machine Learning': { bg: 'rgba(99,102,241,0.15)', border: '#6366f1', text: '#a5b4fc' },
  'Artificial Intelligence': { bg: 'rgba(139,92,246,0.15)', border: '#8b5cf6', text: '#c4b5fd' },
  'Computer Vision': { bg: 'rgba(236,72,153,0.15)', border: '#ec4899', text: '#f9a8d4' },
  'Natural Language Processing': { bg: 'rgba(14,165,233,0.15)', border: '#0ea5e9', text: '#7dd3fc' },
  'Robotics': { bg: 'rgba(245,158,11,0.15)', border: '#f59e0b', text: '#fcd34d' },
  'Data Science': { bg: 'rgba(34,197,94,0.15)', border: '#22c55e', text: '#86efac' },
  'Security & Privacy': { bg: 'rgba(239,68,68,0.15)', border: '#ef4444', text: '#fca5a5' },
  'Cryptography': { bg: 'rgba(168,85,247,0.15)', border: '#a855f7', text: '#d8b4fe' },
  'Systems': { bg: 'rgba(6,182,212,0.15)', border: '#06b6d4', text: '#67e8f9' },
  'Computer Architecture': { bg: 'rgba(20,184,166,0.15)', border: '#14b8a6', text: '#5eead4' },
  'Networking': { bg: 'rgba(59,130,246,0.15)', border: '#3b82f6', text: '#93c5fd' },
  'Databases': { bg: 'rgba(249,115,22,0.15)', border: '#f97316', text: '#fdba74' },
  'Theory': { bg: 'rgba(217,70,239,0.15)', border: '#d946ef', text: '#f0abfc' },
  'Human-Computer Interaction': { bg: 'rgba(244,114,182,0.15)', border: '#f472b6', text: '#fbcfe8' },
  'Computer Graphics': { bg: 'rgba(251,146,60,0.15)', border: '#fb923c', text: '#fed7aa' },
  'Software Engineering': { bg: 'rgba(74,222,128,0.15)', border: '#4ade80', text: '#bbf7d0' },
  'Programming Languages': { bg: 'rgba(45,212,191,0.15)', border: '#2dd4bf', text: '#99f6e4' },
  'Information Retrieval': { bg: 'rgba(56,189,248,0.15)', border: '#38bdf8', text: '#bae6fd' },
  'Design Automation': { bg: 'rgba(148,163,184,0.15)', border: '#94a3b8', text: '#cbd5e1' },
  'High-Performance Computing': { bg: 'rgba(52,211,153,0.15)', border: '#34d399', text: '#a7f3d0' },
  'Mobile Computing': { bg: 'rgba(253,186,116,0.15)', border: '#fdba74', text: '#fed7aa' },
  'Bioinformatics': { bg: 'rgba(134,239,172,0.15)', border: '#86efac', text: '#bbf7d0' },
  'Visualization': { bg: 'rgba(196,181,253,0.15)', border: '#c4b5fd', text: '#e9d5ff' },
};
