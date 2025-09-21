import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain } from "lucide-react"
import Link from "next/link"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/landing" className="inline-flex items-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">CareerAI</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sorry, something went wrong.</CardTitle>
          </CardHeader>
          <CardContent>
            {params?.error ? (
              <p className="text-sm text-muted-foreground text-center">Error: {params.error}</p>
            ) : (
              <p className="text-sm text-muted-foreground text-center">An unspecified error occurred.</p>
            )}
            <div className="mt-4 text-center">
              <Link href="/auth/login" className="text-primary hover:underline">
                Try signing in again
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
