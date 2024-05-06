USE SpiderRecipes;
GO

CREATE TABLE FavouritedRecipes (
    favourite_recipe_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT FOREIGN KEY REFERENCES [dbo].[Users](user_id) NOT NULL,
    recipe_id INT FOREIGN KEY REFERENCES [dbo].[Recipes](recipe_id) NOT NULL
);