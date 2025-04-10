import * as yup from "yup";


// Validation schema
export const useSchema = () => {
  return yup.object().shape({
      title: yup.string().required("Title is required"),
      description: yup.string().required("Description is required"),
      tags: yup.string().optional(),
  });
};


export type FormDataType = yup.InferType<ReturnType<typeof useSchema>>;