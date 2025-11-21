import express, {Request,Response} from "express";
import "dotenv/config";
import errorHandler from "./middlewares/errorHandler";
import notesRoutes from "./routes/notesRoutes"
import userRoutes from "./routes/userRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/notes",notesRoutes)
app.use("/api/user",userRoutes)

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});