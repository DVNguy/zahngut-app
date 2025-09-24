// Design-Funktionen für Zahngut Admin Panel - VERBESSERTE VERSION

// Aktuelle Einstellungen
let currentIcon = '🦷';
let currentLogoType = 'icon';
let currentColors = {
    primary: '#2563EB',
    accent: '#7C3AED'
};

// Farb-Presets
const colorPresets = {
    blue: { primary: '#2563EB', accent: '#7C3AED' },
    green: { primary: '#059669', accent: '#10B981' },
    teal: { primary: '#0891B2', accent: '#06B6D4' },
    purple: { primary: '#9333EA', accent: '#C084FC' },
    red: { primary: '#DC2626', accent: '#F87171' },
    orange: { primary: '#EA580C', accent: '#FB923C' },
    pink: { primary: '#EC4899', accent: '#F9A8D4' },
    indigo: { primary: '#6366F1', accent: '#818CF8' }
};

// Farbschema anwenden
function applyColorPreset(preset) {
    if (colorPresets[preset]) {
        const colors = colorPresets[preset];
        document.getElementById('colorPrimary').value = colors.primary;
        document.getElementById('colorPrimaryHex').value = colors.primary;
        document.getElementById('colorAccent').value = colors.accent;
        document.getElementById('colorAccentHex').value = colors.accent;
        currentColors = colors;
        
        // Live-Vorschau
        updateLivePreview();
    }
}

// Logo-Typ ändern
function updateLogoType(type) {
    currentLogoType = type;
    const iconSection = document.getElementById('iconSelection');
    const logoSection = document.getElementById('logoUploadSection');
    
    if (type === 'icon') {
        iconSection.style.display = 'block';
        logoSection.style.display = 'none';
    } else {
        iconSection.style.display = 'none';
        logoSection.style.display = 'block';
    }
}

// Icon auswählen
function selectIcon(icon, element) {
    // Entferne aktive Klasse von allen Icons
    document.querySelectorAll('.icon-option').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Setze aktive Klasse
    if (element) {
        element.classList.add('active');
    }
    
    // Custom Icon Upload zeigen/verstecken
    const customUpload = document.getElementById('customIconUpload');
    if (icon === 'custom') {
        customUpload.style.display = 'block';
    } else {
        customUpload.style.display = 'none';
        currentIcon = icon;
    }
    
    updateLivePreview();
}

// Icon Upload Handler
function handleIconUpload(event) {
    const file = event.target.files[0];
    if (file) {
        // Prüfe Dateigröße
        if (file.size > 500000) { // 500KB
            alert('Das Icon ist zu groß. Bitte wählen Sie eine Datei unter 500 KB.');
            return;
        }
        
        // Prüfe Dateityp
        if (!file.type.match(/image\/(png|svg\+xml|jpeg)/)) {
            alert('Bitte laden Sie nur PNG, SVG oder JPEG Dateien hoch.');
            return;
        }
        
        // Lese Datei
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('iconPreview');
            preview.innerHTML = `
                <img src="${e.target.result}" style="width: 64px; height: 64px; object-fit: contain;">
                <p style="color: var(--success); margin-top: 10px;">✓ Icon erfolgreich hochgeladen</p>
            `;
            
            // Speichere Icon direkt im currentIcon
            currentIcon = 'custom';
            
            // Stelle sicher, dass appData existiert
            if (typeof appData === 'undefined') {
                window.appData = { design: {} };
            }
            if (!appData.design) {
                appData.design = {};
            }
            appData.design.customIcon = e.target.result;
            appData.design.logoIcon = 'custom';
            
            console.log('Icon uploaded and saved');
        };
        reader.readAsDataURL(file);
    }
}

// Logo Upload Handler
function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        // Prüfe Dateigröße
        if (file.size > 1000000) { // 1MB
            alert('Das Logo ist zu groß. Bitte wählen Sie eine Datei unter 1 MB.');
            return;
        }
        
        // Prüfe Dateityp
        if (!file.type.match(/image\/(png|svg\+xml|jpeg)/)) {
            alert('Bitte laden Sie nur PNG, SVG oder JPEG Dateien hoch.');
            return;
        }
        
        // Lese Datei
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('logoPreview');
            preview.innerHTML = `
                <img src="${e.target.result}" style="max-width: 200px; max-height: 80px; object-fit: contain;">
                <p style="color: var(--success); margin-top: 10px;">✓ Logo erfolgreich hochgeladen</p>
            `;
            
            // Stelle sicher, dass appData existiert
            if (typeof appData === 'undefined') {
                window.appData = { design: {} };
            }
            if (!appData.design) {
                appData.design = {};
            }
            appData.design.customLogo = e.target.result;
            appData.design.logoType = 'upload';
            
            console.log('Logo uploaded and saved');
        };
        reader.readAsDataURL(file);
    }
}

// Live-Vorschau aktualisieren
function updateLivePreview() {
    console.log('Design-Update:', {
        logoType: currentLogoType,
        icon: currentIcon,
        colors: currentColors
    });
}

// Design-Einstellungen speichern - VERBESSERTE VERSION
function saveDesignSettings() {
    // Stelle sicher, dass appData existiert
    if (typeof appData === 'undefined' || !appData) {
        console.error('appData ist nicht definiert, lade Daten...');
        // Versuche Daten zu laden
        const stored = localStorage.getItem('zahngutAppData');
        if (stored) {
            window.appData = JSON.parse(stored);
        } else {
            window.appData = {
                praxis: {},
                oeffnungszeiten: {},
                treatments: [],
                videos: [],
                aftercare: [],
                design: {}
            };
        }
    }
    
    // Erstelle Design-Objekt wenn nicht vorhanden
    if (!appData.design) {
        appData.design = {};
    }
    
    // Hole die aktuellen Farbwerte aus den Inputs
    const primaryColor = document.getElementById('colorPrimary').value;
    const accentColor = document.getElementById('colorAccent').value;
    
    // Speichere Farben
    appData.design.colors = {
        primary: primaryColor,
        primaryDark: darkenColor(primaryColor, 20),
        accent: accentColor,
        secondary: lightenColor(primaryColor, 20),
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        textDark: '#0F172A',
        textLight: '#64748B',
        bgLight: '#F8FAFC',
        white: '#FFFFFF'
    };
    
    // Speichere Logo-Einstellungen
    appData.design.logoType = currentLogoType;
    appData.design.logoIcon = currentIcon;
    
    // WICHTIG: Speichere in localStorage
    localStorage.setItem('zahngutAppData', JSON.stringify(appData));
    
    console.log('Design gespeichert:', appData.design);
    
    // Zeige Erfolgsmeldung
    showSuccess('Design-Einstellungen gespeichert!');
    
    // Öffne Vorschau in neuem Tab um Änderungen zu sehen
    setTimeout(() => {
        if (confirm('Möchten Sie die Änderungen in der App-Vorschau ansehen?')) {
            window.open('index.html', '_blank');
        }
    }, 500);
}

// Farbe abdunkeln
function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return "#" + ((R << 16) | (G << 8) | B).toString(16).padStart(6, '0');
}

// Farbe aufhellen
function lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return "#" + ((R << 16) | (G << 8) | B).toString(16).padStart(6, '0');
}

// Design-Vorschau
function previewDesign() {
    // Speichere zuerst die Einstellungen
    saveDesignSettings();
}

// Design zurücksetzen
function resetDesign() {
    if (confirm('Möchten Sie alle Design-Einstellungen auf die Standardwerte zurücksetzen?')) {
        // Reset zu Standardwerten
        document.getElementById('colorPrimary').value = '#2563EB';
        document.getElementById('colorPrimaryHex').value = '#2563EB';
        document.getElementById('colorAccent').value = '#7C3AED';
        document.getElementById('colorAccentHex').value = '#7C3AED';
        
        currentColors = {
            primary: '#2563EB',
            accent: '#7C3AED'
        };
        
        // Reset Logo
        const iconRadio = document.querySelector('input[name="logoType"][value="icon"]');
        if (iconRadio) {
            iconRadio.checked = true;
            updateLogoType('icon');
        }
        
        // Reset Icon
        currentIcon = '🦷';
        const firstIconOption = document.querySelector('.icon-option');
        if (firstIconOption) {
            selectIcon('🦷', firstIconOption);
        }
        
        // Reset in appData
        if (appData && appData.design) {
            appData.design = {
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
                customIcon: null,
                customLogo: null
            };
            
            // Speichere Reset
            localStorage.setItem('zahngutAppData', JSON.stringify(appData));
        }
        
        showSuccess('Design wurde zurückgesetzt!');
    }
}

// Farb-Input Synchronisation
document.addEventListener('DOMContentLoaded', function() {
    // Synchronisiere Color Picker mit Hex Input
    const colorPrimary = document.getElementById('colorPrimary');
    const colorPrimaryHex = document.getElementById('colorPrimaryHex');
    const colorAccent = document.getElementById('colorAccent');
    const colorAccentHex = document.getElementById('colorAccentHex');
    
    if (colorPrimary && colorPrimaryHex) {
        colorPrimary.addEventListener('input', function() {
            colorPrimaryHex.value = this.value;
            currentColors.primary = this.value;
            updateLivePreview();
        });
        
        colorPrimaryHex.addEventListener('input', function() {
            if (/^#[0-9A-F]{6}$/i.test(this.value)) {
                colorPrimary.value = this.value;
                currentColors.primary = this.value;
                updateLivePreview();
            }
        });
    }
    
    if (colorAccent && colorAccentHex) {
        colorAccent.addEventListener('input', function() {
            colorAccentHex.value = this.value;
            currentColors.accent = this.value;
            updateLivePreview();
        });
        
        colorAccentHex.addEventListener('input', function() {
            if (/^#[0-9A-F]{6}$/i.test(this.value)) {
                colorAccent.value = this.value;
                currentColors.accent = this.value;
                updateLivePreview();
            }
        });
    }
    
    // Lade gespeicherte Design-Einstellungen
    loadDesignSettings();
});

// Lade Design-Einstellungen beim Start - VERBESSERTE VERSION
function loadDesignSettings() {
    // Lade Daten aus localStorage
    const stored = localStorage.getItem('zahngutAppData');
    if (stored) {
        try {
            const data = JSON.parse(stored);
            if (data.design) {
                console.log('Lade Design-Einstellungen:', data.design);
                
                // Setze Farben
                if (data.design.colors) {
                    const colorPrimary = document.getElementById('colorPrimary');
                    const colorPrimaryHex = document.getElementById('colorPrimaryHex');
                    const colorAccent = document.getElementById('colorAccent');
                    const colorAccentHex = document.getElementById('colorAccentHex');
                    
                    if (colorPrimary && colorPrimaryHex) {
                        colorPrimary.value = data.design.colors.primary || '#2563EB';
                        colorPrimaryHex.value = data.design.colors.primary || '#2563EB';
                    }
                    
                    if (colorAccent && colorAccentHex) {
                        colorAccent.value = data.design.colors.accent || '#7C3AED';
                        colorAccentHex.value = data.design.colors.accent || '#7C3AED';
                    }
                    
                    currentColors = {
                        primary: data.design.colors.primary || '#2563EB',
                        accent: data.design.colors.accent || '#7C3AED'
                    };
                }
                
                // Setze Logo-Typ
                if (data.design.logoType) {
                    currentLogoType = data.design.logoType;
                    const logoRadio = document.querySelector(`input[name="logoType"][value="${data.design.logoType}"]`);
                    if (logoRadio) {
                        logoRadio.checked = true;
                        updateLogoType(data.design.logoType);
                    }
                }
                
                // Setze Icon
                if (data.design.logoIcon) {
                    currentIcon = data.design.logoIcon;
                    const iconButtons = document.querySelectorAll('.icon-option');
                    iconButtons.forEach(btn => {
                        const iconText = btn.querySelector('.icon-preview');
                        if (iconText && iconText.textContent === data.design.logoIcon) {
                            selectIcon(data.design.logoIcon, btn);
                        }
                    });
                }
                
                // Zeige hochgeladene Bilder
                if (data.design.customIcon) {
                    const preview = document.getElementById('iconPreview');
                    if (preview) {
                        preview.innerHTML = `
                            <img src="${data.design.customIcon}" style="width: 64px; height: 64px; object-fit: contain;">
                            <p style="color: var(--success); margin-top: 10px;">✓ Gespeichertes Icon</p>
                        `;
                    }
                }
                
                if (data.design.customLogo) {
                    const preview = document.getElementById('logoPreview');
                    if (preview) {
                        preview.innerHTML = `
                            <img src="${data.design.customLogo}" style="max-width: 200px; max-height: 80px; object-fit: contain;">
                            <p style="color: var(--success); margin-top: 10px;">✓ Gespeichertes Logo</p>
                        `;
                    }
                }
            }
        } catch (error) {
            console.error('Fehler beim Laden der Design-Einstellungen:', error);
        }
    }
}

// Helper-Funktion für Success-Messages (falls nicht vorhanden)
function showSuccess(message) {
    const msg = document.getElementById('successMessage');
    if (msg) {
        msg.textContent = '✅ ' + message;
        msg.style.display = 'block';
        setTimeout(() => {
            msg.style.display = 'none';
        }, 3000);
    } else {
        console.log('Success:', message);
    }
}
