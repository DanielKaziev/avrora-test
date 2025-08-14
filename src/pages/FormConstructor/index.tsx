import {
  useFieldArray,
  useForm,
  Controller,
  FormProvider,
  type SubmitHandler,
} from "react-hook-form";
import type { IFormData, IField } from "../../types/form";
import {
  Box,
  Button,
  TextField,
  Paper,
  Stack,
  MenuItem,
  Select,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Fade,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import { OptionsEditor } from "./components/OptionsEditor";

function FormConstructor() {
  const formMethods = useForm<IFormData>({
    defaultValues: {
      title: "",
      fields: [
        {
          name: "",
          type: "string",
        },
      ],
    },
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const onSubmit: SubmitHandler<IFormData> = (data) => console.log(data);

  const fieldValues = watch("fields");

  return (
    <FormProvider {...formMethods}>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4, p: 2 }}>
        <Paper
          elevation={3}
          sx={{ p: 4, maxWidth: 800, width: "100%", borderRadius: 3 }}
        >
          <TextField
            label="Название формы"
            {...register(`title` as const, {
              required: {
                value: true,
                message: "Поле обязательно для заполнения",
              },
              maxLength: {
                value: 64,
                message: "Максимум 64 символов",
              },
              minLength: {
                value: 2,
                message: "Минимум 2 символа",
              },
            })}
            error={Boolean(errors?.title?.message)}
            helperText={errors?.title?.message}
            required
            fullWidth
            size="small"
          />
          <Stack mt={2} spacing={3}>
            {fields.map((field, index) => (
              <Fade in key={field.id}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardHeader
                    title={`Поле ${index + 1}`}
                    action={
                      <IconButton
                        color="error"
                        onClick={() => remove(index)}
                        size="small"
                      >
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
                          {...register(`fields.${index}.name` as const, {
                            required: {
                              value: true,
                              message: "Поле обязательно для заполнения",
                            },
                            maxLength: {
                              value: 32,
                              message: "Максимум 32 символов",
                            },
                            minLength: {
                              value: 2,
                              message: "Минимум 2 символа",
                            },
                          })}
                          error={Boolean(
                            errors?.fields?.[index]?.name?.message,
                          )}
                          helperText={errors?.fields?.[index]?.name?.message}
                          required
                          fullWidth
                          size="small"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                          control={control}
                          name={`fields.${index}.type` as const}
                          render={({ field }) => (
                            <Select {...field} size="small" fullWidth>
                              <MenuItem value="string">Строка</MenuItem>
                              <MenuItem value="number">Число</MenuItem>
                              <MenuItem value="options">Список</MenuItem>
                            </Select>
                          )}
                        />
                      </Grid>
                      {fieldValues[index]?.type === "options" && (
                        <Grid size={{ xs: 12 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Варианты выбора
                          </Typography>
                          <OptionsEditor fieldIndex={index} />
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Fade>
            ))}

            <Stack spacing={2} direction={"row"}>
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
