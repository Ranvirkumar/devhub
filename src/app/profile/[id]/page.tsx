"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useData } from "@/lib/data";
import { Developer, BlogPost } from "@/types";
import { Calendar, Github, Globe, Linkedin, Twitter } from "lucide-react";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { developers, blogPosts } = useData();
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [developerPosts, setDeveloperPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Simulate API fetch with a small delay
    const timer = setTimeout(() => {
      const foundDeveloper = developers.find((dev) => dev.id === id);
      if (!foundDeveloper) {
        setIsLoading(false);
        notFound();
      }

      setDeveloper(foundDeveloper);

      const posts = blogPosts.filter((post) => post.authorId === id);

      setDeveloperPosts(posts);

      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <Card>
              <CardHeader className="flex flex-col items-center">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-8 w-48 mt-4" />
                <Skeleton className="h-4 w-32 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full mt-4" />
                <div className="flex flex-wrap gap-2 mt-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex justify-center gap-4 mt-6">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:w-2/3">
            <Tabs defaultValue="posts">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="posts">Blog Posts</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="mt-6">
                <div className="space-y-6">
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-40 w-full" />
                </div>
              </TabsContent>
              <TabsContent value="about" className="mt-6">
                <Skeleton className="h-60 w-full" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
        Data not present
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={developer.avatar || ""}
                  alt={developer.name}
                />
                <AvatarFallback>
                  {developer.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4 text-center">
                {developer.name}
              </CardTitle>
              <CardDescription className="text-center">
                {developer.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{developer.bio}</p>

              <div className="flex flex-wrap gap-2 mt-6">
                {developer.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-center gap-4 mt-6">
                {developer.socialLinks.github && (
                  <Link
                    href={developer.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" size="icon" aria-label="GitHub">
                      <Github className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                {developer.socialLinks.twitter && (
                  <Link
                    href={developer.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" size="icon" aria-label="Twitter">
                      <Twitter className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                {developer.socialLinks.linkedin && (
                  <Link
                    href={developer.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" size="icon" aria-label="LinkedIn">
                      <Linkedin className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                {developer.socialLinks.website && (
                  <Link
                    href={developer.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" size="icon" aria-label="Website">
                      <Globe className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Tabs defaultValue="posts">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="posts">Blog Posts</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="mt-6">
              {developerPosts.length > 0 ? (
                <div className="space-y-6">
                  {developerPosts.map((post) => (
                    <Link key={post.id} href={`/blogs/${post.id}`}>
                      <Card className="transition-transform hover:scale-[1.01]">
                        <CardHeader>
                          <CardTitle>{post.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            {post.excerpt}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">No blog posts yet</h3>
                  <p className="text-muted-foreground mt-2">
                    This developer hasn&apos;t published any blog posts.
                  </p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="about" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About {developer.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Bio</h3>
                      <p className="text-muted-foreground mt-1">
                        {developer.bio}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Skills</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {developer.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">Contact</h3>
                      <p className="text-muted-foreground mt-1">
                        {developer.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
