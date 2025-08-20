export type Language = 'en' | 'fr' | 'rw'

export const languages: { [key in Language]: string } = {
  en: 'English',
  fr: 'Français',
  rw: 'Kinyarwanda'
}

export const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.scholarships': 'Browse Scholarships',
    'nav.resources': 'Resources',
    'nav.signin': 'Sign In',
    'nav.signup': 'Sign Up',
    
    // Hero Section
    'hero.title': 'Discover Your Perfect Scholarship',
    'hero.subtitle': 'Connect with thousands of scholarship opportunities worldwide. Your journey to free education starts here.',
    'hero.search.placeholder': 'Search scholarships by field, country, or keyword...',
    'hero.cta.scholarships': 'See All Scholarships',
    'hero.cta.getstarted': 'Get Started Free',
    
    // Stats
    'stats.scholarships': 'Active Scholarships',
    'stats.students': 'Students Helped',
    'stats.success': 'Success Rate',
    'stats.funding': 'Total Funding',
    
    // Common
    'common.apply': 'Apply Now',
    'common.view': 'View Details',
    'common.save': 'Save for Later',
    'common.share': 'Share',
    'common.deadline': 'Deadline',
    'common.amount': 'Amount',
    'common.category': 'Category',
    'common.degree': 'Degree Level',
    
    // Filters
    'filters.search': 'Search scholarships...',
    'filters.category': 'Field of Study',
    'filters.degree': 'Degree Level',
    'filters.amount': 'Amount Type',
    'filters.deadline': 'Deadline',
    'filters.all': 'All',
    
    // Auth
    'auth.signin.title': 'Welcome Back',
    'auth.signup.title': 'Join FreeUnApp',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.phone': 'Phone Number',
    'auth.role': 'I am a',
    'auth.role.student': 'Student (Looking for scholarships)',
    'auth.role.admin': 'Administrator (Managing scholarships)',
    'auth.approval.note': 'Note: New accounts require super admin approval. You\'ll be notified when your account is activated.',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.scholarships': 'Scholarships',
    'dashboard.applications': 'Applications',
    'dashboard.users': 'Users',
    'dashboard.settings': 'Settings',
    'dashboard.profile': 'Profile',
    'dashboard.notifications': 'Notifications',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.field': 'Field-Based Notifications',
    'notifications.preferences': 'Notification Preferences',
    
    // Marketing
    'marketing.title': 'Stay Updated',
    'marketing.subtitle': 'Get notified about new scholarships, opportunities, and exclusive deals',
    'marketing.email': 'Enter your email address',
    'marketing.phone': 'Enter your phone number',
    'marketing.subscribe': 'Subscribe for Updates',
    'marketing.privacy': 'We respect your privacy. Unsubscribe at any time.',
    
    // Onboarding
    'onboarding.title': 'Welcome to FreeUnApp! 🎓',
    'onboarding.subtitle': 'Join our community of students and get instant updates on new scholarships, application tips, and success stories.',
    'onboarding.why.title': 'Why Join Our WhatsApp Group?',
    'onboarding.why.instant': 'Get instant notifications for new scholarships',
    'onboarding.why.tips': 'Share application tips and experiences',
    'onboarding.why.connect': 'Connect with other students',
    'onboarding.why.help': 'Ask questions and get help',
    'onboarding.join': 'Join WhatsApp Group',
    'onboarding.later': 'Maybe Later',
    'onboarding.reminder': 'You can always join later from your dashboard'
  },
  
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.scholarships': 'Parcourir les Bourses',
    'nav.resources': 'Ressources',
    'nav.signin': 'Se Connecter',
    'nav.signup': 'S\'inscrire',
    
    // Hero Section
    'hero.title': 'Découvrez Votre Bourse Parfaite',
    'hero.subtitle': 'Connectez-vous avec des milliers d\'opportunités de bourses dans le monde. Votre voyage vers l\'éducation gratuite commence ici.',
    'hero.search.placeholder': 'Rechercher des bourses par domaine, pays ou mot-clé...',
    'hero.cta.scholarships': 'Voir Toutes les Bourses',
    'hero.cta.getstarted': 'Commencer Gratuitement',
    
    // Stats
    'stats.scholarships': 'Bourses Actives',
    'stats.students': 'Étudiants Aidés',
    'stats.success': 'Taux de Réussite',
    'stats.funding': 'Financement Total',
    
    // Common
    'common.apply': 'Postuler Maintenant',
    'common.view': 'Voir les Détails',
    'common.save': 'Sauvegarder',
    'common.share': 'Partager',
    'common.deadline': 'Date Limite',
    'common.amount': 'Montant',
    'common.category': 'Catégorie',
    'common.degree': 'Niveau d\'Études',
    
    // Filters
    'filters.search': 'Rechercher des bourses...',
    'filters.category': 'Domaine d\'Études',
    'filters.degree': 'Niveau d\'Études',
    'filters.amount': 'Type de Montant',
    'filters.deadline': 'Date Limite',
    'filters.all': 'Tout',
    
    // Auth
    'auth.signin.title': 'Bon Retour',
    'auth.signup.title': 'Rejoindre FreeUnApp',
    'auth.email': 'Adresse Email',
    'auth.password': 'Mot de Passe',
    'auth.name': 'Nom Complet',
    'auth.phone': 'Numéro de Téléphone',
    'auth.role': 'Je suis un',
    'auth.role.student': 'Étudiant (Recherche de bourses)',
    'auth.role.admin': 'Administrateur (Gestion des bourses)',
    'auth.approval.note': 'Note: Les nouveaux comptes nécessitent l\'approbation du super administrateur. Vous serez notifié lorsque votre compte sera activé.',
    
    // Dashboard
    'dashboard.title': 'Tableau de Bord',
    'dashboard.scholarships': 'Bourses',
    'dashboard.applications': 'Candidatures',
    'dashboard.users': 'Utilisateurs',
    'dashboard.settings': 'Paramètres',
    'dashboard.profile': 'Profil',
    'dashboard.notifications': 'Notifications',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.field': 'Notifications par Domaine',
    'notifications.preferences': 'Préférences de Notification',
    
    // Marketing
    'marketing.title': 'Restez Informé',
    'marketing.subtitle': 'Recevez des notifications sur les nouvelles bourses, opportunités et offres exclusives',
    'marketing.email': 'Entrez votre adresse email',
    'marketing.phone': 'Entrez votre numéro de téléphone',
    'marketing.subscribe': 'S\'abonner aux Mises à Jour',
    'marketing.privacy': 'Nous respectons votre vie privée. Désabonnez-vous à tout moment.',
    
    // Onboarding
    'onboarding.title': 'Bienvenue sur FreeUnApp! 🎓',
    'onboarding.subtitle': 'Rejoignez notre communauté d\'étudiants et recevez des mises à jour instantanées sur les nouvelles bourses, conseils de candidature et histoires de réussite.',
    'onboarding.why.title': 'Pourquoi Rejoindre Notre Groupe WhatsApp?',
    'onboarding.why.instant': 'Recevez des notifications instantanées pour les nouvelles bourses',
    'onboarding.why.tips': 'Partagez des conseils et expériences de candidature',
    'onboarding.why.connect': 'Connectez-vous avec d\'autres étudiants',
    'onboarding.why.help': 'Posez des questions et obtenez de l\'aide',
    'onboarding.join': 'Rejoindre le Groupe WhatsApp',
    'onboarding.later': 'Peut-être Plus Tard',
    'onboarding.reminder': 'Vous pouvez toujours rejoindre plus tard depuis votre tableau de bord'
  },
  
  rw: {
    // Navigation
    'nav.home': 'Ahabanza',
    'nav.scholarships': 'Reba Ibikorwa',
    'nav.resources': 'Ibikoresho',
    'nav.signin': 'Injira',
    'nav.signup': 'Iyandikishe',
    
    // Hero Section
    'hero.title': 'Menya Igikorwa Cyawe Cy\'Icyemezo',
    'hero.subtitle': 'Huzuza na ibikorwa by\'amashuri by\'ibihumbi by\'amashuri ku isi. Urugendo rwawe rwo kwiga kubuntu rutangira hano.',
    'hero.search.placeholder': 'Shakisha ibikorwa by\'amashuri ku ishami, igihugu cyangwa ijambo...',
    'hero.cta.scholarships': 'Reba Ibikorwa Byose',
    'hero.cta.getstarted': 'Tangira Kuri Buntu',
    
    // Stats
    'stats.scholarships': 'Ibikorwa Bikora',
    'stats.students': 'Abanyeshuri Bafashijwe',
    'stats.success': 'Igihe Cy\'Intsinzi',
    'stats.funding': 'Amafaranga Yose',
    
    // Common
    'common.apply': 'Gusaba Nonaha',
    'common.view': 'Reba Ibisobanura',
    'common.save': 'Bika Kuri Nyuma',
    'common.share': 'Sangira',
    'common.deadline': 'Itariki Y\'Iherezo',
    'common.amount': 'Umubare',
    'common.category': 'Ubwoko',
    'common.degree': 'Urupapuro',
    
    // Filters
    'filters.search': 'Shakisha ibikorwa...',
    'filters.category': 'Ishami Ry\'Amashuri',
    'filters.degree': 'Urupapuro',
    'filters.amount': 'Ubwoko Bw\'Amafaranga',
    'filters.deadline': 'Itariki Y\'Iherezo',
    'filters.all': 'Byose',
    
    // Auth
    'auth.signin.title': 'Subira Inyuma',
    'auth.signup.title': 'Uzuzwe FreeUnApp',
    'auth.email': 'Imeyili',
    'auth.password': 'Ijambo Ry\'Ibanga',
    'auth.name': 'Amazina Yose',
    'auth.phone': 'Telefoni',
    'auth.role': 'Ndi',
    'auth.role.student': 'Umunyeshuri (Nshakisha ibikorwa)',
    'auth.role.admin': 'Umuyobozi (Gukurikirana ibikorwa)',
    'auth.approval.note': 'Icyitonderwa: Konti nshya zikenewe ko umuyobozi mukuru abemera. Uzamenyeshwa iyo konti yawe yemewe.',
    
    // Dashboard
    'dashboard.title': 'Ikibaho',
    'dashboard.scholarships': 'Ibikorwa',
    'dashboard.applications': 'Amasaba',
    'dashboard.users': 'Abakoresha',
    'dashboard.settings': 'Igenamiterere',
    'dashboard.profile': 'Umwirondoro',
    'dashboard.notifications': 'Amatangazo',
    
    // Notifications
    'notifications.title': 'Amatangazo',
    'notifications.field': 'Amatangazo Y\'Ishami',
    'notifications.preferences': 'Igenamiterere Ry\'Amatangazo',
    
    // Marketing
    'marketing.title': 'Menya Ibikorwa',
    'marketing.subtitle': 'Menya ibikorwa bishya, amahirwe n\'amasezerano y\'ihari',
    'marketing.email': 'Andika imeyili yawe',
    'marketing.phone': 'Andika telefoni yawe',
    'marketing.subscribe': 'Iyandikishe Kuri Amatangazo',
    'marketing.privacy': 'Dushyira mu gaciro ubwihisho bwawe. Urashobora kwiyandikisha buri gihe.',
    
    // Onboarding
    'onboarding.title': 'Murakaza neza kuri FreeUnApp! 🎓',
    'onboarding.subtitle': 'Uzuzwe umuryango w\'abanyeshuri kandi ubone amatangazo ya vuba ku bikorwa bishya, inama z\'amasaba n\'inkuru z\'intsinzi.',
    'onboarding.why.title': 'Kuki Kujya Mu Muryango Wa WhatsApp?',
    'onboarding.why.instant': 'Bona amatangazo ya vuba ku bikorwa bishya',
    'onboarding.why.tips': 'Sangira inama n\'ubuhanga bwo gusaba',
    'onboarding.why.connect': 'Uzuzwe abandi banyeshuri',
    'onboarding.why.help': 'Ibaza ibibazo kandi ubone ubufasha',
    'onboarding.join': 'Jya Mu Muryango Wa WhatsApp',
    'onboarding.later': 'Birashoboka Nyuma',
    'onboarding.reminder': 'Urashobora kujya nyuma uhereye ku kibaho cyawe'
  }
}

export function getTranslation(lang: Language, key: string): string {
  return translations[lang][key as keyof typeof translations[typeof lang]] || key
}

export function getCurrentLanguage(): Language {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('language') as Language) || 'en'
  }
  return 'en'
}

export function setLanguage(lang: Language) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang)
  }
}
