const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123'; // à mettre dans .env plus tard

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📁 Vérifie et crée le dossier 'uploads' s'il n'existe pas
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// 📦 Connexion à MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // ajoute ton mot de passe ici si besoin
  database: 'marbre_app'
});

db.connect(err => {
  if (err) {
    console.error("❌ Erreur de connexion MySQL :", err);
    return;
  }
  console.log('✅ Connecté à MySQL');
});

// Middleware d’authentification
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ msg: "Token manquant" });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ msg: "Token manquant" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch {
    return res.status(401).json({ msg: "Token invalide" });
  }
}

// Middleware admin
function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: "Accès refusé, admin uniquement" });
  }
  next();
}

// 📂 Configuration multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Routes d’authentification

// Inscription
app.post('/api/signup', async (req, res) => {
  const { nom, email, mot_de_passe, role } = req.body;
  if (!nom || !email || !mot_de_passe) return res.status(400).json({ msg: "Champs manquants" });

  try {
    const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) return res.status(400).json({ msg: "Utilisateur déjà existant" });

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    await db.promise().query(
      'INSERT INTO users (nom, email, mot_de_passe, role, date_creation) VALUES (?, ?, ?, ?, NOW())',
      [nom, email, hashedPassword, role || 'client']
    );

    res.json({ msg: "Utilisateur créé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur serveur" });
  }
});

// Connexion
app.post('/api/login', async (req, res) => {
  const { email, mot_de_passe } = req.body;
  if (!email || !mot_de_passe) return res.status(400).json({ msg: "Champs manquants" });

  try {
    const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(400).json({ msg: "Utilisateur non trouvé" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isMatch) return res.status(400).json({ msg: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: user.id, role: user.role, nom: user.nom, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token, user: { id: user.id, nom: user.nom, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur serveur" });
  }
});

// 🔓 Serve les fichiers statiques
app.use('/uploads', express.static('uploads'));

// ✅ Ajouter un produit (protégé admin)
app.post('/api/produits', authMiddleware, adminMiddleware, upload.single('image'), (req, res) => {
  const { nom, gamme, marque, prix_m2, quantite } = req.body;
  const image_url = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

  if (!nom || !gamme || !marque || !prix_m2 || !quantite || !image_url) {
    return res.status(400).send("Tous les champs sont requis !");
  }

  const sql = "INSERT INTO produits (nom, gamme, marque, prix_m2, quantite, image_url) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [nom, gamme, marque, prix_m2, quantite, image_url], (err, result) => {
    if (err) {
      console.error("❌ Erreur SQL (ajout) :", err);
      return res.status(500).send("Erreur ajout produit");
    }
    res.status(201).send({
      id: result.insertId,
      nom, gamme, marque, prix_m2, quantite, image_url
    });
  });
});

// ✅ Modifier un produit (protégé admin)
app.put('/api/produits/:id', authMiddleware, adminMiddleware, upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { nom, gamme, marque, prix_m2, quantite, existingImage } = req.body;

  let image_url = existingImage;
  if (req.file) {
    image_url = `http://localhost:5000/uploads/${req.file.filename}`;
  }

  if (!nom || !gamme || !marque || !prix_m2 || !quantite) {
    return res.status(400).send("Champs manquants !");
  }

  const sql = "UPDATE produits SET nom=?, gamme=?, marque=?, prix_m2=?, quantite=?, image_url=? WHERE id=?";
  db.query(sql, [nom, gamme, marque, prix_m2, quantite, image_url, id], (err, result) => {
    if (err) {
      console.error("❌ Erreur SQL (modif):", err);
      return res.status(500).send("Erreur modification");
    }
    res.status(200).send({ message: "Produit modifié avec succès" });
  });
});

// 📥 Liste des produits (pas protégé, accessible à tous)
app.get('/api/produits', (req, res) => {
  db.query("SELECT * FROM produits", (err, result) => {
    if (err) {
      console.error("❌ Erreur SQL (get):", err);
      return res.status(500).send("Erreur récupération");
    }
    res.status(200).json(result);
  });
});

// ❌ Supprimer un produit (protégé admin)
app.delete('/api/produits/:id', authMiddleware, adminMiddleware, (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM produits WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("❌ Erreur SQL (delete):", err);
      return res.status(500).send("Erreur suppression");
    }
    res.status(200).send({ message: 'Produit supprimé' });
  });
});

// 🚀 Lancement du serveur
app.listen(5000, () => {
  console.log('🚀 Serveur backend sur http://localhost:5000');
});

// Gestion commandes (à adapter selon besoin, à sécuriser aussi si tu veux)
app.post('/api/commandes', (req, res) => {
  const { user_id, produits } = req.body;

  if (!user_id || !produits || !Array.isArray(produits) || produits.length === 0) {
    return res.status(400).send("Champs invalides !");
  }

  const sqlCommande = "INSERT INTO commandes (user_id, statut) VALUES (?, 'acceptée')";
  db.query(sqlCommande, [user_id], (err, result) => {
    if (err) {
      console.error("❌ Erreur ajout commande:", err);
      return res.status(500).send("Erreur création commande");
    }

    const commande_id = result.insertId;

    const details = produits.map(p => [
      commande_id,
      p.produit_id,
      p.longueur_cm,
      p.largeur_cm,
      p.quantite,
      p.prix_total
    ]);

    const sqlDetails = `
      INSERT INTO details_commande 
      (commande_id, produit_id, longueur_cm, largeur_cm, quantite, prix_total)
      VALUES ?
    `;

    db.query(sqlDetails, [details], (err2) => {
      if (err2) {
        console.error("❌ Erreur détails:", err2);
        return res.status(500).send("Erreur ajout détails");
      }

      res.status(201).send({ message: "Commande créée", commande_id });
    });
  });
});

app.get('/api/commandes', (req, res) => {
  const sql = `
    SELECT 
      c.id AS commande_id, c.user_id, u.nom AS client_nom, c.date_commande, c.statut,
      d.id AS detail_id, d.produit_id, d.longueur_cm, d.largeur_cm, d.quantite, d.prix_total,
      p.nom AS produit_nom
    FROM commandes c
    JOIN utilisateurs u ON c.user_id = u.id
    JOIN details_commande d ON c.id = d.commande_id
    JOIN produits p ON d.produit_id = p.id
    ORDER BY c.date_commande DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Erreur récupération commandes:", err);
      return res.status(500).send("Erreur récupération");
    }

    const commandes = {};
    result.forEach(row => {
      if (!commandes[row.commande_id]) {
        commandes[row.commande_id] = {
          id: row.commande_id,
          user_id: row.user_id,
          client_nom: row.client_nom,
          date_commande: row.date_commande,
          statut: row.statut,
          details: []
        };
      }

      commandes[row.commande_id].details.push({
        produit_id: row.produit_id,
        produit_nom: row.produit_nom,
        longueur_cm: row.longueur_cm,
        largeur_cm: row.largeur_cm,
        quantite: row.quantite,
        prix_total: row.prix_total
      });
    });

    res.status(200).json(Object.values(commandes));
  });
});

app.put('/api/commandes/:id', (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  db.query("UPDATE commandes SET statut = ? WHERE id = ?", [statut, id], (err) => {
    if (err) {
      console.error("❌ Erreur mise à jour statut:", err);
      return res.status(500).send("Erreur mise à jour");
    }
    res.status(200).send({ message: "Statut mis à jour" });
  });
});
