import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

interface UserAvatarProps {
  src: string | null
  name: string
  className?: string
}

export function UserAvatar({ src, name, className = "h-8 w-8" }: UserAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage src={src || ""} alt={name} />
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  )
}
