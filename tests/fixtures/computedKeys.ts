const copyOf = "duplicate";
const connectedTo = "linked";

export const actions = {
  [copyOf]: (project: string): string => project,
};

export class Actions {
  public [connectedTo] = (project: string): string => project;

  public [copyOf](project: string): string {
    return project;
  }
}
