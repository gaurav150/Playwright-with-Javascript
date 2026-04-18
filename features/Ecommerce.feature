Feature: Ecommerce validations

    Scenario: Placing the order
        Given the user has been logged in to the Ecommerce website with "abhishek03.sharma@example.com" and "Abhishek@123"
        When the user adds "ZARA COAT 3" to the Cart
        Then the user verifies that "ZARA COAT 3" is displayed in the Cart
        When the user proceeds to checkout and fills in valid details
        Then the user verifies that the order is present in the order history with the correct product name "ZARA COAT 3"
