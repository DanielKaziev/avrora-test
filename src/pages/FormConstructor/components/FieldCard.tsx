import { memo } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { IFormData } from "../../../types/form";
import { OptionsEditor } from "./OptionsEditor";
import TextField from "@mui/material/TextField";

interface FieldCardProps {
  index: number;
  remove: (index: number) => void;
}

export const FieldCard = memo(({ index, remove }: FieldCardProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<IFormData>();
  const type = useWatch({ control, name: `fields.${index}.type` });

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardHeader
        title={`Поле ${index + 1}`}
        action={
          <IconButton color="error" onClick={() => remove(index)} size="small">
            <DeleteIcon />
          </IconButton>
        }
        sx={{
          "& .MuiCardHeader-title": {
            fontWeight: 500,
            fontSize: 16,
          },
        }}
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Название поля"
              {...register(`fields.${index}.name`, {
                required: "Поле обязательно",
                maxLength: { value: 32, message: "Максимум 32 символа" },
                minLength: { value: 2, message: "Минимум 2 символа" },
              })}
              error={Boolean(errors?.fields?.[index]?.name)}
              helperText={errors?.fields?.[index]?.name?.message}
              required
              fullWidth
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              control={control}
              name={`fields.${index}.type`}
              render={({ field }) => (
                <Select {...field} size="small" fullWidth>
                  <MenuItem value="string">Строка</MenuItem>
                  <MenuItem value="number">Число</MenuItem>
                  <MenuItem value="options">Список</MenuItem>
                </Select>
              )}
            />
          </Grid>
          {type === "options" && (
            <Grid size={{ xs: 12 }}>
              <OptionsEditor fieldIndex={index} />
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
});
FieldCard.displayName = "FieldCard";
