import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { buildPlanHtml, type PlanPdfData } from './templates/plan.template';
import { buildWeeklyReportHtml, type WeeklyReportPdfData } from './templates/weekly-report.template';

@Injectable()
export class PdfService {
  async generatePlanPdf(data: PlanPdfData): Promise<Buffer> {
    const html = buildPlanHtml(data);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {

      const page = await browser.newPage();

      await page.setContent(html, { waitUntil: 'load' });

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

  async generateWeekScorePdf(scoreData: WeeklyReportPdfData): Promise<Buffer> {
    
    const html = buildWeeklyReportHtml(scoreData);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {

      const page = await browser.newPage();
      
      await page.setContent(html, { waitUntil: 'load' });

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
