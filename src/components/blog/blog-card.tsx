import Link from "next/link"
import { Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { UserAvatar } from "@/components/ui/user-avatar"
import { formatDate } from "@/lib/utils"
import type { BlogPost } from "@/types"

interface BlogCardProps {
  post: BlogPost
  author: { name: string; avatar: string | null }
}

export function BlogCard({ post, author }: BlogCardProps) {
  return (
    <Link href={`/blogs/${post.id}`} className="transition-transform hover:scale-[1.02]">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDate(post.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-2">
            <UserAvatar src={author.avatar} name={author.name} className="h-6 w-6" />
            <span className="text-sm text-muted-foreground">{author.name}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
