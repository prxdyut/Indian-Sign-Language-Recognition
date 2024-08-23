import puppeteer, { Browser, BrowserContext, Page } from "puppeteer";

let context: { browser?: Browser; page?: Page } = {};
let temporaryContext: Page | undefined = undefined;
let currentAction: string = "";

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function initializeBrowser(): Promise<void> {
  try {
    context.browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
      userDataDir: "../data/browser",
    });

    context.page = await context.browser?.newPage();
    await context.page?.setViewport({ width: 1366, height: 768 });
    await context.page?.goto("https://web.whatsapp.com", { timeout: 60000 });
    console.log("Browser initialized and WhatsApp Web loaded");
  } catch (error) {
    console.error("Error initializing browser:", error);
    throw error;
  }
}

export async function isLoggedIn(): Promise<boolean> {
  if (!context.page) return false;
  try {
    await context.page?.waitForSelector('[aria-label="Chats"]', {
      timeout: 5000,
    });
    return true;
  } catch {
    return false;
  }
}

export async function getScreenshot(): Promise<string> {
  if (!context.page) return "";
  try {
    return (await context.page?.screenshot({
      type: "png",
      encoding: "base64",
    })) as string;
  } catch {
    console.log("Couldn't take screenshot");
    return "";
  }
}

export async function sendWhatsappMessage(data: {
  contactName?: string;
  message: string;
  phoneNumber?: string;
}): Promise<void> {
  const { contactName, message, phoneNumber } = data;

  if (!contactName && !phoneNumber) {
    throw new Error("Either contactName or phoneNumber is required");
  }

  if (!(await isLoggedIn())) {
    throw new Error("WhatsApp not logged in");
  }

  try {
    if (contactName) {
      await openContact(contactName);
    } else if (phoneNumber) {
      await openPhone(phoneNumber);
    }
    await sendMessage(message);
    console.log("Message sent successfully!");
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

export async function openContact(contactName: string): Promise<void> {
  if (!context.page) return;
  try {
    await context.page?.waitForSelector(
      '#side div[contenteditable="true"][data-tab="3"]',
      { timeout: 5000 }
    );
    await context.page?.type(
      '#side div[contenteditable="true"][data-tab="3"]',
      contactName
    );
    await context.page?.click(`span[title="${contactName}"]`);
    await context.page?.waitForNetworkIdle({ timeout: 10000 });
  } catch (error) {
    console.log("Open contact error:", error);
    throw new Error("Cannot open contact.");
  }
}

export async function openPhone(phoneNumber: string): Promise<void> {
  try {
    if (!context.page) throw new Error("Page not initialized");
    const url = `https://web.whatsapp.com/send?phone=${phoneNumber}`;
    await context.page?.goto(url, { waitUntil: "networkidle0" });
  } catch (error) {
    console.log(error);
    throw new Error("Cannot open Phone Number.");
  }
}

export async function sendMessage(message: string): Promise<void> {
  try {
    if (!context.page) throw new Error("Page not initialized");
    await context.page?.waitForSelector('[aria-placeholder="Type a message"]');
    await context.page?.type('[aria-placeholder="Type a message"]', message, {
      delay: 5,
    });
    await context.page?.keyboard.press("Enter");
    await context.page?.waitForNetworkIdle({ timeout: 10000 });
  } catch (error) {
    console.log(error);
    throw new Error("Message was not sent.");
  }
}

export const meetingLink = "https://meet.jit.si/RelievedPublicsExplainVery";

let whatsappInitialized = false;

async function controlNetworkConditions(offline: boolean) {
  if (!context.page) return;
  const client = await context.page?.target().createCDPSession();
  await client.send("Network.enable");
  await client.send("Network.emulateNetworkConditions", {
    offline,
    downloadThroughput: offline ? 0 : -1,
    uploadThroughput: offline ? 0 : -1,
    latency: 0,
  });
}
async function joinMeet() {
  try {
    if (!context.page) throw new Error("Page not initialized");

    temporaryContext = await context.browser?.newPage();
    await temporaryContext?.setViewport({ width: 1366, height: 768 });

    const browserContext = context.browser?.defaultBrowserContext();
    await browserContext?.overridePermissions(meetingLink, [
      "microphone",
      "camera",
    ]);

    await temporaryContext?.goto(meetingLink, {
      timeout: 60000,
      waitUntil: "networkidle0",
    });

    await delay(1000);
    await temporaryContext?.click('[aria-label="Stop camera"]');
    await delay(1000);
    await temporaryContext?.click('[aria-label="Join meeting"]');
    await delay(1000);
  } catch (error) {
    console.log(error);
    throw new Error("Error getting meet link.");
  }
}

async function leaveMeet() {
  try {
    if (!context.page) throw new Error("Page not initialized");

    await temporaryContext?.close();
    temporaryContext = undefined;
    await context.page.bringToFront();
  } catch (error) {
    console.log(error);
    throw new Error("Error getting meet link.");
  }
}

async function closeChat() {
  if (!context.page) return;

  try {
    await context.page?.waitForSelector('#main [aria-label="Menu"]', {
      timeout: 500,
    });
    await context.page?.click('#main [aria-label="Menu"]');
    await context.page?.waitForSelector('[role="application"]', {
      timeout: 1000,
    });
    await context.page?.waitForSelector(
      '[role="application"] [aria-label="Close chat"]',
      {
        timeout: 1000,
      }
    );
    await context.page?.click('[role="application"] [aria-label="Close chat"]');
  } catch (error) {}
}

type Message = { text: string; time: string };
type Store = { [key: string]: Message };
let store: Store = {};

function updateStore(contact: string, message: Message) {
  store[contact] = message;
}

function getMessagesAfterAMessage(
  message: Message,
  messages: Message[] | undefined
): Message[] {
  if (!messages) {
    return [];
  }
  const index = messages.findIndex(
    (item) =>
      item?.text === (message?.text || " ") &&
      item?.time === (message?.time || " ")
  );
  if (index === -1) {
    return messages;
  }
  return messages.slice(index + 1);
}
export async function toggleMeet() {
  if (currentAction == "join-meet") {
    await leaveMeet();
    const message = `Hey! I Ended the call.`;
    await sendWhatsappMessage({
      message,
      contactName: "Pradyut Das 444",
    });
    currentAction = "";
  } else {
    const message = `Hey! I Invite you to my call.\n${meetingLink}\nclick on the link to join the call.`;
    await sendWhatsappMessage({
      message,
      contactName: "Pradyut Das 444",
    });
    await joinMeet();
    currentAction = "join-meet";
  }
}
async function resetSearch(): Promise<void> {
  if (!context.page) return;
  await context.page?.waitForNetworkIdle({ timeout: 10000 });
  try {
    await context.page?.waitForSelector('[aria-label="Cancel search"]', {
      timeout: 500,
    });
    await context.page?.click('[aria-label="Cancel search"]');
  } catch (error) {}
}
async function fetchUnreadMessages() {
  if (!context.page) return [];
  if (!(await isLoggedIn())) return;

  await context.page?.waitForSelector("[aria-label='Chat list']", {
    timeout: 60000,
  });

  await resetSearch();

  let unreads = await context.page?.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        "[aria-label='Chat list'] [role='listitem']:has([aria-label*='unread message']) [role='gridcell'] span[title]"
      )
    ).map((_) => _.textContent);
  });

  if (unreads.length === 0) return [];

  await closeChat();
  for (const contact of unreads) {
    await controlNetworkConditions(false);
    await context.page?.click(`span[title="${contact}"]`);
    await context.page?.waitForNetworkIdle({ timeout: 10000 });
    await controlNetworkConditions(true);
    await context.page?.waitForSelector(".message-in, .message-out", {
      timeout: 10000,
    });
    const messages = await context.page?.evaluate(() => {
      let messages: any[] = [];
      document
        .querySelectorAll('.message-in, .message-out')
        .forEach((elem) => {
          let text = "";
          const isReceived = elem.classList.contains('message-in');
          
          const textElement = elem.querySelector("[class*='copyable-text'] > div");
          if (textElement) {
            const spanElement = textElement.querySelector("span[aria-label] span") || textElement.querySelector("span[class]");
            if (spanElement) {
              spanElement.childNodes.forEach((_: ChildNode) => {
                const n = _.nodeName;
                if (n === "#text") {
                  text += (_.textContent || "").trim();
                }
                if (n === "IMG") {
                  const imgElement = _ as HTMLElement;
                  text += imgElement.getAttribute("alt") || "";
                }
              });
            }
          }

          const timeElement = elem.querySelector("[class*='copyable-text']")
            ?.parentElement?.querySelector("div:nth-of-type(2) > div > span");
          const time = timeElement ? (timeElement as HTMLElement).innerText : "-";

          messages.push({ text, time, isReceived });
        });
      return messages;
    });
    try {
      const newMessages = getMessagesAfterAMessage(
        store[contact as string],
        messages
      );
      console.log(newMessages);

      updateStore(
        contact as string,
        messages?.[messages?.length - 1] ?? messages?.[0]
      );
    } catch (error) {}
  }
  controlNetworkConditions(false);
  await closeChat();
}
let isFetchingUnreadMessages = false;
setInterval(async () => {
  if (!isFetchingUnreadMessages) {
    isFetchingUnreadMessages = true;
    await fetchUnreadMessages();
    isFetchingUnreadMessages = false;
  }
}, 1000);
