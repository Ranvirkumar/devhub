import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, Globe, Linkedin, Twitter } from "lucide-react"

interface SocialLinksProps {
  links: {
    github?: string
    twitter?: string
    linkedin?: string
    website?: string
  }
}

export function SocialLinks({ links }: SocialLinksProps) {
  return (
    <div className="flex justify-center gap-4 mt-6">
      {links.github && (
        <Link href={links.github} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon" aria-label="GitHub">
            <Github className="h-5 w-5" />
          </Button>
        </Link>
      )}
      {links.twitter && (
        <Link href={links.twitter} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon" aria-label="Twitter">
            <Twitter className="h-5 w-5" />
          </Button>
        </Link>
      )}
      {links.linkedin && (
        <Link href={links.linkedin} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon" aria-label="LinkedIn">
            <Linkedin className="h-5 w-5" />
          </Button>
        </Link>
      )}
      {links.website && (
        <Link href={links.website} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon" aria-label="Website">
            <Globe className="h-5 w-5" />
          </Button>
        </Link>
      )}
    </div>
  )
}
