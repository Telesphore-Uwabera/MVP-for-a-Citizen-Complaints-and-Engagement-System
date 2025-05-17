import { Province, District } from '../types/location';

export const COMPLAINT_CATEGORIES = [
  {
    id: 'health',
    name: 'Health',
    agency: 'Ministry of Health',
    description: 'Issues related to healthcare facilities, services, and public health',
  },
  {
    id: 'education',
    name: 'Education',
    agency: 'MINEDUC',
    description: 'Concerns about schools, universities, and educational services',
  },
  {
    id: 'water',
    name: 'Water & Sanitation',
    agency: 'WASAC',
    description: 'Water supply, sanitation, and related infrastructure issues',
  },
  {
    id: 'roads',
    name: 'Roads & Transport',
    agency: 'RTDA / RURA',
    description: 'Road maintenance, public transport, and traffic management',
  },
  {
    id: 'security',
    name: 'Security',
    agency: 'Rwanda National Police',
    description: 'Public safety, security concerns, and law enforcement',
  },
  {
    id: 'local',
    name: 'Local Government',
    agency: 'MINALOC',
    description: 'Local administration, community services, and district-level issues',
  },
] as const;

export const PROVINCES: Province[] = [
  {
    id: 'kigali',
    name: 'Kigali',
    districts: [
      {
        id: 'gasabo',
        name: 'Gasabo',
        sectors: [
          'Bumbogo', 'Gatsata', 'Gikomero', 'Gisozi', 'Jabana', 'Jali', 'Kacyiru',
          'Kimihurura', 'Kimironko', 'Kinyinya', 'Ndera', 'Nduba', 'Rusororo', 'Rutunga'
        ]
      },
      {
        id: 'kicukiro',
        name: 'Kicukiro',
        sectors: [
          'Gatenga', 'Gikondo', 'Kagarama', 'Kanombe', 'Kicukiro', 'Kigarama',
          'Masaka', 'Niboye', 'Nyarugunga'
        ]
      },
      {
        id: 'nyarugenge',
        name: 'Nyarugenge',
        sectors: [
          'Gitega', 'Kanyinya', 'Kigali', 'Kimisagara', 'Mageragere', 'Muhima',
          'Nyakabanda', 'Nyamirambo', 'Nyarugenge', 'Rwezamenyo'
        ]
      }
    ]
  },
  {
    id: 'eastern',
    name: 'Eastern Province',
    districts: [
      {
        id: 'bugesera',
        name: 'Bugesera',
        sectors: [
          'Gashora', 'Juru', 'Kamabuye', 'Mareba', 'Mayange', 'Musenyi', 'Mwogo',
          'Ngeruka', 'Nyamata', 'Nyarugenge', 'Rilima', 'Ruhuha', 'Rweru', 'Shyara'
        ]
      },
      {
        id: 'gatsibo',
        name: 'Gatsibo',
        sectors: [
          'Gatsibo', 'Gasange', 'Gitoki', 'Kabarore', 'Kageyo', 'Kiramuruzi',
          'Kiziguro', 'Muhura', 'Murambi', 'Ngarama', 'Nyagihanga', 'Remera', 'Rugarama', 'Rwimbogo'
        ]
      },
      {
        id: 'kayonza',
        name: 'Kayonza',
        sectors: [
          'Gahini', 'Kabare', 'Kabarondo', 'Mukarange', 'Murama', 'Murundi',
          'Mwiri', 'Ndego', 'Nyamirama', 'Rukara', 'Ruramira', 'Rwinkwavu'
        ]
      },
      {
        id: 'kirehe',
        name: 'Kirehe',
        sectors: [
          'Gahara', 'Gatore', 'Kigarama', 'Kigina', 'Kirehe', 'Mahama', 'Mpanga',
          'Musaza', 'Mushikiri', 'Nasho', 'Nyamugari', 'Nyarubuye'
        ]
      },
      {
        id: 'ngoma',
        name: 'Ngoma',
        sectors: [
          'Gashanda', 'Jarama', 'Karembo', 'Kazo', 'Kibungo', 'Mugesera', 'Murama',
          'Mutenderi', 'Remera', 'Rukira', 'Rukumberi', 'Rurenge', 'Sake', 'Zaza'
        ]
      },
      {
        id: 'nyagatare',
        name: 'Nyagatare',
        sectors: [
          'Bukure', 'Bwambazi', 'Gatunda', 'Kiyombe', 'Matimba', 'Mimuli', 'Mukama',
          'Musheli', 'Nyagatare', 'Rukomo', 'Rwempasha', 'Rwimiyaga', 'Tabagwe'
        ]
      },
      {
        id: 'rwamagana',
        name: 'Rwamagana',
        sectors: [
          'Fumbwe', 'Gahengeri', 'Gishari', 'Karenge', 'Kigabiro', 'Muhazi', 'Munyaga',
          'Munyiginya', 'Musaza', 'Mushonyi', 'Mushube', 'Muyumbu', 'Mwulire', 'Nyakaliro', 'Nzige', 'Rubona'
        ]
      }
    ]
  },
  {
    id: 'northern',
    name: 'Northern Province',
    districts: [
      {
        id: 'burera',
        name: 'Burera',
        sectors: [
          'Bungwe', 'Butaro', 'Cyanika', 'Cyeru', 'Gahunga', 'Gatebe', 'Gitovu',
          'Kagogo', 'Kinoni', 'Kinyababa', 'Kivuye', 'Nemba', 'Rugarama', 'Rugengabari', 'Ruhunde', 'Rusarabuye', 'Rwerere'
        ]
      },
      {
        id: 'gakenke',
        name: 'Gakenke',
        sectors: [
          'Busengo', 'Coko', 'Cyabingo', 'Gakenke', 'Gashenyi', 'Janja', 'Kamubuga',
          'Karambo', 'Kivuruga', 'Mataba', 'Minazi', 'Mugunga', 'Muhondo', 'Muyongwe', 'Muzo', 'Nemba', 'Ruli', 'Rusasa', 'Rushashi'
        ]
      },
      {
        id: 'gicumbi',
        name: 'Gicumbi',
        sectors: [
          'Bukure', 'Bwisige', 'Byumba', 'Cyumba', 'Giti', 'Kageyo', 'Kaniga',
          'Manyagiro', 'Miyove', 'Kiyombe', 'Mukarange', 'Muko', 'Mutete', 'Nyamiyaga', 'Nyankenke', 'Rubaya', 'Rukomo', 'Rushaki', 'Rutare', 'Ruvune', 'Rwamiko', 'Shangasha'
        ]
      },
      {
        id: 'musanze',
        name: 'Musanze',
        sectors: [
          'Busogo', 'Cyuve', 'Gacaca', 'Gashaki', 'Gataraga', 'Kimonyi', 'Kinigi',
          'Muhoza', 'Muko', 'Musanze', 'Nkotsi', 'Nyange', 'Remera', 'Rwaza', 'Shingiro'
        ]
      },
      {
        id: 'rulindo',
        name: 'Rulindo',
        sectors: [
          'Base', 'Burega', 'Bushoki', 'Buyoga', 'Cyinzuzi', 'Cyungo', 'Kinihira',
          'Kisaro', 'Masoro', 'Mbogo', 'Murambi', 'Ngoma', 'Ntarabana', 'Rukozo', 'Rusiga', 'Shyorongi', 'Tumba'
        ]
      }
    ]
  },
  {
    id: 'southern',
    name: 'Southern Province',
    districts: [
      {
        id: 'gisagara',
        name: 'Gisagara',
        sectors: [
          'Gikonko', 'Gishubi', 'Kansi', 'Kibilizi', 'Kigembe', 'Mamba', 'Muganza',
          'Mugombwa', 'Mukindo', 'Musha', 'Ndora', 'Nyanza', 'Save'
        ]
      },
      {
        id: 'huye',
        name: 'Huye',
        sectors: [
          'Gishamvu', 'Huye', 'Karama', 'Kigoma', 'Kinazi', 'Maraba', 'Mbazi',
          'Mukura', 'Ngoma', 'Ruhashya', 'Rusatira', 'Rwaniro', 'Simbi', 'Tumba'
        ]
      },
      {
        id: 'kamonyi',
        name: 'Kamonyi',
        sectors: [
          'Gacurabwenge', 'Karama', 'Kayenzi', 'Kayumbu', 'Mugina', 'Musambira',
          'Ngamba', 'Nyamiyaga', 'Nyarubaka', 'Rugarika', 'Rukoma', 'Runda'
        ]
      },
      {
        id: 'muhanga',
        name: 'Muhanga',
        sectors: [
          'Cyeza', 'Kabacuzi', 'Kibangu', 'Kiyumba', 'Muhanga', 'Mushishiro',
          'Nyabinoni', 'Nyamabuye', 'Nyarusange', 'Rongi', 'Rugendabari', 'Shyogwe'
        ]
      },
      {
        id: 'nyamagabe',
        name: 'Nyamagabe',
        sectors: [
          'Buruhukiro', 'Cyanika', 'Gasaka', 'Gatare', 'Kaduha', 'Kamegeli',
          'Kibirizi', 'Kibumbwe', 'Kitabi', 'Mbazi', 'Mugano', 'Musange', 'Musebeya', 'Mushubi', 'Nkomane', 'Gasaka', 'Tare', 'Uwinkingi'
        ]
      },
      {
        id: 'nyanza',
        name: 'Nyanza',
        sectors: [
          'Busasamana', 'Busoro', 'Cyabakamyi', 'Kibilizi', 'Kigoma', 'Mukingo',
          'Muyira', 'Ntyazo', 'Nyagisozi', 'Rwabicuma'
        ]
      },
      {
        id: 'nyaruguru',
        name: 'Nyaruguru',
        sectors: [
          'Busanze', 'Cyahinda', 'Kibeho', 'Kivu', 'Mata', 'Muganza', 'Munini',
          'Ngera', 'Ngoma', 'Nyabimata', 'Nyagisozi', 'Ruheru', 'Ruramba', 'Rusenge'
        ]
      },
      {
        id: 'ruhango',
        name: 'Ruhango',
        sectors: [
          'Bweramana', 'Byimana', 'Kabagali', 'Kinazi', 'Kinihira', 'Mbuye',
          'Mpanga', 'Muhanga', 'Mushishiro', 'Ndiza', 'Ntongwe', 'Ruhango'
        ]
      }
    ]
  },
  {
    id: 'western',
    name: 'Western Province',
    districts: [
      {
        id: 'karongi',
        name: 'Karongi',
        sectors: [
          'Bwishyura', 'Gashari', 'Gishyita', 'Gitesi', 'Mubuga', 'Murambi',
          'Murundi', 'Mutuntu', 'Rubengera', 'Rugabano', 'Ruganda', 'Rwankuba', 'Twumba'
        ]
      },
      {
        id: 'ngororero',
        name: 'Ngororero',
        sectors: [
          'Bwira', 'Gatumba', 'Hindiro', 'Kabaya', 'Kageyo', 'Kavumu', 'Matyazo',
          'Muhanda', 'Muhororo', 'Ndaro', 'Ngororero', 'Nyange', 'Sovu'
        ]
      },
      {
        id: 'nyabihu',
        name: 'Nyabihu',
        sectors: [
          'Bigogwe', 'Jenda', 'Jomba', 'Kabatwa', 'Karago', 'Kintobo', 'Mukamira',
          'Muringa', 'Rambura', 'Rugera', 'Rurembo', 'Shyira'
        ]
      },
      {
        id: 'nyamasheke',
        name: 'Nyamasheke',
        sectors: [
          'Bushekeri', 'Bushenge', 'Cyato', 'Gihombo', 'Kagano', 'Kanjongo',
          'Karambi', 'Karengera', 'Kirimbi', 'Macuba', 'Mahembe', 'Nyabiteke', 'Rangiro', 'Ruharambuga', 'Shangi', 'Yungwe'
        ]
      },
      {
        id: 'rubavu',
        name: 'Rubavu',
        sectors: [
          'Bugeshi', 'Busasamana', 'Cyanzarwe', 'Gisenyi', 'Kanama', 'Kanzenze',
          'Mudende', 'Nyakiriba', 'Nyamyumba', 'Nyundo', 'Rubavu', 'Rugerero'
        ]
      },
      {
        id: 'rusizi',
        name: 'Rusizi',
        sectors: [
          'Bugarama', 'Butare', 'Bweyeye', 'Gashonga', 'Giheke', 'Gihundwe',
          'Gikundamvura', 'Gitambi', 'Kamembe', 'Muganza', 'Mururu', 'Nkanka', 'Nkungu', 'Nyakabuye', 'Nyakarenzo', 'Nzahaha', 'Rwimbogo'
        ]
      },
      {
        id: 'rutsiro',
        name: 'Rutsiro',
        sectors: [
          'Boneza', 'Gihango', 'Kigeyo', 'Kivumu', 'Manihira', 'Mukura', 'Murunda',
          'Musasa', 'Mushonyi', 'Mushubati', 'Nyabirasi', 'Ruhango', 'Rusebeya', 'Rwakaboko'
        ]
      }
    ]
  }
];

export const COMPLAINT_STATUS = {
  SUBMITTED: 'submitted',
  IN_REVIEW: 'in_review',
  IN_PROGRESS: 'in_progress',
  RESPONDED: 'responded',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

export const COMPLAINT_PRIORITY = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  URGENT: 4,
  CRITICAL: 5,
} as const;

export const COMPLAINT_PRIORITY_LABELS = {
  [COMPLAINT_PRIORITY.LOW]: 'Low',
  [COMPLAINT_PRIORITY.MEDIUM]: 'Medium',
  [COMPLAINT_PRIORITY.HIGH]: 'High',
  [COMPLAINT_PRIORITY.URGENT]: 'Urgent',
  [COMPLAINT_PRIORITY.CRITICAL]: 'Critical',
} as const;

export const COMPLAINT_STATUS_LABELS = {
  [COMPLAINT_STATUS.SUBMITTED]: 'Submitted',
  [COMPLAINT_STATUS.IN_REVIEW]: 'In Review',
  [COMPLAINT_STATUS.IN_PROGRESS]: 'In Progress',
  [COMPLAINT_STATUS.RESPONDED]: 'Responded',
  [COMPLAINT_STATUS.RESOLVED]: 'Resolved',
  [COMPLAINT_STATUS.CLOSED]: 'Closed',
} as const;

export const COMPLAINT_STATUS_COLORS = {
  [COMPLAINT_STATUS.SUBMITTED]: 'default',
  [COMPLAINT_STATUS.IN_REVIEW]: 'info',
  [COMPLAINT_STATUS.IN_PROGRESS]: 'warning',
  [COMPLAINT_STATUS.RESPONDED]: 'primary',
  [COMPLAINT_STATUS.RESOLVED]: 'success',
  [COMPLAINT_STATUS.CLOSED]: 'default',
} as const; 