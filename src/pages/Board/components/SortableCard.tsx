import React, { type JSX } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  CardActions,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import CreateIcon from "@mui/icons-material/Create";
import DonutSmallIcon from "@mui/icons-material/DonutSmall";
import type { ICard } from "../../../types/board";

const typeToIcon: Record<ICard["icon"], JSX.Element> = {
  created: <CreateIcon fontSize="medium" color="primary" />,
  inProgress: <DonutSmallIcon fontSize="medium" color="secondary" />,
  done: <BeenhereIcon fontSize="medium" color="success" />,
};

interface Props extends ICard {
  onEdit: (card: ICard) => void;
  onDelete: (id: string) => void;
}

const SortableCard: React.FC<Props> = React.memo(
  ({ id, title, description, icon, onEdit, onDelete }) => {
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
        sx={{ borderRadius: 2, mb: 2, "&:hover": { boxShadow: 6 } }}
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
              onClick={(e) => {
                e.stopPropagation();
                onEdit({ id, title, description, icon });
              }}
            >
              Редактировать
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              fullWidth
              startIcon={<DeleteIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
            >
              Удалить
            </Button>
          </Stack>
        </CardActions>
      </Card>
    );
  },
);

export default SortableCard;
