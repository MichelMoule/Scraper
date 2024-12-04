import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio'; // Assurez-vous d'avoir cette ligne pour importer cheerio correctement

class CalendarScraperTool {
    constructor() {
        this.name = "CalendarScraperTool";
        this.description = "Scrape les informations des matchs pour Lyon La Duchère.";
    }

    // Méthode pour scraper le calendrier National 3
    async scrapeNational3Calendar() {
        const url = "https://www.lyonladuchere.fr/calendrier-national-3/";

        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.goto(url, {
                waitUntil: 'networkidle2', // Attends que toutes les requêtes réseau soient terminées
            });

            // Récupère le contenu HTML rendu par la page
            const html = await page.content();

            // Charge le HTML avec Cheerio
            const $ = cheerio.load(html);

            const data = [];

            // Remplace les sélecteurs CSS par ceux correspondant à la structure de la page
            $('.match-row').each((index, element) => {
                const date = $(element).find('.match-date').text().trim();
                const opponent = $(element).find('.match-opponent').text().trim();
                const location = $(element).find('.match-location').text().trim();

                data.push({ date, opponent, location });
            });

            await browser.close();

            return data.length > 0 ? data : { message: "Aucun match trouvé pour le National 3." };
        } catch (error) {
            console.error("Erreur lors du scraping National 3 :", error);
            return { error: "Impossible de récupérer les données pour le National 3." };
        }
    }

    // Méthode pour scraper le calendrier général
    async scrapeCalendars() {
        const url = "https://www.lyonladuchere.fr/equipes/";
        try {
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);

            const matches = [];

            // Parcourir chaque bloc de match
            $('.bloc-match').each((index, element) => {
                const heure = $(element).find('.heure').text().trim();
                const date = $(element).find('.date').text().trim();
                const stade = $(element).find('.stade').text().trim();
                const ville = $(element).find('.ville').text().trim();

                matches.push({
                    heure,
                    date,
                    stade,
                    ville
                });
            });

            return matches.length > 0 ? matches : { message: "Aucun match trouvé." };
        } catch (error) {
            console.error("Erreur lors du scraping général :", error);
            return { error: "Impossible de récupérer les informations des matchs." };
        }
    }

    // Méthode exécutée pour Flowise
    async execute(input) {
        if (input && input.type === "national3") {
            return await this.scrapeNational3Calendar();
        } else {
            return await this.scrapeCalendars();
        }
    }
}

export { CalendarScraperTool };
