'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SearchBar } from './SearchBar';

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
    <header className="bg-[#3a3f50] border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-2xl font-bold">📊</span>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold text-white">finviz</span>
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

          {/* Language Switcher */}
          <div className="flex items-center space-x-2 flex-shrink-0">
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
