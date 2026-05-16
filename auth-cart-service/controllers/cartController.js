const prisma = require('../config/prisma');

// --- SIMULATION DU CATALOGUE (Mock) ---
const getFakeProduct = (id) => {
    const products = {
        "1": { name: "iPhone 15", price: 999, stock: 10 },
        "2": { name: "MacBook Air", price: 1200, stock: 5 },
        "3": { name: "AirPods Pro", price: 250, stock: 20 },
        "4": { name: "Montre Connectée", price: 199, stock: 15 },
        "5": { name: "Casque Audio", price: 149, stock: 30 }
    };
    return products[id] || { name: `Produit ${id}`, price: 100, stock: 50 };
};

// --- FONCTION INTERNE : Trouver ou Créer le Panier ---
const findCart = async (userId, sessionId) => {
    let cart = null;

    if (userId) {
        cart = await prisma.cart.findUnique({ where: { userId: userId }, include: { items: true } });
    } else if (sessionId) {
        cart = await prisma.cart.findUnique({ where: { sessionId: sessionId }, include: { items: true } });
    }

    if (!cart) {
        cart = await prisma.cart.create({
            data: { userId: userId || null, sessionId: userId ? null : sessionId },
            include: { items: true }
        });
    }
    return cart;
};

// --- 1. RÉCUPÉRER LE PANIER ---
exports.getCart = async (req, res) => {
    try {
        const userId = req.user ? req.user.userId : null;
        const sessionId = req.headers['x-session-id'];

        if (!userId && !sessionId) {
            return res.status(200).json({ items: [] });
        }

        const cart = await findCart(userId, sessionId);

        const itemsWithDetails = cart.items.map(item => {
            const productData = getFakeProduct(item.productId.toString());
            return {
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
                name: productData.name,
                unitPrice: productData.price,
                availableStock: productData.stock,
                totalPrice: productData.price * item.quantity
            };
        });

        res.status(200).json({ id: cart.id, items: itemsWithDetails });
    } catch (error) {
        console.error("🚨 ERREUR RECUPERATION PANIER :", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération du panier." });
    }
};

// --- 2. AJOUTER UN PRODUIT ---
exports.addItem = async (req, res) => {
    try {
        const userId = req.user ? req.user.userId : null;
        const sessionId = req.headers['x-session-id'];
        const { productId, quantity } = req.body;

        if (!userId && !sessionId) {
            return res.status(400).json({ message: "Non identifié. Connectez-vous ou fournissez un Session ID." });
        }

        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({ message: "Produit ou quantité invalide." });
        }

        const productData = getFakeProduct(productId.toString());
        const cart = await findCart(userId, sessionId);

        const existingItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId: parseInt(productId) }
        });

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (productData.stock < newQuantity) {
                return res.status(400).json({ message: `Stock insuffisant. Il ne reste que ${productData.stock} article(s).` });
            }
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity }
            });
        } else {
            if (productData.stock < quantity) {
                 return res.status(400).json({ message: `Stock insuffisant. Il ne reste que ${productData.stock} article(s).` });
            }
            await prisma.cartItem.create({
                data: { cartId: cart.id, productId: parseInt(productId), quantity: quantity }
            });
        }

        res.status(200).json({ message: "Produit ajouté au panier." });
    } catch (error) {
        console.error("🚨 ERREUR AJOUT ARTICLE :", error);
        res.status(500).json({ message: "Erreur serveur lors de l'ajout au panier." });
    }
};

// --- 3. MODIFIER LA QUANTITÉ ---
exports.updateQuantity = async (req, res) => {
    try {
        const userId = req.user ? req.user.userId : null;
        const sessionId = req.headers['x-session-id'];
        const rawId = req.params.productId || req.params.id || req.params.itemId;
        const productId = parseInt(rawId);
        const { quantity } = req.body;

        if (!userId && !sessionId) {
             return res.status(400).json({ message: "Non identifié." });
        }

        const cart = await findCart(userId, sessionId);
        
        // On cherche l'article (soit par productId, soit par l'ID de la ligne)
        const itemToUpdate = cart.items.find(i => i.productId === productId || i.id === productId);

        if (!itemToUpdate) {
            return res.status(404).json({ message: "Article introuvable dans le panier." });
        }

        await prisma.cartItem.update({
            where: { id: itemToUpdate.id },
            data: { quantity: quantity }
        });

        res.status(200).json({ message: "Quantité mise à jour." });
    } catch (error) {
        console.error("🚨 ERREUR UPDATE QUANTITE:", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// --- 4. SUPPRIMER UN PRODUIT ---
exports.removeItem = async (req, res) => {
    try {
        const userId = req.user ? req.user.userId : null;
        const sessionId = req.headers['x-session-id'];
        const rawId = req.params.productId || req.params.id || req.params.itemId;
        const productId = parseInt(rawId);

        if (!userId && !sessionId) {
             return res.status(400).json({ message: "Non identifié." });
        }

        const cart = await findCart(userId, sessionId);

        // On cherche l'article (soit par productId, soit par l'ID de la ligne)
        const itemToDelete = cart.items.find(i => i.productId === productId || i.id === productId);

        if (!itemToDelete) {
             // S'il est déjà supprimé, on renvoie 200 pour dire au Front que c'est OK !
             return res.status(200).json({ message: "Article déjà supprimé." });
        }

        await prisma.cartItem.delete({
            where: { id: itemToDelete.id }
        });

        res.status(200).json({ message: "Article supprimé." });
    } catch (error) {
        console.error("🚨 ERREUR SUPPRESSION:", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// --- 5. VIDER LE PANIER ---
exports.clearCart = async (req, res) => {
    try {
        const userId = req.user ? req.user.userId : null;
        const sessionId = req.headers['x-session-id'];

        const cart = await findCart(userId, sessionId);
        if (!cart) return res.status(200).json({ message: "Le panier est déjà vide." });

        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        });

        res.status(200).json({ message: "Panier vidé avec succès." });
    } catch (error) {
        console.error("🚨 ERREUR CLEAR PANIER :", error);
        res.status(500).json({ message: "Erreur serveur lors du vidage du panier." });
    }
};