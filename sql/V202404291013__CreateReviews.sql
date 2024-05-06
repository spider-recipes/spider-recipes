USE SpiderRecipes;
GO

CREATE TABLE Reviews (
    review_id INT PRIMARY KEY IDENTITY(1,1),
    review_rating INT NOT NULL,
    review_message NVARCHAR(MAX) NOT NULL,
    time_created DATETIME NOT NULL,
    user_id INT FOREIGN KEY REFERENCES [dbo].[Users](user_id) NOT NULL,
    recipe_id INT FOREIGN KEY REFERENCES [dbo].[Recipes](recipe_id) NOT NULL,
    CONSTRAINT CHK_ReviewRatingRange CHECK (review_rating >= 1 AND review_rating <= 5)
);