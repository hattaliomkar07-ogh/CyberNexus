/**
 * CYBERNEXUS — CORE JAVASCRIPT CONTROLLER
 * Architecture: Vanilla JavaScript (ES6+)
 * Purpose: Interactive canvas particle network, HUD controls, telemetry displays,
 *          animated numerical counters, mobile navigation, and contact validation.
 * Techfest Campus Ambassador Program Web Development Task.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. GLOBAL CANVAS: CYBERNETIC SYNAPTIC PARTICLE MATRIX
     ========================================================================== */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle settings
    const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
    const particles = [];
    const maxDistance = 140;

    // Mouse tracking for interactive repulsion/attraction
    const mouse = {
      x: null,
      y: null,
      radius: 120
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Handle Window Resize
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Particle Object
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
        // Distribute colors: Cyan (70%), Purple (30%)
        this.color = Math.random() > 0.3 ? '#00F5FF' : '#A855F7';
        this.baseAlpha = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce from walls
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse proximity reaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 2;
            this.y -= Math.sin(angle) * force * 2;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.baseAlpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    }

    // Initialize particle array
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Main animation loop
    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles with synaptic lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = particles[i].color === '#A855F7' ? 'rgba(168, 85, 247, ' + alpha + ')' : 'rgba(0, 245, 255, ' + alpha + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Update and draw each particle
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  /* ==========================================================================
     2. STICKY NAVBAR & ACTIVE NAVIGATION LINK TRACKING
     ========================================================================== */
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Add blurred glass background to header when scrolled
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy: highlight current active nav item
    const scrollPos = window.scrollY + 180;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  /* ==========================================================================
     3. RESPONSIVE MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when clicking on any link inside the mobile drawer
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ==========================================================================
     4. SMOOTH SCROLLING FOR ALL INTERNAL ANCHOR LINKS
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // If CTA "JOIN THE EVOLUTION" button was clicked, autofocus on Operative Name input
        if (this.id === 'join-evolution-btn') {
          setTimeout(() => {
            const nameInput = document.getElementById('user-name');
            if (nameInput) {
              nameInput.focus();
              nameInput.classList.add('input-highlight');
              setTimeout(() => nameInput.classList.remove('input-highlight'), 1200);
            }
          }, 600);
        }
      }
    });
  });

  /* ==========================================================================
     5. SECTION D: TECHNOLOGY SHOWCASE INTERACTIVE TELEMETRY HUD
     ========================================================================== */
  const techCards = document.querySelectorAll('.tech-card');
  const inspectButtons = document.querySelectorAll('.tech-inspect-btn');
  const telemetryHud = document.getElementById('tech-telemetry-hud');
  const telemetryOutput = document.getElementById('telemetry-output');
  const closeHudBtn = document.getElementById('close-telemetry-hud');

  // Rich telemetry specifications for each sector
  const techTelemetryData = {
    ai: {
      title: 'ARTIFICIAL INTELLIGENCE // DEEP COGNITIVE TELEMETRY',
      status: 'OPTIMAL (SYNCHRONIZED)',
      metrics: [
        { label: 'Neural Throughput', value: '8.4 Petabytes/sec' },
        { label: 'Inference Latency', value: '0.12 milliseconds' },
        { label: 'Cognitive Synapses', value: '1.2 Trillion Nodes' },
        { label: 'Active Algorithm', value: 'Recursive Deep Synthesis v9.2' }
      ],
      description:
        'Continuous deep reinforcement architectures processing planetary sensor streams. Capable of predictive intuition, zero-shot real-time linguistics, and multi-vector threat mitigation.'
    },
    robotics: {
      title: 'ROBOTICS // KINETIC EXOSKELETON TELEMETRY',
      status: 'CALIBRATED // ARMED',
      metrics: [
        { label: 'Actuator Torque', value: '1,420 Nm @ 8,000 RPM' },
        { label: 'Kinematic Precision', value: '±0.002 Microns' },
        { label: 'Tensile Fiber Load', value: 'Carbon-Nanotube Grade 5' },
        { label: 'Haptic Feedback', value: '0.04ms Tactile Response' }
      ],
      description:
        'Autonomous kinetic units built with bio-mimetic carbon-nanotube musculature and ultra-responsive micro-hydraulic valves, executing high-precision maneuvers in extreme environments.'
    },
    cybernetics: {
      title: 'CYBERNETICS // NEURAL MESH TELEMETRY',
      status: 'BIO-COMPATIBLE // 100% LINKED',
      metrics: [
        { label: 'Cortical Synapses', value: '48,000 Direct Junctions' },
        { label: 'Bio-Energy Tap', value: '98.6% Efficient Cellular Draw' },
        { label: 'Optical Resolution', value: 'Full-Spectrum Hex-Band' },
        { label: 'Immune Rejection', value: '0.00% (Nanocoat Shield)' }
      ],
      description:
        'Seamless integration between carbon-based living neurons and silicon-diamond computational lattices. Eliminating biological friction while elevating physical reflexes.'
    },
    quantum: {
      title: 'QUANTUM COMPUTING // ENTANGLEMENT LOGIC TELEMETRY',
      status: 'SUPERPOSITION STABLE // 15mK',
      metrics: [
        { label: 'Coherent Qubits', value: '2,048 Superconducting Qubits' },
        { label: 'Cryo-Temp Stability', value: '0.015 Kelvin (Near Zero)' },
        { label: 'Quantum Decoherence', value: '&lt; 0.0001% per Cycle' },
        { label: 'Post-Quantum Defense', value: 'Lattice-Key Cryptography' }
      ],
      description:
        'Hyper-dimensional computing solving NP-hard simulations instantaneously. Capable of modeling molecular structures, cryptographic matrices, and astrophysical wormholes.'
    }
  };

  function displayTelemetry(techKey) {
    const data = techTelemetryData[techKey];
    if (!data || !telemetryHud || !telemetryOutput) return;

    telemetryOutput.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <h4 style="font-family: var(--font-heading); color: var(--neon-cyan); font-size: 1.1rem; margin: 0;">${data.title}</h4>
          <span style="font-family: var(--font-data); font-size: 0.85rem; color: #10B981; border: 1px solid #10B981; padding: 2px 8px; border-radius: 2px;">${data.status}</span>
        </div>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin: 0;">${data.description}</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-top: 6px;">
          ${data.metrics
            .map(
              (m) => `
            <div style="background: rgba(11, 16, 38, 0.8); border: 1px solid rgba(0, 245, 255, 0.2); padding: 10px 14px; border-radius: 4px;">
              <small style="font-family: var(--font-data); color: var(--text-dim); display: block; letter-spacing: 0.08em;">${m.label}</small>
              <strong style="font-family: var(--font-heading); color: var(--text-primary); font-size: 0.95rem;">${m.value}</strong>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    telemetryHud.style.display = 'block';
    telemetryHud.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Bind click handlers to cards & buttons
  techCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      const techKey = card.getAttribute('data-tech');
      displayTelemetry(techKey);
    });
  });

  inspectButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const techKey = btn.getAttribute('data-tech-id');
      displayTelemetry(techKey);
    });
  });

  if (closeHudBtn && telemetryHud) {
    closeHudBtn.addEventListener('click', () => {
      telemetryHud.style.display = 'none';
    });
  }

  /* ==========================================================================
     6. SECTION E: EXPERIENCE SECTION (INTERACTIVE SIMULATOR)
     ========================================================================== */
  const modeButtons = document.querySelectorAll('.mode-btn');
  const overclockSlider = document.getElementById('overclock-slider');
  const overclockVal = document.getElementById('overclock-val');
  const bandwidthSlider = document.getElementById('bandwidth-slider');
  const bandwidthVal = document.getElementById('bandwidth-val');
  const terminalLog = document.getElementById('terminal-log');
  const systemTimeDisplay = document.getElementById('system-time');

  // Real-time UTC System Clock
  function updateClock() {
    if (systemTimeDisplay) {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      systemTimeDisplay.textContent = `${hours}:${mins}:${secs} UTC`;
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Mode descriptions & log responses
  const simulationModes = {
    neural: {
      tag: 'tag-cyan',
      tagText: 'NEURAL',
      log: 'Switched protocol to NEURAL UPLINK. Synaptic resonance established at 99.8%.'
    },
    biomech: {
      tag: 'tag-purple',
      tagText: 'BIOMECH',
      log: 'Switched protocol to BIOMECH KINETICS. Actuator hydraulics pressurized to 4,500 PSI.'
    },
    quantum: {
      tag: 'tag-green',
      tagText: 'QUANTUM',
      log: 'Switched protocol to QUANTUM SYNAPSE. 2,048 Qubits entangled in cryogenic coherence.'
    }
  };

  function appendLog(tagClass, tagText, message) {
    if (!terminalLog) return;
    const now = new Date();
    const timeStr = `[${String(now.getUTCHours()).padStart(2, '0')}:${String(
      now.getUTCMinutes()
    ).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}]`;

    const logP = document.createElement('p');
    logP.className = 'log-line';
    logP.innerHTML = `<span class="log-time">${timeStr}</span> <span class="log-tag ${tagClass}">${tagText}</span> ${message}`;

    terminalLog.appendChild(logP);
    terminalLog.scrollTop = terminalLog.scrollHeight;
  }

  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      modeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const modeKey = btn.getAttribute('data-mode');
      const modeData = simulationModes[modeKey];
      if (modeData) {
        appendLog(modeData.tag, modeData.tagText, modeData.log);
      }
    });
  });

  // Slider adjustments
  if (overclockSlider && overclockVal) {
    overclockSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value).toFixed(1);
      overclockVal.textContent = `${val} GHz`;
    });

    overclockSlider.addEventListener('change', (e) => {
      appendLog(
        'tag-cyan',
        'OVERCLOCK',
        `Clock frequency updated to ${e.target.value} GHz. Thermal mitigation active.`
      );
    });
  }

  if (bandwidthSlider && bandwidthVal) {
    bandwidthSlider.addEventListener('input', (e) => {
      bandwidthVal.textContent = `${e.target.value}%`;
    });

    bandwidthSlider.addEventListener('change', (e) => {
      appendLog(
        'tag-purple',
        'BANDWIDTH',
        `Network allocation shifted to ${e.target.value}%. Uplink streaming stable.`
      );
    });
  }

  /* ==========================================================================
     7. SECTION F: ANIMATED NUMERICAL COUNTERS (INTERSECTION OBSERVER)
     ========================================================================== */
  const statsSection = document.getElementById('statistics');
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let hasAnimatedCounters = false;

  function runCounterAnimation() {
    statNumbers.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 1800; // Animation duration in milliseconds
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic calculation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        counter.textContent = `${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = `${target}${suffix}`;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedCounters) {
            hasAnimatedCounters = true;
            runCounterAnimation();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    statsObserver.observe(statsSection);
  } else {
    // Fallback if IntersectionObserver is unsupported
    runCounterAnimation();
  }

  /* ==========================================================================
     8. SECTION H: CONTACT FORM VALIDATION & TRANSMISSION SIMULATION
     ========================================================================== */
  const contactForm = document.getElementById('cyber-contact-form');
  const nameInput = document.getElementById('user-name');
  const emailInput = document.getElementById('user-email');
  const messageInput = document.getElementById('user-message');
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');
  const submitBtn = document.getElementById('submit-btn');
  const successHud = document.getElementById('submission-success');
  const receiptIdDisplay = document.getElementById('receipt-id');
  const receiptTimestampDisplay = document.getElementById('receipt-timestamp');
  const resetFormBtn = document.getElementById('reset-form-btn');

  // Email format validator
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // Field validation helpers
  function validateName() {
    if (!nameInput) return true;
    const isValid = nameInput.value.trim().length >= 2;
    if (!isValid) {
      nameInput.classList.add('invalid');
      nameError.classList.add('visible');
    } else {
      nameInput.classList.remove('invalid');
      nameError.classList.remove('visible');
    }
    return isValid;
  }

  function validateEmail() {
    if (!emailInput) return true;
    const isValid = isValidEmail(emailInput.value.trim());
    if (!isValid) {
      emailInput.classList.add('invalid');
      emailError.classList.add('visible');
    } else {
      emailInput.classList.remove('invalid');
      emailError.classList.remove('visible');
    }
    return isValid;
  }

  function validateMessage() {
    if (!messageInput) return true;
    const isValid = messageInput.value.trim().length >= 10;
    if (!isValid) {
      messageInput.classList.add('invalid');
      messageError.classList.add('visible');
    } else {
      messageInput.classList.remove('invalid');
      messageError.classList.remove('visible');
    }
    return isValid;
  }

  // Live validation on blur
  if (nameInput) nameInput.addEventListener('blur', validateName);
  if (emailInput) emailInput.addEventListener('blur', validateEmail);
  if (messageInput) messageInput.addEventListener('blur', validateMessage);

  // Clear errors on input typing
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.classList.contains('invalid')) validateName();
    });
  }
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (emailInput.classList.contains('invalid')) validateEmail();
    });
  }
  if (messageInput) {
    messageInput.addEventListener('input', () => {
      if (messageInput.classList.contains('invalid')) validateMessage();
    });
  }

  // Handle Form Submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isMessageValid = validateMessage();

      if (!isNameValid || !isEmailValid || !isMessageValid) {
        // Focus first invalid field
        if (!isNameValid) nameInput.focus();
        else if (!isEmailValid) emailInput.focus();
        else if (!isMessageValid) messageInput.focus();
        return;
      }

      // Simulate network packet transmission with button state
      submitBtn.disabled = true;
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <span class="btn-glow"></span>
        <span class="btn-text">TRANSMITTING PACKET...</span>
      `;

      setTimeout(() => {
        // Generate random unique receipt ID
        const randomHex = Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .toUpperCase()
          .padStart(6, '0');
        const receiptCode = `#NX-${randomHex}`;

        const now = new Date();
        const timestampStr = `${now.toUTCString()}`;

        if (receiptIdDisplay) receiptIdDisplay.textContent = receiptCode;
        if (receiptTimestampDisplay) receiptTimestampDisplay.textContent = timestampStr;

        // Hide form and display success HUD
        contactForm.style.display = 'none';
        if (successHud) successHud.style.display = 'block';

        // Reset submit button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }, 900);
    });
  }

  // Reset / Send another transmission
  if (resetFormBtn && contactForm && successHud) {
    resetFormBtn.addEventListener('click', () => {
      contactForm.reset();
      contactForm.style.display = 'block';
      successHud.style.display = 'none';
      if (nameInput) nameInput.focus();
    });
  }

  /* ==========================================================================
     9. SCROLL REVEAL FADE-IN ANIMATION
     ========================================================================== */
  const revealElements = document.querySelectorAll('.cyber-card, .tech-card, .stat-card, .cta-banner');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      revealObserver.observe(el);
    });
  }
});

