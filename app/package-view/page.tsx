import PackageDisplay from "../../components/package-display"
import AccessLimiter from "../../components/access-limiter"

export default function PackageViewPage() {
  return (
    <AccessLimiter>
      <PackageDisplay />
    </AccessLimiter>
  )
}
