// controllers/searchController.js
//
// Handles search across restaurants AND products
// Returns combined results in one response
//====================================================================================================
// Imports
//====================================================================================================
import * as restaurantModel from '../models/restaurantModel.js';
import * as productModel from '../models/productModel.js';

//====================================================================================================
//Search
//====================================================================================================
/**
 * Searches restaurants and products where name OR description
 * contains the query string
 *
 * Returns: 200 OK + { restaurants: [...], products: [...] }
 *          200 OK + { restaurants: [], products: [] } if no matches
 *
 * Does not require authentication — anyone can search
 */
export const search = (req, res) => {
    const { query } = req.params;

    // Empty query — return everything or empty
    if (!query?.trim()) {
        return res.status(400).json({
            error: 'Search query is required'
        });
    }

    // Convert both query and field to lowercase before comparing
    const queryLower = query.toLowerCase();

    // Search restaurants
    // Match if name OR description contains the query
    const matchingRestaurants = restaurantModel
        .getAllRestaurants()
        .filter(restaurant => {
            const nameMatch = restaurant.name
                ?.toLowerCase()
                .includes(queryLower);

            const descriptionMatch = restaurant.description
                ?.toLowerCase()
                .includes(queryLower);

            return nameMatch || descriptionMatch;
        });

    // Search products
    // Match if name OR description contains the query
    const matchingProducts = productModel
        .getAllProducts()
        .filter(product => {
            const nameMatch = product.name
                ?.toLowerCase()
                .includes(queryLower);

            const descriptionMatch = product.description
                ?.toLowerCase()
                .includes(queryLower);

            return nameMatch || descriptionMatch;
        });

    // 200 even if no matches — empty arrays signal no results
    return res.status(200).json({
        restaurants: matchingRestaurants,
        products:    matchingProducts
    });
};