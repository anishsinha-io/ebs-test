import { RequestHandler } from "express";
import usersService from "../services/users-service";

const create: RequestHandler = async (req, res, next) => {
  try {
    console.log(req.body);
    const { firstName, lastName, email, username, password } = req.body;
    const newUser = await usersService.create({
      firstName,
      lastName,
      username,
      email,
      password,
    });
    return res.status(201).json(newUser);
  } catch (e) {
    return res.status(500).json(e);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await usersService.read(id);
    if (!user) return res.status(404).json({ msg: "no user found!" });
    return res.status(200).json(user);
  } catch (e) {
    return res.status(500).json(e);
  }
};

const readAll: RequestHandler = async (req, res, next) => {
  try {
    const users = await usersService.readAll();
    if (!users) return res.status(404).json({ msg: "no users found!" });
    return res.status(200).json(users);
  } catch (e) {
    return res.status(500).json(e);
  }
};

const update: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, username, email } = req.body;
    const user = await usersService.read(id);
    if (!user) return res.status(404).json("user not found!");
    const updatedUser = await usersService.update(
      id,
      firstName || user.first_name,
      lastName || user.last_name,
      email || user.email,
      username || user.username
    );
    return res.status(200).json(updatedUser);
  } catch (e) {
    return res.status(500).json(e);
  }
};

const del: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUser = await usersService.delete(id);
    return res.status(204).json(deletedUser);
  } catch (e) {
    return res.status(500).json(e);
  }
};

export default {
  create,
  read,
  readAll,
  update,
  del,
};
