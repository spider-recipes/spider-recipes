USE SpiderRecipes;
GO


-- Insert into Users table
INSERT INTO Users (username, auth_token, created_date)
VALUES 
('thashiltheg1', '1234', GETDATE()),
('iLoveSpiderRecipes', '12345', GETDATE()),
('TeeHeeTarantula', '123456', GETDATE()),
('SillySpinner', '1234567', GETDATE());

-- Insert into Tags table
INSERT INTO Tags (tag_name)
VALUES 
('Bake'),
('Fry');

-- Insert into Recipes table
INSERT INTO Recipes (recipe_name, recipe_ingredients, recipe_steps, recipe_preparation_time_minutes, recipe_cooking_time_minutes, recipe_serves, recipe_image, time_created, user_id)
VALUES 
('Spider Bread', 'Yeast 5g;Flour 500g;Eggs x2;Spiders (to taste)', 'Add dry ingredients to a bowl & mix.;Add spiders and eggs.;Place the mixture into a bread tray and bake in an oven at 180* for 30 minutes.;Let the bread cool before serving.', 5, 30, 4, 'image_link1', GETDATE(), 6),
('Spiderweb Dip', 'Creamy spinach dip;Sour cream;Spiders', 'Prepare a creamy spinach dip.;Transfer the dip into a serving bowl.;Drizzle sour cream or ranch dressing in a spiral pattern over the dip.;Use a toothpick to drag lines from the center to the edges, creating a spiderweb effect.;Place spiders in the center for decoration.', 10, 2, 4, 'image_link1', GETDATE(), 6),
('Batter-Fried Tarantulas', 'Fry oil;Flour;Egg;Tarantulas', 'Dip tarantulas in the egg;Coat the dipped tarantulas in flour;Heat oil to 200* and gently put the tarantulas in;Remove the tarantulas from the oil after 15 minutes and let them rest for 5 minutes', 2, 20, 5, 'image_links1', GETDATE(), 6),
('Spider Cupcakes', 'Cupcake mix;Frosting;Spiders', 'Put the cupcake mix in a cupcake baking tray.;Bake the cupcakes in the oven for 20 minutes at 180*.;After baking the cupcakes, apply the frosting to the tops of the cupcakes.;Finally, place the spiders ontop of the cupcakes.', 2, 25, 6, 'image_links1', GETDATE(), 6),
('SLT Sandwich', 'Bread;Butter;Spiders;Lettuce;Tomato;', 'Slice the spiders, tomato and lettuce.;Butter the bread.;Construct the sandwich with all the ingredients inbetween the bread.', 3, 1, 1, 'image_links1', GETDATE(), 7);


-- Insert into FavouritedRecipes table
INSERT INTO FavouritedRecipes (user_id, recipe_id)
VALUES 
(1, 3),
(1, 2),
(2, 3),
(3, 1),
(4, 1);

-- Insert into Reviews table
INSERT INTO Reviews (review_rating, review_message, time_created, user_id, recipe_id)
VALUES 
(4, 'Great flavour but does not look exactly like the picture.', GETDATE(), 6, 8),
(2, 'Not very descriptive instructions :(', GETDATE(), 3, 5),
(4, 'Almost perfect. Could use some sugar.', GETDATE(), 7, 4),
(5, 'Absolutely delectable!', GETDATE(), 7, 6);

-- Insert into RecipeTags table
INSERT INTO RecipeTags (recipe_id, tag_id)
VALUES 
(4, 2),
(4, 5),
(4, 6),
(5, 3),
(5, 5),
(6, 3)
(6, 4),
(6, 7),
(7, 2)
(7, 5),
(7, 6),
(8, 3),
(8, 5);