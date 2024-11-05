// pages/api/saveData.js
import client from '../../lib/edgedb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { deliveries, foods, votes } = req.body;

    try {
      await client.query(`
        INSERT Delivery {
          name := <str>$name
        }
      `, { deliveries });

      await client.query(`
        INSERT Food {
          name := <str>$name,
          deliveryId := <uuid>$deliveryId,
          isAvailableToday := <bool>$isAvailableToday
        }
      `, { foods });

      await client.query(`
        INSERT Vote {
          foodId := <uuid>$foodId,
          userId := <str>$userId,
          additionalRequests := <str>$additionalRequests,
          date := <datetime>$date
        }
      `, { votes });

      res.status(200).json({ message: 'Data saved successfully!' });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ error: 'Error saving data' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
