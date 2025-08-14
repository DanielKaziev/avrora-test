import { memo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Stack, TextField, IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import type { IFormData } from "../../../types/form";

interface OptionsEditorProps {
  fieldIndex: number;
}

export const OptionsEditor = memo(({ fieldIndex }: OptionsEditorProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<IFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `fields.${fieldIndex}.options` as const,
  });

  return (
    <Stack spacing={1}>
      {fields.map((opt, optIndex) => (
        <Stack key={opt.id} direction="row" alignItems="center" spacing={1}>
          <TextField
            label="Название"
            {...register(`fields.${fieldIndex}.options.${optIndex}.name`, {
              required: "Поле обязательно",
              maxLength: { value: 64, message: "Максимум 64 символа" },
              minLength: { value: 2, message: "Минимум 2 символа" },
            })}
            error={!!errors?.fields?.[fieldIndex]?.options?.[optIndex]?.name}
            helperText={
              errors?.fields?.[fieldIndex]?.options?.[optIndex]?.name?.message
            }
            size="small"
            fullWidth
          />
          <TextField
            label="Значение"
            {...register(`fields.${fieldIndex}.options.${optIndex}.value`, {
              required: "Поле обязательно",
              maxLength: { value: 64, message: "Максимум 64 символа" },
              minLength: { value: 2, message: "Минимум 2 символа" },
            })}
            error={!!errors?.fields?.[fieldIndex]?.options?.[optIndex]?.value}
            helperText={
              errors?.fields?.[fieldIndex]?.options?.[optIndex]?.value?.message
            }
            size="small"
            fullWidth
          />
          <IconButton
            color="error"
            onClick={() => remove(optIndex)}
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ))}
      <Button
        variant="outlined"
        size="small"
        startIcon={<AddIcon />}
        onClick={() => append({ name: "", value: "" })}
      >
        Добавить вариант
      </Button>
    </Stack>
  );
});
OptionsEditor.displayName = "OptionsEditor";
