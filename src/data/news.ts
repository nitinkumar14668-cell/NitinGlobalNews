export interface Article {
  id: string;
  title: Record<string, string>;
  summary: Record<string, string>;
  imageUrl: string;
  category: string;
  timestamp: string;
}

export const mockArticles: Article[] = [
  {
    id: "1",
    category: "tech",
    timestamp: "2026-04-26T01:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: {
      en: "The Future of AI: What's Next in 2026?",
      hi: "AI का भविष्य: 2026 में आगे क्या?",
      fr: "L'avenir de l'IA: Quelle est la suite en 2026?",
      es: "El futuro de la IA: ¿Qué sigue en 2026?"
    },
    summary: {
      en: "Experts predict a new wave of autonomous systems by the end of the year, revolutionizing how we interact with technology.",
      hi: "विशेषज्ञों का अनुमान है कि इस साल के अंत तक स्वायत्त प्रणालियों की एक नई लहर आएगी, जो हमारी तकनीक के साथ बातचीत के तरीके में क्रांति लाएगी।",
      fr: "Les experts prédisent une nouvelle vague de systèmes autonomes d'ici la fin de l'année, révolutionnant la façon dont nous interagissons avec la technologie.",
      es: "Los expertos predicen una nueva ola de sistemas autónomos para fin de año, revolucionando la forma en que interactuamos con la tecnología."
    }
  },
  {
    id: "2",
    category: "world",
    timestamp: "2026-04-26T02:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbdf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: {
      en: "Global Markets See Record Highs Amidst Green Energy Boom",
      hi: "हरित ऊर्जा बूम के बीच वैश्विक बाजारों में रिकॉर्ड ऊंचाई",
      fr: "Les marchés mondiaux atteignent des sommets records au milieu du boom de l'énergie verte",
      es: "Los mercados globales alcanzan máximos históricos en medio del auge de la energía verde"
    },
    summary: {
      en: "Investments in renewable energy sectors have pushed major global indices to unprecedented levels today.",
      hi: "नवीकरणीय ऊर्जा क्षेत्रों में निवेश ने आज प्रमुख वैश्विक सूचकांकों को अभूतपूर्व स्तर पर धकेल दिया है।",
      fr: "Les investissements dans les secteurs des énergies renouvelables ont poussé les principaux indices mondiaux à des niveaux sans précédent aujourd'hui.",
      es: "Las inversiones en sectores de energías renovables han impulsado los principales índices mundiales a niveles sin precedentes en la actualidad."
    }
  },
  {
    id: "3",
    category: "tech",
    timestamp: "2026-04-26T03:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: {
      en: "Mars Mission Successfully Deploys New Rover",
      hi: "मंगल मिशन ने सफलतापूर्वक नया रोवर तैनात किया",
      fr: "La mission sur Mars déploie avec succès un nouveau rover",
      es: "La misión a Marte despliega con éxito un nuevo rover"
    },
    summary: {
      en: "Space agencies celebrate the flawless landing and deployment of the next-generation Mars exploration rover.",
      hi: "अंतरिक्ष एजेंसियां अगली पीढ़ी के मंगल अन्वेषण रोवर की त्रुटिहीन लैंडिंग और तैनाती का जश्न मना रही हैं।",
      fr: "Les agences spatiales célèbrent l'atterrissage et le déploiement sans faille du rover d'exploration martienne de nouvelle génération.",
      es: "Las agencias espaciales celebran el aterrizaje y despliegue impecables del rover de exploración de Marte de próxima generación."
    }
  },
  {
    id: "4",
    category: "world",
    timestamp: "2026-04-25T20:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: {
      en: "International Policy Shift Emphasizes Climate Action",
      hi: "अंतर्राष्ट्रीय नीति में बदलाव ने जलवायु कार्रवाई पर जोर दिया",
      fr: "Un changement de politique internationale met l'accent sur l'action climatique",
      es: "Cambio de política internacional enfatiza la acción climática"
    },
    summary: {
      en: "Multiple nations signed a binding agreement to accelerate carbon net-zero commitments ahead of the upcoming summit.",
      hi: "कई देशों ने आगामी शिखर सम्मेलन से पहले कार्बन नेट-जीरो प्रतिबद्धताओं में तेजी लाने के लिए एक बाध्यकारी समझौते पर हस्ताक्षर किए।",
      fr: "Plusieurs pays ont signé un accord contraignant pour accélérer les engagements nets zéro carbone avant le prochain sommet.",
      es: "Varias naciones firmaron un acuerdo vinculante para acelerar los compromisos de cero carbono neto antes de la próxima cumbre."
    }
  }
];
