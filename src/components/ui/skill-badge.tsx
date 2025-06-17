import { Badge } from "@/components/ui/badge"

interface SkillBadgeProps {
  skills: string[]
  limit?: number
}

export function SkillBadge({ skills, limit }: SkillBadgeProps) {
  const displaySkills = limit ? skills.slice(0, limit) : skills
  const remaining = limit && skills.length > limit ? skills.length - limit : 0

  return (
    <div className="flex flex-wrap gap-2">
      {displaySkills.map((skill) => (
        <Badge key={skill} variant="secondary">
          {skill}
        </Badge>
      ))}
      {remaining > 0 && <Badge variant="outline">+{remaining}</Badge>}
    </div>
  )
}
