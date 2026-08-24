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
    btn.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
    btn.addEventListener('mousedown', (e) => e.stopPropagation());
    
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
    
    // Anti-GSAP 
    const filterBox = toggle.closest('.window-header--filter');
    if (filterBox) {
      filterBox.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
      filterBox.addEventListener('mousedown', (e) => e.stopPropagation());
    }

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


// SYSTEME DE TEXTE A TROU + POINTS DE VIE

  const submitBtn = document.getElementById('submit-answer');
  const inputField = document.getElementById('terminal-answer'); 
  const footerQuestion = document.querySelector('.footer-text'); 
  const terminalNotification = document.getElementById('terminal-notification');
  const terminalNotificationText = document.getElementById('terminal-notification-text');

  let viesRestantes = 3;
  const hpDisplay = document.getElementById('hp-display');

  function perdreVie() {
    viesRestantes--;
    
    if (viesRestantes === 2) {
      hpDisplay.textContent = "[■] [■] [ ]";
    } else if (viesRestantes === 1) {
      hpDisplay.textContent = "[■] [ ] [ ]";
      hpDisplay.style.color = "orange"; 
      hpDisplay.classList.add('blink-simple'); 
    } else if (viesRestantes <= 0) {
      hpDisplay.textContent = "[ ] [ ] [ ]";
      hpDisplay.style.color = "red";
      
      // GAME OVER : Déclenche l'écran de Shutdown
      const shutdownScreen = document.getElementById('shutdown-screen');
      if (shutdownScreen) {
        shutdownScreen.classList.remove('hidden-element');
        gsap.fromTo(shutdownScreen, 
          { autoAlpha: 0, scale: 1.1 }, 
          { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power4.in" }
        );
      }
    }
  }

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
        footerQuestion.textContent = "Technologie de l'armement : "; 
        etapeActuelle = 2; 

      } else {
        showCenterMessage("INFORMATION ERRONÉE", "error");
        perdreVie();
        inputField.value = "";
        // Le champ de texte tremble si c'est faux !
        gsap.fromTo(inputField, { x: 5 }, { x: 0, duration: 0.05, repeat: 4, yoyo: true });
      }
    }
    
   // PART 2
    else if (etapeActuelle === 2) {
      if (userAnswer === "GRAVITATIONNEL") {
        
        showCenterMessage("INFORMATION FIABLE", "success");
        
        const iconEtape2 = document.querySelector('.terminal-icon--secret__four');
        const winEtape2 = document.querySelector('.terminal-window--secret__four');
        
        if (iconEtape2) {
          iconEtape2.classList.remove('hidden-element');
          iconEtape2.style.display = "flex";
          gsap.fromTo(iconEtape2, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0 });
        }
        if (winEtape2) {
          winEtape2.classList.remove('hidden-element');
        }

        inputField.value = "";
        
        footerQuestion.textContent = "Emplacement de Rohrbach : "; 
        etapeActuelle = 3; 

      } else {
        showCenterMessage("INFORMATION ERRONÉE", "error");
        perdreVie();
        inputField.value = "";
        gsap.fromTo(inputField, { x: 5 }, { x: 0, duration: 0.05, repeat: 4, yoyo: true });
      }
    }

     else if (etapeActuelle === 3) {
      if (userAnswer === "BERLIN") {
        
        showCenterMessage("INFORMATION FIABLE", "success");
        
        const iconEtape3 = document.querySelector('.terminal-icon--secret__two');
        const winEtape3 = document.querySelector('.terminal-window--secret__two');
        
        if (iconEtape3) {
          iconEtape3.classList.remove('hidden-element');
          iconEtape3.style.display = "flex";
          gsap.fromTo(iconEtape3, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0 });
        }
        if (winEtape3) {
          winEtape3.classList.remove('hidden-element');
        }

        inputField.value = "";
        
        footerQuestion.textContent = "But du projet Fallguy : "; 
        etapeActuelle = 3; 

      } else {
        showCenterMessage("INFORMATION ERRONÉE", "error");
        perdreVie();
        inputField.value = "";
        gsap.fromTo(inputField, { x: 5 }, { x: 0, duration: 0.05, repeat: 4, yoyo: true });
      }
    }


    // PART 4
  else if (etapeActuelle === 3) {
      if (userAnswer === "LIVRER UN AGENT DE L'OUEST") { 
        
        showCenterMessage("CRYPTAGE DÉTECTÉ", "error");
        
        inputField.value = "";
        inputField.disabled = true;
        submitBtn.disabled = true;

        const hackWindow = document.querySelector('.terminal-window--hack');
        if (hackWindow) {
          hackWindow.classList.remove('hidden-element');
          hackWindow.classList.add('active');
          zIndexCounter++;
          hackWindow.style.zIndex = zIndexCounter;
          
          initHack(); // Lance le minijeu
        }

      } else {
        showCenterMessage("INFORMATION ERRONÉE", "error");
        perdreVie();
        inputField.value = "";
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
        if (targetName === 'secret__three') {
          
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


  // Système de grattage en mobile

 function handleResize() {
    const motsCensures = document.querySelectorAll('.text-normal .classified, .text-normal .is-split');

    if (window.innerWidth <= 1024) {
      motsCensures.forEach(mot => {
        if (!mot.classList.contains('is-split')) {
          mot.setAttribute('data-original', mot.textContent); 
          const lettres = mot.textContent.split('');
          
          mot.innerHTML = ''; 
          mot.classList.remove('classified');
          mot.classList.add('is-split');
          
          lettres.forEach(lettre => {
            const span = document.createElement('span');
            span.innerHTML = lettre === ' ' ? '&nbsp;' : lettre; 
            span.className = 'classified scratch-letter';
            mot.appendChild(span);
          });
        }
      });
    } else {
   
      motsCensures.forEach(mot => {
        if (mot.classList.contains('is-split')) {
          mot.textContent = mot.getAttribute('data-original'); 
          mot.classList.remove('is-split');
          mot.classList.add('classified'); 
        }
      });
    }
  }

  handleResize();
  
  window.addEventListener('resize', handleResize);

  // 2. L'ACTION DE GRATTAGE
  const gratterTexte = (e) => {
    // Évite les erreurs si pas tactile
    if (!e.touches || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    const elementUnderFinger = document.elementFromPoint(touch.clientX, touch.clientY);
    
    // Si le doigt touche le mot classifié
    if (elementUnderFinger && elementUnderFinger.classList.contains('scratch-letter') && elementUnderFinger.classList.contains('classified')) {
      
      // ... ET DCV est sur "ON"
      const container = elementUnderFinger.closest('.spotlight-container');
      if (container && container.classList.contains('is-revealing')) {
        
        // On dévoile lettre par lettre
        elementUnderFinger.classList.remove('classified');
        elementUnderFinger.classList.add('declassified');
        
        // Anim apparition lettre
        gsap.fromTo(elementUnderFinger, 
          { opacity: 0 }, 
          { opacity: 1, duration: 0.2 }
        );
      }
    }
  };

  document.addEventListener('touchmove', gratterTexte, { passive: true });
  document.addEventListener('touchstart', gratterTexte, { passive: true });


  // Système Breach Protocol

  const hackMatrix = document.getElementById('hack-matrix');
  const hackBufferSlots = document.querySelectorAll('.buffer-slot');
  const hackMessage = document.getElementById('hack-message');

  const codesPool = ["1C", "BD", "55", "E9", "FF", "7A"];
  let targetSeq = []; 
  let hackGrid = [];
  let isRowPhase = true;
  let activeLine = 0; 
  let hackBuffer = [];
  const MAX_BUFFER = 4; 

  function initHack() {
    hackGrid = [];
    hackBuffer = [];
    isRowPhase = true;
    activeLine = 0;
    if(hackMatrix) hackMatrix.style.pointerEvents = "auto"; 

    // 1. Séquence cible aléatoire
    targetSeq = [];
    for(let i = 0; i < 3; i++) {
      targetSeq.push(codesPool[Math.floor(Math.random() * codesPool.length)]);
    }
    
    const targetUI = document.querySelectorAll('.target-code');
    if (targetUI.length === 3) {
      targetUI[0].textContent = targetSeq[0];
      targetUI[1].textContent = targetSeq[1];
      targetUI[2].textContent = targetSeq[2];
    }

    if(hackBufferSlots) {
        hackBufferSlots.forEach(slot => {
            slot.textContent = "";
            slot.style.borderColor = "var(--theme-color)";
        });
    }

    if(hackMessage) {
        hackMessage.textContent = "> NOUS AVONS INTERCEPTÉ UN RAPPORT SECRET DONT NOUS IGNORONS LE CONTENU, DÉCOUVREZ-LE. SÉLECTIONNEZ UNE CLÉ DANS LA PREMIÈRE LIGNE.";
        hackMessage.className = "hack-message";
        hackMessage.style.color = "var(--theme-color)";
    }

    // 2. Remplissage aléatoire de la grille
    for (let r = 0; r < 5; r++) {
      let row = [];
      for (let c = 0; c < 5; c++) {
        row.push(codesPool[Math.floor(Math.random() * codesPool.length)]);
      }
      hackGrid.push(row);
    }

    // 3. Chemin (Ligne -> Colonne -> Ligne)
    let c0 = Math.floor(Math.random() * 5);
    hackGrid[0][c0] = targetSeq[0];

    let r1 = Math.floor(Math.random() * 4) + 1; 
    hackGrid[r1][c0] = targetSeq[1];

    let c1 = Math.floor(Math.random() * 5);
    while (c1 === c0) { c1 = Math.floor(Math.random() * 5); }
    hackGrid[r1][c1] = targetSeq[2];

    drawMatrix();
  }

  function drawMatrix() {
    if(!hackMatrix) return;
    hackMatrix.innerHTML = "";
    
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const cell = document.createElement('div');
        cell.className = 'matrix-cell';
        cell.textContent = hackGrid[r][c];

        if (hackGrid[r][c] === "") {
          cell.classList.add('used');
          cell.textContent = "[-]";
        } else {
          if (isRowPhase && r === activeLine) {
            cell.classList.add('active-zone');
            cell.addEventListener('click', () => handleCellClick(r, c));
          } else if (!isRowPhase && c === activeLine) {
            cell.classList.add('active-zone');
            cell.addEventListener('click', () => handleCellClick(r, c));
          }
        }
        hackMatrix.appendChild(cell);
      }
    }
  }

  function handleCellClick(r, c) {
    const code = hackGrid[r][c];
    hackBuffer.push(code); 
    hackGrid[r][c] = ""; 

    if(hackBufferSlots[hackBuffer.length - 1]) {
        hackBufferSlots[hackBuffer.length - 1].textContent = code;
    }

    isRowPhase = !isRowPhase;
    activeLine = isRowPhase ? r : c; 

    checkHackStatus();
  }

  function checkHackStatus() {
    const bufferStr = hackBuffer.join(",");
    const targetStr = targetSeq.join(",");

    if (bufferStr.includes(targetStr)) {
      if(hackMessage) {
          hackMessage.textContent = "> ACCÈS AUTORISÉ. DÉCRYPTAGE TERMINÉ.";
          hackMessage.classList.remove('blink-text');
      }
      if(hackMatrix) hackMatrix.style.pointerEvents = "none";
      unlockFinalFiles(); 
      
    } else if (hackBuffer.length >= MAX_BUFFER) {
      if(hackMessage) {
          hackMessage.textContent = "> ÉCHEC. RÉINITIALISATION DU PROTOCOLE...";
          hackMessage.style.color = "red";
      }
      perdreVie();
      if(hackMatrix) hackMatrix.style.pointerEvents = "none";
      if(hackBufferSlots) hackBufferSlots.forEach(s => s.style.borderColor = "red");
      
      setTimeout(initHack, 1500); 
    } else {
      if(hackMessage) {
          hackMessage.textContent = isRowPhase ? "> SÉLECTIONNEZ UNE CLÉ DANS LA LIGNE EN SURBRILLANCE." : "> SÉLECTIONNEZ UNE CLÉ DANS LA COLONNE EN SURBRILLANCE.";
      }
      drawMatrix();
    }
  }

  function unlockFinalFiles() {
    const iconEtape3 = document.querySelector('.terminal-icon--secret__three');
    const winEtape3 = document.querySelector('.terminal-window--secret__three');
    
    if (iconEtape3) {
      iconEtape3.classList.remove('hidden-element');
      iconEtape3.style.display = "flex";
      gsap.fromTo(iconEtape3, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 });
    }
    if (winEtape3) {
      winEtape3.classList.remove('hidden-element');
    }

    setTimeout(() => {
      const hackWindow = document.querySelector('.terminal-window--hack');
      if (hackWindow) hackWindow.classList.remove('active');
    }, 2500);
    
    const footerQuestion = document.querySelector('.footer-text'); 
    if(footerQuestion) footerQuestion.textContent = "SYSTÈME ENTIÈREMENT DÉVERROUILLÉ.";
  }