"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Navigation() {
  const { t } = useLanguage();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8 items-center">
            <Link href="/" className="text-gray-800 hover:text-gray-600">
              {t("navigation.home")}
            </Link>
            <Link href="/properties" className="text-gray-800 hover:text-gray-600">
              {t("navigation.properties")}
            </Link>
            <Link href="/about" className="text-gray-800 hover:text-gray-600">
              {t("navigation.about")}
            </Link>
            <Link href="/contact" className="text-gray-800 hover:text-gray-600">
              {t("navigation.contact")}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 