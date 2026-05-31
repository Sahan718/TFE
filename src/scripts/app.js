"use strict";

  // SÉQUENCE DE DÉMARRAGE (GSAP)

  gsap.registerPlugin(TextPlugin);

  const bootScreen = document.getElementById('boot-screen');
  const briefingContainer = document.getElementById('boot-briefing');
  const bootBtn = document.getElementById('boot-btn');
  const logsP = document.querySelectorAll('#boot-logs p');

  // ANTIBUG pour les br
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
    text: {
      value: briefingText,
      html: true // Dit à GSAP : "Interprète les balises HTML, ne les écris pas !"
    },
    duration: 4, // L'effet machine à écrire durera 4 secondes
    ease: "none"
  })
  .to(bootBtn, {
    autoAlpha: 1, // Fait apparaître le bouton avec un fondu
    duration: 0
  }, "+=0.3");

  // Fermeture du boot screen au clic du bouton
  bootBtn.addEventListener('click', () => {
    gsap.to(bootScreen, {
      autoAlpha: 0, // Fondu noir
      duration: 0,
      onComplete: () => {
        bootScreen.style.display = 'none'; // Détruit l'écran de chargement
      }
    });
  });



  // GESTION DES FENÊTRES DE L'OS (Ouverture/Fermeture)

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


  // SYSTÈME DE GLISSER-DÉPOSER (DRAG)

  // On cible toutes les fenêtres
  const draggableWindows = document.querySelectorAll('.terminal-window');

  // On les prend une par une
  draggableWindows.forEach(win => {
    
    // On trouve le header SPÉCIFIQUE qui est à l'intérieur de cette fenêtre
    const localHeader = win.querySelector('.window-header');

    // On crée l'action de glisser uniquement pour cette fenêtre
    Draggable.create(win, {
      type: "x,y",
      trigger: localHeader, // Le déclencheur est uniquement CE header !
      bounds: window,
      
      onPress: function() {
        zIndexCounter++;
        this.target.style.zIndex = zIndexCounter;
      }
    });
  });


  // SYSTÈME DE LAMPE TORCHE / MASQUE AU SURVOL

  
  // BOUTON DU MASQUE
  const filterToggles = document.querySelectorAll('.filter-dcv-toggle');

  filterToggles.forEach(toggle => {
    toggle.addEventListener('change', (e) => {
      const parentWindow = toggle.closest('.terminal-window');
      if (parentWindow) {
        // CIBLAGE CONTAINER
        const container = parentWindow.querySelector('.spotlight-container');
        if (container) {
          if (e.target.checked) {
            container.classList.add('is-revealing'); // ON
          } else {
            container.classList.remove('is-revealing'); // OFF
          }
        }
      }
    });
  });

  // LUMIERE EN HOVER
  const spotlights = document.querySelectorAll('.spotlight-container');

  spotlights.forEach(spotlight => {
    spotlight.addEventListener('mousemove', (e) => {
      // SEULEMENT QUAND C'EST ON
      if (!spotlight.classList.contains('is-revealing')) return;

      // Récupère les dimensions de la fenêtre pour être précis
      const rect = spotlight.getBoundingClientRect();
      
      // Calcule la position X et Y de la souris à l'intérieur de l'image
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Envoie les nouvelles coordonnées au CSS
      spotlight.style.setProperty('--x', `${x}px`);
      spotlight.style.setProperty('--y', `${y}px`);
    });
  });


// SYSTEME DE TEXTE A TROU 

  const submitBtn = document.getElementById('submit-answer');
  const inputField = document.getElementById('terminal-answer'); 
  const footerQuestion = document.querySelector('.footer-text'); 
  const terminalNotification = document.getElementById('terminal-notification');
  const terminalNotificationText = document.getElementById('terminal-notification-text');

  let etapeActuelle = 1; 

  function showCenterMessage(text, statusClass) {
    if (!terminalNotification) return;

    // On change le texte et la couleur (success/error)
    terminalNotificationText.textContent = text;
    terminalNotification.className = statusClass; 
    terminalNotification.classList.remove('hidden-element');
    
    // Animation pop-up
    gsap.fromTo(terminalNotification, 
      { autoAlpha: 0, scale: 0.9 }, 
      { autoAlpha: 1, scale: 1, duration: 0.1 }
    );

    // Fait disparaître le message après 2 secondes
    setTimeout(() => {
      gsap.to(terminalNotification, { autoAlpha: 0, duration: 0.2 });
    }, 2000);
  }

  function checkAnswer() {
    const userAnswer = inputField.value.trim().toUpperCase();

    // STEP 1 : RAISON DE LA DÉFECTION
    if (etapeActuelle === 1) {
      if (userAnswer === "MODE DE VIE") {
        
        showCenterMessage("INFORMATION FIABLE", "success");
        
        // 1. On affiche l'icône Fallguy
        const secretIcon = document.querySelector('.terminal-icon--secret');
        const secretWindow = document.querySelector('.terminal-window--secret');
        
        if (secretIcon) {
          secretIcon.classList.remove('hidden-element');
          secretIcon.style.display = "flex"; 
          gsap.fromTo(secretIcon, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0 });
        }
        if (secretWindow) {
          secretWindow.classList.remove('hidden-element');
        }

        // STEP 2 SI BON
        inputField.value = ""; 
        footerQuestion.textContent = "But du projet Fallguy : "; 
        etapeActuelle = 2; 

      } else {
        showCenterMessage("INFORMATION ERRONÉE", "error");
        inputField.value = "";
        // Le champ de texte tremble si c'est faux !
        gsap.fromTo(inputField, { x: 5 }, { x: 0, duration: 0.05, repeat: 4, yoyo: true });
      }
    }
    
   // PART 2
    else if (etapeActuelle === 2) {
      // Réponse 
      if (userAnswer === "LIVRER UN AGENT DE L'OUEST") {
        
        showCenterMessage("INFORMATION FIABLE", "success");
        
        // 1. On affiche la nouvelle icône pour la 2ème fenetre
        const iconEtape2 = document.querySelector('.terminal-icon--secret__two');
        const winEtape2 = document.querySelector('.terminal-window--secret__two');
        
        if (iconEtape2) {
          iconEtape2.classList.remove('hidden-element');
          iconEtape2.style.display = "flex";
          gsap.fromTo(iconEtape2, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0 });
        }
        if (winEtape2) {
          winEtape2.classList.remove('hidden-element');
        }

        // 2. FIN DU JEU : On bloque tout
        inputField.value = "";
        inputField.disabled = true;
        submitBtn.disabled = true;
        footerQuestion.textContent = "SYSTÈME ENTIÈREMENT DÉVERROUILLÉ.";

      } else {
        showCenterMessage("INFORMATION ERRONÉE", "error");
        inputField.value = "";
        // Le champ tremble
        gsap.fromTo(inputField, { x: 5 }, { x: 0, duration: 0.05, repeat: 4, yoyo: true });
      }
    }
  }

  // Écoute les actions (Clic ou Enter)
  if (submitBtn && inputField) {
    submitBtn.addEventListener('click', checkAnswer);
    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        checkAnswer();
      }
    });
  }

  // Event listener au clic des fenetres (pr determiner si oui ou non c'est le bon par après)
  icons.forEach(icon => {
    icon.addEventListener('click', () => {
      const targetName = icon.getAttribute('data-target');
      const windowSelector = `.terminal-window--${targetName}`;
      const targetWindow = document.querySelector(windowSelector);
      
      if (targetWindow) {
        targetWindow.classList.add('active');
        zIndexCounter++;
        targetWindow.style.zIndex = zIndexCounter;

        // DÉCLENCHEUR DU SHUTDOWN FINAL

        // Si la fenêtre ouverte est le rapport secret
        if (targetName === 'secret__two') {
          
          // Compte à rebours de 20 secondes (20000 ms) 
          setTimeout(() => {
            const shutdownScreen = document.getElementById('shutdown-screen');
            
            if (shutdownScreen) {
              // Retire la classe hidden-element pour montrer 
              shutdownScreen.classList.remove('hidden-element');
              
              // Apparition avec GSAP
              gsap.fromTo(shutdownScreen, 
                { autoAlpha: 0, scale: 1.1 }, 
                { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power4.in" }
              );
            }
          }, 50000); 
        }
      }
    });
  });


  const clockElement = document.getElementById('real-time-clock');
  
  if (clockElement) {
    // setInterval exécute le code en boucle toutes les 1000 millisecondes (1 seconde)
    setInterval(() => {
      const now = new Date();
      // On formate l'heure pour qu'elle s'affiche en HH:MM:SS
      const timeString = now.toLocaleTimeString('fr-FR', { hour12: false });
      clockElement.textContent = timeString;
    }, 1000);
  }