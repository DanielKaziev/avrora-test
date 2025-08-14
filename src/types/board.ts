export interface ICard {
  id: string;
  title: string;
  description: string;
  icon: TIconVariants;
}

type TIconVariants = "created" | "inProgress" | "done";
