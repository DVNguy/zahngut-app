import { dataService } from './dataService.js';

class ZahngutApp {
  constructor() {
    this.currentSection = 'home';
    this.treatments = [];
    this.videos = [];
    this.aftercare = [];
    this.news = [];
    this.subscriptions = [];
    this.init();
  }

  async init() {
    this.showLoading();
    await this.loadAllData();
    this.setupNavigation();
    this.setupModals();
    this.setupRealTimeUpdates();
    this.checkOnlineStatus();
    this.hideLoading();
  }

  showLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.classList.remove('hidden');
    }
  }

  hideLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
      }, 500);
    }
  }

  async loadAllData() {
    try {
      const [praxisInfo, openingHours, treatments, videos, aftercare, designSettings, emergencyInfo, news] = await Promise.all([
        dataService.getPraxisInfo(),
        dataService.getOpeningHours(),
        dataService.getTreatments(),
        dataService.getVideos(),
        dataService.getAftercare(),
        dataService.getDesignSettings(),
        dataService.getEmergencyInfo(),
        dataService.getNews()
      ]);

      this.treatments = treatments;
      this.videos = videos;
      this.aftercare = aftercare;
      this.news = news;

      this.renderPraxisInfo(praxisInfo);
      this.renderOpeningHours(openingHours);
      this.renderTreatments(treatments);
      this.renderVideos(videos);
      this.renderAftercare(aftercare);
      this.applyDesignSettings(designSettings);
      this.renderEmergencyInfo(emergencyInfo);
      this.renderNews(news);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  renderPraxisInfo(info) {
    if (!info) return;

    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) heroTitle.textContent = `Willkommen bei ${info.name}`;

    const heroSubtitle = document.getElementById('heroSubtitle');
    if (heroSubtitle) heroSubtitle.textContent = info.slogan;

    const logoText = document.getElementById('logoText');
    if (logoText) logoText.textContent = info.name.split(' ')[0];

    const contactInfo = document.getElementById('contactInfo');
    if (contactInfo && info) {
      const telClean = info.telefon.replace(/\s+/g, '');
      contactInfo.innerHTML = `
        <a href="tel:${telClean}" class="primary-btn">
          <span>📞</span>
          <span>${info.telefon}</span>
        </a>
        <a href="mailto:${info.email}" class="primary-btn">
          <span>📧</span>
          <span>${info.email}</span>
        </a>
        <a href="${info.doctolib}" target="_blank" rel="noopener noreferrer" class="primary-btn">
          <span>📅</span>
          <span>Online Termin buchen</span>
        </a>
      `;
    }

    const addressInfo = document.getElementById('addressInfo');
    if (addressInfo && info.address) {
      const addr = info.address;
      addressInfo.innerHTML = `
        ${addr.street}<br>
        ${addr.zip} ${addr.city}
      `;
    }

    const mapContainer = document.getElementById('mapContainer');
    if (mapContainer && info.address) {
      const addr = info.address;
      const address = `${addr.street}, ${addr.zip} ${addr.city}`;
      const encodedAddress = encodeURIComponent(address);
      mapContainer.innerHTML = `
        <a href="https://www.google.com/maps?q=${encodedAddress}"
           target="_blank"
           rel="noopener noreferrer"
           class="map-link">
          <div class="map-placeholder">
            <div class="map-icon">📍</div>
            <div class="map-text">
              <strong>Route planen</strong>
              <span>In Google Maps öffnen</span>
            </div>
          </div>
        </a>
      `;
    }
  }

  renderOpeningHours(hours) {
    const container = document.getElementById('openingHours');
    if (!container) return;

    container.innerHTML = hours.map(day => `
      <div class="hours-row">
        <span class="day-name">${day.day_of_week}</span>
        <span class="hours-time ${day.is_closed ? 'closed' : ''}">
          ${day.is_closed ? 'Geschlossen' : `${day.opens_at?.substring(0, 5)} - ${day.closes_at?.substring(0, 5)}`}
        </span>
      </div>
    `).join('');
  }

  renderTreatments(treatments) {
    const grid = document.getElementById('treatmentGrid');
    if (!grid) return;

    grid.innerHTML = treatments.map(treatment => `
      <div class="treatment-card" data-id="${treatment.id}">
        <div class="treatment-header">
          <div class="treatment-icon">${treatment.icon}</div>
          <div class="treatment-info">
            <h3>${treatment.name}</h3>
            <span class="treatment-category">${treatment.category}</span>
          </div>
        </div>
        <p class="treatment-untertitel">${treatment.untertitel}</p>
        <div class="treatment-footer">
          <span>⏱️ ${treatment.dauer}</span>
          <span>→ Details</span>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.treatment-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const treatment = treatments.find(t => t.id === id);
        if (treatment) {
          this.showTreatmentDetail(treatment);
        }
      });
    });
  }

  renderVideos(videos) {
    const grid = document.getElementById('videoGrid');
    if (!grid) return;

    grid.innerHTML = videos.map(video => `
      <div class="video-card" data-url="${video.url}">
        <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail" />
        <div class="video-info">
          <h3>${video.title}</h3>
          <div class="video-meta">
            <span>📁 ${video.category}</span>
            <span>⏱️ ${video.duration}</span>
            ${video.views ? `<span>👁️ ${video.views}</span>` : ''}
          </div>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('click', () => {
        const url = card.dataset.url;
        this.showVideoPlayer(url);
      });
    });
  }

  renderNews(news) {
    const grid = document.getElementById('newsGrid');
    if (!grid) return;

    if (!news || news.length === 0) {
      grid.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px;">Noch keine Neuigkeiten vorhanden.</p>';
      return;
    }

    grid.innerHTML = news.map(post => {
      const date = new Date(post.created_at).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      return `
        <div class="news-card">
          ${post.image_url ? `
            <div class="news-image">
              <img src="${post.image_url}" alt="${post.title}" />
            </div>
          ` : ''}
          ${post.video_url ? `
            <div class="news-video">
              <video controls>
                <source src="${post.video_url}" type="video/mp4">
              </video>
            </div>
          ` : ''}
          <div class="news-content">
            <div class="news-date">${date}</div>
            <h3>${post.title}</h3>
            <p>${post.content}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  renderAftercare(aftercareList) {
    const container = document.getElementById('aftercareList');
    if (!container) return;

    container.innerHTML = aftercareList.map((aftercare, index) => {
      const phasen = Array.isArray(aftercare.phasen) ? aftercare.phasen : [];
      let warnsignale = aftercare.warnsignale || aftercare.warnung || [];
      if (!Array.isArray(warnsignale)) {
        warnsignale = typeof warnsignale === 'string' ? [warnsignale] : [];
      }

      return `
        <div class="aftercare-card" data-index="${index}">
          <div class="aftercare-header">
            <div class="aftercare-title-section">
              <div class="aftercare-icon">${aftercare.icon}</div>
              <div class="aftercare-title">
                <h3>${aftercare.behandlung}</h3>
                <p class="aftercare-period">${aftercare.time || aftercare.zeitraum || ''}</p>
              </div>
            </div>
            <div class="expand-icon">▼</div>
          </div>
          <div class="aftercare-content">
            <div class="aftercare-description">${aftercare.kurzbeschreibung}</div>
            <div class="timeline">
              ${Array.isArray(phasen) ? phasen.map(phase => {
                const items = Array.isArray(phase.items) ? phase.items : [];
                return `
                  <div class="phase">
                    <div class="phase-marker"></div>
                    <div class="phase-header">
                      <span class="phase-title">${phase.title || ''}</span>
                      <span class="phase-time">${phase.time || ''}</span>
                    </div>
                    <ul class="phase-items">
                      ${items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                  </div>
                `;
              }).join('') : ''}
            </div>
            ${warnsignale && warnsignale.length > 0 ? `
              <div class="warning-symptoms">
                <h4>⚠️ Sofort Praxis kontaktieren bei:</h4>
                <ul>
                  ${warnsignale.map(w => `<li>${w}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.aftercare-card').forEach(card => {
      const header = card.querySelector('.aftercare-header');
      header.addEventListener('click', () => {
        card.classList.toggle('expanded');
      });
    });
  }

  applyDesignSettings(settings) {
    if (!settings) return;

    if (settings.logo_icon) {
      const logoIcon = document.getElementById('logoIcon');
      if (logoIcon) {
        logoIcon.textContent = settings.logo_icon;
      }
    }

    if (settings.colors) {
      const root = document.documentElement;
      Object.keys(settings.colors).forEach(key => {
        const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        root.style.setProperty(`--${cssVarName}`, settings.colors[key]);
      });
    }
  }

  renderEmergencyInfo(info) {
    if (!info) return;

    const emergencyNumber = document.getElementById('emergencyNumber');
    if (emergencyNumber) {
      emergencyNumber.href = `tel:${info.nummer}`;
      emergencyNumber.textContent = info.nummer;
    }

    const emergencyTime = document.getElementById('emergencyTime');
    if (emergencyTime) {
      emergencyTime.textContent = info.zeiten;
    }

    const instructionsList = document.getElementById('emergencyInstructions');
    if (instructionsList && info.anweisungen) {
      instructionsList.innerHTML = info.anweisungen.map(instruction => `
        <li>${instruction}</li>
      `).join('');
    }

    const toothOut = document.getElementById('toothOut');
    if (toothOut && info.zahn_aus) {
      toothOut.querySelector('p').textContent = info.zahn_aus;
    }

    const toothLoose = document.getElementById('toothLoose');
    if (toothLoose && info.zahn_locker) {
      toothLoose.querySelector('p').textContent = info.zahn_locker;
    }
  }

  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const categoryCards = document.querySelectorAll('.category-card[data-nav]');
    const emergencyBtn = document.getElementById('emergencyBtn');
    const backBtn = document.getElementById('backBtn');
    const logoBtn = document.getElementById('logoBtn');

    const navigate = (sectionName) => {
      document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
      });

      const targetSection = document.getElementById(`${sectionName}Section`);
      if (targetSection) {
        targetSection.classList.add('active');
      }

      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionName) {
          item.classList.add('active');
        }
      });

      this.currentSection = sectionName;
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (backBtn) {
        if (sectionName === 'home') {
          backBtn.style.display = 'none';
        } else {
          backBtn.style.display = 'flex';
        }
      }
    };

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navigate(item.dataset.section);
      });
    });

    categoryCards.forEach(card => {
      card.addEventListener('click', () => {
        navigate(card.dataset.nav);
      });
    });

    if (emergencyBtn) {
      emergencyBtn.addEventListener('click', () => {
        navigate('emergency');
      });
    }

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        navigate('home');
      });
    }

    if (logoBtn) {
      logoBtn.addEventListener('click', () => {
        navigate('home');
      });
    }

    const treatmentFilters = document.querySelectorAll('#treatmentFilters .filter-chip');
    treatmentFilters.forEach(chip => {
      chip.addEventListener('click', () => {
        treatmentFilters.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const category = chip.dataset.category;
        this.filterTreatments(category);
      });
    });
  }

  filterTreatments(category) {
    const filtered = category === 'all'
      ? this.treatments
      : this.treatments.filter(t => t.category === category);
    this.renderTreatments(filtered);
  }

  setupModals() {
    const treatmentModal = document.getElementById('treatmentModal');
    const videoModal = document.getElementById('videoModal');
    const modalClose = document.getElementById('modalClose');
    const videoModalClose = document.getElementById('videoModalClose');

    if (modalClose) {
      modalClose.addEventListener('click', () => {
        treatmentModal.classList.remove('active');
      });
    }

    if (videoModalClose) {
      videoModalClose.addEventListener('click', () => {
        videoModal.classList.remove('active');
        const videoPlayer = document.getElementById('videoPlayer');
        if (videoPlayer) {
          videoPlayer.innerHTML = '';
        }
      });
    }

    [treatmentModal, videoModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.remove('active');
            const videoPlayer = document.getElementById('videoPlayer');
            if (videoPlayer) {
              videoPlayer.innerHTML = '';
            }
          }
        });
      }
    });
  }

  showTreatmentDetail(treatment) {
    const modal = document.getElementById('treatmentModal');
    const detail = document.getElementById('treatmentDetail');

    if (!modal || !detail) return;

    const ablauf = Array.isArray(treatment.ablauf) ? treatment.ablauf : [];
    const vorteile = Array.isArray(treatment.vorteile) ? treatment.vorteile : [];

    detail.innerHTML = `
      <div class="treatment-detail">
        <div class="treatment-detail-icon">${treatment.icon}</div>
        <h2>${treatment.name}</h2>
        <p class="treatment-detail-subtitle">${treatment.untertitel}</p>

        <div class="treatment-detail-section">
          <h3>💡 Was ist das?</h3>
          <p>${treatment.was}</p>
        </div>

        ${ablauf.length > 0 ? `
          <div class="treatment-detail-section">
            <h3>📋 Ablauf</h3>
            <ol class="treatment-steps">
              ${ablauf.map(step => `<li>${step}</li>`).join('')}
            </ol>
          </div>
        ` : ''}

        ${vorteile.length > 0 ? `
          <div class="treatment-detail-section">
            <h3>✨ Vorteile</h3>
            <ul class="treatment-benefits">
              ${vorteile.map(vorteil => `<li>${vorteil}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="treatment-meta">
          <div class="meta-item">
            <div class="meta-label">Dauer</div>
            <div class="meta-value">${treatment.dauer}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Empfehlung</div>
            <div class="meta-value">${treatment.empfohlen}</div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  showVideoPlayer(url) {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoPlayer');

    if (!modal || !player) return;

    const videoId = this.extractYouTubeId(url);
    if (videoId) {
      player.innerHTML = `
        <div class="video-player-wrapper">
          <iframe
            src="https://www.youtube.com/embed/${videoId}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      `;
      modal.classList.add('active');
    }
  }

  extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  setupRealTimeUpdates() {
    const tables = ['praxis_info', 'opening_hours', 'treatments', 'videos', 'aftercare', 'design_settings', 'emergency_info'];

    tables.forEach(table => {
      const channel = dataService.subscribeToTable(table, async () => {
        await this.loadAllData();
      });
      this.subscriptions.push(channel);
    });
  }

  checkOnlineStatus() {
    const indicator = document.getElementById('offlineIndicator');
    if (!indicator) return;

    const updateOnlineStatus = () => {
      if (navigator.onLine) {
        indicator.classList.remove('active');
      } else {
        indicator.classList.add('active');
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ZahngutApp();
});
