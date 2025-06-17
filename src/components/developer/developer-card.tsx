import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { UserAvatar } from "@/components/ui/user-avatar"
import { SkillBadge } from "@/components/ui/skill-badge"
import type { Developer } from "@/types"

interface DeveloperCardProps {
  developer: Developer
}

export function DeveloperCard({ developer }: DeveloperCardProps) {
  return (
    <Link href={`/profile/${developer.id}`} className="transition-transform hover:scale-[1.02]">
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center gap-4">
          <UserAvatar src={developer.avatar} name={developer.name} className="h-12 w-12" />
          <div>
            <h2 className="text-xl font-bold">{developer.name}</h2>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{developer.bio}</p>
        </CardContent>
        <CardFooter>
          <SkillBadge skills={developer.skills} limit={3} />
        </CardFooter>
      </Card>
    </Link>
  )
}
