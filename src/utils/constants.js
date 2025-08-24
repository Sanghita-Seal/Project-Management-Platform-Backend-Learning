export const UserRolesEnum = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project_admin",
  MEMBER: "member"
};

export const AvailableUserRole = Object.values(UserRolesEnum);//now it can be used as an array
//od only the values of the above object 
//[admin, project_admin, member] 

export const TaskStatusEnum = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done"
};
export const AvailableTaskStatues = Object.values(TaskStatusEnum);