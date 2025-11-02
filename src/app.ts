import express from "express";
import cors from "cors";
import "dotenv/config";
import { categoriesRouter } from "./routes/CategoriesRouter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { productsRouter } from "./routes/productsRouter.js";
import { usersRouter } from "./routes/usersRouter.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

app.use("/categories", categoriesRouter);
app.use("/products", productsRouter);
app.use("/auth", usersRouter);
app.use(errorHandler);

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`App listening on http://localhost:${PORT}`);
});
