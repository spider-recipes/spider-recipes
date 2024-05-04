USE SpiderRecipes;
GO

CREATE TABLE Recipes (
    recipe_id INT PRIMARY KEY IDENTITY(1,1),
    recipe_name NVARCHAR(250),
    recipe_ingredients NVARCHAR(MAX),
    recipe_steps NVARCHAR(MAX),
    recipe_preparation_time_minutes INT NOT NULL,
    recipe_cooking_time_minutes INT NOT NULL,
    recipe_image NVARCHAR(MAX),
    time_created DATETIME NOT NULL,
    deleted BIT NOT NULL DEFAULT 0,
    user_id INT FOREIGN KEY REFERENCES [dbo].[Users](user_id) NOT NULL
);