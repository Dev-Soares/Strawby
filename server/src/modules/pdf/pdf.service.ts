import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { buildPlanHtml, type PlanPdfData } from './templates/plan.template';

const WINDOWS_BRAVE_PATH =
  'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';

@Injectable()
export class PdfService implements OnModuleInit {
  private chromiumExecutablePath: string;

  async onModuleInit() {
    if (os.platform() === 'win32') {
      this.chromiumExecutablePath = WINDOWS_BRAVE_PATH;
    } else {
      this.chromiumExecutablePath = await chromium.executablePath();
    }
  }

  private getLogoBase64(): string | undefined {
    try {
      const logoPath = path.join(
        process.cwd(),
        '..',
        'client',
        'public',
        'logo.png',
      );
      return fs.readFileSync(logoPath).toString('base64');
    } catch {
      return undefined;
    }
  }

  async generatePlanPdf(data: PlanPdfData): Promise<Buffer> {
    const html = buildPlanHtml({ ...data, logoBase64: this.getLogoBase64() });

    const isWindows = os.platform() === 'win32';
    const browser = await puppeteer.launch({
      args: isWindows
        ? ['--no-sandbox', '--disable-setuid-sandbox']
        : chromium.args,
      executablePath: this.chromiumExecutablePath,
      headless: true,
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      });
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }
}
