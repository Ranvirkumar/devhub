export type Developer = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string;
  skills: string[];
  socialLinks: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
};

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};

export type Comment = {
  id: string;
  content: string;
  authorId: string;
  blogPostId: string;
  createdAt: string;
  authorname?: string;
  authorAvatar?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};
