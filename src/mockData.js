// Mock data for development and when Supabase is not configured
export const mockData = {
  praxisInfo: {
    id: '1',
    name: 'Zahngut Bad Wünnenberg',
    slogan: 'Modernste Zahnmedizin. Der Mensch im Mittelpunkt.',
    telefon: '02957 - 1010',
    notdienst: '01805 - 986 700',
    email: 'info@dein-zahngut.de',
    doctolib: 'https://www.doctolib.de/zahnarztpraxis/bad-wuennenberg/zahngut-bad-wuennenberg',
    address: {
      street: 'Kirchweg 8d',
      zip: '33181',
      city: 'Bad Wünnenberg - Haaren'
    }
  },

  openingHours: [
    { day_of_week: 'Montag', opens_at: '08:00', closes_at: '19:00', is_closed: false, display_order: 1 },
    { day_of_week: 'Dienstag', opens_at: '08:00', closes_at: '19:00', is_closed: false, display_order: 2 },
    { day_of_week: 'Mittwoch', opens_at: '08:00', closes_at: '19:00', is_closed: false, display_order: 3 },
    { day_of_week: 'Donnerstag', opens_at: '08:00', closes_at: '19:00', is_closed: false, display_order: 4 },
    { day_of_week: 'Freitag', opens_at: '08:00', closes_at: '16:00', is_closed: false, display_order: 5 },
    { day_of_week: 'Samstag', opens_at: null, closes_at: null, is_closed: true, display_order: 6 },
    { day_of_week: 'Sonntag', opens_at: null, closes_at: null, is_closed: true, display_order: 7 }
  ],

  treatments: [
    {
      id: '1',
      category: 'Zahnerhaltung',
      name: 'Füllungen',
      icon: '🦷',
      untertitel: 'Hochwertige Zahnfüllungen',
      was: 'Kariesbehandlung mit modernen Materialien',
      ablauf: ['Untersuchung', 'Lokalanästhesie', 'Kariesentfernung', 'Füllung'],
      vorteile: ['Schmerzfrei', 'Langlebig', 'Ästhetisch'],
      dauer: '30-60 Min',
      empfohlen: 'Bei Karies',
      active: true
    },
    {
      id: '2',
      category: 'Prophylaxe',
      name: 'Professionelle Zahnreinigung',
      icon: '✨',
      untertitel: 'Für gesunde und saubere Zähne',
      was: 'Gründliche Reinigung aller Zahnflächen',
      ablauf: ['Untersuchung', 'Zahnsteinentfernung', 'Politur', 'Fluoridierung'],
      vorteile: ['Vorbeugt Karies', 'Frischer Atem', 'Helle Zähne'],
      dauer: '45-60 Min',
      empfohlen: '2x jährlich',
      active: true
    }
  ],

  videos: [
    {
      id: '1',
      title: 'Richtig Zähneputzen',
      category: 'Prophylaxe',
      duration: '3:24',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: '',
      views: 0,
      active: true
    }
  ],

  aftercare: [
    {
      id: '1',
      behandlung: 'Nach Zahnextraktion',
      kurzbeschreibung: 'Wichtige Hinweise nach dem Ziehen eines Zahns',
      zeitraum: '3-5 Tage',
      icon: '🦷',
      phasen: {
        phase1: {
          title: 'Erste 24 Stunden',
          time: '0-24h',
          items: ['Auf Tupfer beißen', 'Nicht spülen', 'Keine Milchprodukte']
        },
        phase2: {
          title: 'Tag 2-3',
          time: '24-72h',
          items: ['Vorsichtig spülen', 'Weiche Kost', 'Kühlen']
        },
        phase3: {
          title: 'Ab Tag 4',
          time: '72h+',
          items: ['Normale Mundhygiene', 'Wunde heilt ab']
        }
      },
      warnung: ['Starke Blutung', 'Starke Schmerzen', 'Fieber'],
      active: true
    }
  ],

  news: [
    {
      id: '1',
      title: 'Willkommen bei Zahngut',
      content: 'Wir freuen uns, Sie in unserer modernen Zahnarztpraxis begrüßen zu dürfen.',
      image_url: '',
      video_url: '',
      published: true,
      display_order: 1,
      created_at: new Date().toISOString()
    }
  ],

  designSettings: {
    id: '1',
    colors: {
      primary: '#0891b2',
      primaryDark: '#0e7490',
      secondary: '#3bc4e5',
      accent: '#06b6d4',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    },
    logo_type: 'icon',
    logo_icon: '🦷',
    custom_logo_url: null,
    custom_icon_url: null
  },

  emergencyInfo: {
    id: '1',
    nummer: '01805 986700',
    zeiten: 'Wochenenden und Feiertage',
    anweisungen: [
      'Ruhe bewahren',
      'Wunde kühlen',
      'Bei starken Schmerzen: Schmerzmittel',
      'Notdienst kontaktieren'
    ],
    zahn_aus: 'Zahn in Zahnrettungsbox oder H-Milch aufbewahren und sofort zum Zahnarzt!',
    zahn_locker: 'Nicht berühren! Sofort den zahnärztlichen Notdienst kontaktieren.'
  }
};

// Simulate async behavior
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
