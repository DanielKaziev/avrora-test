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
  Box,
  Button,
  MenuItem,
  TextField,
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

export const SortableCard: React.FC<ICard> = ({
  id,
  title,
  description,
  icon,
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
      {...attributes}
      {...listeners}
      elevation={3}
      sx={{
        borderRadius: 2,
        mb: 2,
        "&:hover": { boxShadow: 6 },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* Верхняя строка: Название + Иконка */}
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

        {/* Описание */}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {description}
        </Typography>

        {/* Кнопки */}
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => console.log("Редактировать", id)}
          >
            Редактировать
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => console.log("Удалить", id)}
          >
            Удалить
          </Button>
        </Box>
      </CardContent>
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
          {/* Карточки */}
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
                      id={card.id}
                      title={card.title}
                      description={card.description}
                      icon={card.icon}
                    />
                  ))}
                </Stack>
              </SortableContext>
            </DndContext>
          </Stack>

          {/* Форма создания карточки */}
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
    </Container>
  );
}
