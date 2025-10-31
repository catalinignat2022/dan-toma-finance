'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export function Header() {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">📊</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {t('appName')}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href={`/${locale}`}
              className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
            >
              {t('home')}
            </Link>
            <Link
              href={`/${locale}/stocks`}
              className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
            >
              {t('stocks')}
            </Link>
            <Link
              href={`/${locale}/crypto`}
              className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
            >
              {t('crypto')}
            </Link>
            <Link
              href={`/${locale}/news`}
              className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
            >
              {t('news')}
            </Link>
          </nav>

          {/* Language Switcher */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => switchLocale('en')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                locale === 'en'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => switchLocale('ro')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                locale === 'ro'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              RO
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
