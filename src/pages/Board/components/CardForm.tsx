import React from "react";
import {
  Stack,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import type { ICard } from "../../../types/board";

interface Props {
  newCard: Omit<ICard, "id">;
  onChange: (field: keyof Omit<ICard, "id">, value: string) => void;
  onAdd: () => void;
}

const CardForm: React.FC<Props> = ({ newCard, onChange, onAdd }) => {
  return (
    <Paper sx={{ p: 2 }} elevation={2}>
      <Stack spacing={2}>
        <Typography variant="h6">Создать карточку</Typography>
        <TextField
          label="Название"
          value={newCard.title}
          onChange={(e) => onChange("title", e.target.value)}
          fullWidth
        />
        <TextField
          label="Описание"
          value={newCard.description}
          onChange={(e) => onChange("description", e.target.value)}
          fullWidth
          multiline
          rows={2}
        />
        <TextField
          select
          label="Тип"
          value={newCard.icon}
          onChange={(e) => onChange("icon", e.target.value)}
          fullWidth
        >
          <MenuItem value="created">Создано</MenuItem>
          <MenuItem value="inProgress">В работе</MenuItem>
          <MenuItem value="done">Готово</MenuItem>
        </TextField>
        <Button variant="contained" color="primary" onClick={onAdd}>
          Добавить
        </Button>
      </Stack>
    </Paper>
  );
};

export default React.memo(CardForm);
