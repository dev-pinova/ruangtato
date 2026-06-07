import { PageHeading } from "@/components/design"

export function AdminPlaceholder({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeading title={title} description={description} />
    </div>
  )
}
