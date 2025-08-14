import React, { useState, type JSX } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardContent,
  Typography,
  Container,
  Stack,
  Paper,
  Button,
  MenuItem,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CardActions,
} from "@mui/material";
import type { ICard } from "../../types/board";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import CreateIcon from "@mui/icons-material/Create";
import DonutSmallIcon from "@mui/icons-material/DonutSmall";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const typeToIcon: Record<ICard["icon"], JSX.Element> = {
  created: <CreateIcon fontSize="medium" color="primary" />,
  inProgress: <DonutSmallIcon fontSize="medium" color="secondary" />,
  done: <BeenhereIcon fontSize="medium" color="success" />,
};

interface SortableCardProps extends ICard {
  onEdit: (card: ICard) => void;
  onDelete: (id: string) => void;
}

export const SortableCard: React.FC<SortableCardProps> = ({
  id,
  title,
  description,
  icon,
  onEdit,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      elevation={3}
      sx={{
        borderRadius: 2,
        mb: 2,
        "&:hover": { boxShadow: 6 },
      }}
    >
      <CardContent sx={{ p: 2 }} {...attributes} {...listeners}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {typeToIcon[icon]}
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            startIcon={<EditIcon />}
            onClick={() => onEdit({ id, title, description, icon })}
          >
            Редактировать
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            fullWidth
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(id)}
          >
            Удалить
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default function Board() {
  const [cards, setCards] = useState<Array<ICard>>([
    { id: "1", title: "Card 1", description: "Description 1", icon: "created" },
    {
      id: "2",
      title: "Card 2",
      description: "Description 2",
      icon: "inProgress",
    },
    { id: "3", title: "Card 3", description: "Description 3", icon: "done" },
  ]);

  const [newCard, setNewCard] = useState<Omit<ICard, "id">>({
    title: "",
    description: "",
    icon: "created",
  });

  const [editCard, setEditCard] = useState<ICard | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddCard = () => {
    if (!newCard.title.trim()) return;
    setCards((prev) => [...prev, { id: Date.now().toString(), ...newCard }]);
    setNewCard({ title: "", description: "", icon: "created" });
  };

  const handleDeleteCard = (id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  const handleSaveEdit = () => {
    if (!editCard) return;
    setCards((prev) =>
      prev.map((card) => (card.id === editCard.id ? editCard : card)),
    );
    setEditCard(null);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(cards)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cards.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          setCards(json);
        }
      } catch (error) {
        console.log(error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Paper sx={{ p: 3 }} elevation={4}>
        <Stack
          justifyContent="space-between"
          alignItems="center"
          direction="row"
          mb={3}
        >
          <Typography variant="h5">Доска</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={handleExport}>
              Экспорт
            </Button>
            <Button variant="outlined" component="label">
              Импорт
              <input
                type="file"
                accept="application/json"
                hidden
                onChange={handleImport}
              />
            </Button>
          </Stack>
        </Stack>

        <Stack justifyContent="space-between" spacing={5} direction="row">
          <Stack flexGrow={1}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={cards.map((card) => card.id)}
                strategy={verticalListSortingStrategy}
              >
                <Stack spacing={2}>
                  {cards.map((card) => (
                    <SortableCard
                      key={card.id}
                      {...card}
                      onEdit={(card) => setEditCard(card)}
                      onDelete={handleDeleteCard}
                    />
                  ))}
                </Stack>
              </SortableContext>
            </DndContext>
          </Stack>

          <Stack flexGrow={1}>
            <Paper sx={{ p: 2 }} elevation={2}>
              <Stack spacing={2}>
                <Typography variant="h6">Создать карточку</Typography>
                <TextField
                  label="Название"
                  value={newCard.title}
                  onChange={(e) =>
                    setNewCard((prev) => ({ ...prev, title: e.target.value }))
                  }
                  fullWidth
                />
                <TextField
                  label="Описание"
                  value={newCard.description}
                  onChange={(e) =>
                    setNewCard((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  fullWidth
                  multiline
                  rows={2}
                />
                <TextField
                  select
                  label="Тип"
                  value={newCard.icon}
                  onChange={(e) =>
                    setNewCard((prev) => ({
                      ...prev,
                      icon: e.target.value as ICard["icon"],
                    }))
                  }
                  fullWidth
                >
                  <MenuItem value="created">Создано</MenuItem>
                  <MenuItem value="inProgress">В работе</MenuItem>
                  <MenuItem value="done">Готово</MenuItem>
                </TextField>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddCard}
                >
                  Добавить
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Stack>
      </Paper>

      {/* Диалог редактирования */}
      <Dialog open={!!editCard} onClose={() => setEditCard(null)}>
        <DialogTitle>Редактировать карточку</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Название"
              value={editCard?.title || ""}
              onChange={(e) =>
                setEditCard((prev) =>
                  prev ? { ...prev, title: e.target.value } : prev,
                )
              }
              fullWidth
            />
            <TextField
              label="Описание"
              value={editCard?.description || ""}
              onChange={(e) =>
                setEditCard((prev) =>
                  prev ? { ...prev, description: e.target.value } : prev,
                )
              }
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              select
              label="Тип"
              value={editCard?.icon || "created"}
              onChange={(e) =>
                setEditCard((prev) =>
                  prev
                    ? { ...prev, icon: e.target.value as ICard["icon"] }
                    : prev,
                )
              }
              fullWidth
            >
              <MenuItem value="created">Создано</MenuItem>
              <MenuItem value="inProgress">В работе</MenuItem>
              <MenuItem value="done">Готово</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditCard(null)}>Отмена</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
