export const translations: Record<string, Record<string, string>> = {
  en: {
    latestNews: "Latest News",
    trending: "Trending",
    world: "World News",
    tech: "Technology",
    login: "Sign In with Google",
    logout: "Sign Out",
    allowLocation: "Allow Location for Local News",
    locationDenied: "Location permission denied",
    locationLoading: "Accessing location...",
    footer: "© 2026 NitinGlobalNews. All rights reserved.",
    readMore: "Read More"
  },
  hi: {
    latestNews: "ताज़ा खबर",
    trending: "ट्रेंडिंग",
    world: "विश्व समाचार",
    tech: "प्रौद्योगिकी",
    login: "Google से साइन इन करें",
    logout: "साइन आउट",
    allowLocation: "स्थानीय समाचार के लिए स्थान की अनुमति दें",
    locationDenied: "स्थान अनुमति अस्वीकृत",
    locationLoading: "स्थान प्राप्त किया जा रहा है...",
    footer: "© 2026 NitinGlobalNews. सर्वाधिकार सुरक्षित।",
    readMore: "और पढ़ें"
  },
  fr: {
    latestNews: "Dernières Nouvelles",
    trending: "Tendance",
    world: "Actualités du Monde",
    tech: "Technologie",
    login: "Se connecter avec Google",
    logout: "Se déconnecter",
    allowLocation: "Autoriser l'emplacement pour les actualités locales",
    locationDenied: "Autorisation de localisation refusée",
    locationLoading: "Accès à l'emplacement...",
    footer: "© 2026 NitinGlobalNews. Tous droits réservés.",
    readMore: "Lire la suite"
  },
  es: {
    latestNews: "Últimas Noticias",
    trending: "Tendencias",
    world: "Noticias del Mundo",
    tech: "Tecnología",
    login: "Iniciar sesión con Google",
    logout: "Cerrar sesión",
    allowLocation: "Permitir ubicación para noticias locales",
    locationDenied: "Permiso de ubicación denegado",
    locationLoading: "Accediendo a la ubicación...",
    footer: "© 2026 NitinGlobalNews. Todos los derechos reservados.",
    readMore: "Leer más"
  }
};

export const getTranslation = (lang: string, key: string) => {
  return translations[lang]?.[key] || translations['en'][key];
};
