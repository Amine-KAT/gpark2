"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, KeyRound, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"

import { supabase } from "@/lib/supabaseClient"

const resetSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type ResetFormValues = z.infer<typeof resetSchema>

export default function ResetPasswordPage() {
  const router = useRouter()

  const [tokenError, setTokenError] = useState<string | null>(null)
  const [isSettingSession, setIsSettingSession] = useState(true)
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false)

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const redirectToLogin = () => router.push("/login")

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        const sp = new URLSearchParams(window.location.search)
        const type = sp.get("type")
        const tokenHashFromQuery = sp.get("token_hash") || sp.get("token")

        // Some Supabase auth links put params in the URL fragment instead of `?query=`.
        const hash = window.location.hash.startsWith("#")
          ? window.location.hash.slice(1)
          : window.location.hash
        const hashSp = new URLSearchParams(hash)
        const typeFromHash = hashSp.get("type")
        const tokenHashFromHash =
          hashSp.get("token_hash") || hashSp.get("token") || hashSp.get("access_token")

        const finalType = (type || typeFromHash) ?? undefined
        const tokenHash = tokenHashFromQuery || tokenHashFromHash || undefined

        if (!finalType || !tokenHash) {
          setTokenError("Invalid or missing reset token in URL.")
          return
        }

        setIsSettingSession(true)

        // Password recovery: verify the token hash to create a session.
        const { error } = await supabase.auth.verifyOtp({
          type: finalType as any,
          token_hash: tokenHash,
        })

        if (error) {
          setTokenError(error.message)
          return
        }

        if (!cancelled) setIsSettingSession(false)
      } catch (e: any) {
        if (!cancelled) setTokenError(e?.message ?? "Failed to validate reset token.")
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [])

  const canSubmit = useMemo(() => {
    return !isSettingSession && !tokenError && !isPasswordUpdated
  }, [isSettingSession, tokenError, isPasswordUpdated])

  async function onSubmit(values: ResetFormValues) {
    const { error } = await supabase.auth.updateUser({ password: values.password })
    if (error) {
      setTokenError(error.message)
      return
    }

    setIsPasswordUpdated(true)
  }

  if (isPasswordUpdated) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <KeyRound className="h-7 w-7 text-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Password updated</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You can now sign in with your new password.
          </p>
        </div>

        <Card className="w-full border-dashed">
          <CardContent className="flex flex-col items-center gap-3 py-4">
            <Button onClick={redirectToLogin} size="lg">
              Back to login
            </Button>
            <Link
              href="/login"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              Go to login page
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/login"
        className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset your password</h1>
        <p className="text-sm text-muted-foreground">
          Enter a new password. You will be able to sign in right away.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          {tokenError ? (
            <p className="text-sm text-destructive" role="alert">
              {tokenError}
            </p>
          ) : null}

          {isSettingSession ? (
            <div className="flex items-center justify-center rounded-xl border bg-card/50 p-6">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-3 text-sm text-muted-foreground">Validating reset link...</span>
            </div>
          ) : (
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter a new password"
                        autoComplete="new-password"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full" disabled={!canSubmit}>
                Update password
              </Button>
            </>
          )}
        </form>
      </Form>
    </div>
  )
}

