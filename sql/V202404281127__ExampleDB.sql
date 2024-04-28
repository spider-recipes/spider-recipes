-- Select the newly created database
USE SpiderRecipes;
GO

-- Create a new table called 'Spiders'
CREATE TABLE Spiders (
    SpiderID INT PRIMARY KEY,
    Name NVARCHAR(50),
);
GO

-- Insert some example data into the 'Spiders' table
INSERT INTO Spiders (SpiderID, Name)
VALUES
(1, 'Daddy long legs'),
(2, 'Black widow'),
(3, 'Tarantula'),
(4, 'Wolf spider'),
(5, 'Jumping spider'),
(6, 'Brown recluse'),
(7, 'Hobo spider'),
(8, 'Orb weaver'),
(9, 'Garden spider'),
(10, 'Crab spider');
GO