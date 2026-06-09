import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';
import { buildPlanHtml, type PlanPdfData } from './templates/plan.template';

@Injectable()
export class PdfService {
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

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {

      const page = await browser.newPage();

      await page.setContent(html, { waitUntil: 'networkidle2' as any });

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
