import { db } from '../src/supabaseClient.js';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where
} from 'firebase/firestore';

class AdminPanel {
  constructor() {
    this.currentTreatment = null;
    this.currentNews = null;
    this.init();
  }

  async init() {
    this.setupNavigation();
    this.setupForms();
    this.setupModals();
    await this.loadAllData();
  }

  setupNavigation() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });

        const tabId = btn.dataset.tab + '-tab';
        document.getElementById(tabId)?.classList.add('active');
      });
    });

    document.getElementById('previewBtn')?.addEventListener('click', () => {
      window.open('/', '_blank');
    });
  }

  setupForms() {
    document.getElementById('praxisForm')?.addEventListener('submit', (e) => this.savePraxisInfo(e));
    document.getElementById('hoursForm')?.addEventListener('submit', (e) => this.saveOpeningHours(e));
    document.getElementById('emergencyForm')?.addEventListener('submit', (e) => this.saveEmergencyInfo(e));
    document.getElementById('treatmentForm')?.addEventListener('submit', (e) => this.saveTreatment(e));
    document.getElementById('newsForm')?.addEventListener('submit', (e) => this.saveNews(e));
    document.getElementById('videoForm')?.addEventListener('submit', (e) => this.saveVideo(e));
    document.getElementById('aftercareForm')?.addEventListener('submit', (e) => this.saveAftercare(e));

    document.getElementById('addTreatmentBtn')?.addEventListener('click', () => this.openTreatmentModal());
    document.getElementById('addNewsBtn')?.addEventListener('click', () => this.openNewsModal());
    document.getElementById('addVideoBtn')?.addEventListener('click', () => this.openVideoModal());
    document.getElementById('addAftercareBtn')?.addEventListener('click', () => this.openAftercareModal());
    document.getElementById('closeNewsModal')?.addEventListener('click', () => this.closeNewsModal());
    document.getElementById('cancelNewsBtn')?.addEventListener('click', () => this.closeNewsModal());
  }

  setupModals() {
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
          modal.classList.remove('active');
        });
      });
    });
  }

  async loadAllData() {
    await Promise.all([
      this.loadPraxisInfo(),
      this.loadOpeningHours(),
      this.loadTreatments(),
      this.loadEmergencyInfo(),
      this.loadNews(),
      this.loadVideos(),
      this.loadAftercare()
    ]);
  }

  async loadPraxisInfo() {
    try {
      const docRef = doc(db, 'praxis_info', 'main');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById('praxisName').value = data.name || '';
        document.getElementById('praxisSlogan').value = data.slogan || '';
        document.getElementById('praxisTelefon').value = data.telefon || '';
        document.getElementById('praxisNotdienst').value = data.notdienst || '';
        document.getElementById('praxisEmail').value = data.email || '';
        document.getElementById('praxisDoctolib').value = data.doctolib || '';

        if (data.address) {
          document.getElementById('praxisStreet').value = data.address.street || '';
          document.getElementById('praxisZip').value = data.address.zip || '';
          document.getElementById('praxisCity').value = data.address.city || '';
        }
      }
    } catch (error) {
      console.error('Error loading praxis info:', error);
    }
  }

  async savePraxisInfo(e) {
    e.preventDefault();

    const data = {
      name: document.getElementById('praxisName').value,
      slogan: document.getElementById('praxisSlogan').value,
      telefon: document.getElementById('praxisTelefon').value,
      notdienst: document.getElementById('praxisNotdienst').value,
      email: document.getElementById('praxisEmail').value,
      doctolib: document.getElementById('praxisDoctolib').value,
      address: {
        street: document.getElementById('praxisStreet').value,
        zip: document.getElementById('praxisZip').value,
        city: document.getElementById('praxisCity').value
      }
    };

    try {
      await setDoc(doc(db, 'praxis_info', 'main'), data);
      this.showNotification('Erfolgreich gespeichert', 'success');
    } catch (error) {
      console.error('Error saving praxis info:', error);
      this.showNotification('Fehler beim Speichern', 'error');
    }
  }

  async loadOpeningHours() {
    try {
      const q = query(collection(db, 'opening_hours'), orderBy('display_order'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const container = document.getElementById('hoursList');

      if (container && data.length > 0) {
        container.innerHTML = data.map(day => `
          <div class="hours-day">
            <label>${day.day_of_week}</label>
            <input type="time" id="opens_${day.id}" value="${day.opens_at || ''}" ${day.is_closed ? 'disabled' : ''} />
            <span>bis</span>
            <input type="time" id="closes_${day.id}" value="${day.closes_at || ''}" ${day.is_closed ? 'disabled' : ''} />
            <label>
              <input type="checkbox" id="closed_${day.id}" ${day.is_closed ? 'checked' : ''}
                onchange="document.getElementById('opens_${day.id}').disabled = this.checked; document.getElementById('closes_${day.id}').disabled = this.checked;" />
              Geschlossen
            </label>
          </div>
        `).join('');
      }
    } catch (error) {
      console.error('Error loading opening hours:', error);
    }
  }

  async saveOpeningHours(e) {
    e.preventDefault();

    try {
      const q = query(collection(db, 'opening_hours'));
      const querySnapshot = await getDocs(q);

      for (const docSnapshot of querySnapshot.docs) {
        const isClosed = document.getElementById(`closed_${docSnapshot.id}`).checked;
        const opensAt = document.getElementById(`opens_${docSnapshot.id}`).value;
        const closesAt = document.getElementById(`closes_${docSnapshot.id}`).value;

        await updateDoc(doc(db, 'opening_hours', docSnapshot.id), {
          is_closed: isClosed,
          opens_at: isClosed ? null : opensAt,
          closes_at: isClosed ? null : closesAt
        });
      }

      this.showNotification('Öffnungszeiten gespeichert', 'success');
    } catch (error) {
      console.error('Error saving opening hours:', error);
      this.showNotification('Fehler beim Speichern', 'error');
    }
  }

  async loadTreatments() {
    try {
      const q = query(collection(db, 'treatments'), orderBy('created_at'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const container = document.getElementById('treatmentsList');

      if (container) {
        container.innerHTML = data.map(treatment => `
          <div class="item-card">
            <div class="item-info">
              <h4>${treatment.icon} ${treatment.name}</h4>
              <p>${treatment.category} • ${treatment.active ? 'Aktiv' : 'Inaktiv'}</p>
            </div>
            <div class="item-actions">
              <button class="btn-edit" onclick="adminPanel.editTreatment('${treatment.id}')">Bearbeiten</button>
              <button class="btn-delete" onclick="adminPanel.deleteTreatment('${treatment.id}')">Löschen</button>
            </div>
          </div>
        `).join('');
      }
    } catch (error) {
      console.error('Error loading treatments:', error);
    }
  }

  openTreatmentModal(treatment = null) {
    this.currentTreatment = treatment;
    const modal = document.getElementById('treatmentModal');
    const form = document.getElementById('treatmentForm');

    if (treatment) {
      document.getElementById('treatmentModalTitle').textContent = 'Behandlung bearbeiten';
      document.getElementById('treatmentId').value = treatment.id;
      document.getElementById('treatmentName').value = treatment.name;
      document.getElementById('treatmentCategory').value = treatment.category;
      document.getElementById('treatmentIcon').value = treatment.icon;
      document.getElementById('treatmentUntertitel').value = treatment.untertitel;
      document.getElementById('treatmentWas').value = treatment.was;
      document.getElementById('treatmentAblauf').value = Array.isArray(treatment.ablauf) ? treatment.ablauf.join('\n') : '';
      document.getElementById('treatmentVorteile').value = Array.isArray(treatment.vorteile) ? treatment.vorteile.join('\n') : '';
      document.getElementById('treatmentDauer').value = treatment.dauer;
      document.getElementById('treatmentEmpfohlen').value = treatment.empfohlen;
      document.getElementById('treatmentActive').checked = treatment.active;
    } else {
      document.getElementById('treatmentModalTitle').textContent = 'Neue Behandlung';
      form.reset();
      document.getElementById('treatmentActive').checked = true;
    }

    modal.classList.add('active');
  }

  async editTreatment(id) {
    try {
      const docRef = doc(db, 'treatments', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.openTreatmentModal({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error('Error editing treatment:', error);
    }
  }

  async saveTreatment(e) {
    e.preventDefault();

    const id = document.getElementById('treatmentId').value;
    const ablaufText = document.getElementById('treatmentAblauf').value;
    const vorteileText = document.getElementById('treatmentVorteile').value;

    const data = {
      name: document.getElementById('treatmentName').value,
      category: document.getElementById('treatmentCategory').value,
      icon: document.getElementById('treatmentIcon').value,
      untertitel: document.getElementById('treatmentUntertitel').value,
      was: document.getElementById('treatmentWas').value,
      ablauf: ablaufText.split('\n').filter(line => line.trim()),
      vorteile: vorteileText.split('\n').filter(line => line.trim()),
      dauer: document.getElementById('treatmentDauer').value,
      empfohlen: document.getElementById('treatmentEmpfohlen').value,
      active: document.getElementById('treatmentActive').checked,
      created_at: new Date().toISOString()
    };

    try {
      if (id) {
        await updateDoc(doc(db, 'treatments', id), data);
      } else {
        await setDoc(doc(db, 'treatments', Date.now().toString()), data);
      }

      this.showNotification('Behandlung gespeichert', 'success');
      document.getElementById('treatmentModal').classList.remove('active');
      await this.loadTreatments();
    } catch (error) {
      console.error('Error saving treatment:', error);
      this.showNotification('Fehler beim Speichern', 'error');
    }
  }

  async deleteTreatment(id) {
    if (!confirm('Wirklich löschen?')) return;

    try {
      await deleteDoc(doc(db, 'treatments', id));
      this.showNotification('Behandlung gelöscht', 'success');
      await this.loadTreatments();
    } catch (error) {
      console.error('Error deleting treatment:', error);
      this.showNotification('Fehler beim Löschen', 'error');
    }
  }

  async loadEmergencyInfo() {
    try {
      const docRef = doc(db, 'emergency_info', 'main');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById('emergencyNumber').value = data.nummer || '';
        document.getElementById('emergencyZeiten').value = data.zeiten || '';
        document.getElementById('emergencyInstructions').value = Array.isArray(data.anweisungen) ? data.anweisungen.join('\n') : '';
        document.getElementById('emergencyZahnAus').value = data.zahn_aus || '';
        document.getElementById('emergencyZahnLocker').value = data.zahn_locker || '';
      }
    } catch (error) {
      console.error('Error loading emergency info:', error);
    }
  }

  async saveEmergencyInfo(e) {
    e.preventDefault();

    const instructionsText = document.getElementById('emergencyInstructions').value;

    const data = {
      nummer: document.getElementById('emergencyNumber').value,
      zeiten: document.getElementById('emergencyZeiten').value,
      anweisungen: instructionsText.split('\n').filter(line => line.trim()),
      zahn_aus: document.getElementById('emergencyZahnAus').value,
      zahn_locker: document.getElementById('emergencyZahnLocker').value
    };

    try {
      await setDoc(doc(db, 'emergency_info', 'main'), data);
      this.showNotification('Notfall-Informationen gespeichert', 'success');
    } catch (error) {
      console.error('Error saving emergency info:', error);
      this.showNotification('Fehler beim Speichern', 'error');
    }
  }

  showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }

  async loadNews() {
    try {
      const q = query(
        collection(db, 'news'),
        orderBy('display_order', 'desc'),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const list = document.getElementById('newsList');
      if (!list) return;

      list.innerHTML = data.map(news => `
        <div class="item-card">
          <div class="item-header">
            <div>
              <h3>${news.title}</h3>
              <p class="item-meta">
                ${news.created_at ? new Date(news.created_at).toLocaleDateString('de-DE') : 'N/A'}
                ${news.published ? '<span class="status-badge published">Veröffentlicht</span>' : '<span class="status-badge draft">Entwurf</span>'}
              </p>
            </div>
            <div class="item-actions">
              <button class="btn-icon" onclick="adminPanel.editNews('${news.id}')">✏️</button>
              <button class="btn-icon" onclick="adminPanel.deleteNews('${news.id}')">🗑️</button>
            </div>
          </div>
          ${news.image_url ? `<img src="${news.image_url}" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; margin-top: 12px;">` : ''}
          <p style="margin-top: 12px; color: #666;">${news.content.substring(0, 150)}${news.content.length > 150 ? '...' : ''}</p>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error loading news:', error);
    }
  }

  openNewsModal(news = null) {
    this.currentNews = news;
    const modal = document.getElementById('newsModal');
    const title = document.getElementById('newsModalTitle');

    if (news) {
      title.textContent = 'Meldung bearbeiten';
      document.getElementById('newsId').value = news.id;
      document.getElementById('newsTitle').value = news.title;
      document.getElementById('newsContent').value = news.content;
      document.getElementById('newsImageUrl').value = news.image_url || '';
      document.getElementById('newsVideoUrl').value = news.video_url || '';
      document.getElementById('newsDisplayOrder').value = news.display_order;
      document.getElementById('newsPublished').checked = news.published;
    } else {
      title.textContent = 'Neue Meldung erstellen';
      document.getElementById('newsForm').reset();
      document.getElementById('newsId').value = '';
    }

    modal.classList.add('active');
  }

  closeNewsModal() {
    document.getElementById('newsModal').classList.remove('active');
    this.currentNews = null;
  }

  async saveNews(e) {
    e.preventDefault();

    const newsData = {
      title: document.getElementById('newsTitle').value,
      content: document.getElementById('newsContent').value,
      image_url: document.getElementById('newsImageUrl').value || null,
      video_url: document.getElementById('newsVideoUrl').value || null,
      display_order: parseInt(document.getElementById('newsDisplayOrder').value),
      published: document.getElementById('newsPublished').checked,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    const newsId = document.getElementById('newsId').value;

    try {
      if (newsId) {
        await updateDoc(doc(db, 'news', newsId), newsData);
        this.showNotification('Meldung aktualisiert!');
      } else {
        await setDoc(doc(db, 'news', Date.now().toString()), newsData);
        this.showNotification('Meldung erstellt!');
      }

      this.closeNewsModal();
      await this.loadNews();
    } catch (error) {
      console.error('Error saving news:', error);
      this.showNotification('Fehler beim Speichern!', 'error');
    }
  }

  async editNews(id) {
    try {
      const docRef = doc(db, 'news', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.openNewsModal({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error('Error editing news:', error);
    }
  }

  async deleteNews(id) {
    if (!confirm('Meldung wirklich löschen?')) return;

    try {
      await deleteDoc(doc(db, 'news', id));
      this.showNotification('Meldung gelöscht!');
      await this.loadNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      this.showNotification('Fehler beim Löschen!', 'error');
    }
  }

  async loadVideos() {
    try {
      const q = query(collection(db, 'videos'), orderBy('display_order', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const list = document.getElementById('videosList');
      if (!list) return;

      list.innerHTML = data.map(video => `
        <div class="item-card">
          <div class="item-header">
            <div>
              <h3>${video.icon || '🎥'} ${video.title}</h3>
              <p class="item-meta">
                ${video.category || 'Allgemein'}
                ${video.active ? '<span class="status-badge published">Aktiv</span>' : '<span class="status-badge draft">Inaktiv</span>'}
              </p>
            </div>
            <div class="item-actions">
              <button class="btn-icon" onclick="adminPanel.editVideo('${video.id}')">✏️</button>
              <button class="btn-icon" onclick="adminPanel.deleteVideo('${video.id}')">🗑️</button>
            </div>
          </div>
          ${video.thumbnail ? `<img src="${video.thumbnail}" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; margin-top: 12px;">` : ''}
          <p style="margin-top: 12px; color: #666;">${video.description || ''}</p>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  }

  openVideoModal(video = null) {
    const modal = document.getElementById('videoModal');
    const title = document.getElementById('videoModalTitle');

    if (video) {
      title.textContent = 'Video bearbeiten';
      document.getElementById('videoId').value = video.id;
      document.getElementById('videoTitle').value = video.title;
      document.getElementById('videoCategory').value = video.category || 'Allgemein';
      document.getElementById('videoIcon').value = video.icon || '🎥';
      document.getElementById('videoUrl').value = video.url;
      document.getElementById('videoThumbnail').value = video.thumbnail || '';
      document.getElementById('videoDescription').value = video.description || '';
      document.getElementById('videoDuration').value = video.duration || '';
      document.getElementById('videoOrder').value = video.display_order || 0;
      document.getElementById('videoActive').checked = video.active || false;
    } else {
      title.textContent = 'Neues Video';
      document.getElementById('videoForm').reset();
      document.getElementById('videoId').value = '';
      document.getElementById('videoIcon').value = '🎥';
      document.getElementById('videoActive').checked = true;
    }

    modal.classList.add('active');
  }

  async editVideo(id) {
    try {
      const docRef = doc(db, 'videos', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.openVideoModal({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error('Error editing video:', error);
    }
  }

  async saveVideo(e) {
    e.preventDefault();

    let videoUrl = document.getElementById('videoUrl').value.trim();

    if (videoUrl.includes('youtube.com/watch?v=')) {
      const videoId = videoUrl.split('v=')[1]?.split('&')[0];
      videoUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (!videoUrl.includes('embed') && !videoUrl.includes('http')) {
      videoUrl = `https://www.youtube.com/embed/${videoUrl}`;
    }

    let thumbnail = document.getElementById('videoThumbnail').value.trim();
    if (!thumbnail && videoUrl.includes('youtube.com/embed/')) {
      const videoId = videoUrl.split('embed/')[1]?.split('?')[0];
      thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    const videoData = {
      title: document.getElementById('videoTitle').value,
      category: document.getElementById('videoCategory').value,
      icon: document.getElementById('videoIcon').value,
      url: videoUrl,
      thumbnail: thumbnail,
      description: document.getElementById('videoDescription').value,
      duration: document.getElementById('videoDuration').value || null,
      display_order: parseInt(document.getElementById('videoOrder').value) || 0,
      active: document.getElementById('videoActive').checked,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    const videoId = document.getElementById('videoId').value;

    try {
      if (videoId) {
        await updateDoc(doc(db, 'videos', videoId), videoData);
        this.showNotification('Video aktualisiert!');
      } else {
        await setDoc(doc(db, 'videos', Date.now().toString()), videoData);
        this.showNotification('Video erstellt!');
      }

      document.getElementById('videoModal').classList.remove('active');
      await this.loadVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      this.showNotification('Fehler beim Speichern!', 'error');
    }
  }

  async deleteVideo(id) {
    if (!confirm('Video wirklich löschen?')) return;

    try {
      await deleteDoc(doc(db, 'videos', id));
      this.showNotification('Video gelöscht!');
      await this.loadVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      this.showNotification('Fehler beim Löschen!', 'error');
    }
  }

  async loadAftercare() {
    try {
      const q = query(collection(db, 'aftercare'), orderBy('display_order', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const list = document.getElementById('aftercareList');
      if (!list) return;

      list.innerHTML = data.map(aftercare => `
        <div class="item-card">
          <div class="item-header">
            <div>
              <h3>${aftercare.icon || '📝'} ${aftercare.behandlung}</h3>
              <p class="item-meta">
                ${aftercare.time || aftercare.zeitraum || ''}
                ${aftercare.active ? '<span class="status-badge published">Aktiv</span>' : '<span class="status-badge draft">Inaktiv</span>'}
              </p>
            </div>
            <div class="item-actions">
              <button class="btn-icon" onclick="adminPanel.editAftercare('${aftercare.id}')">✏️</button>
              <button class="btn-icon" onclick="adminPanel.deleteAftercare('${aftercare.id}')">🗑️</button>
            </div>
          </div>
          <p style="margin-top: 12px; color: #666;">${aftercare.kurzbeschreibung || ''}</p>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error loading aftercare:', error);
    }
  }

  openAftercareModal(aftercare = null) {
    const modal = document.getElementById('aftercareModal');
    const title = document.getElementById('aftercareModalTitle');

    if (aftercare) {
      title.textContent = 'Nachsorge bearbeiten';
      document.getElementById('aftercareId').value = aftercare.id;
      document.getElementById('aftercareName').value = aftercare.behandlung;
      document.getElementById('aftercareIcon').value = aftercare.icon || '📝';
      document.getElementById('aftercareTime').value = aftercare.time || aftercare.zeitraum || '';
      document.getElementById('aftercareDescription').value = aftercare.kurzbeschreibung || '';

      const warnings = aftercare.warnsignale || aftercare.warnung || [];
      document.getElementById('aftercareWarnings').value = Array.isArray(warnings)
        ? warnings.join('\n')
        : (typeof warnings === 'string' ? warnings : '');

      const phasen = aftercare.phasen || [];
      document.getElementById('aftercarePhases').value = JSON.stringify(phasen, null, 2);
      document.getElementById('aftercareOrder').value = aftercare.display_order || 0;
      document.getElementById('aftercareActive').checked = aftercare.active || false;
    } else {
      title.textContent = 'Neue Nachsorge';
      document.getElementById('aftercareForm').reset();
      document.getElementById('aftercareId').value = '';
      document.getElementById('aftercareIcon').value = '📝';
      document.getElementById('aftercareActive').checked = true;
      document.getElementById('aftercarePhases').value = '[]';
    }

    modal.classList.add('active');
  }

  async editAftercare(id) {
    try {
      const docRef = doc(db, 'aftercare', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.openAftercareModal({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error('Error editing aftercare:', error);
    }
  }

  async saveAftercare(e) {
    e.preventDefault();

    const warningsText = document.getElementById('aftercareWarnings').value;
    const phasesText = document.getElementById('aftercarePhases').value;

    let phasen = [];
    try {
      phasen = JSON.parse(phasesText);
    } catch (err) {
      this.showNotification('Fehler im Phasen-JSON Format!', 'error');
      return;
    }

    const aftercareData = {
      behandlung: document.getElementById('aftercareName').value,
      icon: document.getElementById('aftercareIcon').value,
      time: document.getElementById('aftercareTime').value,
      zeitraum: document.getElementById('aftercareTime').value,
      kurzbeschreibung: document.getElementById('aftercareDescription').value,
      warnsignale: warningsText.split('\n').filter(line => line.trim()),
      warnung: warningsText.split('\n').filter(line => line.trim()),
      phasen: phasen,
      display_order: parseInt(document.getElementById('aftercareOrder').value) || 0,
      active: document.getElementById('aftercareActive').checked,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    const aftercareId = document.getElementById('aftercareId').value;

    try {
      if (aftercareId) {
        await updateDoc(doc(db, 'aftercare', aftercareId), aftercareData);
        this.showNotification('Nachsorge aktualisiert!');
      } else {
        await setDoc(doc(db, 'aftercare', Date.now().toString()), aftercareData);
        this.showNotification('Nachsorge erstellt!');
      }

      document.getElementById('aftercareModal').classList.remove('active');
      await this.loadAftercare();
    } catch (error) {
      console.error('Error saving aftercare:', error);
      this.showNotification('Fehler beim Speichern!', 'error');
    }
  }

  async deleteAftercare(id) {
    if (!confirm('Nachsorge wirklich löschen?')) return;

    try {
      await deleteDoc(doc(db, 'aftercare', id));
      this.showNotification('Nachsorge gelöscht!');
      await this.loadAftercare();
    } catch (error) {
      console.error('Error deleting aftercare:', error);
      this.showNotification('Fehler beim Löschen!', 'error');
    }
  }
}

window.adminPanel = new AdminPanel();
