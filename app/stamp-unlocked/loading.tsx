export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-coral mb-4"></div>
      <p className="text-deep-navy">Loading stamp information...</p>
    </div>
  )
}
