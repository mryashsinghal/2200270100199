import Url from '../models/Url.js';
import { nanoid } from 'nanoid';
import { getGeoLocation } from '../utils/geo.js';
import {Log} from '../../Logging/index.js';


function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

import { Log } from '../logger/index.js'; // assuming you've added your logging package

// Utility to validate URL
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customCode, expiresAt } = req.body;

    if (!isValidUrl(originalUrl)) {
      await Log("backend", "error", "controller", "Invalid long URL provided");
      return res.status(400).json({ message: 'Invalid URL format' });
    }

    const shortCode = customCode || nanoid(6);

    const existing = await Url.findOne({ shortCode });
    if (existing) {
      await Log("backend", "error", "controller", "Custom code already in use");
      return res.status(409).json({ message: 'Custom code already exists' });
    }

    const finalExpiry = expiresAt ? new Date(expiresAt) : new Date(Date.now() + 30 * 60 * 1000);

    const newUrl = new Url({
      originalUrl,
      shortCode,
      expiresAt: finalExpiry,
    });

    await newUrl.save();
    await Log("backend", "info", "controller", `Short URL created for ${originalUrl}`);

    res.json({ shortUrl: `${process.env.BASE_URL}/${shortCode}` });
  } catch (error) {
    await Log("backend", "error", "controller", `Server error while creating short URL: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};


export const redirectToOriginalUrl = async (req, res) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ shortCode: code });

    if (!url) {
      await Log("backend", "error", "redirect", `Short code ${code} not found`);
      return res.status(404).send('URL not found');
    }

    if (url.expiresAt && new Date() > url.expiresAt) {
      await Log("backend", "warn", "redirect", `Short code ${code} expired`);
      return res.status(410).send('URL expired');
    }

    const referrer = req.get('Referer') || 'Direct';
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const location = getGeoLocation(ip);

    url.clicks.push({ referrer, location });
    await url.save();

    await Log("backend", "info", "redirect", `Redirecting to original URL for short code ${code}`);
    return res.redirect(url.originalUrl); // Only redirect, do not send JSON
  } catch (error) {
    await Log("backend", "error", "redirect", `Redirection error: ${error.message}`);
    res.status(500).send('Error redirecting');
  }
};


export const getAllStats = async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};
