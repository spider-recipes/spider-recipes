CREATE TABLE RecipeTags (
    recipe_tag_id INT PRIMARY KEY IDENTITY(1,1),
    FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id),
    FOREIGN KEY (tag_id) REFERENCES Tags(tag_id)
);