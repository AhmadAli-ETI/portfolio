// Global portfolioData is loaded via separate script tag

document.addEventListener('DOMContentLoaded', () => {
  initProfile();
  initOverview();
  initProjects();
  initSkills();
  initEducation();
  initNavigation();
  initThemeToggle();
});

// 1. Initialize Profile Information
function initProfile() {
  const { profile } = portfolioData;
  
  document.getElementById('profileName').textContent = profile.name;
  document.getElementById('profileTitle').textContent = profile.title;
  document.getElementById('profileLocation').textContent = profile.location;
  document.getElementById('aboutText').textContent = profile.about;
  
  const emailBtn = document.getElementById('emailBtn');
  emailBtn.href = `mailto:${profile.email}`;
  
  const phoneLink = document.getElementById('phoneLink');
  phoneLink.href = `tel:${profile.phone.replace(/\s+/g, '')}`;
  phoneLink.innerHTML = `<i class="fa-solid fa-phone"></i> ${profile.phone}`;
  
  const avatarFallback = document.getElementById('avatarFallback');
  const profileImg = document.getElementById('profileImg');
  
  if (profile.avatar) {
    profileImg.src = profile.avatar;
    profileImg.style.display = 'block';
    avatarFallback.style.display = 'none';
  } else {
    // Generate initials for fallback
    avatarFallback.textContent = profile.name
      .split(' ')
      .map(part => part[0])
      .join('');
  }
}

// 2. Initialize Overview Tab (Pinned Projects)
function initOverview() {
  const container = document.getElementById('pinnedProjectsContainer');
  container.innerHTML = '';
  
  // Pin first 2 projects
  const pinned = portfolioData.projects.slice(0, 2);
  
  pinned.forEach(project => {
    const card = document.createElement('div');
    card.className = 'pinned-card';
    
    const tagsHTML = project.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('');
    
    card.innerHTML = `
      <i class="fa-solid fa-thumbtack pin-icon"></i>
      <div>
        <h4>${project.title}</h4>
        <div class="project-subtitle">${project.subtitle}</div>
        <p>${project.description.substring(0, 100)}...</p>
      </div>
      <div class="pinned-footer">
        <div class="tags-row">${tagsHTML}</div>
        <button class="view-details-btn" data-id="${project.id}">
          Details <i class="fa-solid fa-arrow-right-long"></i>
        </button>
      </div>
    `;
    
    container.appendChild(card);
  });

  // Attach event listeners to detail buttons
  container.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openProjectModal(btn.getAttribute('data-id'));
    });
  });
}

// 3. Initialize Projects Tab with Filters
function initProjects() {
  const container = document.getElementById('projectsContainer');
  renderProjectsList(portfolioData.projects);
  
  // Attach event listeners to filter buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Toggle active class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      let filteredProjects = portfolioData.projects;
      
      if (filter === 'embedded') {
        filteredProjects = portfolioData.projects.filter(p => p.category.toLowerCase().includes('embedded') || p.tags.includes('C++'));
      } else if (filter === 'hardware') {
        filteredProjects = portfolioData.projects.filter(p => p.category.toLowerCase().includes('elektronik') || p.category.toLowerCase().includes('hardware') || p.tags.includes('Eagle CAD'));
      } else if (filter === 'network') {
        filteredProjects = portfolioData.projects.filter(p => p.category.toLowerCase().includes('netzwerk') || p.tags.includes('Cisco'));
      }
      
      renderProjectsList(filteredProjects);
    });
  });
}

function renderProjectsList(projectsList) {
  const container = document.getElementById('projectsContainer');
  container.innerHTML = '';
  
  if (projectsList.length === 0) {
    container.innerHTML = `<div class="viewer-placeholder"><p>Keine Projekte in dieser Kategorie gefunden.</p></div>`;
    return;
  }
  
  projectsList.forEach(project => {
    const item = document.createElement('div');
    item.className = 'project-item';
    
    const tagsHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    item.innerHTML = `
      <div class="project-main">
        <h3>${project.title}</h3>
        <div class="project-subtitle">${project.subtitle}</div>
        <p>${project.description}</p>
        <div class="tags-row" style="margin-bottom: 1rem;">${tagsHTML}</div>
        <div class="project-action">
          <button class="action-btn view-details-btn" data-id="${project.id}">
            <i class="fa-solid fa-circle-info"></i> Technische Details ansehen
          </button>
        </div>
      </div>
      <div class="project-meta-box">
        <div class="meta-item">
          <span class="meta-label">Kategorie</span>
          <span class="meta-value">${project.category}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Status</span>
          <span class="meta-value">${project.status}</span>
        </div>
      </div>
    `;
    
    container.appendChild(item);
  });
  
  // Attach event listeners to project detail buttons
  container.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openProjectModal(btn.getAttribute('data-id'));
    });
  });
}

// 4. Initialize Skills Tab (Bars and Tags)
function initSkills() {
  const { skills, languages, interests } = portfolioData;
  
  // Render Skill Bars
  renderSkillGroup('skillsProgramming', skills.programming);
  renderSkillGroup('skillsHardware', skills.hardware);
  renderSkillGroup('skillsInfrastructure', skills.infrastructure);
  renderSkillGroup('skillsGeneral', skills.general);
  
  // Render Languages
  const langContainer = document.getElementById('languagesContainer');
  langContainer.innerHTML = languages.map(lang => `
    <div class="lang-item">
      <span class="lang-name">${lang.name}</span>
      <span class="lang-level">${lang.level}</span>
    </div>
  `).join('');
  
  // Render Interests
  const interestsContainer = document.getElementById('interestsContainer');
  interestsContainer.innerHTML = interests.map(item => `
    <span class="interest-tag">${item.icon} ${item.name}</span>
  `).join('');
}

function renderSkillGroup(containerId, skillsList) {
  const container = document.getElementById(containerId);
  container.innerHTML = skillsList.map(skill => `
    <div class="skill-progress-item">
      <div class="skill-info">
        <span class="skill-name">${skill.name}</span>
        <span class="skill-percentage">${skill.level}%</span>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" data-level="${skill.level}"></div>
      </div>
    </div>
  `).join('');
}

// Animate skill bars once they are visible
function animateSkillBars() {
  const fills = document.querySelectorAll('.progress-bar-fill');
  fills.forEach(fill => {
    const level = fill.getAttribute('data-level');
    fill.style.width = `${level}%`;
  });
}

function resetSkillBars() {
  const fills = document.querySelectorAll('.progress-bar-fill');
  fills.forEach(fill => {
    fill.style.width = '0%';
  });
}

// 5. Initialize Education Timeline
function initEducation() {
  const container = document.getElementById('educationTimeline');
  container.innerHTML = '';
  
  portfolioData.education.forEach(edu => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    
    item.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-period">${edu.period}</div>
      <div class="timeline-content">
        <h3>${edu.degree}</h3>
        <h4>${edu.field}</h4>
        <p>${edu.description}</p>
      </div>
    `;
    
    container.appendChild(item);
  });
}

// 6. Navigation Tabs Logic
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const panels = document.querySelectorAll('.tab-panel');
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      const tabId = item.getAttribute('data-tab');
      
      // Update active nav item
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      // Toggle panels
      panels.forEach(panel => panel.classList.remove('active'));
      const activePanel = document.getElementById(`${tabId}-tab`);
      activePanel.classList.add('active');
      
      // Specific triggers for tabs
      if (tabId === 'skills') {
        setTimeout(animateSkillBars, 100);
      } else {
        resetSkillBars();
      }

      // Smooth scroll back to top of content area on navigation
      document.querySelector('.content-area').scrollTop = 0;
    });
  });
}

// 7. Light / Dark Mode Toggle
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const htmlEl = document.documentElement;
  
  toggleBtn.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlEl.setAttribute('data-theme', newTheme);
    
    // Update button content
    const icon = toggleBtn.querySelector('i');
    const text = toggleBtn.querySelector('span');
    
    if (newTheme === 'light') {
      icon.className = 'fa-solid fa-sun';
      text.textContent = 'Light Mode';
    } else {
      icon.className = 'fa-solid fa-moon';
      text.textContent = 'Dark Mode';
    }
  });
}

// 8. Project Details Modal popup
const modal = document.getElementById('projectModal');
const modalContent = document.getElementById('modalContent');
const closeModalBtn = document.getElementById('closeModalBtn');

function openProjectModal(projectId) {
  const project = portfolioData.projects.find(p => p.id === projectId);
  if (!project) return;
  
  const hardwareList = project.details.hardware.map(item => `<li>${item}</li>`).join('');
  const softwareList = project.details.software.map(item => `<li>${item}</li>`).join('');
  
  let codeSnippetHTML = '';
  if (project.details.codeSnippet) {
    // Determine language class for Prism
    const langClass = projectId === 'dactylus' ? 'language-cpp' : (projectId === 'netzwerk' ? 'language-none' : 'language-none');
    
    // Escape HTML tags to prevent execution
    const escapedCode = project.details.codeSnippet
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
      
    codeSnippetHTML = `
      <div class="modal-section">
        <h4>Technischer Code / Konfigurations-Ausschnitt</h4>
        <pre class="modal-code"><code class="${langClass}">${escapedCode}</code></pre>
      </div>
    `;
  }
  
  modalContent.innerHTML = `
    <h2>${project.title}</h2>
    <div class="project-subtitle">${project.subtitle}</div>
    
    <div class="modal-section">
      <h4>Herausforderung / Problemstellung</h4>
      <p>${project.details.problem}</p>
    </div>
    
    <div class="modal-section">
      <h4>Technische Umsetzung / Lösung</h4>
      <p>${project.details.solution}</p>
    </div>
    
    <div class="modal-section">
      <h4>Hardware & Komponenten</h4>
      <ul class="modal-list">${hardwareList}</ul>
    </div>
    
    <div class="modal-section">
      <h4>Software & Infrastruktur</h4>
      <ul class="modal-list">${softwareList}</ul>
    </div>
    
    ${codeSnippetHTML}
  `;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Lock background scrolling
  
  // Highlight code block
  const codeBlock = modalContent.querySelector('code');
  if (codeBlock && window.Prism) {
    window.Prism.highlightElement(codeBlock);
  }
}

closeModalBtn.addEventListener('click', closeProjectModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeProjectModal();
});

function closeProjectModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}


