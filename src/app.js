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
        "--no-zygote",
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    await page.waitForNavigation();
    const pdfBuffer = await page.pdf({ landscape: true, width: "198mm" });
    await browser.close();

    res.setHeader("Content-Type", "application/pdf");

    return res.status(200).send(new Buffer.from(pdfBuffer));
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
