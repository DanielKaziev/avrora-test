import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { IconButton, Stack, TextField, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import type { IFormData, IOptionsField } from "../../../types/form";
import type { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

type OptionsFieldError = Merge<FieldError, FieldErrorsImpl<IOptionsField>>;
function isOptionsFieldError(
  err: unknown
): err is OptionsFieldError {
  return typeof err === "object" && err !== null && "options" in err;
}

interface Props {
  fieldIndex: number;
}

export const OptionsEditor: React.FC<Props> = ({ fieldIndex }) => {
  const { control, formState: { errors } } = useFormContext<IFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `fields.${fieldIndex}.options` as const,
  });

  const fieldError = errors?.fields?.[fieldIndex];

  return (
    <Stack spacing={2} >
      {fields.map((opt, optIndex) => {
        const optionError = isOptionsFieldError(fieldError)
          ? fieldError.options?.[optIndex]
          : undefined;

        return (
          <Stack key={opt.id} direction="row" alignItems="center" spacing={1}>
            <Controller
              control={control}
              name={`fields.${fieldIndex}.options.${optIndex}.name`}
              rules={{              required: "Поле обязательно",
              maxLength: { value: 64, message: "Максимум 64 символа" },
              minLength: { value: 2, message: "Минимум 2 символа" },}}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Название"
                  error={!!optionError?.name}
                  helperText={optionError?.name?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              control={control}
              name={`fields.${fieldIndex}.options.${optIndex}.value`}
                            rules={{              required: "Поле обязательно",
              maxLength: { value: 64, message: "Максимум 64 символа" },
              minLength: { value: 2, message: "Минимум 2 символа" },}}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Значение"
                  error={!!optionError?.value}
                  helperText={optionError?.value?.message}
                  fullWidth
                />
              )}
            />
            <IconButton onClick={() => remove(optIndex)} color="error">
              <DeleteIcon />
            </IconButton>
          </Stack>
        );
      })}

      <Button
        onClick={() => append({ name: "", value: "" })}
        variant="outlined"
        startIcon={<AddIcon />}
      >
        Добавить опцию
      </Button>
    </Stack>
  );
};
