"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useData } from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { updateBlog } from "@/lib/api";

const schema = yup
  .object({
    title: yup.string().required("Title is required"),
    content: yup.string().required("Content is required"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export default function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { blogPosts } = useData();
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("write");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const content = watch("content", "");

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be signed in to edit a blog post.",
      });
      router.push("/auth/signin");
      return;
    }

    // Fetch blog post
    const timer = setTimeout(() => {
      const post = blogPosts.find((post) => post.id === id);

      if (!post) {
        setIsLoading(false);
        notFound();
        return;
      }

      // Check if user is the author
      if (post.authorId !== user.id) {
        toast({
          variant: "destructive",
          title: "Permission denied",
          description: "You don't have permission to edit this blog post.",
        });
        router.push(`/blogs/${id}`);
        return;
      }

      setValue("title", post.title);
      setValue("content", post.content);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id, user, router, toast, setValue, blogPosts]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Simulate API call with the form data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await updateBlog(id, data, blogPosts);
      toast({
        title: "Blog post updated",
        description: "Your blog post has been updated successfully.",
      });

      router.push(`/blogs/${id}`);
    } catch (err) {
      console.error("Blog post update error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update blog post. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <div className="h-8 w-1/3 bg-muted rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                <div className="h-10 w-full bg-muted rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                <div className="h-64 w-full bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Blog Post</CardTitle>
            <CardDescription>Make changes to your blog post</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a descriptive title"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="write">Write</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="write" className="mt-2">
                    <Textarea
                      placeholder="Write your blog post content in Markdown..."
                      className="min-h-[300px] font-mono"
                      {...register("content")}
                    />
                    {errors.content && (
                      <p className="text-sm text-destructive mt-2">
                        {errors.content.message}
                      </p>
                    )}
                  </TabsContent>
                  <TabsContent value="preview" className="mt-2">
                    <div className="border rounded-md p-4 min-h-[300px] prose dark:prose-invert max-w-none">
                      {content ? (
                        <ReactMarkdown>{content}</ReactMarkdown>
                      ) : (
                        <p className="text-muted-foreground">
                          Nothing to preview yet. Start writing in the Write
                          tab.
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/blogs/${id}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Post"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
