CREATE TABLE RecipeTags (
    recipe_tag_id INT PRIMARY KEY IDENTITY(1,1),
    recipe_id INT FOREIGN KEY REFERENCES [dbo].[Recipes](recipe_id) NOT NULL,
    tag_id INT FOREIGN KEY REFERENCES [dbo].Tags(tag_id) NOT NULL
);