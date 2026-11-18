const copyOf = "duplicate";

export const actions = {
  [copyOf]: (project: string): string => project,
};

export class Actions {
  [copyOf](project: string): string {
    return project;
  }
}
