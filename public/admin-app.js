import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, orderBy, where } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyBci-nWGvx7OdMb6BmWbS8pWBR9Leidl_Q",
  authDomain: "zahngut-app.firebaseapp.com",
  databaseURL: "https://zahngut-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "zahngut-app",
  storageBucket: "zahngut-app.firebasestorage.app",
  messagingSenderId: "1022498780184",
  appId: "1:1022498780184:web:922e819956feb594037f6d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

class AdminPanel {
  constructor() {
    this.currentTreatment = null;
    this.currentNews = null;
    this.checkAuth();
  }

  checkAuth() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.init();
      } else {
        window.location.href = '/admin-login.html';
      }
    });
  }

  async init() {
    this.setupNavigation();
    this.setupForms();
    this.setupModals();
    this.setupLogout();
    await this.loadAllData();
  }

  setupLogout() {
    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
      try {
        await signOut(auth);
        window.location.href = '/admin-login.html';
      } catch (error) {
        console.error('Logout error:', error);
      }
    });
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
    document.getElementById('categoriesForm')?.addEventListener('submit', (e) => this.saveCategories(e));

    document.getElementById('addTreatmentBtn')?.addEventListener('click', () => this.openTreatmentModal());
    document.getElementById('addNewsBtn')?.addEventListener('click', () => this.openNewsModal());
    document.getElementById('addVideoBtn')?.addEventListener('click', () => this.openVideoModal());
    document.getElementById('addAftercareBtn')?.addEventListener('click', () => this.openAftercareModal());
    document.getElementById('closeNewsModal')?.addEventListener('click', () => this.closeNewsModal());
    document.getElementById('cancelNewsBtn')?.addEventListener('click', () => this.closeNewsModal());

    // Logo file upload
    document.getElementById('praxisLogoFile')?.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        const uploadedUrl = await this.uploadImage(file, 'logos');
        if (uploadedUrl) {
          document.getElementById('praxisLogo').value = uploadedUrl;
          this.showLogoPreview(uploadedUrl);
        }
      }
    });

    // Logo remove button
    document.getElementById('removeLogoBtn')?.addEventListener('click', () => {
      document.getElementById('praxisLogo').value = '';
      document.getElementById('praxisLogoFile').value = '';
      document.getElementById('logoPreview').style.display = 'none';
    });

    this.setupImagePreviews();
    this.setupColorPreviews();
    this.setupCopyColorButtons();
    this.setupGradientToggles();
    this.setupColorValueCopy();
  }

  setupImagePreviews() {
    const previewConfigs = [
      { fileId: 'treatmentIconFile', previewId: 'treatmentIconPreview' },
      { fileId: 'videoIconFile', previewId: 'videoIconPreview' },
      { fileId: 'aftercareIconFile', previewId: 'aftercareIconPreview' },
      { fileId: 'categoryBehandlungenIconFile', previewId: 'categoryBehandlungenIconPreview' },
      { fileId: 'categoryVideosIconFile', previewId: 'categoryVideosIconPreview' },
      { fileId: 'categoryAktuellesIconFile', previewId: 'categoryAktuellesIconPreview' },
      { fileId: 'categoryNachsorgeIconFile', previewId: 'categoryNachsorgeIconPreview' }
    ];

    previewConfigs.forEach(config => {
      const fileInput = document.getElementById(config.fileId);
      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          const preview = document.getElementById(config.previewId);

          if (file && preview) {
            const reader = new FileReader();
            reader.onload = (event) => {
              preview.innerHTML = `<img src="${event.target.result}" alt="Vorschau">`;
              preview.classList.add('active');
            };
            reader.readAsDataURL(file);
          }
        });
      }
    });
  }

  setupColorPreviews() {
    const categories = [
      { key: 'Behandlungen', iconId: 'categoryBehandlungenIcon', iconFileId: 'categoryBehandlungenIconFile', color1Id: 'categoryBehandlungenBgColor1', color2Id: 'categoryBehandlungenBgColor2', previewId: 'categoryBehandlungenColorPreview' },
      { key: 'Videos', iconId: 'categoryVideosIcon', iconFileId: 'categoryVideosIconFile', color1Id: 'categoryVideosBgColor1', color2Id: 'categoryVideosBgColor2', previewId: 'categoryVideosColorPreview' },
      { key: 'Aktuelles', iconId: 'categoryAktuellesIcon', iconFileId: 'categoryAktuellesIconFile', color1Id: 'categoryAktuellesBgColor1', color2Id: 'categoryAktuellesBgColor2', previewId: 'categoryAktuellesColorPreview' },
      { key: 'Nachsorge', iconId: 'categoryNachsorgeIcon', iconFileId: 'categoryNachsorgeIconFile', color1Id: 'categoryNachsorgeBgColor1', color2Id: 'categoryNachsorgeBgColor2', previewId: 'categoryNachsorgeColorPreview' }
    ];

    categories.forEach(cat => {
      const color1Input = document.getElementById(cat.color1Id);
      const color2Input = document.getElementById(cat.color2Id);
      const iconInput = document.getElementById(cat.iconId);
      const iconFileInput = document.getElementById(cat.iconFileId);
      const preview = document.getElementById(cat.previewId);

      const updateColorValue = (input) => {
        const wrapper = input.closest('.color-input-wrapper');
        const hexInput = wrapper?.querySelector('.color-hex-input');
        if (hexInput) {
          hexInput.value = input.value.toUpperCase();
        }
      };

      const updatePreview = () => {
        if (!preview) return;

        const color1 = color1Input?.value || '#4F46E5';
        const color2 = color2Input?.value || color1;
        const iconValue = iconInput?.value || '🦷';

        // Check if gradient is enabled
        const gradientCheckbox = document.getElementById(`category${cat.key}UseGradient`);
        const useGradient = gradientCheckbox ? gradientCheckbox.checked : true;

        const background = useGradient && color1 !== color2
          ? `linear-gradient(135deg, ${color1}, ${color2})`
          : color1;

        preview.style.background = background;

        if (iconValue.startsWith('http')) {
          preview.innerHTML = `<img src="${iconValue}" alt="Icon" style="width: 50px; height: 50px; object-fit: contain;">`;
        } else {
          preview.textContent = iconValue;
        }
      };

      color1Input?.addEventListener('input', (e) => {
        updateColorValue(e.target);
        updatePreview();
      });
      color2Input?.addEventListener('input', (e) => {
        updateColorValue(e.target);
        updatePreview();
      });
      iconInput?.addEventListener('input', updatePreview);

      iconFileInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && preview) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const color1 = color1Input?.value || '#4F46E5';
            const color2 = color2Input?.value || color1;
            const background = color1 === color2
              ? color1
              : `linear-gradient(135deg, ${color1}, ${color2})`;

            preview.style.background = background;
            preview.innerHTML = `<img src="${event.target.result}" alt="Icon" style="width: 50px; height: 50px; object-fit: contain;">`;
          };
          reader.readAsDataURL(file);
        }
      });

      updatePreview();
    });
  }

  setupCopyColorButtons() {
    let copiedColor = null;

    document.querySelectorAll('.copy-color-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const colorId = btn.getAttribute('data-color-id');
        const colorInput = document.getElementById(colorId);

        if (copiedColor === null) {
          // Kopier-Modus
          copiedColor = colorInput.value;
          btn.textContent = '✓';
          btn.style.background = '#10B981';
          btn.title = 'Farbe einfügen';

          // Zeige alle anderen Buttons als "einfügen"
          document.querySelectorAll('.copy-color-btn').forEach(otherBtn => {
            if (otherBtn !== btn) {
              otherBtn.textContent = '📋';
              otherBtn.style.opacity = '1';
            }
          });
        } else {
          // Einfüge-Modus
          colorInput.value = copiedColor;

          // Trigger input event to update preview and color value
          colorInput.dispatchEvent(new Event('input'));

          // Reset alle Buttons
          document.querySelectorAll('.copy-color-btn').forEach(allBtn => {
            allBtn.textContent = '📋';
            allBtn.style.background = '#0891b2';
            allBtn.style.opacity = '1';
            allBtn.title = 'Farbe kopieren';
          });

          copiedColor = null;
        }
      });
    });
  }

  setupColorValueCopy() {
    // Sync color picker and hex input fields
    document.querySelectorAll('.color-input-wrapper').forEach(wrapper => {
      const colorPicker = wrapper.querySelector('input[type="color"]');
      const hexInput = wrapper.querySelector('.color-hex-input');

      if (colorPicker && hexInput) {
        // Update hex input when color picker changes
        colorPicker.addEventListener('input', () => {
          hexInput.value = colorPicker.value.toUpperCase();
        });

        // Update color picker when hex input changes
        hexInput.addEventListener('input', (e) => {
          let value = e.target.value.toUpperCase();

          // Auto-add # if missing
          if (value && !value.startsWith('#')) {
            value = '#' + value;
            hexInput.value = value;
          }

          // Validate hex color format
          if (/^#[0-9A-F]{6}$/i.test(value)) {
            colorPicker.value = value;
            // Trigger color picker's input event to update previews
            colorPicker.dispatchEvent(new Event('input'));
          }
        });
      }
    });
  }

  setupGradientToggles() {
    const categories = ['Behandlungen', 'Videos', 'Aktuelles', 'Nachsorge'];

    categories.forEach(cat => {
      const checkbox = document.getElementById(`category${cat}UseGradient`);
      const wrapper = document.getElementById(`category${cat}Color2Wrapper`);

      if (checkbox && wrapper) {
        const updateVisibility = () => {
          wrapper.style.display = checkbox.checked ? 'flex' : 'none';

          // Trigger preview update
          const color1Input = document.getElementById(`category${cat}BgColor1`);
          if (color1Input) {
            color1Input.dispatchEvent(new Event('input'));
          }
        };

        checkbox.addEventListener('change', updateVisibility);
        updateVisibility();
      }
    });
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
      this.loadAftercare(),
      this.loadCategories()
    ]);
  }

  async loadCategories() {
    try {
      const docRef = doc(db, 'app_config', 'categories');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.categories = docSnap.data();

        // Add termine category if it doesn't exist
        if (!this.categories.termine) {
          this.categories.termine = { name: 'Termine & Kontakt', icon: '📅', description: 'Öffnungszeiten und Buchung', bgColor1: '#06B6D4', bgColor2: '#3B82F6' };
          await setDoc(doc(db, 'app_config', 'categories'), this.categories);
        }
      } else {
        this.categories = {
          behandlungen: { name: 'Behandlungen', icon: '🦷', description: 'Unsere zahnmedizinischen Leistungen', bgColor1: '#4F46E5', bgColor2: '#7C3AED' },
          videos: { name: 'Videos', icon: '🎥', description: 'Aufklärungsvideos zu Behandlungen', bgColor1: '#EC4899', bgColor2: '#F43F5E' },
          aktuelles: { name: 'Aktuelles', icon: '📰', description: 'Neuigkeiten aus der Praxis', bgColor1: '#10B981', bgColor2: '#14B8A6' },
          nachsorge: { name: 'Nachsorge', icon: '📝', description: 'Pflegehinweise nach Behandlungen', bgColor1: '#F59E0B', bgColor2: '#EF4444' },
          termine: { name: 'Termine & Kontakt', icon: '📅', description: 'Öffnungszeiten und Buchung', bgColor1: '#06B6D4', bgColor2: '#3B82F6' }
        };
        await setDoc(doc(db, 'app_config', 'categories'), this.categories);
      }
      this.updateCategoryUI();
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  updateCategoryUI() {
    const categoryFields = [
      { key: 'behandlungen', nameId: 'categoryBehandlungenName', iconId: 'categoryBehandlungenIcon', descId: 'categoryBehandlungenDesc', previewId: 'categoryBehandlungenIconPreview', color1Id: 'categoryBehandlungenBgColor1', color2Id: 'categoryBehandlungenBgColor2', colorPreviewId: 'categoryBehandlungenColorPreview' },
      { key: 'videos', nameId: 'categoryVideosName', iconId: 'categoryVideosIcon', descId: 'categoryVideosDesc', previewId: 'categoryVideosIconPreview', color1Id: 'categoryVideosBgColor1', color2Id: 'categoryVideosBgColor2', colorPreviewId: 'categoryVideosColorPreview' },
      { key: 'aktuelles', nameId: 'categoryAktuellesName', iconId: 'categoryAktuellesIcon', descId: 'categoryAktuellesDesc', previewId: 'categoryAktuellesIconPreview', color1Id: 'categoryAktuellesBgColor1', color2Id: 'categoryAktuellesBgColor2', colorPreviewId: 'categoryAktuellesColorPreview' },
      { key: 'nachsorge', nameId: 'categoryNachsorgeName', iconId: 'categoryNachsorgeIcon', descId: 'categoryNachsorgeDesc', previewId: 'categoryNachsorgeIconPreview', color1Id: 'categoryNachsorgeBgColor1', color2Id: 'categoryNachsorgeBgColor2', colorPreviewId: 'categoryNachsorgeColorPreview' }
    ];

    categoryFields.forEach(field => {
      const cat = this.categories[field.key];
      if (cat) {
        const nameEl = document.getElementById(field.nameId);
        const iconEl = document.getElementById(field.iconId);
        const descEl = document.getElementById(field.descId);
        const previewEl = document.getElementById(field.previewId);
        const color1El = document.getElementById(field.color1Id);
        const color2El = document.getElementById(field.color2Id);
        const colorPreviewEl = document.getElementById(field.colorPreviewId);

        if (nameEl) nameEl.value = cat.name || '';
        if (iconEl) iconEl.value = cat.icon || '';
        if (descEl) descEl.value = cat.description || '';
        if (color1El) {
          color1El.value = cat.bgColor1 || '#4F46E5';
          // Update hex input display
          const wrapper1 = color1El.closest('.color-input-wrapper');
          const hexInput1 = wrapper1?.querySelector('.color-hex-input');
          if (hexInput1) hexInput1.value = color1El.value.toUpperCase();
        }
        if (color2El) {
          color2El.value = cat.bgColor2 || cat.bgColor1 || '#7C3AED';
          // Update hex input display
          const wrapper2 = color2El.closest('.color-input-wrapper');
          const hexInput2 = wrapper2?.querySelector('.color-hex-input');
          if (hexInput2) hexInput2.value = color2El.value.toUpperCase();
        }

        // Set gradient checkbox
        const catName = field.key.charAt(0).toUpperCase() + field.key.slice(1);
        const gradientCheckbox = document.getElementById(`category${catName}UseGradient`);
        if (gradientCheckbox) {
          gradientCheckbox.checked = cat.bgColor1 !== cat.bgColor2;
          gradientCheckbox.dispatchEvent(new Event('change'));
        }

        if (previewEl && cat.icon && cat.icon.startsWith('http')) {
          previewEl.innerHTML = `<img src="${cat.icon}" alt="Icon">`;
          previewEl.classList.add('active');
        }

        if (colorPreviewEl) {
          const bg = cat.bgColor1 === cat.bgColor2 || !cat.bgColor2
            ? cat.bgColor1
            : `linear-gradient(135deg, ${cat.bgColor1}, ${cat.bgColor2})`;
          colorPreviewEl.style.background = bg;

          if (cat.icon && cat.icon.startsWith('http')) {
            colorPreviewEl.innerHTML = `<img src="${cat.icon}" alt="Icon" style="width: 50px; height: 50px; object-fit: contain;">`;
          } else {
            colorPreviewEl.textContent = cat.icon || '🦷';
          }
        }
      }
    });
  }

  async saveCategories(e) {
    e.preventDefault();

    try {
      const categoryKeys = [
        { key: 'behandlungen', fileId: 'categoryBehandlungenIconFile', iconId: 'categoryBehandlungenIcon', nameId: 'categoryBehandlungenName', descId: 'categoryBehandlungenDesc', color1Id: 'categoryBehandlungenBgColor1', color2Id: 'categoryBehandlungenBgColor2' },
        { key: 'videos', fileId: 'categoryVideosIconFile', iconId: 'categoryVideosIcon', nameId: 'categoryVideosName', descId: 'categoryVideosDesc', color1Id: 'categoryVideosBgColor1', color2Id: 'categoryVideosBgColor2' },
        { key: 'aktuelles', fileId: 'categoryAktuellesIconFile', iconId: 'categoryAktuellesIcon', nameId: 'categoryAktuellesName', descId: 'categoryAktuellesDesc', color1Id: 'categoryAktuellesBgColor1', color2Id: 'categoryAktuellesBgColor2' },
        { key: 'nachsorge', fileId: 'categoryNachsorgeIconFile', iconId: 'categoryNachsorgeIcon', nameId: 'categoryNachsorgeName', descId: 'categoryNachsorgeDesc', color1Id: 'categoryNachsorgeBgColor1', color2Id: 'categoryNachsorgeBgColor2' }
      ];

      const categories = {};

      for (const cat of categoryKeys) {
        let iconValue = document.getElementById(cat.iconId).value;
        const iconFile = document.getElementById(cat.fileId).files[0];

        if (iconFile) {
          iconValue = await this.uploadImage(iconFile, 'category-icons');
        }

        const catName = cat.key.charAt(0).toUpperCase() + cat.key.slice(1);
        const useGradient = document.getElementById(`category${catName}UseGradient`)?.checked ?? true;

        categories[cat.key] = {
          name: document.getElementById(cat.nameId).value,
          icon: iconValue,
          description: document.getElementById(cat.descId).value,
          bgColor1: document.getElementById(cat.color1Id).value,
          bgColor2: useGradient ? document.getElementById(cat.color2Id).value : document.getElementById(cat.color1Id).value
        };
      }

      await setDoc(doc(db, 'app_config', 'categories'), categories);
      this.categories = categories;
      this.showNotification('Kategorien gespeichert', 'success');
    } catch (error) {
      console.error('Error saving categories:', error);
      this.showNotification('Fehler beim Speichern', 'error');
    }
  }

  async loadPraxisInfo() {
    try {
      const docRef = doc(db, 'praxis_info', 'main');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById('praxisName').value = data.name || '';
        document.getElementById('praxisLogo').value = data.logo || '';
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

        // Show logo preview if logo URL exists
        if (data.logo) {
          this.showLogoPreview(data.logo);
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
      logo: document.getElementById('praxisLogo').value,
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
      const querySnapshot = await getDocs(collection(db, 'treatments'));
      const data = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          const aDate = a.created_at?.seconds || 0;
          const bDate = b.created_at?.seconds || 0;
          return aDate - bDate;
        });
      const container = document.getElementById('treatmentsList');

      if (container) {
        if (data.length === 0) {
          container.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">Noch keine Behandlungen vorhanden. Klicke auf "Neue Behandlung" um eine zu erstellen.</p>';
          return;
        }

        container.innerHTML = data.map(treatment => {
          const iconDisplay = treatment.icon && treatment.icon.startsWith('http')
            ? `<img src="${treatment.icon}" style="width: 32px; height: 32px; object-fit: cover;">`
            : treatment.icon;

          return `
          <div class="item-card-compact">
            <div class="item-info-compact">
              <span class="item-icon">${iconDisplay}</span>
              <div class="item-details">
                <h4>${treatment.name}</h4>
                <p class="item-meta">${treatment.category}</p>
              </div>
            </div>
            <div class="item-status-actions">
              ${treatment.active ? '<span class="status-badge published">Aktiv</span>' : '<span class="status-badge draft">Inaktiv</span>'}
              <button class="btn-icon" onclick="adminPanel.editTreatment('${treatment.id}')">✏️</button>
              <button class="btn-icon" onclick="adminPanel.deleteTreatment('${treatment.id}')">🗑️</button>
            </div>
          </div>
        `;
        }).join('');
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

    let iconValue = document.getElementById('treatmentIcon').value;
    const iconFile = document.getElementById('treatmentIconFile').files[0];

    if (iconFile) {
      const uploadedUrl = await this.uploadImage(iconFile, 'treatment-icons');
      if (uploadedUrl) {
        iconValue = uploadedUrl;
      }
    }

    const data = {
      name: document.getElementById('treatmentName').value,
      category: document.getElementById('treatmentCategory').value,
      icon: iconValue,
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

      let data;
      if (docSnap.exists()) {
        data = docSnap.data();
      } else {
        // Create default emergency info if none exists
        data = {
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
        };
        await setDoc(docRef, data);
      }

      document.getElementById('emergencyNumber').value = data.nummer || '';
      document.getElementById('emergencyZeiten').value = data.zeiten || '';
      document.getElementById('emergencyInstructions').value = Array.isArray(data.anweisungen) ? data.anweisungen.join('\n') : '';
      document.getElementById('emergencyZahnAus').value = data.zahn_aus || '';
      document.getElementById('emergencyZahnLocker').value = data.zahn_locker || '';
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

  showLogoPreview(url) {
    const preview = document.getElementById('logoPreview');
    const img = document.getElementById('logoPreviewImg');

    img.src = url;
    img.onerror = () => {
      preview.style.display = 'none';
    };
    img.onload = () => {
      preview.style.display = 'block';
    };
  }

  async uploadImage(file, folder = 'icons') {
    if (!file) return null;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.showNotification('Bild ist zu groß (max. 5MB)', 'error');
      return null;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      this.showNotification('Nur JPG, PNG, WebP oder SVG erlaubt', 'error');
      return null;
    }

    try {
      const timestamp = Date.now();
      const filename = `${folder}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, filename);

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      this.showNotification('Fehler beim Hochladen', 'error');
      return null;
    }
  }

  async loadNews() {
    try {
      const querySnapshot = await getDocs(collection(db, 'news'));
      const data = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          if (a.display_order !== b.display_order) {
            return (b.display_order || 0) - (a.display_order || 0);
          }
          const aDate = a.created_at?.seconds || a.created_at || 0;
          const bDate = b.created_at?.seconds || b.created_at || 0;
          return bDate - aDate;
        });

      const list = document.getElementById('newsList');
      if (!list) return;

      if (data.length === 0) {
        list.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">Noch keine News vorhanden. Klicke auf "Neue Meldung" um eine zu erstellen.</p>';
        return;
      }

      list.innerHTML = data.map(news => `
        <div class="item-card-compact">
          <div class="item-info-compact">
            <span class="item-icon">📰</span>
            <div class="item-details">
              <h4>${news.title}</h4>
              <p class="item-meta">${news.created_at ? (news.created_at.seconds ? new Date(news.created_at.seconds * 1000).toLocaleDateString('de-DE') : new Date(news.created_at).toLocaleDateString('de-DE')) : 'N/A'}</p>
            </div>
          </div>
          <div class="item-status-actions">
            ${news.published ? '<span class="status-badge published">Veröffentlicht</span>' : '<span class="status-badge draft">Entwurf</span>'}
            ${!news.published ? `<button class="btn-icon" onclick="adminPanel.toggleNewsPublish('${news.id}', true)" title="Veröffentlichen">👁️</button>` : `<button class="btn-icon" onclick="adminPanel.toggleNewsPublish('${news.id}', false)" title="Verstecken">🙈</button>`}
            <button class="btn-icon" onclick="adminPanel.editNews('${news.id}')">✏️</button>
            <button class="btn-icon" onclick="adminPanel.deleteNews('${news.id}')">🗑️</button>
          </div>
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

  async toggleNewsPublish(id, publish) {
    try {
      await updateDoc(doc(db, 'news', id), { published: publish });
      this.showNotification(publish ? 'Meldung veröffentlicht!' : 'Meldung versteckt!');
      await this.loadNews();
    } catch (error) {
      console.error('Error toggling news publish status:', error);
      this.showNotification('Fehler beim Aktualisieren!', 'error');
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
      const querySnapshot = await getDocs(collection(db, 'videos'));
      const data = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.display_order || 0) - (a.display_order || 0));

      const list = document.getElementById('videosList');
      if (!list) return;

      if (data.length === 0) {
        list.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">Noch keine Videos vorhanden. Klicke auf "Neues Video" um eins zu erstellen.</p>';
        return;
      }

      list.innerHTML = data.map(video => {
        const iconDisplay = video.icon && video.icon.startsWith('http')
          ? `<img src="${video.icon}" style="width: 32px; height: 32px; object-fit: cover;">`
          : (video.icon || '🎥');

        return `
        <div class="item-card-compact">
          <div class="item-info-compact">
            <span class="item-icon">${iconDisplay}</span>
            <div class="item-details">
              <h4>${video.title}</h4>
              <p class="item-meta">${video.category || 'Allgemein'}</p>
            </div>
          </div>
          <div class="item-status-actions">
            ${video.active ? '<span class="status-badge published">Aktiv</span>' : '<span class="status-badge draft">Inaktiv</span>'}
            <button class="btn-icon" onclick="adminPanel.editVideo('${video.id}')">✏️</button>
            <button class="btn-icon" onclick="adminPanel.deleteVideo('${video.id}')">🗑️</button>
          </div>
        </div>
        `;
      }).join('');
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

    let iconValue = document.getElementById('videoIcon').value;
    const iconFile = document.getElementById('videoIconFile').files[0];

    if (iconFile) {
      const uploadedUrl = await this.uploadImage(iconFile, 'video-icons');
      if (uploadedUrl) {
        iconValue = uploadedUrl;
      }
    }

    const videoData = {
      title: document.getElementById('videoTitle').value,
      category: document.getElementById('videoCategory').value,
      icon: iconValue,
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
      const querySnapshot = await getDocs(collection(db, 'aftercare'));
      const data = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.display_order || 0) - (a.display_order || 0));

      const list = document.getElementById('aftercareList');
      if (!list) return;

      if (data.length === 0) {
        list.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">Noch keine Nachsorge-Infos vorhanden. Klicke auf "Neue Nachsorge" um eine zu erstellen.</p>';
        return;
      }

      list.innerHTML = data.map(aftercare => {
        const iconDisplay = aftercare.icon && aftercare.icon.startsWith('http')
          ? `<img src="${aftercare.icon}" style="width: 32px; height: 32px; object-fit: cover;">`
          : (aftercare.icon || '📝');

        return `
        <div class="item-card-compact">
          <div class="item-info-compact">
            <span class="item-icon">${iconDisplay}</span>
            <div class="item-details">
              <h4>${aftercare.behandlung}</h4>
              <p class="item-meta">${aftercare.time || aftercare.zeitraum || 'Keine Zeitangabe'}</p>
            </div>
          </div>
          <div class="item-status-actions">
            ${aftercare.active ? '<span class="status-badge published">Aktiv</span>' : '<span class="status-badge draft">Inaktiv</span>'}
            <button class="btn-icon" onclick="adminPanel.editAftercare('${aftercare.id}')">✏️</button>
            <button class="btn-icon" onclick="adminPanel.deleteAftercare('${aftercare.id}')">🗑️</button>
          </div>
        </div>
        `;
      }).join('');
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

    let iconValue = document.getElementById('aftercareIcon').value;
    const iconFile = document.getElementById('aftercareIconFile').files[0];

    if (iconFile) {
      const uploadedUrl = await this.uploadImage(iconFile, 'aftercare-icons');
      if (uploadedUrl) {
        iconValue = uploadedUrl;
      }
    }

    const aftercareData = {
      behandlung: document.getElementById('aftercareName').value,
      icon: iconValue,
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
