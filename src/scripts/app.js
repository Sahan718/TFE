"use strict";

  // ==========================================
  // 1. SÉQUENCE DE DÉMARRAGE (GSAP)
  // ==========================================
  gsap.registerPlugin(TextPlugin);

  const bootScreen = document.getElementById('boot-screen');
  const briefingContainer = document.getElementById('boot-briefing');
  const bootBtn = document.getElementById('boot-btn');
  const logsP = document.querySelectorAll('#boot-logs p');

  // CRUCIAL : On utilise innerHTML pour capturer les <br> de ton HTML
  const briefingText = briefingContainer.innerHTML.trim();
  
  // On vide la boîte pour préparer l'animation
  briefingContainer.innerHTML = "";
  briefingContainer.style.visibility = "visible";

  // Création de la chorégraphie GSAP
  const tl = gsap.timeline();

  tl.to(logsP, {
    display: "block",
    duration: 0.01,
    stagger: 0.2 // Temps entre chaque ligne de log
  })
  .to("#boot-logs", {
    autoAlpha: 0,
    display: "none",
    duration: 0.2
  }, "+=0.5")
  .to(briefingContainer, {
    // LA CONFIGURATION MAGIQUE POUR LES <BR> EST ICI :
    text: {
      value: briefingText,
      html: true // Dit à GSAP : "Interprète les balises HTML, ne les écris pas !"
    },
    duration: 4, // L'effet machine à écrire durera 4 secondes
    ease: "none"
  })
  .to(bootBtn, {
    autoAlpha: 1, // Fait apparaître le bouton avec un fondu
    duration: 0.5
  }, "+=0.3");

  // Fermeture du boot screen au clic du bouton
  bootBtn.addEventListener('click', () => {
    gsap.to(bootScreen, {
      autoAlpha: 0, // Fondu noir
      duration: 1,
      onComplete: () => {
        bootScreen.style.display = 'none'; // Détruit l'écran de chargement
      }
    });
  });


  // ==========================================
  // 2. GESTION DES FENÊTRES DE L'OS (Ouverture/Fermeture)
  // ==========================================
  const icons = document.querySelectorAll('.terminal-icon');
  const closeButtons = document.querySelectorAll('.close-btn');
  const windows = document.querySelectorAll('.terminal-window');
  
  let zIndexCounter = 100;

  // Ouvrir les fenêtres
  icons.forEach(icon => {
    icon.addEventListener('click', () => {
      const targetName = icon.getAttribute('data-target');
      const windowSelector = `.terminal-window--${targetName}`;
      const targetWindow = document.querySelector(windowSelector);
      
      if (targetWindow) {
        targetWindow.classList.add('active');
        zIndexCounter++;
        targetWindow.style.zIndex = zIndexCounter;
      }
    });
  });

  // Fermer les fenêtres
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentWindow = btn.closest('.terminal-window');
      if (parentWindow) {
        parentWindow.classList.remove('active');
      }
    });
  });

  // Mettre la fenêtre au premier plan au clic
  windows.forEach(win => {
    win.addEventListener('mousedown', () => {
      zIndexCounter++;
      win.style.zIndex = zIndexCounter;
    });
  });


  // ==========================================
  // 3. SYSTÈME DE GLISSER-DÉPOSER (DRAG)
  // ==========================================
  windows.forEach(win => {
    const header = win.querySelector('.window-header');
    
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    header.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('close-btn')) return;

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = win.offsetLeft;
      initialTop = win.offsetTop;
      
      e.preventDefault();

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
      if (!isDragging) return;
      const distanceX = e.clientX - startX;
      const distanceY = e.clientY - startY;
      win.style.left = `${initialLeft + distanceX}px`;
      win.style.top = `${initialTop + distanceY}px`;
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  });