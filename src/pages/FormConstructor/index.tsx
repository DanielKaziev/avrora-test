import {
  useFieldArray,
  useForm,
  FormProvider,
  type SubmitHandler,
} from "react-hook-form";
import type { IFormData, IField } from "../../types/form";
import { Box, Button, TextField, Paper, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import { FieldCard } from "./components/FieldCard";

function FormConstructor() {
  const formMethods = useForm<IFormData>({
    defaultValues: {
      title: "",
      fields: [{ name: "", type: "string" }],
    },
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const onSubmit: SubmitHandler<IFormData> = (data) => console.log(data);

  return (
    <FormProvider {...formMethods}>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4, p: 2 }}>
        <Paper
          elevation={3}
          sx={{ p: 4, maxWidth: 800, width: "100%", borderRadius: 3 }}
        >
          <TextField
            label="Название формы"
            {...register("title", {
              required: "Поле обязательно",
              maxLength: { value: 64, message: "Максимум 64 символов" },
              minLength: { value: 2, message: "Минимум 2 символа" },
            })}
            error={Boolean(errors?.title?.message)}
            helperText={errors?.title?.message}
            required
            fullWidth
            size="small"
          />
          <Stack mt={2} spacing={3}>
            {fields.map((field, index) => (
              <FieldCard key={field.id} index={index} remove={remove} />
            ))}

            <Stack spacing={2} direction="row">
              <Button
                fullWidth
                startIcon={<AddIcon />}
                variant="outlined"
                onClick={() => append({ name: "", type: "string" } as IField)}
              >
                Добавить поле
              </Button>
              <Button
                fullWidth
                color="success"
                endIcon={<SaveIcon />}
                variant="outlined"
                onClick={handleSubmit(onSubmit)}
                type="submit"
                disabled={!fields.length}
              >
                Отправить в консоль
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </FormProvider>
  );
}

export default FormConstructor;
