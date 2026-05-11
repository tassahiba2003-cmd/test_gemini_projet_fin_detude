export const mockCatalogData = {
  "imagerie": {
    name: "Imagerie Médicale",
    description: "Découvrez notre gamme complète de scanners, IRM et appareils de radiographie de dernière génération pour un diagnostic précis.",
    products: [
      { id: 101, name: "Scanner IRM Optima 1.5T", price: 245000, imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800", isPriority: true, inStock: true, stockCount: 2, description: "Le système Optima 1.5T offre une qualité d'image exceptionnelle et un confort patient accru.", specs: ["Champ magnétique : 1.5 Tesla", "Tunnel : 70 cm", "Consommation réduite de 30%"] },
      { id: 102, name: "Échographe Portable V5", price: 12500, imageUrl: "https://images.unsplash.com/photo-1583912267550-d44d4a3c392c?w=800", isPriority: false, inStock: true, stockCount: 5, description: "Léger et puissant, l'échographe V5 permet une imagerie de haute résolution au chevet du patient.", specs: ["Autonomie : 4h", "Écran tactile 12 pouces", "Sondes multifréquences"] },
      { id: 103, name: "Système de Radiographie X-Ray", price: 54000, imageUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800", isPriority: false, inStock: false, stockCount: 0, description: "Système de radiographie numérique polyvalent pour des examens de routine rapides.", specs: ["Capteur plan numérique", "Générateur haute fréquence", "Table élévatrice"] },
      { id: 104, name: "Échographe 3D/4D Premium", price: 32000, imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800", isPriority: true, inStock: true, stockCount: 3, description: "La référence en imagerie gynécologique et obstétrique avec rendu 4D en temps réel.", specs: ["Rendu HD Live", "Écran OLED 23 pouces", "Doppler couleur ultrasensible"] },
      { id: 105, name: "Mammographe Numérique", price: 85000, imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800", isPriority: false, inStock: true, stockCount: 4, description: "Mammographe avec tomosynthèse pour un dépistage précis et précoce du cancer du sein.", specs: ["Tomosynthèse 3D", "Compression ergonomique", "Dose de rayons X réduite"] }
    ]
  },
  "mobilier": {
    name: "Mobilier Médical",
    description: "Lits médicalisés, tables d'examen et fauteuils ergonomiques pour le confort optimal des patients et des soignants.",
    products: [
      { id: 201, name: "Lit Médicalisé Électrique V3", price: 2800, imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800", isPriority: true, inStock: true, stockCount: 15, description: "Lit à hauteur variable électrique conçu pour le confort du patient et la facilité de soin.", specs: ["Charge max : 250kg", "Freinage centralisé", "Barrières escamotables"] },
      { id: 202, name: "Table d'Examen Hydraulique", price: 1450, imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800", isPriority: false, inStock: false, stockCount: 0, description: "Table d'examen robuste avec réglage en hauteur par pédale hydraulique.", specs: ["Sellerie expansée", "Dossier inclinable par vérin à gaz", "Support rouleau papier"] },
      { id: 203, name: "Fauteuil de Prélèvement", price: 850, imageUrl: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800", isPriority: false, inStock: true, stockCount: 8, description: "Fauteuil confortable avec accoudoirs réglables, idéal pour les laboratoires d'analyses.", specs: ["Accoudoirs articulés", "Position de Trendelenburg", "Mousse haute densité"] },
      { id: 204, name: "Chariot de Soins Inox", price: 420, imageUrl: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800", isPriority: true, inStock: true, stockCount: 20, description: "Chariot en acier inoxydable pour le transport de matériel et de médicaments.", specs: ["2 plateaux", "Tiroir coulissant", "Roulettes antistatiques"] },
      { id: 205, name: "Paravent Médical 3 Panneaux", price: 150, imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800", isPriority: false, inStock: true, stockCount: 12, description: "Paravent pliable pour préserver l'intimité des patients lors des soins.", specs: ["Toile plastifiée lavable", "Structure tubulaire époxy", "Roulettes pivotantes"] }
    ]
  },
  "dentaire": {
    name: "Équipement Dentaire",
    description: "Unités de soins, fauteuils dentaires et imagerie panoramique pour les cabinets de stomatologie.",
    products: [
      { id: 301, name: "Unité Dentaire Complète Pro", price: 18500, imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800", isPriority: true, inStock: true, stockCount: 2, description: "Fauteuil dentaire ergonomique avec unit complet, éclairage LED et crachoir en céramique.", specs: ["Pédale multifonction", "Système d'aspiration chirurgicale", "Détartreur intégré"] },
      { id: 302, name: "Radio Panoramique 3D", price: 22000, imageUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800", isPriority: false, inStock: true, stockCount: 1, description: "Appareil d'imagerie panoramique et céphalométrique pour un diagnostic dentaire complet.", specs: ["Capteur CMOS", "Temps d'acquisition : 14s", "Logiciel 3D inclus"] },
      { id: 303, name: "Autoclave Stérilisation 18L", price: 3500, imageUrl: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800", isPriority: false, inStock: false, stockCount: 0, description: "Autoclave de classe B assurant la stérilisation parfaite de tous vos instruments.", specs: ["Volume : 18 Litres", "Cycles rapides", "Imprimante de traçabilité intégrée"] },
      { id: 304, name: "Lampe à Polymériser LED", price: 450, imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800", isPriority: false, inStock: true, stockCount: 10, description: "Lampe sans fil haute puissance pour un durcissement rapide des composites.", specs: ["Intensité : 1200 mW/cm²", "Autonomie : 400 cycles", "Design ergonomique léger"] }
    ]
  },
  "laboratoire": {
    name: "Laboratoire",
    description: "Matériel d'analyse, microscopes et centrifugeuses pour les laboratoires de biologie médicale.",
    products: [
      { id: 401, name: "Microscope Binoculaire LED", price: 1200, imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800", isPriority: true, inStock: true, stockCount: 8, description: "Microscope de laboratoire performant avec éclairage LED réglable et objectifs achromatiques.", specs: ["Grossissement : 40x à 1000x", "Tête orientable à 360°", "Mise au point coaxiale"] },
      { id: 402, name: "Centrifugeuse de Paillasse", price: 2100, imageUrl: "https://images.unsplash.com/photo-1583912267550-d44d4a3c392c?w=800", isPriority: false, inStock: true, stockCount: 5, description: "Centrifugeuse ventilée idéale pour la séparation des échantillons sanguins.", specs: ["Vitesse max : 6000 tr/min", "Minuterie digitale", "Verrouillage de sécurité"] },
      { id: 403, name: "Analyseur Hématologie Automatique", price: 15400, imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800", isPriority: true, inStock: false, stockCount: 0, description: "Analyseur rapide et précis pour la numération formule sanguine complète (NFS).", specs: ["Cadence : 60 tests/heure", "Écran tactile couleur", "Nettoyage automatique de la sonde"] },
      { id: 404, name: "Congélateur Ultra Basse Température", price: 8900, imageUrl: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800", isPriority: false, inStock: true, stockCount: 2, description: "Congélateur -86°C pour le stockage sécurisé de vaccins, virus et échantillons biologiques.", specs: ["Volume : 400 Litres", "Alarme visuelle et sonore", "Isolation VIP (Vacuum Insulation Panel)"] }
    ]
  },
  "chirurgie": {
    name: "Bloc Opératoire",
    description: "Tables d'opération, éclairage chirurgical et bistouris pour équiper vos blocs opératoires.",
    products: [
      { id: 501, name: "Table d'Opération Universelle", price: 28000, imageUrl: "https://images.unsplash.com/photo-1551076805-e166946c9ebf?w=800", isPriority: true, inStock: true, stockCount: 3, description: "Table multi-sections radiotransparente, adaptée à la chirurgie générale et spécialisée.", specs: ["Mouvements électro-hydrauliques", "Charge max : 300kg", "Matelas à mémoire de forme"] },
      { id: 502, name: "Éclairage Scialytique LED Plafond", price: 12500, imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800", isPriority: false, inStock: true, stockCount: 5, description: "Double coupole LED fournissant un éclairage froid, sans ombre portée, idéal pour la chirurgie.", specs: ["Intensité lumineuse : 160 000 Lux", "Température de couleur réglable", "Durée de vie LED : 50 000h"] },
      { id: 503, name: "Bistouri Électrique Haute Fréquence", price: 4200, imageUrl: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800", isPriority: false, inStock: true, stockCount: 7, description: "Générateur d'électrochirurgie polyvalent pour coupe pure, coagulation et chirurgie bipolaire.", specs: ["Puissance max : 400W", "Contrôle automatique de l'impédance", "Pédale double commande"] },
      { id: 504, name: "Respirateur d'Anesthésie", price: 35000, imageUrl: "https://images.unsplash.com/photo-1583912267550-d44d4a3c392c?w=800", isPriority: true, inStock: false, stockCount: 0, description: "Station d'anesthésie complète avec ventilation avancée et monitoring des gaz.", specs: ["Ventilateur électronique", "Vaporisateur halogéné intégré", "Absorbeur de CO2"] }
    ]
  },
  "monitoring": {
    name: "Monitoring & Soins Intensifs",
    description: "Surveillance continue des patients, défibrillateurs et équipements de réanimation.",
    products: [
      { id: 601, name: "Moniteur Patient Multiparamétrique", price: 3500, imageUrl: "https://images.unsplash.com/photo-1583912267550-d44d4a3c392c?w=800", isPriority: true, inStock: true, stockCount: 12, description: "Moniteur de surveillance des signes vitaux pour les soins intensifs et les blocs opératoires.", specs: ["Écran TFT 15 pouces", "ECG, SpO2, PNI, Température", "Connexion réseau centrale"] },
      { id: 602, name: "Défibrillateur Externe Automatisé", price: 1800, imageUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800", isPriority: true, inStock: true, stockCount: 20, description: "Défibrillateur grand public (DEA) avec instructions vocales pour les urgences cardiaques.", specs: ["Onde biphasique", "Temps de charge < 10s", "Électrodes adultes/enfants"] },
      { id: 603, name: "Pousse-Seringue Électrique", price: 1100, imageUrl: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800", isPriority: false, inStock: true, stockCount: 15, description: "Pompe à perfusion précise pour l'administration sécurisée de médicaments en réanimation.", specs: ["Débit : 0.1 à 1200 ml/h", "Détection d'occlusion", "Batterie de secours"] },
      { id: 604, name: "Électrocardiographe (ECG) 12 Pistes", price: 2400, imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800", isPriority: false, inStock: false, stockCount: 0, description: "Appareil ECG compact avec interprétation automatique pour un diagnostic cardiologique rapide.", specs: ["Impression thermique A4", "Mémoire : 1000 ECG", "Transfert USB/Réseau"] }
    ]
  }
};