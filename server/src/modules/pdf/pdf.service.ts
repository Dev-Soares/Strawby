import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { buildPlanHtml, type PlanPdfData } from './templates/plan.template';

@Injectable()
export class PdfService implements OnModuleInit {
  private chromiumExecutablePath: string;

  async onModuleInit() {
    this.chromiumExecutablePath = await chromium.executablePath();
    console.log('[PdfService] Chromium executable:', this.chromiumExecutablePath);
  }

  private getLogoBase64(): string | undefined {
    try {
      const logoPath = path.join(process.cwd(), '..', 'client', 'public', 'logo.png');
      return fs.readFileSync(logoPath).toString('base64');
    } catch {
      return undefined;
    }
  }

  async generatePlanPdf(data: PlanPdfData): Promise<Buffer> {
    const html = buildPlanHtml({ ...data, logoBase64: this.getLogoBase64() });

    console.log('[PdfService] Launching browser...');
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: this.chromiumExecutablePath,
      headless: true,
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle2' as any });
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      });
      console.log('[PdfService] PDF generated successfully');
      return Buffer.from(pdf);
    } catch (error) {
      console.error('[PdfService] PDF generation failed:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }
}
