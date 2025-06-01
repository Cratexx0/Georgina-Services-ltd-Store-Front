
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'de' | 'fr' | 'es' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    home: 'Home',
    clothing: 'Clothing',
    food: 'Food',
    cleaningServices: 'Cleaning Services',
    searchPlaceholder: 'Search products...',
    signIn: 'Sign In',
    account: 'Account',
    shopByCategory: 'Shop by Category',
    featuredProducts: 'Featured Products',
    qualityProducts: 'Quality Products Delivered To Your Door',
    qualityDescription: 'Shop our curated selection of clothing, food items, and cleaning services.',
    fastDelivery: 'Fast Delivery',
    fastDeliveryDesc: 'Get your products delivered in as little as 24 hours.',
    qualityGuaranteed: 'Quality Guaranteed',
    qualityGuaranteedDesc: 'All our products undergo strict quality control.',
    securePayments: 'Secure Payments',
    securePaymentsDesc: 'Shop with confidence with our secure payment systems.',
    bookingHistory: 'Booking History'
  },
  de: {
    home: 'Startseite',
    clothing: 'Kleidung',
    food: 'Lebensmittel',
    cleaningServices: 'Reinigungsdienste',
    searchPlaceholder: 'Produkte suchen...',
    signIn: 'Anmelden',
    account: 'Konto',
    shopByCategory: 'Nach Kategorie einkaufen',
    featuredProducts: 'Empfohlene Produkte',
    qualityProducts: 'Qualitätsprodukte vor Ihre Haustür geliefert',
    qualityDescription: 'Kaufen Sie unsere kuratierte Auswahl an Kleidung, Lebensmitteln und Reinigungsdiensten.',
    fastDelivery: 'Schnelle Lieferung',
    fastDeliveryDesc: 'Erhalten Sie Ihre Produkte in nur 24 Stunden geliefert.',
    qualityGuaranteed: 'Qualität garantiert',
    qualityGuaranteedDesc: 'Alle unsere Produkte durchlaufen strenge Qualitätskontrollen.',
    securePayments: 'Sichere Zahlungen',
    securePaymentsDesc: 'Kaufen Sie mit Vertrauen mit unseren sicheren Zahlungssystemen.',
    bookingHistory: 'Buchungshistorie'
  },
  fr: {
    home: 'Accueil',
    clothing: 'Vêtements',
    food: 'Nourriture',
    cleaningServices: 'Services de nettoyage',
    searchPlaceholder: 'Rechercher des produits...',
    signIn: 'Se connecter',
    account: 'Compte',
    shopByCategory: 'Acheter par catégorie',
    featuredProducts: 'Produits en vedette',
    qualityProducts: 'Produits de qualité livrés à votre porte',
    qualityDescription: 'Achetez notre sélection de vêtements, produits alimentaires et services de nettoyage.',
    fastDelivery: 'Livraison rapide',
    fastDeliveryDesc: 'Recevez vos produits livrés en seulement 24 heures.',
    qualityGuaranteed: 'Qualité garantie',
    qualityGuaranteedDesc: 'Tous nos produits subissent un contrôle qualité strict.',
    securePayments: 'Paiements sécurisés',
    securePaymentsDesc: 'Achetez en toute confiance avec nos systèmes de paiement sécurisés.',
    bookingHistory: 'Historique des réservations'
  },
  es: {
    home: 'Inicio',
    clothing: 'Ropa',
    food: 'Comida',
    cleaningServices: 'Servicios de limpieza',
    searchPlaceholder: 'Buscar productos...',
    signIn: 'Iniciar sesión',
    account: 'Cuenta',
    shopByCategory: 'Comprar por categoría',
    featuredProducts: 'Productos destacados',
    qualityProducts: 'Productos de calidad entregados en su puerta',
    qualityDescription: 'Compre nuestra selección de ropa, alimentos y servicios de limpieza.',
    fastDelivery: 'Entrega rápida',
    fastDeliveryDesc: 'Reciba sus productos entregados en tan solo 24 horas.',
    qualityGuaranteed: 'Calidad garantizada',
    qualityGuaranteedDesc: 'Todos nuestros productos pasan por un control de calidad estricto.',
    securePayments: 'Pagos seguros',
    securePaymentsDesc: 'Compre con confianza con nuestros sistemas de pago seguros.',
    bookingHistory: 'Historial de reservas'
  },
  zh: {
    home: '首页',
    clothing: '服装',
    food: '食品',
    cleaningServices: '清洁服务',
    searchPlaceholder: '搜索产品...',
    signIn: '登录',
    account: '账户',
    shopByCategory: '按类别购买',
    featuredProducts: '特色产品',
    qualityProducts: '优质产品送到您门口',
    qualityDescription: '选购我们精选的服装、食品和清洁服务。',
    fastDelivery: '快速配送',
    fastDeliveryDesc: '您的产品可在24小时内送达。',
    qualityGuaranteed: '质量保证',
    qualityGuaranteedDesc: '我们所有的产品都经过严格的质量控制。',
    securePayments: '安全支付',
    securePaymentsDesc: '使用我们安全的支付系统放心购物。',
    bookingHistory: '预订历史'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
