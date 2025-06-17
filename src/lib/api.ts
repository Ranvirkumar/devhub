import { useData, baseUrl } from "@/lib/data";
import type { BlogPost, Comment } from "@/types";

// Helper function to generate a unique ID
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function createBlog(data: {
  title: string;
  content: string;
  authorId: string;
}): Promise<BlogPost> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const excerpt = data.content
    .replace(/[#*`]/g, "")
    .slice(0, 150)
    .trim()
    .concat("...");

  const newPost = {
    id: generateId("blog"),
    title: data.title,
    content: data.content,
    excerpt,
    authorId: data.authorId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  // Push the new blog post to the JSON server
  await fetch(`${baseUrl}/blogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  });
  return newPost;
}

export async function updateBlog(
  id: string,
  data: { title: string; content: string },
  blogPosts: BlogPost[]
): Promise<BlogPost> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const postIndex = blogPosts.findIndex((post) => post.id === id);
  if (postIndex === -1) {
    throw new Error("Blog post not found");
  }

  const excerpt = data.content
    .replace(/[#*`]/g, "")
    .slice(0, 150)
    .trim()
    .concat("...");

  const updatedPost = {
    ...blogPosts[postIndex]!,
    title: data.title,
    content: data.content,
    excerpt,
    updatedAt: new Date().toISOString(),
  } as BlogPost;
  // Push the updated blog post to the JSON server
  await fetch(`${baseUrl}/blogs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedPost),
  });
  return updatedPost;
}

export async function deleteBlog(id: string, blogPosts: BlogPost[]) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Push the updated blog post to the JSON server

  const postIndex = blogPosts.findIndex((post) => post.id === id);
  if (postIndex === -1) {
    throw new Error("Blog post not found");
  }
  await fetch(`${baseUrl}/blogs/${id}`, {
    method: "DELETE",
  });
  return { success: true };
}

// Comment API
export async function getCommentsByBlogId(blogId: string) {
  const { comments } = useData();
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return comments
    .filter((comment) => comment.blogPostId === blogId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
}

export async function createComment(data: {
  content: string;
  authorId: string;
  blogPostId: string;
}): Promise<Comment> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newComment = {
    id: generateId("comment"),
    content: data.content,
    authorId: data.authorId,
    blogPostId: data.blogPostId,
    createdAt: new Date().toISOString(),
  };

  return newComment;
}

// Developers API
export async function fetchDevelopers() {
  const res = await fetch(`${baseUrl}/developers`);
  if (!res.ok) throw new Error("Failed to fetch developers");
  return res.json();
}

// Blogs API
export async function fetchBlogs() {
  const res = await fetch(`${baseUrl}/blogs`);
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
}
