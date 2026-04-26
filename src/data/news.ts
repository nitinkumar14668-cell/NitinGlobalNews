export interface Article {
  id: string;
  title: Record<string, string>;
  summary: Record<string, string>;
  content: Record<string, string>;
  imageUrl: string;
  sourceUrl: string;
  category: string;
  timestamp: string;
}

const baseArticles: Article[] = [
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
    },
    content: {
      en: "The rapid advancement of artificial intelligence continues to reshape industries. Experts predict that by the end of 2026, autonomous systems will be seamlessly integrated into daily life, from smart city infrastructure to personal assistants. The focus is now shifting towards ethical AI and ensuring these systems operate with fairness and transparency.",
      hi: "कृत्रिम बुद्धिमत्ता की तीव्र प्रगति उद्योगों को नया आकार दे रही है। विशेषज्ञों का अनुमान है कि 2026 के अंत तक, स्वायत्त प्रणालियां दैनिक जीवन में निर्बाध रूप से एकीकृत हो जाएंगी, स्मार्ट सिटी बुनियादी ढांचे से लेकर व्यक्तिगत सहायकों तक। अब ध्यान नैतिक एआई और यह सुनिश्चित करने पर केंद्रित हो रहा है कि ये प्रणालियां निष्पक्षता और पारदर्शिता के साथ काम करें।",
      fr: "L'avancement rapide de l'intelligence artificielle continue de remodeler les industries. Les experts prédisent que d'ici la fin de 2026, les systèmes autonomes seront parfaitement intégrés dans la vie quotidienne, de l'infrastructure des villes intelligentes aux assistants personnels. L'accent se déplace maintenant vers l'IA éthique et la garantie que ces systèmes fonctionnent avec équité et transparence.",
      es: "El rápido avance de la inteligencia artificial continúa remodelando las industrias. Los expertos predicen que para fines de 2026, los sistemas autónomos se integrarán perfectamente en la vida diaria, desde la infraestructura de ciudades inteligentes hasta los asistentes personales. El enfoque ahora se está desplazando hacia la IA ética y garantizando que estos sistemas operen con equidad y transparencia."
    },
    sourceUrl: "https://example.com/tech/ai-future"
  },
  {
    id: "2",
    category: "trending",
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
    },
    content: {
      en: "Global stock markets rallied significantly today as reports of massive investments in renewable energy infrastructure worldwide were released. Green tech companies saw their stock prices soar, reflecting growing investor confidence in sustainable energy solutions. Analysts believe this trend will continue as governments push for stricter environmental regulations.",
      hi: "वैश्विक शेयर बाजारों में आज महत्वपूर्ण तेजी आई क्योंकि दुनिया भर में नवीकरणीय ऊर्जा बुनियादी ढांचे में बड़े पैमाने पर निवेश की खबरें जारी की गईं। हरित तकनीक कंपनियों के शेयरों की कीमतों में उछाल आया, जो टिकाऊ ऊर्जा समाधानों में निवेशकों के बढ़ते विश्वास को दर्शाता है। विश्लेषकों का मानना ​​है कि यह प्रवृत्ति जारी रहेगी क्योंकि सरकारें सख्त पर्यावरणीय नियमों पर जोर दे रही हैं।",
      fr: "Les marchés boursiers mondiaux ont connu une hausse significative aujourd'hui suite à la publication de rapports faisant état d'investissements massifs dans les infrastructures d'énergie renouvelable à travers le monde. Les entreprises de technologies vertes ont vu le cours de leurs actions s'envoler, reflétant la confiance croissante des investisseurs dans les solutions énergétiques durables. Les analystes estiment que cette tendance se poursuivra alors que les gouvernements font pression pour des réglementations environnementales plus strictes.",
      es: "Los mercados bursátiles mundiales repuntaron significativamente hoy al publicarse informes de inversiones masivas en infraestructuras de energía renovable en todo el mundo. Las empresas de tecnología verde vieron dispararse los precios de sus acciones, reflejando la creciente confianza de los inversores en las soluciones de energía sostenible. Los analistas creen que esta tendencia continuará a medida que los gobiernos presionen por regulaciones ambientales más estrictas."
    },
    sourceUrl: "https://example.com/world/markets-green-energy"
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
    },
    content: {
      en: "In a historic achievement, the latest collaborative Mars rover has successfully touched down on the Martian surface. Equipped with state-of-the-art scientific instruments, the rover has already beamed back high-definition images and is preparing to begin its mission to search for signs of past microbial life and collect samples for future return to Earth.",
      hi: "एक ऐतिहासिक उपलब्धि में, नवीनतम सहयोगी मंगल रोवर मंगल की सतह पर सफलतापूर्वक उतरा है। अत्याधुनिक वैज्ञानिक उपकरणों से लैस, रोवर ने पहले ही उच्च-परिभाषा चित्र वापस भेज दिए हैं और पिछले सूक्ष्मजीव जीवन के संकेतों की खोज करने और भविष्य में पृथ्वी पर वापसी के लिए नमूने एकत्र करने के लिए अपना मिशन शुरू करने की तैयारी कर रहा है।",
      fr: "Dans une réalisation historique, le dernier rover martien collaboratif s'est posé avec succès sur la surface martienne. Équipé d'instruments scientifiques de pointe, le rover a déjà retransmis des images haute définition et se prépare à commencer sa mission de recherche de signes de vie microbienne passée et de collecte d'échantillons pour un retour futur sur Terre.",
      es: "En un logro histórico, el último rover colaborativo de Marte ha aterrizado con éxito en la superficie marciana. Equipado con instrumentos científicos de última generación, el rover ya ha transmitido imágenes de alta definición y se está preparando para comenzar su misión de buscar signos de vida microbiana pasada y recolectar muestras para un futuro regreso a la Tierra."
    },
    sourceUrl: "https://example.com/tech/mars-rover"
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
    },
    content: {
      en: "In a major diplomatic breakthrough, leaders from over 50 nations have signed a landmark agreement to accelerate their transition to carbon neutrality. The pact outlines strict timelines for reducing greenhouse gas emissions and pledges significant financial support for developing countries to adopt clean technologies. Environmental groups have welcomed the move as a crucial step towards mitigating climate change.",
      hi: "एक बड़ी कूटनीतिक सफलता में, 50 से अधिक देशों के नेताओं ने कार्बन तटस्थता की दिशा में अपने संक्रमण को तेज करने के लिए एक ऐतिहासिक समझौते पर हस्ताक्षर किए हैं। समझौते में ग्रीनहाउस गैस उत्सर्जन को कम करने के लिए सख्त समय-सीमा की रूपरेखा दी गई है और विकासशील देशों को स्वच्छ प्रौद्योगिकियों को अपनाने के लिए महत्वपूर्ण वित्तीय सहायता का वचन दिया गया है। पर्यावरण समूहों ने इस कदम को जलवायु परिवर्तन को कम करने की दिशा में एक महत्वपूर्ण कदम के रूप में स्वागत किया है।",
      fr: "Lors d'une percée diplomatique majeure, les dirigeants de plus de 50 pays ont signé un accord historique pour accélérer leur transition vers la neutralité carbone. Le pacte définit des calendriers stricts pour la réduction des émissions de gaz à effet de serre et promet un soutien financier important aux pays en développement pour l'adoption de technologies propres. Les groupes environnementaux ont salué cette initiative comme une étape cruciale vers l'atténuation des changements climatiques.",
      es: "En un importante avance diplomático, líderes de más de 50 naciones han firmado un acuerdo histórico para acelerar su transición hacia la neutralidad de carbono. El pacto establece plazos estrictos para reducir las emisiones de gases de efecto invernadero y promete un importante apoyo financiero para que los países en desarrollo adopten tecnologías limpias. Los grupos ambientalistas han acogido con satisfacción la medida como un paso crucial para mitigar el cambio climático."
    },
    sourceUrl: "https://example.com/world/climate-action"
  }
];

export const mockArticles: Article[] = [];
// Generate 100k articles exactly
for (let i = 0; i < 25000; i++) {
  baseArticles.forEach((article, index) => {
    mockArticles.push({
      ...article,
      id: `${article.id}-${i}`,
      title: {
        en: `${article.title.en} (Article ${i * 4 + index + 1})`,
        hi: `${article.title.hi} (लेख ${i * 4 + index + 1})`,
        fr: `${article.title.fr} (Article ${i * 4 + index + 1})`,
        es: `${article.title.es} (Artículo ${i * 4 + index + 1})`
      }
    });
  });
}
