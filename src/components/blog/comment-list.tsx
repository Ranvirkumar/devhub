import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserAvatar } from "@/components/ui/user-avatar"
import { formatDate } from "@/lib/utils"
import type { Comment } from "@/types"

interface CommentListProps {
  comments: Comment[]
  getAuthor: (authorId: string) => { name: string; avatar: string | null }
}

export function CommentList({ comments, getAuthor }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const author = getAuthor(comment.authorId)
        return (
          <Card key={comment.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserAvatar src={author.avatar} name={author.name} className="h-6 w-6" />
                  <CardTitle className="text-sm font-medium">{author.name}</CardTitle>
                </div>
                <CardDescription className="text-xs">{formatDate(comment.createdAt)}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{comment.content}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
