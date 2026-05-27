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
  const feedbackMsg = document.getElementById('form-feedback');
  const footerQuestion = document.querySelector('.footer-text'); // On cible la question dans le footer

  let etapeActuelle = 1; // On initialise le jeu à la première étape

  function checkAnswer() {
    const userAnswer = inputField.value.trim().toUpperCase();


    // STEP 1 : RAISON DE LA DÉFECTION

    if (etapeActuelle === 1) {
      if (userAnswer === "MODE DE VIE") {
        
        feedbackMsg.textContent = "ACCÈS AUTORISÉ";
        feedbackMsg.className = "feedback-msg success"; 
        
        // 1. On affiche l'icône Fallguy
        const secretIcon = document.querySelector('.terminal-icon--secret');
        const secretWindow = document.querySelector('.terminal-window--secret');
        
        if (secretIcon) {
          secretIcon.classList.remove('hidden-element');
          secretIcon.style.display = "flex"; 
          gsap.fromTo(secretIcon, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 });
        }
        if (secretWindow) {
          secretWindow.classList.remove('hidden-element');
        }

        // STEP 2 SI BON
        inputField.value = ""; // Vide le champ
        footerQuestion.textContent = "But du projet Fallguy : "; // Change la question
        etapeActuelle = 2; // Le jeu passe au niveau 2

      } else {
        feedbackMsg.textContent = "ACCÈS REFUSÉ";
        feedbackMsg.className = "feedback-msg error"; 
        inputField.value = "";
      }
    }
    
   // PART 2
    else if (etapeActuelle === 2) {
      // Réponse 
      if (userAnswer === "LIVRER UN AGENT DE L'OUEST") {
        
        feedbackMsg.textContent = "ACCÈS AUTORISÉ";
        feedbackMsg.className = "feedback-msg success"; 
        
        // 1. On affiche la nouvelle icône pour la 2ème fenetre
        const iconEtape2 = document.querySelector('.terminal-icon--secret__two');
        const winEtape2 = document.querySelector('.terminal-window--secret__two');
        
        if (iconEtape2) {
          iconEtape2.classList.remove('hidden-element');
          iconEtape2.style.display = "flex";
          gsap.fromTo(iconEtape2, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 });
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
        feedbackMsg.textContent = "ACCÈS REFUSÉ";
        feedbackMsg.className = "feedback-msg error"; 
        inputField.value = "";
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