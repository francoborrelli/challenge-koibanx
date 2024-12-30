export enum Permissions {
  'getTask' = 'getTask',
  'uploadTask' = 'uploadTask',
  'getTasksData' = 'getTasksData',
  'getTaskErrors' = 'getTaskErrors',

  // User related
  'getUsers' = 'getUsers',
  'manageUsers' = 'manageUsers',
}

const allRoles: Record<string, Permissions[]> = {
  user: [Permissions.uploadTask, Permissions.getTask, Permissions.getTasksData, Permissions.getTaskErrors],
  admin: [
    Permissions.getUsers,
    Permissions.manageUsers,
    Permissions.uploadTask,
    Permissions.getTask,
    Permissions.getTasksData,
    Permissions.getTaskErrors,
  ],
};

export const roles: string[] = Object.keys(allRoles);

export type Role = keyof typeof allRoles;

export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
