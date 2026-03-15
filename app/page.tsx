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

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const handleExportPDF = () => {

    const filteredEvents = events2026
      .filter((event) => selectedCategories.includes(event.category))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const groupedByMonth = new Map<number, typeof filteredEvents>()

    filteredEvents.forEach((event) => {
      const month = new Date(event.date + "T00:00:00").getMonth()
      if (!groupedByMonth.has(month)) {
        groupedByMonth.set(month, [])
      }
      groupedByMonth.get(month)!.push(event)
    })


    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ]

   

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr + "T00:00:00")
      return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
    }

    const printWindow = window.open("", "_blank")
    if (!printWindow) return
    const categoryColors: Record<string, string> = {
      acampamento: "#10B981",      // emerald
      reuniao: "#3B82F6",          // blue
      especialidade: "#F59E0B",    // amber
      comunitario: "#F43F5E",      // rose
      "evento-especial": "#A855F7", // purple
      visita: "#06B6D4",
      regular: "#64748B"
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Calendario Desbravadores ${currentYear}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            color: #1a1a1a;
            line-height: 1.5;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #2d7a3e;
          }
          .header h1 {
            font-size: 28px;
            color: #2d7a3e;
            margin-bottom: 8px;
          }
          .header p {
            font-size: 16px;
            color: #666;
          }
          .month-section {
            margin-bottom: 30px;
            break-inside: avoid;
          }
          .month-title {
            font-size: 20px;
            color: #2d7a3e;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e0e0e0;
          }
          .event {
            padding: 12px 15px;
            margin-bottom: 10px;
            background: #f8f9fa;
            border-left: 4px solid #2d7a3e;
            border-radius: 0 8px 8px 0;
          }
          .event-title {
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 6px;
          }
          .event-details {
            font-size: 12px;
            color: #555;
          }
          .event-details span {
            margin-right: 15px;
          }
          .category {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
            background: #2d7a3e;
            color: white;
            margin-bottom: 6px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #888;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
          }
          @media print {
            body { padding: 20px; }
            .month-section { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Unidade Sirius</h1>
          <p>Calendario de Atividades ${currentYear}</p>
        </div>
        ${Array.from(groupedByMonth.entries())
          .sort((a, b) => a[0] - b[0])
          .map(([month, monthEvents]) => `
            <div class="month-section">
              <h2 class="month-title">${months[month]}</h2>
              ${monthEvents.map(event => `
                <div class="event">
                  <div 
                     class="category" 
                     style="background:${categoryColors[event.category]};">
                      ${categoryConfig[event.category]?.label}
                  </div>
                  <div class="event-title">${event.title}</div>
                  <div class="event-details">
                    <span><strong>Data:</strong> ${formatDate(event.date)}${event.endDate ? ` - ${formatDate(event.endDate)}` : ""}</span>
                    ${event.time ? `<span><strong>Horario:</strong> ${event.time}</span>` : ""}
                    ${event.location ? `<span><strong>Local:</strong> ${event.location}</span>` : ""}
                  </div>
                </div>
              `).join("")}
            </div>
          `).join("")}
        <div class="footer">
          <p>Documento gerado em ${new Date().toLocaleDateString("pt-BR")} | Clube de Desbravadores</p>
        </div>
      </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.print()
    }
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
