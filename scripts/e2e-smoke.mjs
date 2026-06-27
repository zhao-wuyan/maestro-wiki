import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const port = 4173;
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(port)], {
  stdio: 'ignore',
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      await wait(250);
    }
  }
  throw new Error('Vite preview did not start in time');
}

try {
  await waitForServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  await page.getByText('maestro-brainstorm').first().waitFor();
  await page.getByRole('button', { name: /方向已稳定/ }).click();
  await page.getByText('maestro-blueprint').first().waitFor();
  await page.getByRole('button', { name: /规格可执行/ }).click();
  await page.getByText('maestro-analyze 1').first().waitFor();
  await page.getByRole('button', { name: /分析结论为 GO/ }).click();
  await page.getByText('maestro-plan 1').first().waitFor();
  await page.getByRole('button', { name: /计划完成/ }).click();

  await page.getByText('Stop', { exact: true }).waitFor();
  await page.getByText('Quality Pipeline', { exact: true }).waitFor();
  await page.getByText('Knowledge Capture', { exact: true }).waitFor();
  await page.getByRole('checkbox', { name: /当前推荐 command/ }).check();
  await page.getByText('1/3').waitFor();

  await browser.close();
} finally {
  server.kill('SIGTERM');
  server.unref();
}
