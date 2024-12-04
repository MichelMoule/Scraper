import { CalendarScraperTool } from './CalendarScraperTool.mjs';

(async () => {
    const scraper = new CalendarScraperTool();
    const results = await scraper.execute();

    console.log("Résultats du scraping :");
    console.log(results);
})();
