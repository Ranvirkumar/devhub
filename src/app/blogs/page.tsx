"use client";

import { useState } from "react";
import Link from "next/link";
import { useData } from "@/lib/data";
import type { Developer } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Calendar, Plus, Search } from "lucide-react";

export default function BlogsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { blogPosts, developers, isLoading } = useData();
  const postsPerPage = 6;

  // Filter blog posts based on search query
  const filteredPosts = (blogPosts || []).filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort posts by date (newest first)
  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Paginate posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Get author info for each post
  const getAuthor = (authorId: string): Developer => {
    return (
      developers?.find((dev) => dev.id === authorId) || {
        id: "",
        name: "Unknown Author",
        email: "",
        avatar: "",
        bio: "",
        skills: [],
        socialLinks: {},
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          {user && (
            <Link href="/blogs/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </Link>
          )}
        </div>
      </div>

      {currentPosts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">No blog posts found</h2>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search criteria
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map((post) => {
              const author = getAuthor(post.authorId);
              return (
                <Link
                  key={post.id}
                  href={`/blogs/${post.id}`}
                  className="transition-transform hover:scale-[1.02]"
                >
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <CardTitle className="line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={author.avatar || ""}
                            alt={author.name}
                          />
                          <AvatarFallback>
                            {author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          {author.name}
                        </span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {filteredPosts.length > postsPerPage && (
            <div className="flex justify-center mt-8">
              <nav>
                <ul className="flex space-x-2">
                  {Array.from(
                    {
                      length: Math.ceil(filteredPosts.length / postsPerPage),
                    },
                    (_, i) => i + 1
                  ).map((number) => (
                    <li key={number}>
                      <Button
                        variant={currentPage === number ? "default" : "outline"}
                        size="sm"
                        onClick={() => paginate(number)}
                      >
                        {number}
                      </Button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}
