import React, { createContext, useState, useContext } from 'react';

const PanierContext = createContext();
export function usePanier() {
  return useContext(PanierContext);
}

export function PanierProvider({ children }) {
  const [panier, setPanier] = useState([]);

  const ajouterAuPanier = (produit, longueur_cm, largeur_cm, quantite) => {
    const prix_total = produit.prix_m2 * (longueur_cm / 100) * (largeur_cm / 100) * quantite;
    setPanier(prev => [...prev, { ...produit, longueur_cm, largeur_cm, quantite, prix_total }]);
  };

  return (
    <PanierContext.Provider value={{ panier, ajouterAuPanier }}>
      {children}
    </PanierContext.Provider>
  );
}
