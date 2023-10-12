import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const port = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Yeah Up And Running"));

app.get("/pdf", async (req, res) => {
  const html = req.body?.html || "<h1>Hello world</h1>";

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--single-process",
        "--disable-dev-shm-usage",
        "--no-zygote",
      ],
      executablePath: puppeteer.executablePath(),
      // process.env.NODE_ENV === "production"
      //   ? process.env.PUPPETEER_EXECUTABLE_PATH
    });
    const page = await browser.newPage();
    await page.goto("https://www.google.com");
    const img = await page.screenshot({ encoding: "base64", type: "jpeg" });
    // await page.setContent(html, { waitUntil: "networkidle2" });
    // const pdfBuffer = await page.pdf({ landscape: true, width: "198mm" });
    await browser.close();

    res.setHeader("Content-Type", "image/jpeg");

    return res.status(200).send(img);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
