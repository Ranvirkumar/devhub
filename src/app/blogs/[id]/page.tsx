"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { baseUrl, useData } from "@/lib/data";
import { BlogPost, Developer, Comment } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Edit, Loader2, Trash } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { deleteBlog } from "@/lib/api";

const commentSchema = yup
  .object({
    content: yup.string().required("Comment cannot be empty"),
  })
  .required();

type CommentFormData = yup.InferType<typeof commentSchema>;

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { blogPosts, developers, comments } = useData();
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [author, setAuthor] = useState<Developer | null>(null);
  const [blogComments, setBlogComments] = useState<Comment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: yupResolver(commentSchema),
  });

  useEffect(() => {
    // Simulate API fetch with a small delay
    const timer = setTimeout(() => {
      const post = blogPosts.find((post) => post.id === id);
      if (!post) {
        setIsLoading(false);
        notFound();
      }

      setBlogPost(post);

      const postAuthor = developers.find((dev) => dev.id === post.authorId);
      setAuthor(postAuthor || null);

      const postComments = comments.filter(
        (comment) => comment.blogPostId === id
      );
      setBlogComments(postComments);

      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id, blogPosts, developers, comments]);

  const getCommentAuthor = (authorId: string, details: Comment) => {
    return (
      developers.find((dev) => dev.id === authorId) || {
        name: details.authorname || "Unknown User",
        avatar: details.authorAvatar || null,
      }
    );
  };

  const onSubmitComment = async (data: CommentFormData) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be signed in to leave a comment.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newComment = {
        id: `comment-${Date.now()}`,
        content: data.content,
        authorId: user.id,
        authorname: user.name,
        authorAvatar: user.avatar || "",
        blogPostId: id,
        createdAt: new Date().toISOString(),
      };

      setBlogComments([...blogComments, newComment]);
      await fetch(`${baseUrl}/comments`, {
        method: "POST",
        body: JSON.stringify(newComment),
      });
      // await loadData();
      reset();

      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    } catch (err) {
      console.error("Comment submission error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!user || (blogPost && user.id !== blogPost.authorId)) {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "You don't have permission to delete this post.",
      });
      return;
    }

    setIsDeleting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      await deleteBlog(id, blogPosts);
      toast({
        title: "Blog post deleted",
        description: "Your blog post has been deleted successfully.",
      });

      router.push("/blogs");
    } catch (err) {
      console.error("Blog post deletion error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete blog post. Please try again.",
      });
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-6 w-1/2 bg-muted rounded animate-pulse" />
            <div className="h-64 w-full bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!blogPost || !author) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
        Data not present
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{blogPost.title}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={author.avatar || ""} alt={author.name} />
                <AvatarFallback>
                  {author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <Link
                  href={`/profile/${author.id}`}
                  className="text-sm font-medium hover:underline"
                >
                  {author.name}
                </Link>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(blogPost.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            {user && user.id === blogPost.authorId && (
              <div className="flex gap-2">
                <Link href={`/blogs/edit/${blogPost.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeletePost}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4 mr-1" />
                  )}
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none mb-12">
          <ReactMarkdown>{blogPost.content}</ReactMarkdown>
        </div>

        <Separator className="my-8" />

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">
            Comments ({blogComments.length})
          </h2>

          {user ? (
            <form
              onSubmit={handleSubmit(onSubmitComment)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Textarea
                  placeholder="Leave a comment..."
                  {...register("content")}
                />
                {errors.content && (
                  <p className="text-sm text-destructive">
                    {errors.content.message}
                  </p>
                )}
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
          ) : (
            <Alert>
              <AlertDescription>
                <Link href="/auth/signin" className="font-medium underline">
                  Sign in
                </Link>{" "}
                to leave a comment.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4 mt-8">
            {blogComments.length > 0 ? (
              blogComments.map((comment) => {
                const commentAuthor = getCommentAuthor(
                  comment.authorId,
                  comment
                );
                return (
                  <Card key={comment.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={commentAuthor.avatar || ""}
                              alt={commentAuthor.name}
                            />
                            <AvatarFallback>
                              {commentAuthor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <CardTitle className="text-sm font-medium">
                            {commentAuthor.name}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-xs">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{comment.content}</p>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
