import type { Role } from "./AlgoYolApp";

export type Permission=
 "problem.create"|"problem.update"|"problem.publish"|"problem.manage_topics"|"problem.manage_testcases"|"problem.delete"|
 "submission.view_all"|"submission.view_source"|"user.view"|"user.suspend"|"user.manage_roles"|
 "moderation.basic"|"content.view_management"|"roadmap.manage"|"lesson.manage"|"quiz.manage"|
 "duel.review"|"mastery.configure"|"settings.manage"|"audit.view";

const ADMIN_DEFAULTS:Permission[]=["problem.create","problem.update","problem.publish","problem.manage_topics","problem.manage_testcases","submission.view_all","submission.view_source","user.view","moderation.basic","content.view_management"];

export function permissionsFor(role:Role,granted:Permission[]=[]){
 if(role==="owner")return new Set<Permission>([...ADMIN_DEFAULTS,"problem.delete","user.suspend","user.manage_roles","roadmap.manage","lesson.manage","quiz.manage","duel.review","mastery.configure","settings.manage","audit.view"]);
 if(role==="admin")return new Set<Permission>([...ADMIN_DEFAULTS,...granted]);
 return new Set<Permission>([]);
}
export const can=(role:Role,permission:Permission,granted:Permission[]=[])=>permissionsFor(role,granted).has(permission);
