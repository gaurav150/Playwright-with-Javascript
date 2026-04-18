Feature: Ecommerce validations

    Scenario: Error validations for Wrong login credentials
        Given the user has been logged in to the Ecommerce website with "abhishek09.sharma@example.com" and "Abhishek@123"
        Then the user verifies that the error message "Incorrect email or password." is displayed