import express, { type Request, type Response } from "express";
import { Server, Socket } from "socket.io";
import {
  initializeBrowser,
  isLoggedIn,
  sendWhatsappMessage,
  toggleAudioRecording,
  toggleMeet,
} from "./controllers/browser";
import { whatsappSocket } from "./sockets/whatsapp";

const port = 7000;
const router = express();

router.use(express.json());

router.get("/meeting", async (req: Request, res: Response) => {
  await toggleMeet();
  res.json({ success: true, message: "Meeting Link Sent!" });
});

router.get("/audio", async (req: Request, res: Response) => {
  await toggleAudioRecording();
  res.json({ success: true, message: "Meeting Link Sent!" });
});

router.get("/message", async (req: Request, res: Response) => {
  const { contactName, message } = req.query as {
    contactName: string;
    message: string;
  };
  await sendWhatsappMessage({
    contactName,
    message,
  });
  res.json({ success: true, message: "Meeting Link Sent!" });
});

router.get("/", async (req: Request, res: Response) => {
  res.json({ success: true, message: "WhatsApp Server is running" });
});

async function init() {
  console.log(`WhatsApp Server is starting`);
  try {
    await initializeBrowser();
    console.log("Browser Started");
  } catch (error) {
    console.error("Failed to start the browser:", error);
    process.exit(1);
  }
}

export function setupWebsocket(
  name: string,
  server: Server,
  socket: (socket: Socket) => void
) {
  const namespace = server.of(name);
  namespace.on("connection", socket);
  return namespace;
}

const socket = new Server(4000, {
  path: "/",
  cors: {
    origin: "*",
  },
});

export const whatsappWebsocket = setupWebsocket(
  "/whatsApp",
  socket,
  whatsappSocket
);

init();

router.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
