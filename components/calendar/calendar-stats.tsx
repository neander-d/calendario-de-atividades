"use client"

import {
  type CalendarEvent,
  type EventCategory,
  categoryConfig,
} from "@/lib/calendar-data"
import { Tent, Users, Star, Heart, Home, Medal } from "lucide-react"

interface CalendarStatsProps {
  events: CalendarEvent[]
}

export function CalendarStats({ events }: CalendarStatsProps) {
  const stats = [
    {
      icon: Tent,
      label: "Atividades do Clube",
      value: events.filter((e) => e.category === "Atividades do clube").length,
      color: "text-emerald-500",
    },
    {
      icon: Users,
      label: "Reuniões",
      value: events.filter((e) => e.category === "reuniao").length,
      color: "text-blue-500",
    },
    {
      icon: Star,
      label: "Eventos Especiais",
      value: events.filter((e) => e.category === "evento-especial").length,
      color: "text-amber-500",
    },
    {
      icon: Heart,
      label: "Ações Comunitárias",
      value: events.filter((e) => e.category === "comunitario").length,
      color: "text-rose-500",
    },
     {
      icon: Home,
      label: "Visitas",
      value: events.filter((e) => e.category === "Visitas").length,
      color: "text-pink-500",
    },
         {
      icon: Medal,
      label: "Especialidades",
      value: events.filter((e) => e.category === "especialidade").length,
      color: "text-purple-500",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-border bg-card p-4 text-center transition-shadow hover:shadow-md"
        >
          <stat.icon className={`mx-auto mb-2 h-8 w-8 ${stat.color}`} />
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
