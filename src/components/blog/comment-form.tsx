"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { commentSchema, type CommentFormData } from "@/schemas/comment"
import Link from "next/link"

interface CommentFormProps {
  onSubmit: (data: CommentFormData) => Promise<void>
  isAuthenticated: boolean
  isSubmitting: boolean
}

export function CommentForm({ onSubmit, isAuthenticated, isSubmitting }: CommentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: yupResolver(commentSchema),
  })

  const handleFormSubmit = async (data: CommentFormData) => {
    await onSubmit(data)
    reset()
  }

  if (!isAuthenticated) {
    return (
      <Alert>
        <AlertDescription>
          <Link href="/auth/signin" className="font-medium underline">
            Sign in
          </Link>{" "}
          to leave a comment.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Textarea placeholder="Leave a comment..." {...register("content")} />
        {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Comment"
        )}
      </Button>
    </form>
  )
}
