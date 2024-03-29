import express from "express";
// import { createRouter } from "@trpc/server";
import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { z } from "zod";

const app = express();
const PORT = 4000;
app.use(cors());

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

const t = initTRPC.create();
// const router = t.router;
// const publicProcedure = t.procedure;

interface Todo {
  id: string;
  content: string;
}

const todoList: Todo[] = [
  { id: "1", content: "First todo" },
  { id: "2", content: "Second todo" },
];

const appRouter = t.router({
  test: t.procedure.query(() => {
    return "TEST TRPC";
  }),
  getTodos: t.procedure.query(() => {
    return todoList;
  }),
  addTodo: t.procedure.input(z.string()).mutation((req) => {
    const id = Math.random().toString();
    const todo: Todo = {
      id,
      content: req.input,
    };
    todoList.push(todo);
    return todoList;
  }),

  deleteTodo: t.procedure.input(z.string()).mutation((req) => {
    const idTodoDelete = req.input;
    const indexToDelete = todoList.findIndex(
      (todo) => todo.id === idTodoDelete
    );
    todoList.splice(indexToDelete, 1);
    return todoList;
  }),
});

app.use("/trpc", trpcExpress.createExpressMiddleware({ router: appRouter }));

app.listen(PORT);

export type AppRouter = typeof appRouter;
