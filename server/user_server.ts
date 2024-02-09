import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;

type User = { id: string; name: string };
// userList: () => User[];
// userById: (id: string) => User;

const userList: User[] = [
  { id: "1", name: "First todo" },
  { id: "2", name: "Second todo" },
];
// userCreate: (data: { name: string }) => User;

const appRouter = router({
  userList: publicProcedure.query(async () => {
    // Retrieve users from a datasource, this is an imaginary database
    // const users = await db.user.findMany();
    //    ^?
    return userList;
  }),
  userById: publicProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts;
    //      ^?
    // Retrieve the user with the given ID
    // const user = await db.user.findById(input);
    // return user;
    return userList[0];
  }),
  // userCreate: publicProcedure
  //   .input(z.object({ name: z.string() }))
  //   .mutation(async (opts) => {
  //     const { input } = opts;
  //     //      ^?
  //     // Create a new user in the database
  //     const user = await db.user.create(input);
  //     //    ^?
  //     return user;
  //   }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
});

server.listen(4000);
