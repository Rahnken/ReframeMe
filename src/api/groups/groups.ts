import { z } from "zod";

const BASE_URL = import.meta.env.VITE_API_BASE_URL! + "/groups";


const groupCreateRequestSchema = z.object({
    name:z.string(),
    description:z.string()
})
const groupMemberAddRequestSchema = z.object({
    user_email:z.string().email(),
    role:z.string()
})


type GroupCreateBody = z.infer<typeof groupCreateRequestSchema>
type GroupMemberAddBody = z.infer<typeof groupMemberAddRequestSchema>

export type{GroupCreateBody,GroupMemberAddBody}

export const getAllGroupsQuery = async (token:string) => {
    return await fetch(BASE_URL,{
      headers: { Authorization: `Bearer ${token}` },
  }).then((response) => response.json());
};
export const getGroupById = async (token: string, groupId: string) => {
  return await fetch(`${BASE_URL}/${groupId}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((response) => response.json());
};
export const createGroup = async (
    token:string,
    requestBody:GroupCreateBody
) => {
    return await fetch(`${BASE_URL}/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  }).then((response) => response.json());
}

export const addMembersToGroup = async (
  token: string,
  groupId: string,
  users: Array<GroupMemberAddBody>
) => {
  return await fetch(`${BASE_URL}/${groupId}/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ users }),
  }).then((response) => response.json());
};
export const updateUserRoleInGroup = async (
  token: string,
  groupId: string,
  userId: string,
  role: string
) => {
  return await fetch(`${BASE_URL}/${groupId}/users/${userId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  }).then((response) => response.json());
};
export const deleteUserFromGroup = async (
  token: string,
  groupId: string,
  userId: string,
) => {
  return await fetch(`${BASE_URL}/${groupId}/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

export const removeUserFromGroup = async (
  token: string,
  groupId: string,
  userId: string
) => {
  return await fetch(`${BASE_URL}/${groupId}/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => response.json());
};
export const deleteGroup = async (token: string, groupId: string) => {
  return await fetch(`${BASE_URL}/${groupId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => response.json());
}