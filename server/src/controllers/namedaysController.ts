import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// Cache the namedays data in memory for better performance
let namedaysCache: Record<string, any[]> | null = null;

const loadNamedays = (): Record<string, any[]> => {
  if (namedaysCache) {
    return namedaysCache;
  }

  try {
    const namedaysPath = path.join(__dirname, '../../data/namedays.json');
    const data = fs.readFileSync(namedaysPath, 'utf-8');
    namedaysCache = JSON.parse(data);
    return namedaysCache as Record<string, any[]>;
  } catch (error) {
    console.error('Error loading namedays data:', error);
    return {};
  }
};

/**
 * Get all namedays
 * Public endpoint - no authentication required
 */
export const getAllNamedays = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const namedays = loadNamedays();
    res.json(namedays);
  } catch (error) {
    console.error('Get namedays error:', error);
    res.status(500).json({ error: 'Failed to get namedays' });
  }
};

/**
 * Search namedays by name prefix
 * Query param: ?name=<prefix>
 * Public endpoint - no authentication required
 */
export const searchNamedays = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== 'string') {
      res.status(400).json({ error: 'Name query parameter is required' });
      return;
    }

    const namedays = loadNamedays();
    const searchTerm = name.toLowerCase();

    // Filter names that start with the search term
    const results: Record<string, any[]> = {};
    Object.entries(namedays).forEach(([key, value]) => {
      if (key.toLowerCase().startsWith(searchTerm)) {
        results[key] = value;
      }
    });

    res.json(results);
  } catch (error) {
    console.error('Search namedays error:', error);
    res.status(500).json({ error: 'Failed to search namedays' });
  }
};
