const copyOf = "duplicate";
const connectedTo = "linked";

export const actions = {
  [copyOf]: (project: string): string => project,
};

export class Actions {
  [connectedTo] = (project: string): string => project;

  [copyOf](project: string): string {
    return project;
  }
}
