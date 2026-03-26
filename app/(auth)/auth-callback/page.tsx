"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { supabase } from "@/lib/supabaseClient"
import { useAuthStore } from "@/src/store/auth-store"
import type { UserRole } from "@/src/mock/users"
import type { MockUser } from "@/src/mock/users"

function computeInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function AuthCallbackPage() {
  const router = useRouter()

  const setUserFromProfile = useAuthStore((s) => s.setUserFromProfile)

  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        const sp = new URLSearchParams(window.location.search)
        const accessToken = sp.get("access_token")
        const refreshToken = sp.get("refresh_token")
        const type = sp.get("type")

        if (!accessToken || !refreshToken) {
          throw new Error("Missing auth tokens in URL.")
        }

        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        if (sessionError) throw sessionError

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) throw userError
        if (!user) throw new Error("User not found after session set.")

        // Ensure a profile row exists so the rest of the app works.
        const metaName = (user.user_metadata as any)?.name as string | undefined
        const metaRole = ((user.user_metadata as any)?.role as UserRole | undefined) ?? "client"

        const fallbackName = metaName ?? user.email?.split("@")[0] ?? "User"
        const initials = computeInitials(fallbackName)

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileError || !profile) {
          const { data: insertedProfile, error: insertError } = await supabase
            .from("profiles")
            .upsert(
              {
                id: user.id,
                name: fallbackName,
                email: user.email ?? "",
                role: metaRole,
                avatar_url: (user.user_metadata as any)?.avatar_url ?? null,
                initials,
              },
              { onConflict: "id" }
            )
            .select("*")
            .single()

          if (insertError) throw insertError
          if (!insertedProfile) throw new Error("Could not create profile row.")

          const mockUser: MockUser = {
            id: insertedProfile.id,
            name: insertedProfile.name,
            email: insertedProfile.email,
            role: insertedProfile.role as UserRole,
            avatar: insertedProfile.avatar_url ?? null,
            initials: insertedProfile.initials,
            createdAt: insertedProfile.created_at,
          }

          if (!cancelled) {
            setUserFromProfile(mockUser)
          }
        } else {
          const mockUser: MockUser = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role as UserRole,
            avatar: profile.avatar_url ?? null,
            initials: profile.initials,
            createdAt: profile.created_at,
          }

          if (!cancelled) {
            setUserFromProfile(mockUser)
          }
        }

        if (cancelled) return

        const roleToUse: UserRole = metaRole ?? "client"
        // After confirmation / magic-link login: send hosts to `/host`, clients to `/explore`.
        router.push(roleToUse === "host" ? "/host" : "/explore")
      } catch (e: any) {
        if (cancelled) return
        setError(e?.message ?? "Authentication callback failed.")
      } finally {
        if (!cancelled) setIsProcessing(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [router, setUserFromProfile])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6 text-center">
      {isProcessing ? (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Signing you in...</h1>
            <p className="text-sm text-muted-foreground">Finishing email authentication.</p>
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Authentication failed</h1>
          <p className="text-sm text-muted-foreground">{error ?? "Something went wrong."}</p>
          <button
            type="button"
            className="mt-3 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
            onClick={() => router.push("/login")}
          >
            Go to login
          </button>
        </div>
      )}
    </div>
  )
}

