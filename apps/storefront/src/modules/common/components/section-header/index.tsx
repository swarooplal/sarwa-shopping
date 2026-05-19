import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  href?: string
  linkText?: string
}

export default function SectionHeader({
  title,
  subtitle,
  href,
  linkText = "View all",
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col small:flex-row small:items-end justify-between mb-10 small:mb-12 gap-4">
      <div>
        <div className="section-divider mb-4" />
        <h2 className="text-2xl small:text-3xl font-light text-sarwa-900 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      {href && (
        <LocalizedClientLink href={href}>
          <button className="group text-sm font-medium text-sarwa-600 hover:text-sarwa-700 transition-colors flex items-center gap-1">
            {linkText}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </LocalizedClientLink>
      )}
    </div>
  )
}
