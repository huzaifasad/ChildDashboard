// Navbar.jsx
'use client';

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Calendar,
  CheckSquare,
  Gift,
  ShoppingCart,
  DollarSign,
  Utensils,
  Menu,
  ChevronDown,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const navItems = [
  { icon: Calendar, label: "calendar", href: "/calender" },
  { icon: CheckSquare, label: "tasks", href: "/tasks" },
  { icon: Utensils, label: "mealPlanner", href: "/meal-planner" },
];

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt="Parent" />
            <AvatarFallback>PN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-semibold">{t?.welcome || "Welcome"}, Sarah!</h1>
            <p className="text-sm text-muted-foreground">{t?.haveAGreatDay || "Have a great day!"}</p>
          </div>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4">
          {[{ icon: Calendar, label: "Home", href: "/" }, ...navItems].map((item, index) => (
            <Button
              key={index}
              variant={pathname === item.href ? "default" : "ghost"}
              asChild
            >
              <Link href={item.href} className="flex items-center space-x-2">
                <item.icon className="h-4 w-4" />
                <span>{t[item.label.toLowerCase()] || item.label}</span>
              </Link>
            </Button>
          ))}

          {/* Finance Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>{t.finance || "Finance"}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link href="/finance/budget">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{t.budget || "Budget"}</span>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/finance/shopping">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    <span>{t.shopping || "Shopping"}</span>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/finance/rewards">
                  <div className="flex items-center space-x-2">
                    <Gift className="h-4 w-4 text-muted-foreground" />
                    <span>{t.rewards || "Rewards"}</span>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[150px] justify-between">
                {language === "en"
                  ? "English"
                  : language === "es"
                  ? "Español"
                  : language === "fr"
                  ? "Français"
                  : language === "de"
                  ? "Deutsch"
                  : "Русский"}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("es")}>Español</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("fr")}>Français</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("de")}>Deutsch</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("ru")}>Русский</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Notification Icon */}
          {/* <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button> */}
          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[{ icon: Calendar, label: "Home", href: "/" }, ...navItems].map((item, index) => (
                <DropdownMenuItem key={index} asChild>
                  <Link href={item.href} className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4" />
                    <span>{t[item.label.toLowerCase()] || item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
              {/* Finance Dropdown Items */}
              <DropdownMenuItem asChild>
                <Link href="/finance/budget" className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>{t.budget || "Budget"}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/finance/shopping" className="flex items-center space-x-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>{t.shopping || "Shopping"}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/finance/rewards" className="flex items-center space-x-2">
                  <Gift className="h-4 w-4" />
                  <span>{t.rewards || "Rewards"}</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
