import { useState, useEffect } from "react";
import type { Developer, BlogPost, Comment } from "@/types";

export const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
}

export const useData = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadDevelopers = async () => {
    try {
      const response = await fetch(`${baseUrl}/developers`);
      const data = await response.json();
      setDevelopers(data);
    } catch (err) {
      console.error("Error loading developers:", err);
      setError(err as Error);
    }
  };

  const loadBlogPosts = async () => {
    try {
      const response = await fetch(`${baseUrl}/blogs`);
      const data = await response.json();
      setBlogPosts(data);
    } catch (err) {
      console.error("Error loading blog posts:", err);
      setError(err as Error);
    }
  };

  const loadComments = async () => {
    try {
      const response = await fetch(`${baseUrl}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error("Error loading comments:", err);
      setError(err as Error);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([loadDevelopers(), loadBlogPosts(), loadComments()]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    developers,
    blogPosts,
    comments,
    isLoading,
    error,
    loadData,
  };
};
