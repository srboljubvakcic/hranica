// pages/api/fetchData.js
import client from '../../lib/edgedb';

export default async function handler(req, res) {
  try {
    const deliveries = await client.query(`
      SELECT Delivery {
        id,
        name
      }
    `);

    const foods = await client.query(`
      SELECT Food {
        id,
        name,
        deliveryId,
        isAvailableToday
      }
    `);

    const votes = await client.query(`
      SELECT Vote {
        id,
        foodId,
        userId,
        additionalRequests,
        date
      }
    `);

    res.status(200).json({ deliveries, foods, votes });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
}
