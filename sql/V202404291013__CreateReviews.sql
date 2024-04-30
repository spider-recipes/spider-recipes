CREATE TABLE Reviews (
    review_id INT PRIMARY KEY IDENTITY(1,1),
    review_rating INT NOT NULL,
    review_message NVARCHAR(MAX) NOT NULL,
    time_created DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id), 
    FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id),
);