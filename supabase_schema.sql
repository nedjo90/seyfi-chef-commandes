-- ============================================
-- Seyfi Chef - Supabase Schema & Seed Data
-- Tables prefixed with seyfi_
-- ============================================

-- 1. Menu Items table
CREATE TABLE IF NOT EXISTS seyfi_menu_items (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(8,2) NOT NULL DEFAULT 0,
  variants JSONB,
  allergens INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- 2. Orders table
CREATE TABLE IF NOT EXISTS seyfi_orders (
  id SERIAL PRIMARY KEY,
  guest_name TEXT NOT NULL,
  phone TEXT,
  remarks TEXT,
  total NUMERIC(8,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Order Items table
CREATE TABLE IF NOT EXISTS seyfi_order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES seyfi_orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER NOT NULL REFERENCES seyfi_menu_items(id),
  variant_label TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(8,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE seyfi_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE seyfi_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE seyfi_order_items ENABLE ROW LEVEL SECURITY;

-- Public read/write policies (like the original project)
CREATE POLICY "Public read seyfi_menu_items" ON seyfi_menu_items FOR SELECT USING (true);
CREATE POLICY "Public read seyfi_orders" ON seyfi_orders FOR SELECT USING (true);
CREATE POLICY "Public insert seyfi_orders" ON seyfi_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete seyfi_orders" ON seyfi_orders FOR DELETE USING (true);
CREATE POLICY "Public read seyfi_order_items" ON seyfi_order_items FOR SELECT USING (true);
CREATE POLICY "Public insert seyfi_order_items" ON seyfi_order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete seyfi_order_items" ON seyfi_order_items FOR DELETE USING (true);

-- ============================================
-- SEED DATA
-- ============================================

-- === ENTREES (sort_order 100-199) ===
INSERT INTO seyfi_menu_items (category, name, description, price, variants, allergens, sort_order) VALUES
('entrees', 'Boeuf fume', 'Delicatement tranche, servi avec roquette croquante et parmesan affine', 0, '[{"label":"2 pers","price":13.90},{"label":"4 pers","price":22.90}]'::jsonb, 6, 100),
('entrees', 'Carpaccio de boeuf', 'Fines tranches de viande tendre, roquette fraiche, parmesan, tomates cerises, vinaigre balsamique', 22.90, NULL, 4, 101),
('entrees', 'Frites Portion 2 Personnes', NULL, 6.00, NULL, 2, 102),
('entrees', 'Burrata', 'Onctueuse et cremeuse, tomates cerises, roquette, basilic, huile d''olive, sauce balsamique', 10.90, NULL, 4, 103),
('entrees', 'Ezme (MEZZE)', 'Tartinade savoureuse de tomates et poivrons, subtilement pimentee', 3.90, NULL, 1, 104),
('entrees', 'Patlincanli (MEZZE)', 'Tartinade onctueuse d''aubergine, yaourt frais et ail parfume', 3.90, NULL, 1, 105),
('entrees', 'Crevettes frites', 'Croustillantes et dorees, servies avec une sauce savoureuse', 10.90, NULL, 1, 106),
('entrees', 'Assortiments de 4 MEZE', 'Selectionnes selon vos envies parmi les delices de notre carte', 15.90, NULL, 2, 107),
('entrees', 'Atom (MEZZE)', 'Melange cremeux de yaourt, ail parfume et beurre fondant', 3.90, NULL, 1, 108),
('entrees', 'Humus (MEZZE)', 'Puree onctueuse de pois chiches, ail et jus de citron frais', 3.90, NULL, 1, 109),
('entrees', 'Seker pancar (MEZZE)', 'Betterave sucree a la texture cremeuse', 3.90, NULL, 1, 110),
('entrees', 'Havuc Tarator (MEZZE)', 'Tartinade cremeuse de carottes, yaourt, ail, noix et huile d''olive', 3.90, NULL, 1, 111);

-- === SALADES (sort_order 200-299) ===
INSERT INTO seyfi_menu_items (category, name, description, price, variants, allergens, sort_order) VALUES
('salades', 'Tulum', 'Mais, grenade, noix, raisins secs, tomates cerises, concombre, croutons, sirop de grenade', 0, '[{"label":"Petite","price":11.90},{"label":"Grande","price":15.90}]'::jsonb, 1, 200),
('salades', 'Bahce', 'Mais, grenade, noix, raisins secs, tomates cerises, concombre, croutons, sirop de grenade', 0, '[{"label":"Petite","price":9.90},{"label":"Grande","price":12.90}]'::jsonb, 1, 201),
('salades', 'Roka', 'Roquette, oignons rouges, tomates, concombre, grenade, parmesan, sauce balsamique', 0, '[{"label":"Petite","price":9.90},{"label":"Grande","price":15.90}]'::jsonb, 1, 202),
('salades', 'Avocadelice', 'Mais baby, avocat, tomates cerises, concombre, parmesan, jeunes pousses, sauce balsamique', 13.90, NULL, 2, 203),
('salades', 'Coban', 'Tomates, concombre, poivrons, oignons, sirop de grenade', 0, '[{"label":"Petite","price":12.90},{"label":"Grande","price":14.90}]'::jsonb, 1, 204),
('salades', 'Salade au Thon', 'Thon, oignons rouges, olives, mais, tomates, sauce onctueuse', 20.90, NULL, 1, 205),
('salades', 'Salade au poulet', 'Poulet, salade verte, olives, mais, tomates, sauce onctueuse', 20.90, NULL, 1, 206),
('salades', 'Salade Cesar', 'Crouton, poulet, parmesan, mais, tomate, laitue, concombre, sauce cesar', 17.90, NULL, 1, 207);

-- === MENU DU MIDI (sort_order 300-399) ===
INSERT INTO seyfi_menu_items (category, name, description, price, variants, allergens, sort_order) VALUES
('menu_midi', 'Pennes Arrabiata', 'Sauce tomate pimentee, olives, parmesan', 14.90, NULL, 2, 300),
('menu_midi', 'Tagliatelle au pesto', 'Sauce pesto cremeuse, creme legere, basilic frais', 14.90, NULL, 2, 301),
('menu_midi', 'Tagliatelle Napolitaine', 'Sauce tomate maison, basilic frais', 14.90, NULL, 1, 302),
('menu_midi', 'Pennes Bolognaise', 'Sauce tomate maison a la viande hachee, parmesan', 14.90, NULL, 1, 303),
('menu_midi', 'Pennes Alfredo', 'Sauce cremeuse a l''ail, poulet, champignons, parmesan, poivres', 21.90, NULL, 1, 304),
('menu_midi', 'Salade thai au boeuf', 'Boeuf, courgette, carotte, oignon, sesame, oignons verts', 25.90, NULL, 1, 305),
('menu_midi', 'Salade thai au poulet', 'Poulet, carottes, courgettes, sesame, oignon vert', 21.90, NULL, 1, 306),
('menu_midi', 'Poulet a la sauce curry', 'Poulet, sauce curry, poivrons, champignons, pates, salade', 21.90, NULL, 1, 307),
('menu_midi', 'Poulet a la creme', 'Poulet, poivrons, oignons, sauce cremeuse, pates, salade', 21.90, NULL, 1, 308),
('menu_midi', 'Poulet a la creme cajun', 'Poulet, sauce cremeuse epicee Cajun, poivrons, oignons, pates, salade', 21.90, NULL, 1, 309),
('menu_midi', 'Poulet epice', 'Poulet, sauce cremeuse relevee, poivrons, oignons, pennes, salade', 21.90, NULL, 3, 310),
('menu_midi', 'Poulet a la creme aux champignons', 'Poulet, sauce cremeuse aux champignons, pennes, salade', 21.90, NULL, 1, 311),
('menu_midi', 'Fajitas combo poulet et boeuf', 'Viandes, poivrons, oignons, salsa, guacamole, cheddar', 24.90, NULL, 1, 312),
('menu_midi', 'Fajitas au boeuf', 'Boeuf, poivrons, oignons, salsa, guacamole, cheddar', 26.90, NULL, 2, 313),
('menu_midi', 'Fajitas au poulet', 'Poulet, poivrons, oignons, salsa, guacamole, cheddar', 21.90, NULL, 1, 314),
('menu_midi', 'Portion de frites', NULL, 3.00, NULL, 2, 315),
('menu_midi', 'Saumon grille', 'Saumon, legumes frais, pennes al dente', 29.90, NULL, 1, 316),
('menu_midi', 'Poulet Schnitzel', 'Escalope de poulet, frites, salade', 21.90, NULL, 1, 317);

-- === BOWL & SANDWICH (sort_order 400-499) ===
INSERT INTO seyfi_menu_items (category, name, description, price, variants, allergens, sort_order) VALUES
('bowl_sandwich', 'Saumon teriyaki', 'Riz noir, roquette, mais, grenade, parmesan, tomate, sesame, sauces', 22.90, NULL, 0, 400),
('bowl_sandwich', 'New York steak teriyaki', 'Riz basmati, roquette, mais, grenade, parmesan, tomate, sesame, sauces', 22.90, NULL, 0, 401),
('bowl_sandwich', 'Crispy Chicken Bowl', 'Riz basmati, roquette, mais, grenade, parmesan, tomate, sesame, sauces', 17.90, NULL, 0, 402),
('bowl_sandwich', 'Poulet Sweet & Sour', 'Haricots verts, feve de soja, carotte, haricots rouges, ciboulette, sesame, sauces', 17.90, NULL, 1, 403),
('bowl_sandwich', 'Poulet Sweet Chilli', 'Haricots verts, feve de soja, carotte, haricots rouges, ciboulette, sesame, sauce piment sucree', 17.90, NULL, 0, 404),
('bowl_sandwich', 'Poulet Hot & Spicy', 'Haricots verts, feve de soja, carotte, haricots rouges, ciboulette, sesame, sauce pimentee', 17.90, NULL, 0, 405),
('bowl_sandwich', 'Poulet teriyaki', 'Haricots verts, feve de soja, carotte, haricots rouges, ciboulette, sesame, sauce teriyaki', 17.90, NULL, 0, 406),
('bowl_sandwich', 'Poulet Cafe de Paris', 'Haricots verts, feve de soja, carotte, haricots rouges, ciboulette, sesame, sauce cafe de Paris', 17.90, NULL, 0, 407),
('bowl_sandwich', 'Salade Quinoa Mix', 'Quinoa, avocat, roquette, lentilles, tomate, mais, feve de soja, carotte, sesame, noix, parmesan, grenade, sauce blanche', 15.90, NULL, 0, 408),
('bowl_sandwich', 'Kofte Bowl', 'Haricot vert, feve de soja, haricot rouge, carotte, sauce speciale', 17.90, NULL, 0, 409),
('bowl_sandwich', 'Sandwich Cesar', 'Poulet, roquette, parmesan, tomate, sauce cesar', 10.90, NULL, 0, 410),
('bowl_sandwich', 'Steak Toscana Sandwich', 'Roquette, steak new york, parmesan, tomate, sauce burger', 14.90, NULL, 0, 411),
('bowl_sandwich', 'Sandwich Boeuf Fume', 'Boeuf fume, avocat, tomate, parmesan, roquette, sauce burger', 12.90, NULL, 0, 412),
('bowl_sandwich', 'Kofte Sandwich', 'Kofte, roquette, tomate, sauce burger', 11.90, NULL, 0, 413);

-- === HAMBURGERS (sort_order 500-599) ===
INSERT INTO seyfi_menu_items (category, name, description, price, variants, allergens, sort_order) VALUES
('hamburgers', 'Seyfi Chef Burger', 'Boeuf fume, cheddar cremeux, oignons caramelises', 18.90, NULL, 2, 500),
('hamburgers', 'Steak Burger', 'Steak, cheddar cremeux, oignons caramelises', 22.90, NULL, 4, 501),
('hamburgers', 'Texas Beef Burger', 'Cheddar cremeux, oignons caramelises, boeuf juteux', 20.90, NULL, 2, 502);

-- === HACHE SELECTION (sort_order 600-699) ===
INSERT INTO seyfi_menu_items (category, name, description, price, variants, allergens, sort_order) VALUES
('hache_selection', 'Kofte', 'Boulettes de viande epicees, frites dorees', 17.90, NULL, 2, 600),
('hache_selection', 'Kasarli Kofte', 'Boulettes fourrees a la mozzarella fondante, frites', 17.90, NULL, 1, 601),
('hache_selection', 'Durum au boeuf fume', 'Wrap au boeuf fume, mozzarella et cheddar fondants, frites', 27.90, NULL, 1, 602),
('hache_selection', 'Kofte au cheddar', 'Boulettes de viande garnies de cheddar fondant, frites', 18.90, NULL, 2, 603);

-- === AGNEAU (sort_order 700-799) ===
INSERT INTO seyfi_menu_items (category, name, description, price, variants, allergens, sort_order) VALUES
('agneau', 'Cote d''agneau tendre (200-250g)', 'Cote d''agneau, legumes frais', 31.90, NULL, 2, 700),
('agneau', 'Tendre kusleme d''agneau (200-250g)', 'Coupe tendre, non grasse, legumes', 31.90, NULL, 2, 701),
('agneau', 'Agneau New York (300-350g)', 'Contre-filet tendre et juteux, legumes frais', 35.90, NULL, 2, 702),
('agneau', 'Carre d''agneau kafes (1300-1500g) a partager', 'Cuisson delicate pour preserver jus et moelleux', 124.90, NULL, 1, 703),
('agneau', 'Mixte d''agneau (600g) a partager', 'Assortiment d''agneau, oignons, ail, tomates cerises, croutons, beurre', 74.90, NULL, 1, 704);

-- === STEAK ET GARNITURES (sort_order 800-899) ===
INSERT INTO seyfi_menu_items (category, name, description, price, variants, allergens, sort_order) VALUES
('steak_garnitures', 'Dallas Beef (450-500g)', 'Beefteck mature, gout riche et intense', 49.90, NULL, 5, 800),
('steak_garnitures', 'Porter House (600-650g)', 'Steak cote de boeuf mature, noble et savoureux', 55.90, NULL, 4, 801),
('steak_garnitures', 'T-Bone Black Angus (450-500g)', 'Coupe os en T, filet pur + faux-filet', 49.90, NULL, 1, 802),
('steak_garnitures', 'New York Steak (300-350g)', 'Coupe tendre et juteuse, partie dorsale du boeuf', 37.90, NULL, 4, 803),
('steak_garnitures', 'Dallas Steak Sauce Moutarde (450-500g)', 'Bifteck mature, sauce moutarde maison', 49.90, NULL, 4, 804),
('steak_garnitures', 'Le Tacos Filet Mignon', 'Tendrete, saveur, sauce moutarde', 38.90, NULL, 1, 805),
('steak_garnitures', 'Tacos Filet Mignon Moutarde', 'Filet mignon, sauce moutarde onctueuse', 38.90, NULL, 1, 806),
('steak_garnitures', 'Toscana (300-350g)', 'Contre-filet, roquette, parmesan, sauce balsamique', 37.90, NULL, 4, 807),
('steak_garnitures', 'RBY Steak (300-320g)', 'Steak tendre et juteux, legumes frais', 38.90, NULL, 1, 808),
('steak_garnitures', 'Escalope de poulet grillee', 'Tendre et juteuse, salade, frites', 24.90, NULL, 2, 809),
('steak_garnitures', 'Steak de Saumon', 'Saumon, legumes frais, pennes al dente', 29.90, NULL, 1, 810);

-- === TRANCHEE SELECTION (sort_order 900-999) ===
INSERT INTO seyfi_menu_items (category, name, description, price, variants, allergens, sort_order) VALUES
('tranchee_selection', 'Turkish Lokum (200-220g)', 'Filet de boeuf tendre, tradition turque', 32.90, NULL, 5, 900),
('tranchee_selection', 'Beef Spaghetti (220-250g)', 'Lamelles de steak de boeuf, legumes de saison', 27.90, NULL, 1, 901),
('tranchee_selection', 'Entrecote de boeuf (230-250g)', 'Tendre et savoureuse, legumes de saison', 28.90, NULL, 2, 902),
('tranchee_selection', 'La Broche Saslik (500g, 2 pers)', 'Brochettes de filet de veau, a partager', 59.90, NULL, 1, 903),
('tranchee_selection', 'Beef (220-250g)', 'Fines tranches de boeuf tendre, legumes de saison', 27.90, NULL, 2, 904);

-- === SPECIALITES A PARTAGER (sort_order 1000-1099) ===
INSERT INTO seyfi_menu_items (category, name, description, price, variants, allergens, sort_order) VALUES
('specialites_partager', 'Signature by Seyfi', 'Filet de boeuf cuit au beurre', 0, '[{"label":"400g (2 pers)","price":69.90},{"label":"800g (4 pers)","price":124.90}]'::jsonb, 2, 1000),
('specialites_partager', 'Filet d''Atome (500g, 2 pers)', 'Filet de boeuf, tomates cerises, ail, croutons, oignons, beurre', 79.90, NULL, 3, 1001),
('specialites_partager', 'Special Lokum', 'Filet de boeuf, champignons, cheddar', 39.90, NULL, 1, 1002),
('specialites_partager', 'Chateaubriand (500g, 2 pers)', 'Filet de boeuf, roquette, cheddar, tomates cerises, beurre', 79.90, NULL, 1, 1003),
('specialites_partager', 'Tendre Atom Agneau', 'Filet d''agneau, tomates cerises, ail, croutons, oignons, beurre', 79.90, NULL, 1, 1004),
('specialites_partager', 'Tomahawk (1000-1100g, 2 pers)', 'Faux-filet sur os entier, legumes frais', 94.90, NULL, 1, 1005),
('specialites_partager', 'Fiorentina Steak (1000-1100g, 2 pers)', 'Coupe royale os en T, filet + contre-filet, legumes', 104.90, NULL, 1, 1006),
('specialites_partager', 'Mixe d''agneaux (600g)', 'Morceaux d''agneau, oignons, ail, croutons, tomates cerises, beurre', 74.90, NULL, 1, 1007);

-- === MENU ENFANT (sort_order 1100-1199) ===
INSERT INTO seyfi_menu_items (category, name, description, price, variants, allergens, sort_order) VALUES
('menu_enfant', 'Hamburger (enfant)', 'Hamburger steak (sans crudites), frites', 12.90, NULL, 3, 1100),
('menu_enfant', 'Poulet Schnitzel (enfant)', '1 Schnitzel, frites', 12.90, NULL, 1, 1101),
('menu_enfant', 'Kofte (enfant)', '2 kofte, frites', 12.90, NULL, 1, 1102);

-- === DESSERTS (sort_order 1200-1299) ===
INSERT INTO seyfi_menu_items (category, name, description, price, variants, allergens, sort_order) VALUES
('desserts', 'Riz au lait (Sutlac)', 'Riz au lait onctueux, parfume aux noisettes', 6.50, NULL, 3, 1200),
('desserts', 'Baklava + Glace vanille', 'Croustillant et parfume, glace vanille', 9.90, NULL, 1, 1201),
('desserts', 'Baklava', NULL, 7.90, NULL, 1, 1202),
('desserts', 'Tiramisu', NULL, 6.00, NULL, 1, 1203),
('desserts', 'Glace', 'Chocolat, pistache, citron ou cafe', 6.00, NULL, 2, 1204),
('desserts', 'Kunefe a partager (2-3 pers)', 'Cheveux d''ange, mozzarella, sirop de sucre', 21.90, NULL, 0, 1205);

-- === BOISSONS CHAUDES (sort_order 1300-1399) ===
INSERT INTO seyfi_menu_items (category, name, description, price, variants, allergens, sort_order) VALUES
('boissons_chaudes', 'Cay (The Turc)', NULL, 2.00, NULL, 0, 1300),
('boissons_chaudes', 'Cafe long', NULL, 3.00, NULL, 0, 1301),
('boissons_chaudes', 'Expresso', NULL, 2.00, NULL, 0, 1302),
('boissons_chaudes', 'Cafe au lait', NULL, 3.00, NULL, 0, 1303),
('boissons_chaudes', 'Macchiato', NULL, 2.50, NULL, 0, 1304),
('boissons_chaudes', 'Chocolat', NULL, 3.00, NULL, 0, 1305),
('boissons_chaudes', 'Cappuccino noisette', NULL, 3.00, NULL, 0, 1306),
('boissons_chaudes', 'Cafe noisette', NULL, 3.00, NULL, 0, 1307),
('boissons_chaudes', 'Moka noisette', NULL, 2.50, NULL, 0, 1308),
('boissons_chaudes', 'Espresso noisette', NULL, 2.50, NULL, 0, 1309),
('boissons_chaudes', 'Chocolat noisette', NULL, 3.00, NULL, 0, 1310);

-- === BOISSONS FROIDES (sort_order 1400-1499) ===
INSERT INTO seyfi_menu_items (category, name, description, price, variants, allergens, sort_order) VALUES
('boissons_froides', 'Eau petillante 1/2', 'Rosport blue, Royal Bliss, Rosport classic', 4.50, NULL, 0, 1400),
('boissons_froides', 'Eau plate 1/2', 'Evian, Rosport viva', 4.50, NULL, 0, 1401),
('boissons_froides', 'Coca Cola', NULL, 3.90, NULL, 0, 1402),
('boissons_froides', 'Coca Cola Zero', NULL, 3.90, NULL, 0, 1403),
('boissons_froides', 'Sprite', NULL, 3.90, NULL, 0, 1404),
('boissons_froides', 'Royal Bliss', 'Better Lemon', 3.90, NULL, 0, 1405),
('boissons_froides', 'Fuze tea', 'Mangue', 3.90, NULL, 0, 1406),
('boissons_froides', 'Rosport classic', NULL, 3.90, NULL, 0, 1407),
('boissons_froides', 'Crodino Orange', NULL, 3.90, NULL, 0, 1408),
('boissons_froides', 'Crodino Rouge', NULL, 3.90, NULL, 0, 1409),
('boissons_froides', 'Looza Peach', NULL, 3.90, NULL, 0, 1410),
('boissons_froides', 'Looza Ace Original', NULL, 3.90, NULL, 0, 1411),
('boissons_froides', 'Looza Orange', NULL, 3.90, NULL, 0, 1412),
('boissons_froides', 'Looza Pomme', NULL, 3.90, NULL, 0, 1413),
('boissons_froides', 'Looza Tomate', NULL, 3.90, NULL, 0, 1414),
('boissons_froides', 'Bitburger biere (sans alcool)', NULL, 4.60, NULL, 0, 1415),
('boissons_froides', 'Diekirch biere (sans alcool)', NULL, 4.60, NULL, 0, 1416),
('boissons_froides', 'Leffe (sans alcool)', NULL, 4.60, NULL, 0, 1417),
('boissons_froides', 'Ayran', NULL, 3.90, NULL, 0, 1418),
('boissons_froides', 'Diabolo Fraise', NULL, 4.50, NULL, 0, 1419),
('boissons_froides', 'Diabolo Grenadine', NULL, 4.50, NULL, 0, 1420),
('boissons_froides', 'Diabolo Citron', NULL, 4.50, NULL, 0, 1421);

-- === COCKTAILS SANS ALCOOL (sort_order 1500-1599) ===
INSERT INTO seyfi_menu_items (category, name, description, price, variants, allergens, sort_order) VALUES
('cocktails', 'Hugo', 'Rafraichissant et petillant, menthe et citron', 8.50, NULL, 0, 1500),
('cocktails', 'Gin & Tonic', 'Rafraichissant et petillant, notes botaniques', 8.50, NULL, 0, 1501),
('cocktails', 'Mojito', 'Menthe, citron et touche de sucre', 8.50, NULL, 0, 1502),
('cocktails', 'Virgin Fruity', 'Explosion de saveurs fruitees', 8.50, NULL, 0, 1503);

-- === SAUCES OFFERTES (sort_order 1600-1699) ===
INSERT INTO seyfi_menu_items (category, name, description, price, variants, allergens, sort_order) VALUES
('sauces', 'Poivre', NULL, 0, NULL, 0, 1600),
('sauces', 'Champignon', NULL, 0, NULL, 0, 1601),
('sauces', 'Ketchup', NULL, 0, NULL, 0, 1602),
('sauces', 'Mayonnaise', NULL, 0, NULL, 0, 1603),
('sauces', 'Tabasco', NULL, 0, NULL, 0, 1604),
('sauces', 'Barbecue', NULL, 0, NULL, 0, 1605),
('sauces', 'Moutarde', NULL, 0, NULL, 0, 1606);
