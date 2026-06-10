"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Eye,
  MousePointerClick,
  Users,
  Percent,
} from "lucide-react"
import { MetricCard, PageHeading } from "@/components/design"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"

type LeadRow = {
  id: string
  name: string
  email: string | null
  message: string
  status: string
  createdAt: string
}

type DashboardData = {
  stats: {
    totalViews: number
    totalClicks: number
    totalLeads: number
    conversionRate: number
  }
  leads: LeadRow[]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  new: { label: "Baru", variant: "default" },
  read: { label: "Dibaca", variant: "secondary" },
  replied: { label: "Dibalas", variant: "outline" },
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/studios/me/dashboard")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json) {
          setData({ stats: json.stats, leads: json.leads ?? [] })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const summaryCards = useMemo(() => {
    const stats = data?.stats ?? {
      totalViews: 0,
      totalClicks: 0,
      totalLeads: 0,
      conversionRate: 0,
    }

    return [
      {
        label: "Total Views",
        value: stats.totalViews.toLocaleString("id-ID"),
        icon: Eye,
      },
      {
        label: "Total Clicks",
        value: stats.totalClicks.toLocaleString("id-ID"),
        icon: MousePointerClick,
      },
      {
        label: "Conversion Rate",
        value: `${stats.conversionRate}%`,
        icon: Percent,
      },
      {
        label: "Total Leads",
        value: stats.totalLeads.toLocaleString("id-ID"),
        icon: Users,
      },
    ]
  }, [data])

  const leads = data?.leads ?? []

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeading
        title="Dashboard"
        description="Pantau performa studio Anda secara real-time."
      />

      {loading ? (
        <p className="text-sm text-muted-foreground">Memuat data...</p>
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12">
        {summaryCards.map((card, idx) => {
          // Bento layout spans: 
          // Views, Clicks, Leads: lg:col-span-4
          // Conversion Rate: lg:col-span-12 (spans full width, highlighted as best performer)
          const isFeatured = idx === 2
          const colSpan = isFeatured 
            ? "col-span-1 sm:col-span-2 lg:col-span-12" 
            : "col-span-1 sm:col-span-1 lg:col-span-4"
          
          return (
            <MetricCard
              key={card.label}
              label={card.label}
              value={card.value}
              icon={card.icon}
              isFeatured={isFeatured}
              className={colSpan}
            />
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistik Harian</CardTitle>
          <CardDescription>
            Data harian akan tersedia setelah fitur analytics lanjutan dirilis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Saat ini gunakan ringkasan total views, clicks, dan leads di atas.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lead Terbaru</CardTitle>
          <CardDescription>
            {leads.length} lead masuk
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada lead. Lead dari form appointment akan muncul di sini.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Pesan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.slice(0, 7).map((lead) => {
                  const status = STATUS_CONFIG[lead.status] ?? STATUS_CONFIG.new
                  return (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {lead.email ?? "—"}
                      </TableCell>
                      <TableCell className="hidden max-w-[240px] truncate text-muted-foreground md:table-cell">
                        {lead.message}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(lead.createdAt)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
