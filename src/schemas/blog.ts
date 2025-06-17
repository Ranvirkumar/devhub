import * as yup from "yup"

export const blogSchema = yup
  .object({
    title: yup.string().required("Title is required"),
    content: yup.string().required("Content is required"),
  })
  .required()

export type BlogFormData = yup.InferType<typeof blogSchema>
