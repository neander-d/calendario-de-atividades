"use client"

import { useState, useCallback } from "react"
import { CalendarHeader } from "@/components/calendar/calendar-header"
import { CategoryFilters } from "@/components/calendar/category-filters"
import { MonthGrid } from "@/components/calendar/month-grid"
import { EventList } from "@/components/calendar/event-list"
import { EventModal } from "@/components/calendar/event-modal"
import { CalendarStats } from "@/components/calendar/calendar-stats"
import {
  events2026,
  months,
  categoryConfig,
  type CalendarEvent,
  type EventCategory,
} from "@/lib/calendar-data"
import { ChevronLeft, ChevronRight, Grid3X3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import jsPDF from "jspdf"

const allCategories = Object.keys(categoryConfig) as EventCategory[]

export default function CalendarPage() {
  const [selectedCategories, setSelectedCategories] =
    useState<EventCategory[]>(allCategories)
    const handleExportPDF = () => {
  const doc = new jsPDF()

  const filteredEvents = events2026
    .filter((event) => selectedCategories.includes(event.category))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  doc.setFontSize(18)
  doc.text("Calendário 2026 - Unidade Crux", 105, 15, { align: "center" })

  let y = 30
  let currentMonth = ""

  filteredEvents.forEach((event) => {
    const date = new Date(event.date + "T00:00:00")

    const monthName = date.toLocaleDateString("pt-BR", { month: "long" })
    const formattedDate = date.toLocaleDateString("pt-BR")

    if (monthName !== currentMonth) {
      currentMonth = monthName

      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
      doc.text(monthName.toUpperCase(), 10, y)

      y += 8
    }

    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)

    doc.text(`${formattedDate} • ${event.title}`, 12, y)

    y += 6

    if (y > 280) {
      doc.addPage()
      y = 20
    }
  })

  doc.save("calendario-2026.pdf")
}


  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [visibleMonthStart, setVisibleMonthStart] = useState(0)

  const year = 2026

  const handleToggleCategory = useCallback((category: EventCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }, [])

  const handleClearFilters = useCallback(() => {
    setSelectedCategories((prev) =>
      prev.length === allCategories.length ? [] : allCategories
    )
  }, [])

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedEvent(null)
  }, [])

  const handlePrevMonths = () => {
    setVisibleMonthStart((prev) => Math.max(0, prev - 3))
  }

  const handleNextMonths = () => {
    setVisibleMonthStart((prev) => Math.min(9, prev + 3))
  }

  const visibleMonths = months.slice(visibleMonthStart, visibleMonthStart + 12)

  return (
    <div className="min-h-screen bg-background">
      <CalendarHeader onExportPDF={handleExportPDF} />


      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Hero Section */}
        <section className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight md:text-5xl">
            Calendário <span className="text-primary">2026</span>
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Acompanhe todas as atividades da Unidade Sirius. Acampamentos,
            reuniões, eventos especiais e muito mais.
          </p>
        </section>

        {/* Stats */}
        <CalendarStats events={events2026} />
        

        {/* Filters */}
        <CategoryFilters
          selectedCategories={selectedCategories}
          onToggleCategory={handleToggleCategory}
          onClearFilters={handleClearFilters}
        />

        {/* View Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="mr-2 h-4 w-4" />
              Grade
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="mr-2 h-4 w-4" />
              Lista
            </Button>
          </div>

          {viewMode === "grid" && (
            <div className="hidden items-center gap-2 md:flex">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevMonths}
                disabled={visibleMonthStart === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Meses anteriores</span>
              </Button>
              <span className="min-w-[120px] text-center text-sm text-muted-foreground">
                {months[visibleMonthStart]} - {months[Math.min(visibleMonthStart + 11, 11)]}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextMonths}
                disabled={visibleMonthStart >= 9}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Próximos meses</span>
              </Button>
            </div>
          )}
        </div>

        {/* Calendar Content */}
        {viewMode === "grid" ? (
          <section id="calendario" className="mb-12">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {months.map((monthName, monthIndex) => (
                <MonthGrid
                  key={monthIndex}
                  year={year}
                  month={monthIndex}
                  monthName={monthName}
                  events={events2026}
                  selectedCategories={selectedCategories}
                  onSelectEvent={handleSelectEvent}
                />
              ))}
            </div>
          </section>
        ) : (
          <EventList
            events={events2026}
            selectedCategories={selectedCategories}
            onSelectEvent={handleSelectEvent}
          />
        )}

        {/* Legend */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Legenda</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {(Object.entries(categoryConfig) as [EventCategory, (typeof categoryConfig)[EventCategory]][]).map(
              ([category, config]) => (
                <div key={category} className="flex items-center gap-2">
                  <span className={cn("h-3 w-3 rounded-full", config.color)} />
                  <span className="text-sm text-muted-foreground">{config.label}</span>
                </div>
              )
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            Unidade Sirius • Calendário de Atividades {year}
          </p>
          <p className="mt-1">
            Sincronize com seu calendário favorito clicando em qualquer evento
          </p>
        </footer>
      </main>

      {/* Event Modal */}
      <EventModal event={selectedEvent} onClose={handleCloseModal} />
    </div>
  )
}
