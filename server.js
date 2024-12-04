import express from 'express';
import bodyParser from 'body-parser';
import { CalendarScraperTool } from './CalendarScraperTool.mjs'; // Chemin vers votre outil

const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(bodyParser.json());

// Initialisation de l'outil de scraping
const scraper = new CalendarScraperTool();

// Route pour scraper les données générales
app.get('/api/calendar', async (req, res) => {
    try {
        const data = await scraper.scrapeCalendars();
        res.json(data); // Envoie les données scrappées en JSON
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors du scraping des données.' });
    }
});

// Route pour scraper le calendrier National 3
app.get('/api/national3', async (req, res) => {
    try {
        const data = await scraper.scrapeNational3Calendar();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors du scraping du National 3.' });
    }
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur API en cours d'exécution sur le port ${port}`);
});
