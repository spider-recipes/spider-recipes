CREATE TABLE FavouritedRecipes (
    fav_recipe_id INT PRIMARY KEY IDENTITY(1,1),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id)
);