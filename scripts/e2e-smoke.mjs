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

function assert(condition, message) {
  if (!condition) throw new Error(`[UI-observable] e2e assertion failed: ${message}`);
}

try {
  await waitForServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  // [UI-observable] empty initial state shows scenario selector + guidance copy
  await page.getByTestId('scenario-label').waitFor();
  await page.getByTestId('guidance-overlay').waitFor();
  const guidanceText = await page.getByTestId('guidance-overlay').textContent();
  assert(guidanceText && guidanceText.includes('选择场景'), 'guidance copy visible in empty initial state');

  const intentNode = page.getByRole('button', { name: '查看 模糊目标' });
  await intentNode.waitFor();
  const brainstormAbsent = await page.getByRole('button', { name: '查看 探索方向' }).count();
  assert(brainstormAbsent === 0, 'brainstorm node hidden before scenario selection');

  // [UI-observable] canvas fills viewport horizontally
  const canvasShell = page.locator('.canvas-shell');
  await canvasShell.waitFor();
  const shellBox = await canvasShell.boundingBox();
  const viewportSize = page.viewportSize();
  assert(shellBox, 'canvas-shell bounding box exists');
  assert(Math.abs(shellBox.width - viewportSize.width) < 4, `canvas-shell fills viewport width (got ${shellBox.width}, viewport ${viewportSize.width})`);
  assert(shellBox.height > viewportSize.height * 0.6, `canvas-shell fills most of viewport height (got ${shellBox.height}, viewport ${viewportSize.height})`);

  // [UI-observable] pan/zoom works — wheel zoom changes transform scale
  const transformGroup = page.getByTestId('canvas-transform-group');
  await transformGroup.waitFor();
  const initialScale = await transformGroup.getAttribute('data-transform-scale');
  const svg = page.locator('.canvas-shell svg');
  await svg.hover();
  await page.mouse.wheel(0, -300);
  await wait(80);
  const zoomedScale = await transformGroup.getAttribute('data-transform-scale');
  assert(Number(zoomedScale) > Number(initialScale), `wheel zoom increases scale (initial=${initialScale}, after=${zoomedScale})`);

  // pan via pointer drag
  const panInitialX = await transformGroup.getAttribute('data-transform-x');
  await page.mouse.move(400, 400);
  await page.mouse.down();
  await page.mouse.move(560, 460, { steps: 8 });
  await page.mouse.up();
  await wait(80);
  const panFinalX = await transformGroup.getAttribute('data-transform-x');
  assert(Number(panFinalX) > Number(panInitialX), `pointer drag pans transform-x (initial=${panInitialX}, after=${panFinalX})`);

  // [UI-observable] fullscreen toggle hides hero
  const heroHeading = page.getByRole('heading', { name: /把复杂工作流变成可点击/ });
  await heroHeading.waitFor();
  const heroVisibleBefore = await heroHeading.isVisible();
  assert(heroVisibleBefore, 'hero visible before fullscreen');

  await page.getByRole('button', { name: '进入全屏' }).click();
  await wait(120);
  const heroDisplay = await page.locator('.app-shell.is-fullscreen .hero').evaluate((el) => window.getComputedStyle(el).display);
  assert(heroDisplay === 'none', `hero hidden in fullscreen (display=${heroDisplay})`);

  // exit fullscreen
  await page.getByRole('button', { name: '退出全屏' }).click();
  await wait(120);
  const heroVisibleAfter = await heroHeading.isVisible();
  assert(heroVisibleAfter, 'hero visible after exiting fullscreen');

  // [UI-observable] selecting scenario hides guidance copy and reveals next node
  await page.getByRole('button', { name: '查看 模糊目标' }).click();
  await wait(120);
  const guidanceGone = await page.getByTestId('guidance-overlay').count();
  assert(guidanceGone === 0, 'guidance copy disappears after first scenario selection');
  await page.getByRole('button', { name: '查看 探索方向' }).waitFor();

  // [UI-observable] on-canvas choice button advances active step
  await page.getByRole('button', { name: '查看 探索方向' }).click();
  await wait(80);
  await page.getByRole('button', { name: '方向已稳定，生成规格' }).click();
  await wait(80);
  await page.getByRole('button', { name: '查看 规格成型' }).waitFor();

  // [UI-observable] right-click on node opens popover with evidence cluster
  const blueprintNode = page.getByRole('button', { name: '查看 规格成型' });
  await blueprintNode.waitFor();
  await blueprintNode.click({ button: 'right' });
  await wait(120);
  const popover = page.getByTestId('node-popover');
  await popover.waitFor();
  const popoverText = await popover.textContent();
  assert(popoverText && popoverText.includes('maestro-blueprint'), 'popover shows recommended command');
  assert(popoverText && popoverText.includes('Purpose'), 'popover shows Purpose evidence');
  assert(popoverText && popoverText.includes('Source Status'), 'popover shows source status section');
  assert(popoverText && popoverText.includes('Validation Checklist'), 'popover shows validation checklist');
  assert(popoverText && popoverText.includes('maestro-flow/'), 'popover cites maestro-flow/ source paths');

  // [UI-observable] validation checklist checkbox toggles and persists per step
  const checklistCheckbox = page.getByTestId('checklist-check-command');
  await checklistCheckbox.check();
  await wait(60);
  const isChecked = await checklistCheckbox.isChecked();
  assert(isChecked, 'checklist checkbox checked after click');

  // close popover
  await page.getByRole('button', { name: '关闭证据弹窗' }).click();
  await wait(80);
  const popoverGone = await page.getByTestId('node-popover').count();
  assert(popoverGone === 0, 'popover closes via close button');

  // reopen popover — checkbox should remain checked (per-step persistence)
  await blueprintNode.click({ button: 'right' });
  await wait(120);
  await page.getByTestId('node-popover').waitFor();
  const checkboxReopened = page.getByTestId('checklist-check-command');
  const stillChecked = await checkboxReopened.isChecked();
  assert(stillChecked, 'checkedItems persists per step after popover reopen');

  // close popover before navigating
  await page.getByRole('button', { name: '关闭证据弹窗' }).click();
  await wait(80);

  // [UI-observable] alternatives render as secondary canvas branches
  const altBranchCount = await page.getByRole('button', { name: '先 roadmap' }).count();
  assert(altBranchCount > 0, 'alternatives render as canvas branches from active node');

  // [UI-observable] navigate to terminal node — terminal routes render as branches
  await page.getByRole('button', { name: '规格可执行，分析 Phase 1' }).click();
  await wait(80);
  await page.getByRole('button', { name: '分析结论为 GO，进入计划' }).click();
  await wait(80);
  await page.getByRole('button', { name: '计划完成，选择后续路线' }).click();
  await wait(80);

  await page.getByRole('button', { name: 'Stop' }).waitFor();
  const stopCount = await page.getByRole('button', { name: 'Stop' }).count();
  const qualityCount = await page.getByRole('button', { name: 'Quality Pipeline' }).count();
  const knowledgeCount = await page.getByRole('button', { name: 'Knowledge Capture' }).count();
  assert(stopCount > 0, 'terminal route Stop renders as canvas branch');
  assert(qualityCount > 0, 'terminal route Quality Pipeline renders as canvas branch');
  assert(knowledgeCount > 0, 'terminal route Knowledge Capture renders as canvas branch');

  // [UI-observable] terminal route branches use terminalRoutes data (data-branch-kind=route)
  const stopBranch = page.getByRole('button', { name: 'Stop' });
  const stopKind = await stopBranch.getAttribute('data-branch-kind');
  assert(stopKind === 'route', `terminal route branch has data-branch-kind=route (got ${stopKind})`);

  await browser.close();
} finally {
  server.kill('SIGTERM');
  server.unref();
}
