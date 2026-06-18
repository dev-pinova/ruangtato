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
import { PendingPaymentBanner } from "@/components/billing/pending-payment-banner"
import { useLanguage } from "@/lib/i18n/language-provider"

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

const STATUS_CONFIG: Record<
  string,
  { labelKey: "new" | "read" | "replied"; variant: "default" | "secondary" | "outline" }
> = {
  new: { labelKey: "new", variant: "default" },
  read: { labelKey: "read", variant: "secondary" },
  replied: { labelKey: "replied", variant: "outline" },
}

export default function DashboardPage() {
  const { t, locale } = useLanguage()
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

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const summaryCards = useMemo(() => {
    const stats = data?.stats ?? {
      totalViews: 0,
      totalClicks: 0,
      totalLeads: 0,
      conversionRate: 0,
    }

    const numLocale = locale === "en" ? "en-US" : "id-ID"

    return [
      {
        label: t.dashboard.views,
        value: stats.totalViews.toLocaleString(numLocale),
        icon: Eye,
      },
      {
        label: t.dashboard.clicks,
        value: stats.totalClicks.toLocaleString(numLocale),
        icon: MousePointerClick,
      },
      {
        label: t.dashboard.conversionRate,
        value: `${stats.conversionRate}%`,
        icon: Percent,
      },
      {
        label: t.dashboard.leads,
        value: stats.totalLeads.toLocaleString(numLocale),
        icon: Users,
      },
    ]
  }, [data, locale, t])

  const leads = data?.leads ?? []

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeading
        title={t.dashboard.title}
        description={t.dashboard.description}
      />

      {/* Banner pembayaran pending */}
      <PendingPaymentBanner />

      {loading ? (
        <p className="text-sm text-muted-foreground">{t.dashboard.loading}</p>
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
          <CardTitle>{t.dashboard.dailyStatsTitle}</CardTitle>
          <CardDescription>
            {t.dashboard.dailyStatsDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t.dashboard.dailyStatsNote}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.latestLeadsTitle}</CardTitle>
          <CardDescription>
            {t.dashboard.leadsCount.replace("{count}", String(leads.length))}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t.dashboard.noLeads}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.dashboard.table.name}</TableHead>
                  <TableHead>{t.dashboard.table.email}</TableHead>
                  <TableHead className="hidden md:table-cell">{t.dashboard.table.message}</TableHead>
                  <TableHead>{t.dashboard.table.status}</TableHead>
                  <TableHead>{t.dashboard.table.date}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.slice(0, 7).map((lead) => {
                  const statusConfig = STATUS_CONFIG[lead.status] ?? STATUS_CONFIG.new
                  const statusLabel = t.dashboard.status[statusConfig.labelKey]
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
                        <Badge variant={statusConfig.variant}>{statusLabel}</Badge>
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
