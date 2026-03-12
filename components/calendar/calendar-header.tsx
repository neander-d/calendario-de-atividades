"use client"

import { Compass, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"


const navItems = [
  { label: "Calendário", href: "#calendario" },
  { label: "Eventos", href: "#eventos" },
  { label: "Categorias", href: "#categorias" },
]

export function CalendarHeader({ onExportPDF }: { onExportPDF: () => void }) {

  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Compass className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">Unidade Sirius</span>
            <span className="text-xs text-muted-foreground">Calendário 2026</span>
          </div>
        </div>

        <div className="hidden md:flex md:items-center md:gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex md:items-center md:gap-4">
          <Button variant="outline" size="sm">
            Sincronizar
          </Button>
          <Button size="sm" onClick={onExportPDF}>
  Exportar
</Button>

        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 md:hidden",
          mobileMenuOpen ? "max-h-64" : "max-h-0"
        )}
      >
        <div className="space-y-2 border-t border-border px-4 py-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1">
              Sincronizar
            </Button>
            <Button size="sm" className="flex-1" onClick={onExportPDF}>
  Exportar
</Button>

          </div>
        </div>
      </div>
    </header>
  )
}
