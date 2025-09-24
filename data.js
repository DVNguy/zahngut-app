// data-fixed.js - Bereinigte und vollständig funktionierende Datenverwaltung für Zahngut App
// Version 2.0 - Garantiert funktionsfähig

const ZahngutData = {
    // Komplette Standard-Datenstruktur
    defaultData: {
        praxis: {
            name: "Zahngut Bad Wünnenberg",
            slogan: "Moderne Zahnmedizin. Der Mensch im Mittelpunkt.",
            telefon: "02957 / 10 10",
            notdienst: "01805 / 986 700",
            email: "info@dein-zahngut.de",
            website: "https://www.dein-zahngut.de",
            doctolib: "https://www.doctolib.de/zahnarztpraxis/bad-wuennenberg",
            address: {
                street: "Kirchweg 8d",
                zip: "33181",
                city: "Bad Wünnenberg",
                state: "Nordrhein-Westfalen"
            }
        },
        
        oeffnungszeiten: {
            montag: { von: "08:00", bis: "19:00" },
            dienstag: { von: "08:00", bis: "19:00" },
            mittwoch: { von: "08:00", bis: "19:00" },
            donnerstag: { von: "08:00", bis: "19:00" },
            freitag: { von: "08:00", bis: "16:00" },
            samstag: { von: "", bis: "" },
            sonntag: { von: "", bis: "" }
        },
        
        // DESIGN-EINSTELLUNGEN
        design: {
            colors: {
                primary: '#2563EB',
                primaryDark: '#1E40AF',
                accent: '#7C3AED',
                secondary: '#60A5FA',
                success: '#10B981',
                warning: '#F59E0B',
                error: '#EF4444',
                textDark: '#0F172A',
                textLight: '#64748B',
                bgLight: '#F8FAFC',
                white: '#FFFFFF'
            },
            logoType: 'icon',
            logoIcon: '🦷',
            customLogo: null,
            customIcon: null,
            theme: 'blue'
        },
        
        // BEHANDLUNGEN
        treatments: [
            {
                id: 'prophylaxe',
                category: 'zahnerhaltung',
                name: 'Prophylaxe',
                icon: '🦷',
                iconType: 'emoji',
                untertitel: 'Professionelle Zahnreinigung',
                was: 'Die professionelle Zahnreinigung (PZR) ist eine intensive Reinigung der Zähne, die weit über das normale Zähneputzen hinausgeht.',
                ablauf: [
                    'Gründliche Untersuchung der Mundhöhle',
                    'Entfernung von Zahnstein und Belägen',
                    'Reinigung der Zahnzwischenräume',
                    'Politur der Zahnoberflächen',
                    'Fluoridierung zum Schutz'
                ],
                vorteile: [
                    'Vorbeugung von Karies und Parodontose',
                    'Frischer Atem und sauberes Mundgefühl',
                    'Hellere, glatte Zähne',
                    'Längere Haltbarkeit von Füllungen'
                ],
                dauer: '45-60 Min',
                empfohlen: '2x jährlich',
                active: true
            },
            {
                id: 'fuellungen',
                category: 'zahnerhaltung',
                name: 'Füllungen',
                icon: '🔨',
                iconType: 'emoji',
                untertitel: 'Moderne Füllungstherapie',
                was: 'Hochwertige zahnfarbene Füllungen zur Wiederherstellung der Zahnsubstanz nach Kariesbefall.',
                ablauf: [
                    'Betäubung des betroffenen Bereichs',
                    'Entfernung der Karies',
                    'Desinfektion der Kavität',
                    'Schichtweiser Aufbau der Füllung',
                    'Ausarbeitung und Politur'
                ],
                vorteile: [
                    'Zahnfarbene, unsichtbare Restauration',
                    'Langlebige Materialien',
                    'Minimalinvasive Behandlung',
                    'Sofortige Belastbarkeit'
                ],
                dauer: '30-45 Min',
                empfohlen: 'Bei Bedarf',
                active: true
            },
            {
                id: 'wurzelbehandlung',
                category: 'zahnerhaltung',
                name: 'Wurzelbehandlung',
                icon: '💉',
                iconType: 'emoji',
                untertitel: 'Endodontie mit modernster Technik',
                was: 'Behandlung des entzündeten Zahnnervs zur Erhaltung des natürlichen Zahns.',
                ablauf: [
                    'Röntgenaufnahme zur Diagnose',
                    'Lokale Betäubung',
                    'Eröffnung des Zahns',
                    'Entfernung des entzündeten Gewebes',
                    'Desinfektion und Aufbereitung',
                    'Wurzelfüllung'
                ],
                vorteile: [
                    'Erhalt des natürlichen Zahns',
                    'Schmerzfreiheit',
                    'Vermeidung von Zahnersatz',
                    'Moderne maschinelle Aufbereitung'
                ],
                dauer: '60-90 Min',
                empfohlen: 'Bei Bedarf',
                active: true
            }
        ],
        
        // VIDEOS
        videos: [
            {
                id: 1,
                title: "Professionelle Zahnreinigung - Was erwartet Sie?",
                category: "zahnerhaltung",
                duration: "3:45",
                views: "2.3k",
                url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                active: true
            },
            {
                id: 2,
                title: "Richtig Zähne putzen",
                category: "prophylaxe",
                duration: "2:30",
                views: "5.1k",
                url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                active: true
            }
        ],
        
        // NACHSORGE
        aftercare: [
            {
                id: 1,
                behandlung: "Zahnextraktion",
                kurzbeschreibung: "Nach dem Ziehen eines Zahnes",
                zeitraum: "7-10 Tage",
                icon: '🦷',
                phasen: {
                    phase1: {
                        title: "Direkt nach dem Eingriff",
                        time: "0-2h",
                        items: [
                            "30 Min fest auf Tupfer beißen",
                            "Nicht ausspülen oder spucken",
                            "Kopf hochlagern",
                            "Von außen kühlen (20 Min Intervalle)"
                        ]
                    },
                    phase2: {
                        title: "Erste 24 Stunden",
                        time: "Tag 1",
                        items: [
                            "Keine heißen Getränke oder Speisen",
                            "Nicht rauchen (mind. 48h)",
                            "Kein Alkohol",
                            "Kein Sport oder schwere Arbeit"
                        ]
                    },
                    phase3: {
                        title: "Heilungsphase",
                        time: "Tag 2-7",
                        items: [
                            "Vorsichtige Mundhygiene",
                            "Wundbereich aussparen",
                            "Chlorhexidin-Spülung 2x täglich",
                            "Bei Schmerzen: Ibuprofen 400-600mg"
                        ]
                    }
                },
                warnung: "Starke Blutungen, pochende Schmerzen nach 3 Tagen, Fieber über 38°C",
                active: true
            }
        ],
        
        emergency: {
            nummer: "01805 / 986 700",
            zeiten: "Außerhalb der Öffnungszeiten",
            anweisungen: [
                "Kühlen Sie die betroffene Stelle von außen",
                "Spülen Sie mit lauwarmem Salzwasser",
                "Nehmen Sie bei Bedarf Schmerzmittel (Ibuprofen)",
                "Vermeiden Sie Wärme und körperliche Anstrengung"
            ],
            zahnAus: "Zahn nur an der Krone anfassen, in H-Milch oder Kochsalzlösung legen, sofort zum Zahnarzt!",
            zahnLocker: "Nicht bewegen, weiche Kost, schnellstmöglich zum Zahnarzt"
        }
    },

    // Daten laden - mit Fehlerbehandlung
    load() {
        try {
            const stored = localStorage.getItem('zahngutAppData');
            if (stored) {
                const parsed = JSON.parse(stored);
                // Merge mit Defaults um fehlende Felder zu ergänzen
                return this.mergeDeep(this.defaultData, parsed);
            }
            return this.defaultData;
        } catch (error) {
            console.error('Fehler beim Laden der Daten:', error);
            return this.defaultData;
        }
    },

    // Daten speichern
    save(data) {
        try {
            localStorage.setItem('zahngutAppData', JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Fehler beim Speichern:', error);
            return false;
        }
    },

    // Design anwenden
    applyDesign() {
        const data = this.load();
        if (!data || !data.design || !data.design.colors) {
            console.log('Keine Design-Einstellungen gefunden, verwende Standards');
            return;
        }
        
        const root = document.documentElement;
        const colors = data.design.colors;
        
        // Setze CSS-Variablen
        root.style.setProperty('--primary', colors.primary);
        root.style.setProperty('--primary-dark', colors.primaryDark);
        root.style.setProperty('--accent', colors.accent);
        root.style.setProperty('--secondary', colors.secondary);
        root.style.setProperty('--text-dark', colors.textDark);
        root.style.setProperty('--text-light', colors.textLight);
        root.style.setProperty('--bg-light', colors.bgLight);
        root.style.setProperty('--gradient', `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`);
        
        console.log('Design erfolgreich angewendet');
        return data.design;
    },

    // Deep merge helper
    mergeDeep(target, source) {
        const output = Object.assign({}, target);
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target))
                        Object.assign(output, { [key]: source[key] });
                    else
                        output[key] = this.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    },

    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    },

    // Utility: Nachsorge rendern
    renderNachsorge(container) {
        const data = this.load();
        const nachsorgeItems = data.aftercare.filter(n => n.active !== false);
        
        if (!container) return;
        
        container.innerHTML = nachsorgeItems.map(item => `
            <div class="nachsorge-card" onclick="toggleNachsorge(this)">
                <div class="nachsorge-header">
                    <div class="nachsorge-icon">${item.icon}</div>
                    <div class="nachsorge-info">
                        <h3>${item.behandlung}</h3>
                        <p>${item.kurzbeschreibung}</p>
                    </div>
                    <div class="expand-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M6 9l6 6 6-6" stroke="var(--text-light)" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                </div>
                <div class="nachsorge-content">
                    <div class="timeline">
                        ${Object.values(item.phasen).map(phase => `
                            <div class="timeline-item">
                                <div class="timeline-badge" data-time="${phase.time}"></div>
                                <div class="timeline-content">
                                    <h4>${phase.title}</h4>
                                    <ul>
                                        ${phase.items.map(i => `<li>${i}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    ${item.warnung ? `
                        <div class="warning-box">
                            <strong>⚠️ Sofort melden bei:</strong> ${item.warnung}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
};

// Export für Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZahngutData;
}

// Auto-Initialize wenn DOM bereit
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('ZahngutData initialisiert und bereit');
        // Automatisch Design anwenden wenn auf index.html
        if (window.location.pathname.includes('index.html')) {
            ZahngutData.applyDesign();
        }
    });
}
