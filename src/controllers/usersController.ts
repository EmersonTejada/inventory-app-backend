import { RequestHandler } from "express";
import * as usersModel from "../models/usersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import "dotenv/config";

export const createUser: RequestHandler<{}, {}, User, {}> = async (
  req,
  res
) => {
  const user = req.body;
  const newUser = await usersModel.createUser(user);
  res.json({ message: "Usuario creado exitosamente", user: newUser });
};

export const loginUser: RequestHandler<{}, {}, User, {}> = async (req, res) => {
  const loginUser = req.body;
  const user = await usersModel.loginUser(loginUser);
  const match = await bcrypt.compare(loginUser.password, user.password);
  if (!match) {
    throw new UnauthorizedError("Contraseña incorrecta");
  }
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    }
  );
  res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 1000 * 60 * 60
    })
    .json({ message: "Login exitoso" });
};

export const getUserProfile: RequestHandler = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    throw new UnauthorizedError("No autenticado");
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      username: string;
    };
    res.json({ id: user.id, username: user.username });
  } catch (err) {
    throw new UnauthorizedError("Token inválido");
  }
};

export const logoutUser: RequestHandler = (req, res) => {
  res
    .clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    })
    .json({ message: "Logout exitoso" });
}
