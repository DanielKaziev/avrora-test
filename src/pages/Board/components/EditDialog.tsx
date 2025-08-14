import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import type { ICard } from "../../../types/board";

interface Props {
  editCard: ICard | null;
  onClose: () => void;
  onChange: (field: keyof ICard, value: string) => void;
  onSave: () => void;
}

const EditDialog: React.FC<Props> = ({
  editCard,
  onClose,
  onChange,
  onSave,
}) => {
  return (
    <Dialog open={!!editCard} onClose={onClose} disableEnforceFocus>
      <DialogTitle>Редактировать карточку</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Название"
            value={editCard?.title || ""}
            onChange={(e) => onChange("title", e.target.value)}
            fullWidth
          />
          <TextField
            label="Описание"
            value={editCard?.description || ""}
            onChange={(e) => onChange("description", e.target.value)}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            select
            label="Тип"
            value={editCard?.icon || "created"}
            onChange={(e) => onChange("icon", e.target.value)}
            fullWidth
          >
            <MenuItem value="created">Создано</MenuItem>
            <MenuItem value="inProgress">В работе</MenuItem>
            <MenuItem value="done">Готово</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={onSave}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(EditDialog);
