'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SearchBar } from './SearchBar';
import { useTheme } from '@/contexts/ThemeContext';

export function Header() {
  const { theme, toggleTheme } = useTheme();
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
    <header className="bg-[#3a3f50] dark:bg-[#14161a] border-b border-gray-700 dark:border-gray-900 sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-2xl font-bold">📊</span>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold text-white">Dan Toma Financial</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Financial Visualizations</span>
            </div>
          </Link>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-2xl">
            <SearchBar />
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 flex-shrink-0">
            <Link
              href={`/${locale}`}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href={`/${locale}/screener`}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Screener
            </Link>
            <Link
              href={`/${locale}/stocks`}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Stocks
            </Link>
            <Link
              href={`/${locale}/crypto`}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Crypto
            </Link>
            <Link
              href={`/${locale}/news`}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              News
            </Link>
          </nav>

          {/* Theme & Language Switcher */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => switchLocale('en')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                locale === 'en'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => switchLocale('ro')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                locale === 'ro'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
