USE SpiderRecipes;
GO

-- Insert into Users table
INSERT INTO Users (username, auth_token, created_date)
VALUES 
('swagmasterk123', '1', GETDATE()),
('brycedizzle', '12', GETDATE()),
('jamesasaur', '123', GETDATE()),
('thashiltheg1', '1234', GETDATE()),
('iLoveSpiderRecipes', '12345', GETDATE());

-- Insert into Tags table
INSERT INTO Tags (tag_name)
VALUES 
('Vegan'),
('Sweet'),
('Savoury'),
('Hot'),
('Cold');

-- Insert into Recipes table
INSERT INTO Recipes (recipe_name, recipe_ingredients, recipe_steps, recipe_preparation_time_minutes, recipe_cooking_time_minutes, recipe_image, time_created, user_id)
VALUES 
('Spider leg soup', '60g of Spider leg;3 cups of broth;Salt;Black pepper', 'To a pan on high heat, add spider legs and salt and pepper to taste.;Once almost cooked, add broth and allow to simmer.;Serve immediately.', 2, 10, 'image_link1', GETDATE(), 1),
('Spider cake', 'Cake batter;Black and red food colouring', 'Add half of cake batter to baking dish and decorate with black and red food colouring to resemble a spider.;Add the other half of the batter and cook until set.;Allow to cool before slicing.', 10, 35, 'image_link2', GETDATE(), 1),
('Spider sugar webs', 'White sugar;Water', 'Heat sugar and water until it reaches 80 degrees celsius.;With a toothpick, dip into the mixture and pull strands out. Lay them on a piece of baking paper and let cool.;Once cooled, make into spiderweb shape and enjoy.', 2, 15, 'image_link3', GETDATE(), 5);


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
(5, 'Great recipe!', GETDATE(), 1, 3),
(4, 'Good recipe, but could use some improvements.', GETDATE(), 2, 2),
(3, 'Average recipe.', GETDATE(), 3, 3),
(2, 'Not my favorite.', GETDATE(), 4, 3),
(1, 'Terrible recipe! I hate spider recipes.', GETDATE(), 5, 1);

-- Insert into RecipeTags table
INSERT INTO RecipeTags (recipe_id, tag_id)
VALUES 
(1, 3),
(1, 5),
(2, 1),
(2, 2),
(3, 1),
(3, 2),
(3, 3);