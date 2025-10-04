import { supabase } from '../src/supabaseClient.js';

class AdminPanel {
  constructor() {
    this.currentTreatment = null;
    this.currentNews = null;
    this.init();
  }

  async init() {
    await this.checkAuth();
    this.setupNavigation();
    this.setupForms();
    this.setupModals();
    await this.loadAllData();
  }

  async checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = '/admin-login.html';
      return;
    }
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

    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.location.href = '/admin-login.html';
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

    document.getElementById('addTreatmentBtn')?.addEventListener('click', () => this.openTreatmentModal());
    document.getElementById('addNewsBtn')?.addEventListener('click', () => this.openNewsModal());
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
      this.loadNews()
    ]);
  }

  async loadPraxisInfo() {
    const { data } = await supabase.from('praxis_info').select('*').maybeSingle();
    if (data) {
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

    const { error } = await supabase.from('praxis_info').upsert(data);

    if (error) {
      this.showNotification('Fehler beim Speichern', 'error');
    } else {
      this.showNotification('Erfolgreich gespeichert', 'success');
    }
  }

  async loadOpeningHours() {
    const { data } = await supabase.from('opening_hours').select('*').order('display_order');
    const container = document.getElementById('hoursList');

    if (container && data) {
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
  }

  async saveOpeningHours(e) {
    e.preventDefault();

    const { data: hours } = await supabase.from('opening_hours').select('*');

    for (const day of hours) {
      const isClosed = document.getElementById(`closed_${day.id}`).checked;
      const opensAt = document.getElementById(`opens_${day.id}`).value;
      const closesAt = document.getElementById(`closes_${day.id}`).value;

      await supabase.from('opening_hours').update({
        is_closed: isClosed,
        opens_at: isClosed ? null : opensAt,
        closes_at: isClosed ? null : closesAt
      }).eq('id', day.id);
    }

    this.showNotification('Öffnungszeiten gespeichert', 'success');
  }

  async loadTreatments() {
    const { data } = await supabase.from('treatments').select('*').order('created_at');
    const container = document.getElementById('treatmentsList');

    if (container && data) {
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
    const { data } = await supabase.from('treatments').select('*').eq('id', id).single();
    if (data) {
      this.openTreatmentModal(data);
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
      active: document.getElementById('treatmentActive').checked
    };

    let error;
    if (id) {
      ({ error } = await supabase.from('treatments').update(data).eq('id', id));
    } else {
      ({ error } = await supabase.from('treatments').insert(data));
    }

    if (error) {
      this.showNotification('Fehler beim Speichern', 'error');
    } else {
      this.showNotification('Behandlung gespeichert', 'success');
      document.getElementById('treatmentModal').classList.remove('active');
      await this.loadTreatments();
    }
  }

  async deleteTreatment(id) {
    if (!confirm('Wirklich löschen?')) return;

    const { error } = await supabase.from('treatments').delete().eq('id', id);

    if (error) {
      this.showNotification('Fehler beim Löschen', 'error');
    } else {
      this.showNotification('Behandlung gelöscht', 'success');
      await this.loadTreatments();
    }
  }

  async loadEmergencyInfo() {
    const { data } = await supabase.from('emergency_info').select('*').maybeSingle();
    if (data) {
      document.getElementById('emergencyNumber').value = data.nummer || '';
      document.getElementById('emergencyZeiten').value = data.zeiten || '';
      document.getElementById('emergencyInstructions').value = Array.isArray(data.anweisungen) ? data.anweisungen.join('\n') : '';
      document.getElementById('emergencyZahnAus').value = data.zahn_aus || '';
      document.getElementById('emergencyZahnLocker').value = data.zahn_locker || '';
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

    const { error } = await supabase.from('emergency_info').upsert(data);

    if (error) {
      this.showNotification('Fehler beim Speichern', 'error');
    } else {
      this.showNotification('Notfall-Informationen gespeichert', 'success');
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

  // News Management
  async loadNews() {
    const { data } = await supabase
      .from('news')
      .select('*')
      .order('display_order', { ascending: false })
      .order('created_at', { ascending: false });

    const list = document.getElementById('newsList');
    if (!list || !data) return;

    list.innerHTML = data.map(news => `
      <div class="item-card">
        <div class="item-header">
          <div>
            <h3>${news.title}</h3>
            <p class="item-meta">
              ${new Date(news.created_at).toLocaleDateString('de-DE')}
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
      updated_at: new Date().toISOString()
    };

    const newsId = document.getElementById('newsId').value;

    try {
      if (newsId) {
        const { error } = await supabase
          .from('news')
          .update(newsData)
          .eq('id', newsId);
        if (error) throw error;
        this.showNotification('Meldung aktualisiert!');
      } else {
        const { error } = await supabase
          .from('news')
          .insert([newsData]);
        if (error) throw error;
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
    const { data } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (data) {
      this.openNewsModal(data);
    }
  }

  async deleteNews(id) {
    if (!confirm('Meldung wirklich löschen?')) return;

    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (error) {
      this.showNotification('Fehler beim Löschen!', 'error');
      return;
    }

    this.showNotification('Meldung gelöscht!');
    await this.loadNews();
  }
}

window.adminPanel = new AdminPanel();
