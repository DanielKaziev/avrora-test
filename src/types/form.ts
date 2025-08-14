export interface IFormData {
  title: string;
  fields: IField[];
}

type FieldType = "string" | "number" | "options";

interface IFieldBase {
  name: string;
  type: FieldType;
}

export interface IOptionsField extends IFieldBase {
  type: "options";
  options: IOption[];
}

interface IOption {
  name: string;
  value: string;
}

export type IField = IFieldBase | IOptionsField;

export const data: IFormData = {
  title: "Form",
  fields: [
    {
      name: "Name",
      type: "string",
    },
    {
      name: "Age",
      type: "number",
    },
    {
      name: "Gender",
      type: "options",
      options: [
        {
          name: "Male",
          value: "male",
        },
        {
          name: "Female",
          value: "female",
        },
      ],
    },
  ],
};
