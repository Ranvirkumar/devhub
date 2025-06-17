import * as yup from "yup"

export const commentSchema = yup
  .object({
    content: yup.string().required("Comment cannot be empty"),
  })
  .required()

export type CommentFormData = yup.InferType<typeof commentSchema>
