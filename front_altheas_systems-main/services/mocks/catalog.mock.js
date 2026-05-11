export const mockCatalogData = {
  "imagerie": {
    name: "Imagerie Médicale",
    description: "Découvrez notre gamme complète de scanners, IRM et appareils de radiographie de dernière génération pour un diagnostic précis.",
    products: [
      { id: 101, name: "Scanner IRM Optima 1.5T", price: 245000, imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800", isPriority: true, inStock: true },
      { id: 102, name: "Échographe Portable V5", price: 12500, imageUrl: "https://images.unsplash.com/photo-1583912267550-d44d4a3c392c?w=800", isPriority: false, inStock: true },
      { id: 103, name: "Système de Radiographie X-Ray", price: 54000, imageUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800", isPriority: false, inStock: false },
      { id: 104, name: "Échographe 3D/4D Premium", price: 32000, imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800", isPriority: true, inStock: true },
      { id: 105, name: "Mammographe Numérique", price: 85000, imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800", isPriority: false, inStock: true }
    ]
  },
  "mobilier": {
    name: "Mobilier Médical",
    description: "Lits médicalisés, tables d'examen et fauteuils ergonomiques pour le confort optimal des patients et des soignants.",
    products: [
      { id: 201, name: "Lit Médicalisé Électrique V3", price: 2800, imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800", isPriority: true, inStock: true },
      { id: 202, name: "Table d'Examen Hydraulique", price: 1450, imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800", isPriority: false, inStock: false },
      { id: 203, name: "Fauteuil de Prélèvement", price: 850, imageUrl: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800", isPriority: false, inStock: true },
      { id: 204, name: "Chariot de Soins Inox", price: 420, imageUrl: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800", isPriority: true, inStock: true },
      { id: 205, name: "Paravent Médical 3 Panneaux", price: 150, imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800", isPriority: false, inStock: true }
    ]
  },
  "dentaire": {
    name: "Équipement Dentaire",
    description: "Unités de soins, fauteuils dentaires et imagerie panoramique pour les cabinets de stomatologie.",
    products: [
      { id: 301, name: "Unité Dentaire Complète Pro", price: 18500, imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800", isPriority: true, inStock: true },
      { id: 302, name: "Radio Panoramique 3D", price: 22000, imageUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800", isPriority: false, inStock: true },
      { id: 303, name: "Autoclave Stérilisation 18L", price: 3500, imageUrl: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800", isPriority: false, inStock: false },
      { id: 304, name: "Lampe à Polymériser LED", price: 450, imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800", isPriority: false, inStock: true }
    ]
  },
  "laboratoire": {
    name: "Laboratoire",
    description: "Matériel d'analyse, microscopes et centrifugeuses pour les laboratoires de biologie médicale.",
    products: [
      { id: 401, name: "Microscope Binoculaire LED", price: 1200, imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800", isPriority: true, inStock: true },
      { id: 402, name: "Centrifugeuse de Paillasse", price: 2100, imageUrl: "https://images.unsplash.com/photo-1583912267550-d44d4a3c392c?w=800", isPriority: false, inStock: true },
      { id: 403, name: "Analyseur Hématologie Automatique", price: 15400, imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800", isPriority: true, inStock: false },
      { id: 404, name: "Congélateur Ultra Basse Température", price: 8900, imageUrl: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800", isPriority: false, inStock: true }
    ]
  },
  "chirurgie": {
    name: "Bloc Opératoire",
    description: "Tables d'opération, éclairage chirurgical et bistouris pour équiper vos blocs opératoires.",
    products: [
      { id: 501, name: "Table d'Opération Universelle", price: 28000, imageUrl: "https://images.unsplash.com/photo-1551076805-e166946c9ebf?w=800", isPriority: true, inStock: true },
      { id: 502, name: "Éclairage Scialytique LED Plafond", price: 12500, imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800", isPriority: false, inStock: true },
      { id: 503, name: "Bistouri Électrique Haute Fréquence", price: 4200, imageUrl: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800", isPriority: false, inStock: true },
      { id: 504, name: "Respirateur d'Anesthésie", price: 35000, imageUrl: "https://images.unsplash.com/photo-1583912267550-d44d4a3c392c?w=800", isPriority: true, inStock: false }
    ]
  },
  "monitoring": {
    name: "Monitoring & Soins Intensifs",
    description: "Surveillance continue des patients, défibrillateurs et équipements de réanimation.",
    products: [
      { id: 601, name: "Moniteur Patient Multiparamétrique", price: 3500, imageUrl: "https://images.unsplash.com/photo-1583912267550-d44d4a3c392c?w=800", isPriority: true, inStock: true },
      { id: 602, name: "Défibrillateur Externe Automatisé", price: 1800, imageUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800", isPriority: true, inStock: true },
      { id: 603, name: "Pousse-Seringue Électrique", price: 1100, imageUrl: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800", isPriority: false, inStock: true },
      { id: 604, name: "Électrocardiographe (ECG) 12 Pistes", price: 2400, imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800", isPriority: false, inStock: false }
    ]
  }
};