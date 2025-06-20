const axios = require('axios');

const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const BUNNY_LIBRARY_ID = process.env.BUNNY_LIBRARY_ID;

// List videos stored in Bunny.net library
exports.listVideos = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const itemsPerPage = req.query.itemsPerPage || 100;
    const url = `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos?page=${page}&itemsPerPage=${itemsPerPage}`;
    const response = await axios.get(url, { headers: { AccessKey: BUNNY_API_KEY } });
    // Bunny returns either {items: [...]} or [...], handle both
    const videos = response.data.items || response.data;
    res.json({ videos });
  } catch (error) {
    console.error('List videos error:', error.message);
    res.status(500).json({ message: 'Failed to fetch videos', error: error.message });
  }
};
